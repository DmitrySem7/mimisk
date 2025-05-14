/* eslint-env node */
const { contextBridge, ipcRenderer,shell  } = require('electron');

// Пробрасываем методы в глобальное окно
contextBridge.exposeInMainWorld('electronAPI', {
    toggleFlyout: () => ipcRenderer.send('toggle-flyout'),
    toggleESMP: () => ipcRenderer.send('toggle-ESMP'),
    toggleJira: () => ipcRenderer.send('toggle-jira'),
    toggleCopy: () => ipcRenderer.send('toggle-copy'),
    runPuppeteer: (ticket) => ipcRenderer.invoke('run-puppeteer', { ticket }),
    openExternal: (url) => shell.openExternal(url)
});


