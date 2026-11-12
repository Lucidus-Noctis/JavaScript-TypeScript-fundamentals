// person-hierarchy.ts
import { Identifiable, AcademicTitle, Grade } from "./basic-contracts.js";
import { Faculty } from "./faculty.js";

/**
 * Базовий абстрактний клас Person
 */
export abstract class Person implements Identifiable {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        private _email: string,
    ) {
        this.email = _email; // використання сетера для валідації
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (!value.includes("@") || !value.includes(".")) {
            throw new Error(`Невалідний email: ${value}`);
        }
        this._email = value;
    }

    /**
     * Абстрактний метод, який кожен нащадок реалізує самостійно
     */
    abstract getRoleDescription(): string;
}

/**
 * Клас Student (IS-A Person)
 */
export class Student extends Person {
    // Приватне сховище оцінок студента
    private _grades: Grade[] = [];

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        public readonly studentCardNumber: string,
    ) {
        super(id, firstName, lastName, email);
    }

    public addGrade(grade: Grade): void {
        if (grade.score < 0 || grade.score > 100) {
            throw new Error("Оцінка повинна бути в діапазоні від 0 до 100");
        }
        this._grades.push(grade);
    }

    public getGrades(): readonly Grade[] {
        return this._grades; // повертаємо readonly версію для захисту від мутацій ззовні
    }

    public calculateGPA(): number {
        if (this._grades.length === 0) return 0;
        const total = this._grades.reduce((acc, curr) => acc + curr.score, 0);
        return Number((total / this._grades.length).toFixed(2));
    }

    override getRoleDescription(): string {
        return `Студент (Квиток: ${this.studentCardNumber}), Сер. бал: ${this.calculateGPA()}`;
    }
}

/**
 * Базовий клас Teacher (IS-A Person)
 */
export abstract class Teacher extends Person {
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        public readonly academicTitle: AcademicTitle,
        protected baseSalary: number,
    ) {
        super(id, firstName, lastName, email);
    }

    // Розрахунок заробітної плати за поліморфним коефіцієнтом
    public abstract calculateSalary(): number;
}

/**
 * Професор (Конкретний викладач)
 */
export class Professor extends Teacher {
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        baseSalary: number,
    ) {
        super(id, firstName, lastName, email, "Professor", baseSalary);
    }

    public calculateSalary(): number {
        return this.baseSalary * 1.5; // Набавка 50%
    }

    override getRoleDescription(): string {
        return `Професор кафедри (${this.fullName})`;
    }
}

/**
 * Доцент (Конкретний викладач)
 */
export class AssociateProfessor extends Teacher {
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        baseSalary: number,
    ) {
        super(id, firstName, lastName, email, "AssociateProfessor", baseSalary);
    }

    public calculateSalary(): number {
        return this.baseSalary * 1.25; // Набавка 25%
    }

    override getRoleDescription(): string {
        return `Доцент кафедри (${this.fullName})`;
    }
}

/**
 * Адміністратор (Конкретний викладач)
 */
export class Staff extends Person {
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        public department: Faculty,
    ) {
        super(id, firstName, lastName, email);
    }

    public generateServiceId(): string {
        return `Службове посвідчення | ID: ${this.id} | Працівник: ${this.fullName} | Департамент: ${this.department.name}`;
    }

    override getRoleDescription(): string {
        return `Адміністратор: ${this.firstName} ${this.lastName}, департамент: ${this.department.name}`;
    }
}
