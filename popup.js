const exportButton = document.getElementById('exportButton');
const copyButton = document.getElementById('copyButton');

let tasksText = '';

exportButton.addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'exportTasks' }, (tasks) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      // Process the tasks array and download it as a text file.
      tasksText = tasks.join('\n');
      const blob = new Blob([tasksText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url: url,
        filename: 'schoology-tasks.txt',
        saveAs: true,
      });
    });
  });
});

copyButton.addEventListener('click', async () => {
  if (!tasksText) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'exportTasks' }, (tasks) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        tasksText = tasks.join('\n');
        copyToClipboard(tasksText);
      });
    });
  } else {
    copyToClipboard(tasksText);
  }
});

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Tasks copied to clipboard!');
}