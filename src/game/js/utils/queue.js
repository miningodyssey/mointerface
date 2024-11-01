export function queueTask(taskQueue, task) {
    taskQueue.push(task);
}
export function clearTaskQueue(taskQueue) {
    taskQueue.length = 0; // Очищает массив очереди задач
}


export function executeTasks(taskQueue, callback, delayBetweenTasks = 0) {
    const tasksPerFrame = 1; // Number of tasks to execute per frame

    function processTasks() {
        if (taskQueue.length === 0) {
            if (callback) callback();
            return;
        }

        const tasksToExecute = taskQueue.splice(0, tasksPerFrame);
        tasksToExecute.forEach(task => task());

        if (delayBetweenTasks > 0) {
            setTimeout(() => requestAnimationFrame(processTasks), delayBetweenTasks);
        } else {
            requestAnimationFrame(processTasks);
        }
    }

    requestAnimationFrame(processTasks);
}
