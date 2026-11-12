export interface UniversityReportData {
    faculty: { id: string; name: string; groups: string[] }[];
    teachers: { id: string; name: string; title: string; salary: number }[];
    students: {
        id: string;
        name: string;
        email: string;
        group: string;
        gpa: number;
        grades: { course: string; score: number; date: string }[];
    }[];
}

/** Базовий клас задає спільний порядок створення звіту. */
export abstract class ReportGenerator {
    constructor(protected readonly data: UniversityReportData) {}

    public generate(): string {
        return `${this.generateHeader()}${this.generateBody()}${this.generateFooter()}`;
    }

    protected abstract generateHeader(): string;
    protected abstract generateBody(): string;
    protected abstract generateFooter(): string;
}

export class XmlReportGenerator extends ReportGenerator {
    protected generateHeader(): string {
        return '<?xml version="1.0" encoding="UTF-8"?>\n<universityReport>\n';
    }

    protected generateBody(): string {
        const faculties = this.data.faculty.map((faculty) =>
            `  <faculty id="${this.escapeXml(faculty.id)}" name="${this.escapeXml(faculty.name)}">\n` +
            faculty.groups.map((group) => `    <group>${this.escapeXml(group)}</group>\n`).join("") +
            '  </faculty>\n',
        ).join("");
        const teachers = this.data.teachers.map((teacher) =>
            `  <teacher id="${this.escapeXml(teacher.id)}" title="${this.escapeXml(teacher.title)}" salary="${teacher.salary}">${this.escapeXml(teacher.name)}</teacher>\n`,
        ).join("");
        const students = this.data.students.map((student) =>
            `  <student id="${this.escapeXml(student.id)}" name="${this.escapeXml(student.name)}" email="${this.escapeXml(student.email)}" group="${this.escapeXml(student.group)}" gpa="${student.gpa}">\n` +
            student.grades.map((grade) => `    <grade course="${this.escapeXml(grade.course)}" score="${grade.score}" date="${this.escapeXml(grade.date)}" />\n`).join("") +
            '  </student>\n',
        ).join("");
        return `  <faculties>\n${faculties}  </faculties>\n  <teachers>\n${teachers}  </teachers>\n  <students>\n${students}  </students>\n`;
    }

    protected generateFooter(): string {
        return '</universityReport>\n';
    }

    private escapeXml(value: string): string {
        return value.replace(/[&<>"']/g, (character) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
        })[character] ?? character);
    }
}

export class JsonReportGenerator extends ReportGenerator {
    protected generateHeader(): string {
        return '{\n';
    }

    protected generateBody(): string {
        return `  "faculties": ${JSON.stringify(this.data.faculty, null, 2).replace(/\n/g, "\n  ")},\n` +
            `  "teachers": ${JSON.stringify(this.data.teachers, null, 2).replace(/\n/g, "\n  ")},\n` +
            `  "students": ${JSON.stringify(this.data.students, null, 2).replace(/\n/g, "\n  ")}\n`;
    }

    protected generateFooter(): string {
        return '}\n';
    }
}