// basic-contracts.ts

/**
 * Базовий контракт для будь-якої сутності з унікальним ідентифікатором
 */
export interface Identifiable {
    readonly id: string;
}

/**
 * Рівні посад викладацького складу (Union-літерали)
 */
export type AcademicTitle = "Assistant" | "AssociateProfessor" | "Professor";

/**
 * Структура оцінки (Асоціація зі студентом і курсом)
 */
export interface Grade {
    readonly courseId: string;
    readonly score: number; // 0 - 100
    readonly date: Date;
}
