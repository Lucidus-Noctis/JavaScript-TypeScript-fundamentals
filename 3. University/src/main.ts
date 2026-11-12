// main.ts
import {
    Student,
    Professor,
    AssociateProfessor,
    Staff,
} from "./person-hierarchy";
import { Course } from "./learning-units";
import { Faculty } from "./faculty";
import { InMemoryRepository } from "./repository";
import { XmlReportGenerator, JsonReportGenerator } from "./report-generator";

async function runDemonstration() {
    console.log("=== 1. Створення викладачів (Поліморфізм та спадкування) ===");
    const profShevchenko = new Professor(
        "t-1",
        "Тарас",
        "Шевченко",
        "t.shevchenko@univ.edu",
        20000,
    );

    const docentKoval = new AssociateProfessor(
        "t-2",
        "Олена",
        "Коваль",
        "o.koval@univ.edu",
        16000,
    );

    console.log(
        `${profShevchenko.getRoleDescription()} | Зарплата: ${profShevchenko.calculateSalary()}`,
    );
    console.log(
        `${docentKoval.getRoleDescription()} | Зарплата: ${docentKoval.calculateSalary()}`,
    );

    console.log("\n=== 2. Створення факультету та груп (Композиція) ===");
    const csFaculty = new Faculty("f-1", "Факультет комп'ютерних наук");

    // Факультет породжує групу
    const groupKN21 = csFaculty.createGroup("g-kn21", "КН-21", docentKoval);
    console.log(
        `Створено групу "${groupKN21.name}" на факультеті "${csFaculty.name}"`,
    );

    console.log("\n=== 3. Студенти та оцінки (Агрегація + Інкапсуляція) ===");
    const studentIvan = new Student(
        "s-101",
        "Іван",
        "Мельник",
        "ivan.m@univ.edu",
        "KB123456",
    );
    const studentAnna = new Student(
        "s-102",
        "Анна",
        "Бойко",
        "anna.b@univ.edu",
        "KB123457",
    );

    // Агрегуємо студентів у групу
    groupKN21.addStudent(studentIvan);
    groupKN21.addStudent(studentAnna);

    // Створюємо курс (Агрегує викладача)
    const tsCourse = new Course(
        "c-ts",
        "TypeScript Enterprise Patterns",
        5,
        profShevchenko,
    );

    // Виставляємо оцінки
    studentIvan.addGrade({
        courseId: tsCourse.id,
        score: 95,
        date: new Date(),
    });
    studentIvan.addGrade({
        courseId: tsCourse.id,
        score: 87,
        date: new Date(),
    });

    studentAnna.addGrade({
        courseId: tsCourse.id,
        score: 98,
        date: new Date(),
    });
    studentAnna.addGrade({
        courseId: tsCourse.id,
        score: 92,
        date: new Date(),
    });

    console.log(`GPA Івана: ${studentIvan.calculateGPA()}`);
    console.log(`GPA Анни: ${studentAnna.calculateGPA()}`);
    console.log(
        `Середній бал групи ${groupKN21.name}: ${groupKN21.getGroupAverageScore()}`,
    );

    console.log("\n=== 4. Узагальнене сховище даних (Generic Repository) ===");
    const studentRepo = new InMemoryRepository<Student>();
    await studentRepo.save(studentIvan);
    await studentRepo.save(studentAnna);

    const foundStudent = await studentRepo.findById("s-101");
    console.log(
        `Знайдено в репозиторії: ${foundStudent?.fullName} (${foundStudent?.email})`,
    );

    console.log(
        `Всього студентів у сховищі: ${(await studentRepo.findAll()).length}`,
    );

    console.log(
        "\n=== 5. Додати новий вид персони — Staff (Адміністратор) ===",
    );

    const admin = new Staff("s-1", "John", "Rembo", "staf1@ukt.net", csFaculty);
    console.log(admin.generateServiceId());

    console.log(
        "\n=== 6. Розширити логіку курсів (Передумови / Prerequisites) ===",
    );
    const programmingBasics = new Course(
        "c-basics",
        "Programming Basics",
        4,
        profShevchenko,
    );
    const advancedTypeScript = new Course(
        "c-advanced-ts",
        "Advanced TypeScript",
        5,
        profShevchenko,
        [programmingBasics],
    );
    studentIvan.addGrade({
        courseId: programmingBasics.id,
        score: 88,
        date: new Date(),
    });
    console.log(
        `Ivan can enroll in ${advancedTypeScript.title}: ${advancedTypeScript.canEnroll(studentIvan)}`,
    );
    console.log(
        `Anna can enroll in ${advancedTypeScript.title}: ${advancedTypeScript.canEnroll(studentAnna)}`,
    );

    console.log("\n=== 7. Механізм експорту звітів (Шаблонний метод) ===");
    const reportData = {
        faculty: [
            {
                id: csFaculty.id,
                name: csFaculty.name,
                groups: csFaculty.getAllGroups().map(group => group.name),
            },
        ],
        teachers: [profShevchenko, docentKoval].map(teacher => ({
            id: teacher.id,
            name: teacher.fullName,
            title: teacher.academicTitle,
            salary: teacher.calculateSalary(),
        })),
        students: [studentIvan, studentAnna].map(student => ({
            id: student.id,
            name: student.fullName,
            email: student.email,
            group: groupKN21.name,
            gpa: student.calculateGPA(),
            grades: student.getGrades().map(grade => ({
                course:
                    grade.courseId === tsCourse.id
                        ? tsCourse.title
                        : grade.courseId === programmingBasics.id
                          ? programmingBasics.title
                          : grade.courseId,
                score: grade.score,
                date: grade.date.toISOString(),
            })),
        })),
    };
    const xmlReport = new XmlReportGenerator(reportData);
    const jsonReport = new JsonReportGenerator(reportData);

    console.log("XML report:");
    console.log(xmlReport.generate());
    console.log("JSON report:");
    console.log(jsonReport.generate());

    console.log("\n=== 8. Репозиторій із фільтрацією за предикатом ===");
    const highAchievingStudents = await studentRepo.findWhere(
        student => student.calculateGPA() >= 90,
    );
    console.log(
        `Students with GPA >= 90: ${highAchievingStudents.map(student => student.fullName).join(", ")}`,
    );
}

runDemonstration().catch(console.error);
