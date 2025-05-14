import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

// Для использования __dirname с ES-модулями
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OFFSET = 12;
const windowWidth = 30;
const windowHeight = 500;
/*const windowWidth = 250;
const windowHeight = 500;*/
const flyoutWidth = 280;
const esmpWidth = 800;
const copyWidth = 300;


let mainWindow;
let flyoutWindow;
let jiraUserListWindow;
let esmpUserListWindow;
let copyWindow;

const isDev = !app.isPackaged;

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const { x, y } = primaryDisplay.workArea;

    // Главное окно
    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: width - windowWidth - OFFSET,
        y: y + height - windowHeight - OFFSET+10,
        alwaysOnTop: true,
        frame: false,
        transparent: false,
        webPreferences: {
            devTools: true,
            preload: path.join(__dirname, 'preload.js'), // Указываем preload
            contextIsolation: true, // ❗ защита
            nodeIntegration: false, // ❗ никаких Node API напрямую
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    // Flyout окно
    flyoutWindow = new BrowserWindow({
        width: flyoutWidth,
        height: windowHeight,
        x: mainWindow.getBounds().x - flyoutWidth,
        y: mainWindow.getBounds().y,
        frame: false,
        show: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    jiraUserListWindow = new BrowserWindow({
        width: flyoutWidth,
        height: windowHeight,
        x: mainWindow.getBounds().x - flyoutWidth,
        y: mainWindow.getBounds().y,
        frame: false,
        show: false,
        transparent: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    esmpUserListWindow = new BrowserWindow({
        width: esmpWidth,
        height: windowHeight,
        x: mainWindow.getBounds().x - esmpWidth,
        y: mainWindow.getBounds().y,
        frame: false,
        show: false,
        transparent: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    copyWindow = new BrowserWindow({
        width: copyWidth,
        height: windowHeight,
        x: mainWindow.getBounds().x - copyWidth,
        y: mainWindow.getBounds().y,
        frame: false,
        show: false,
        transparent: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    // Загружаем test.html
    if (isDev) {
        flyoutWindow.loadURL('http://localhost:5173/src/test.html');
        jiraUserListWindow.loadURL('http://localhost:5173/src/jiraUserList.html');
        esmpUserListWindow.loadURL('http://localhost:5173/src/esmpUserList.html');
        copyWindow.loadURL('http://localhost:5173/src/copyManager.html');
    } else {
        flyoutWindow.loadFile(path.join(__dirname, 'dist', 'src/test.html'));
        jiraUserListWindow.loadFile(path.join(__dirname, 'dist', 'src/jiraUserList.html'));
        esmpUserListWindow.loadFile(path.join(__dirname, 'dist', 'src/esmpUserList.html'));
        copyWindow.loadFile(path.join(__dirname, 'dist', 'src/copyManager.html'));
    }

    // Привязываем движение
    mainWindow.on('move', () => {
        const [mainX, mainY] = mainWindow.getBounds();
        flyoutWindow.setBounds({
            x: mainX - flyoutWidth,
            y: mainY,
            width: flyoutWidth,
            height: windowHeight,
        });
        jiraUserListWindow.setBounds({
            x: mainX - flyoutWidth,
            y: mainY,
            width: flyoutWidth,
            height: windowHeight,
        });
        esmpUserListWindow.setBounds({
            x: mainX - flyoutWidth,
            y: mainY,
            width: flyoutWidth,
            height: windowHeight,
        });
        copyWindow.setBounds({
            x: mainX - flyoutWidth,
            y: mainY,
            width: flyoutWidth,
            height: windowHeight,
        });
    });

    /*

    const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // путь к вашему Chrome
});


     */


    ipcMain.handle('run-puppeteer', async (event, args) => {
        try {
            //args.ticket
            if(!args.ticket){
                throw new Error('Ticket is required');
            }
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            console.log('Запуск Puppeteer...');
            const browser = await puppeteer.launch({
                headless: false,
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // путь к вашему Chrome
            });
            const page = await browser.newPage();
            //https://sm.gasvybory2.ru/sm/ESMPUserLogin?Lang=&RequestedURL=&TimeZoneOffset=
            await page.goto('https://sm.gasvybory2.ru/sm/ESMPUserLogin?Lang=&RequestedURL=&TimeZoneOffset=', { waitUntil: 'networkidle2' });
            await page.type('#app > div > div > div.d-flex-nowrap-centered.flex-grow-1 > form > div.login-form > div:nth-child(2) > div > div > input', 'заглушка-юзер', { delay: 50 });
            await page.type('#app > div > div > div.d-flex-nowrap-centered.flex-grow-1 > form > div.login-form > div.input-block.d-flex.mt-24 > div > div > input', 'заглушка-пароль', { delay: 50 });
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }), // или 'load', 'networkidle2' в зависимости от ситуации
                page.waitForSelector('#app > div > main > aside > div > div.esmp-sidebar__footer > div.esmp-dropdown.esmp-dropdown--is-transfered.navigation-sidebar-user-wrapper > div > div.navigation-sidebar-user__name', { timeout: 30000 }),
                page.waitForSelector('#app > div > main > div.main__content.d-flex-nowrap.flex-column > div > div.layout-content.d-flex-nowrap.flex-column.layout-content_without-aside.queue-tickets > div > div.layout-content__main.w-100.relative.px-24 > div.report-table-with-controls > div.report-table-with-controls__inner > div > div.table-with-types.report-table-with-controls__report-table > div.esmp-table__wrapper.sm-table_selectable > table > thead', { timeout: 30000 }),
                page.click('#app > div > div > div.d-flex-nowrap-centered.flex-grow-1 > form > div.login-form > button'), // клик по элементу
            ]);
            await page.type('#search input', args.ticket, { delay: 50 });
            const [newPage] = await Promise.all([
                new Promise(resolve => {
                    browser.once('targetcreated', async target => {
                        if (target.type() === 'page') {
                            const page = await target.page();
                            resolve(page);
                        }
                    });
                }),
                page.click('#app > div > main > aside > div > div.esmp-sidebar__footer > div.navigation-sidebar-search__wrapper.d-flex-nowrap.align-center.align-h-start > div > button > div > svg'), // клик по элементу
            ]);
            await newPage.bringToFront(); // активировать вкладку
            await newPage.waitForNavigation({waitUntil: 'networkidle0'});
            await newPage.hover('#app > div > main > div.main__content.d-flex-nowrap.flex-column > div > div.layout-content.d-flex-nowrap.flex-column > div.layout-content__body.d-flex-nowrap.flex-row > div.layout-content__main.w-100.relative.px-24 > div.ticket-view-content.h-100.d-flex-nowrap.flex-column > div.operation-bar.d-flex.w-100.px-24.py-4 > div:nth-child(6) > div > button > div > div > span');


            await Promise.all([
                newPage.waitForSelector('#app > div > main > div.main__content.d-flex-nowrap.flex-column > div > div.layout-content.d-flex-nowrap.flex-column > div.layout-content__body.d-flex-nowrap.flex-row > div.layout-content__main.w-100.relative.px-24 > div.ticket-view-content.h-100.d-flex-nowrap.flex-column > div.operation-bar.d-flex.w-100.px-24.py-4 > div:nth-child(6) > div > button > div > div > span'),
                newPage.hover('#app > div > main > div.main__content.d-flex-nowrap.flex-column > div > div.layout-content.d-flex-nowrap.flex-column > div.layout-content__body.d-flex-nowrap.flex-row > div.layout-content__main.w-100.relative.px-24 > div.ticket-view-content.h-100.d-flex-nowrap.flex-column > div.operation-bar.d-flex.w-100.px-24.py-4 > div:nth-child(6) > div > button > div > div > span'),
                newPage.click('#app > div > main > div.main__content.d-flex-nowrap.flex-column > div > div.layout-content.d-flex-nowrap.flex-column > div.layout-content__body.d-flex-nowrap.flex-row > div.layout-content__main.w-100.relative.px-24 > div.ticket-view-content.h-100.d-flex-nowrap.flex-column > div.operation-bar.d-flex.w-100.px-24.py-4 > div:nth-child(6) > div > div > button:nth-child(1) > div > div > span')
            ]);
            await delay(3000);
            page.on('popup', async (popupPage) => {
                // Тут у вас есть `popupPage` — это новая страница
                await popupPage.bringToFront(); // активировать
                console.log("activated");
                // Можно ждать загрузки, взаимодействовать и т.д.
                await popupPage.waitForNavigation({waitUntil: 'networkidle0'}); // или waitForNavigation

                await page.type('#DynamicField_UpdateTicketDecision','InputText', { delay: 50 });
                await delay(28000);
            });
            //await newPage.waitForLoadState();
            //await page.goto(args.ticket);
            const buffer = await newPage.screenshot();
            await browser.close();
            return { success: true, data: buffer.toString('base64') };
        } catch (err) {
            console.error('Ошибка Puppeteer:', err);
            return { success: false, error: err.message || String(err) };
        }
    });



    ipcMain.on('toggle-flyout', () => {
        if (flyoutWindow.isVisible()) {
            flyoutWindow.hide();
        } else {
            flyoutWindow.show();
            jiraUserListWindow.hide();
            esmpUserListWindow.hide();
            copyWindow.hide();
        }
    });

    ipcMain.on('toggle-jira', () => {
        if (jiraUserListWindow.isVisible()) {
            jiraUserListWindow.hide();
        } else {
            jiraUserListWindow.show();
            flyoutWindow.hide();
            esmpUserListWindow.hide();
            copyWindow.hide();
        }
    });
    ipcMain.on('toggle-ESMP', () => {
        if (esmpUserListWindow.isVisible()) {
            esmpUserListWindow.hide();
        } else {
            esmpUserListWindow.show();
            flyoutWindow.hide();
            jiraUserListWindow.hide();
            copyWindow.hide();
        }
    });

    ipcMain.on('toggle-copy', () => {
        if (copyWindow.isVisible()) {
            copyWindow.hide();
        } else {
            copyWindow.show();
            esmpUserListWindow.hide();
            flyoutWindow.hide();
            jiraUserListWindow.hide();
        }
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

