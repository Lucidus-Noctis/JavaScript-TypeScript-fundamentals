import TaskManager from './TaskManager.js';

const taskManager = new TaskManager();

const line = '─'.repeat(55);

function printSection(title) {
    console.log(`\n${line}`);
    console.log(`  ${title}`);
    console.log(line);
}

// 1. Add tasks
printSection('1. ADD TASKS');

taskManager.addTask('Learn Closures', 'high', '2026-10-17');
taskManager.addTask('Practice Loops', 'low', '2026-10-15');
taskManager.addTask('Learn Arrays', 'normal', '2026-11-13');
taskManager.addTask('Practice Functions', 'high', '2026-12-12');
taskManager.addTask('Learn Closures', 'low', '2026-11-01');

console.log(`Added tasks: ${taskManager.countTasks()}`);

// 2. Show all tasks
printSection('2. ALL TASKS');

taskManager.showTasks();

// 3. Mark a task as completed
printSection('3. MARK TASK AS COMPLETED');

const completedId = 0;
const isCompleted = taskManager.markCompleted(completedId);

console.log(`Task ${completedId}: ${isCompleted ? 'Completed successfully' : 'Task not found'}`);
taskManager.showTasks();

// 4. Find tasks
printSection('4. SEARCH TASKS');

const keyword = 'closures';
const foundTasks = taskManager.findTask(keyword);

console.log(`Search keyword: "${keyword}"`);
console.log(`Found: ${foundTasks.length} task(s)`);

console.table(foundTasks);

// 5. Sort by name
printSection('5. SORT BY NAME');

console.table(
    taskManager.sortByName().map(({ id, title, priority }) => ({
        ID: id,
        Title: title,
        Priority: priority
    }))
);

// 6. Sort by priority
printSection('6. SORT BY PRIORITY');

console.table(
    taskManager.sortByPriority().map(({ id, title, priority }) => ({
        ID: id,
        Title: title,
        Priority: priority
    }))
);

// 7. Count tasks
printSection('7. TASK COUNTS');

console.log(`Total tasks: ${taskManager.countTasks()}`);
console.log(`Completed tasks: ${taskManager.countCompletedTasks()}`);
console.log(`Open tasks: ${taskManager.countTasks() - taskManager.countCompletedTasks()}`);

// 8. Show statistics
printSection('8. STATISTICS');

taskManager.showStatistics();

// 9. Export tasks
printSection('9. EXPORT TASKS');

const exportedTasks = taskManager.exportTasks();

console.log(exportedTasks);

// 10. Remove a task
printSection('10. REMOVE TASK');

const removedId = 1;
const isRemoved = taskManager.removeTask(removedId);

console.log(`Removal result: ${isRemoved ? 'Success' : 'Failed'}`);
console.log(`Tasks remaining: ${taskManager.countTasks()}`);

// 11. Import tasks
printSection('11. IMPORT TASKS');

// Create a separate manager to demonstrate importing without
// affecting the original manager.
const importedTaskManager = new TaskManager();

try {
    importedTaskManager.importTasks(exportedTasks);

    console.log('Tasks imported successfully.');
    console.log(`Imported tasks: ${importedTaskManager.countTasks()}`);

    importedTaskManager.showTasks();
} catch (error) {
    console.error(`Import failed: ${error.message}`);
}

// 12. Test invalid task data
printSection('12. ERROR HANDLING');

try {
    taskManager.importTasks('{ invalid JSON }');
} catch (error) {
    console.log(`Invalid JSON handled: ${error.message}`);
}

// 13. Final state
printSection('13. FINAL STATE');

taskManager.showStatistics();

console.log('\nTest completed.');