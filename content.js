chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportTasks') {
    const tasks = getTasksFromSchoology();
    sendResponse(tasks);
  }
  return true;
});

function getTasksFromSchoology() {
  const upcomingTaskElements = document.querySelectorAll('#upcoming-events .upcoming-event');
  const tasks = [];

  for (const taskElement of upcomingTaskElements) {
    const titleElement = taskElement.querySelector('h4 a');
    const title = titleElement ? titleElement.textContent.trim() : '';

    const dueDateElement = taskElement.previousElementSibling;
    const dueDate = dueDateElement && dueDateElement.classList.contains('date-header') ? dueDateElement.textContent.trim() : '';

    const task = `${title} - ${dueDate}`;
    tasks.push(task);
  }

  return tasks;
}