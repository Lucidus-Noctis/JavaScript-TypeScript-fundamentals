// faculty.ts
import { Identifiable } from "./basic-contracts";
import { AcademicGroup } from "./learning-units";
import { Teacher } from "./person-hierarchy";

/**
 * Клас Faculty
 * Демонструє КОМПОЗИЦІЮ: Факультет сам створює та знищує свої навчальні групи.
 */
export class Faculty implements Identifiable {
    private _groups: Map<string, AcademicGroup> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
    ) {}

    /**
     * КОМПОЗИЦІЯ: Факультет інкапсулює процес створення групи у своєму складі.
     */
    public createGroup(
        id: string,
        name: string,
        curator?: Teacher,
    ): AcademicGroup {
        if (this._groups.has(id)) {
            throw new Error(
                `Група з ID ${id} вже створена на факультеті ${this.name}`,
            );
        }
        const newGroup = new AcademicGroup(id, name, curator);
        this._groups.set(id, newGroup);
        return newGroup;
    }

    public deleteGroup(groupId: string): boolean {
        return this._groups.delete(groupId);
    }

    public findGroupById(groupId: string): AcademicGroup | undefined {
        return this._groups.get(groupId);
    }

    public getAllGroups(): AcademicGroup[] {
        return Array.from(this._groups.values());
    }
}
