// learning-units.ts
import { Identifiable } from "./basic-contracts";
import { Student, Teacher } from "./person-hierarchy";

/**
 * Клас Course (Агрегує викладача)
 */
export class Course implements Identifiable {
    constructor(
        public readonly id: string,
        public title: string,
        public credits: number,
        // АГРЕГАЦІЯ: Курс знає про вчителя, але вчитель існує незалежно від курсу
        private _instructor: Teacher,
        public readonly prerequisites: Course[] = [],
    ) {}

    public canEnroll(student: Student): boolean {
        return this.prerequisites.every(course =>
            student
                .getGrades()
                .some(
                    grade => grade.courseId === course.id && grade.score >= 60,
                ),
        );
    }

    get instructor(): Teacher {
        return this._instructor;
    }

    public reassignInstructor(newInstructor: Teacher): void {
        console.log(
            `[Course Info] Зміна викладача курсу "${this.title}": ${newInstructor.fullName}`,
        );
        this._instructor = newInstructor;
    }
}

/**
 * Клас AcademicGroup (Агрегує студентів та призначеного куратора)
 */
export class AcademicGroup implements Identifiable {
    // АГРЕГАЦІЯ: Масив посилань на студентів, які існують самостійно
    private _students: Map<string, Student> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
        // АГРЕГАЦІЯ: Викладач виступає куратором
        public curator?: Teacher,
    ) {}

    public addStudent(student: Student): void {
        if (this._students.has(student.id)) {
            throw new Error(
                `Студент ${student.fullName} вже зарахований до групи ${this.name}`,
            );
        }
        this._students.set(student.id, student);
    }

    public removeStudent(studentId: string): boolean {
        return this._students.delete(studentId);
    }

    public getStudents(): Student[] {
        return Array.from(this._students.values());
    }

    public getGroupAverageScore(): number {
        const list = this.getStudents();
        if (list.length === 0) return 0;
        const totalGpa = list.reduce((acc, s) => acc + s.calculateGPA(), 0);
        return Number((totalGpa / list.length).toFixed(2));
    }
}
