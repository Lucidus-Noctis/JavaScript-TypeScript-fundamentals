/**
 * Manages tasks, including creation, deletion, searching, sorting,
 * importing, exporting, and tracking task statistics.
 */
export default class TaskManager {
    #tasks = new Map();
    #idCounter = 0;
    #priorityOrder = { 'high': 1, 'normal': 2, 'low': 3 };

    /** Generates a unique ID for a new task. */
    #generateUniqueId() {
        return this.#idCounter++;
    }

    /** Creates a task object with the specified properties. */
    #createTask(title, id, priority, dueDate) {
        return {
            id,
            title,
            completed: false,
            priority,
            dueDate
        }
    }

    /** Creates a new task and adds it to the collection. */
    addTask(title, priority, dueDate) {
        const id = this.#generateUniqueId();
        this.#tasks.set(id, this.#createTask(title, id, priority, dueDate));
    }

    /** Displays all tasks and their current status in the console. */
    showTasks() {
        for (const [id, task] of this.#tasks) {
            const completedSign = task.completed ? 'x' : ' ';
            console.log(`[${completedSign}] ${id} - ${task.title} (priority - ${task.priority}, dueDate - ${task.dueDate})`);
        }
    }

    /** Marks a task as completed if it exists. */
    markCompleted(id) {
        if (this.#tasks.has(id)){
            this.#tasks.get(id).completed = true;
            return true;
        }
        return false;
    }

    /** Removes a task by ID and logs whether the operation succeeded. */
    removeTask(id) {
        const isDeleted = this.#tasks.delete(id);

        if (isDeleted) {
            console.log(`Task with id ${id} has been deleted.`);
            return true;
        } else {
            console.log(`Task with id ${id} does not exist.`);
            return false;
        }
    }

    /** Finds tasks whose titles contain the specified keyword. */
    findTask(keyword) {
        const foundTasks = [];

        for (const task of this.#tasks.values()) {
            if (task.title.toLowerCase().includes(keyword.toLowerCase())) {
                foundTasks.push(task);
            }
        }
        return foundTasks;
    }

    /** Returns the total number of tasks. */
    countTasks() {
        return this.#tasks.size;
    }

    /** Returns the number of completed tasks. */
    countCompletedTasks() {
        return [...this.#tasks.values()].filter(task => task.completed).length;
    }

    /** Exports all tasks as a formatted JSON string. */
    exportTasks() {        
        return JSON.stringify([...this.#tasks.values()], null, 2);
    }

    /** Imports tasks from a JSON string into the collection. */
    importTasks(jsonString) {
        let newTasks;

        try {
            newTasks = JSON.parse(jsonString);
        } catch (error) {
            throw new Error("Invalid JSON format.", { cause: error });
        }

        if (!Array.isArray(newTasks)) {
            throw new TypeError("Imported data must be an array.");
        }

        for (const task of newTasks) {
            if (
                !task ||
                typeof task !== "object" ||
                !Number.isInteger(task.id) ||
                typeof task.title !== "string" ||
                typeof task.completed !== "boolean" ||
                typeof task.dueDate !== "string" ||
                !["high", "normal", "low"].includes(task.priority)
            ) {
                throw new TypeError("Invalid task data.");
            }
        }

        this.#tasks.clear();
        let maxId = -1;
        for (const task of newTasks) {
            this.#tasks.set(task.id, task);
            maxId = Math.max(maxId, task.id);
        }
        this.#idCounter = maxId + 1;
    }

    /** Returns a new array of tasks sorted alphabetically by title. */
    sortByName() {
        return [...this.#tasks.values()].sort((task1, task2) => task1.title.localeCompare(task2.title));
    }

    /** Returns a new array of tasks sorted by priority: high, normal, low. */
    sortByPriority() {
        return [...this.#tasks.values()].sort((task1, task2) => this.#priorityOrder[task1.priority] - this.#priorityOrder[task2.priority]);
    }

    /** Calculates and displays task statistics in the console. */
    showStatistics() {
        const totalTasks = this.countTasks();
        const completedTasks = this.countCompletedTasks();
        const openTasks = totalTasks - completedTasks;
        let completionRate = Math.round(completedTasks / totalTasks * 100);
        completionRate = isNaN(completionRate) ? 'N/A' : (completionRate + '%');

        console.log(`Total Tasks: ${totalTasks}`);
        console.log(`Completed: ${completedTasks}`);
        console.log(`Open: ${openTasks}`);
        console.log(`Completion Rate: ${completionRate}`);
    }
}