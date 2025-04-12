const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// Set up logging
const logFile = path.join(app.getPath('userData'), 'jsmol.log');
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(message);
}

// Clear log file
fs.writeFileSync(logFile, '');
log('Application starting');
log('Working directory: ' + process.cwd());
log('Args: ' + JSON.stringify(process.argv));

let fileContent = null;

function getFileFromArgs() {
    const args = process.argv.slice(process.defaultApp ? 2 : 1);
    return args.find(arg => !arg.startsWith('-'));
}

const fileArg = getFileFromArgs();
if (fileArg) {
    try {
        fileContent = fs.readFileSync(fileArg, 'utf8');
        log('File loaded successfully, size: ' + fileContent.length);
    } catch (error) {
        log('Error reading file: ' + error.toString());
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false, // Don't show until fully loaded
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });

    win.loadFile(path.join(__dirname, '../index.html'));
    win.setMenuBarVisibility(true);

    // Wait for window to be ready before showing
    win.once('ready-to-show', () => {
        win.show();
        // Initialize JSmol after window is visible
        win.webContents.executeJavaScript(`
            if (typeof Jmol !== 'undefined' && typeof jmolApplet0 !== 'undefined') {
                const container = document.getElementById('viewer-inner');
                const width = container.offsetWidth || 400;
                const height = container.offsetHeight || 400;
                
                // Force immediate canvas resize
                const canvas = document.querySelector('#viewer-inner canvas');
                if (canvas) {
                    canvas.width = width;
                    canvas.height = height;
                }
                
                // Update JSmol dimensions
                Jmol.resizeApplet(jmolApplet0, [width, height]);
            }
        `);
    });

    // Handle window resizing
    let resizeTimeout;
    win.on('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            win.webContents.executeJavaScript(`
                if (typeof Jmol !== 'undefined' && typeof jmolApplet0 !== 'undefined' && jmolApplet0._ready) {
                    const container = document.getElementById('viewer-inner');
                    const width = container.offsetWidth;
                    const height = container.offsetHeight;
                    
                    const canvas = document.querySelector('#viewer-inner canvas');
                    if (canvas) {
                        canvas.width = width;
                        canvas.height = height;
                        Jmol.resizeApplet(jmolApplet0, [width, height]);
                    }
                }
            `);
        }, 100);
    });

    // Load file content if any
    if (fileContent) {
        win.webContents.on('did-finish-load', () => {
            log('Window loaded');
            win.webContents.executeJavaScript(`
                if (typeof Jmol !== 'undefined' && typeof jmolApplet0 !== 'undefined') {
                    console.log('Loading molecule...');
                    const waitForReady = setInterval(() => {
                        if (jmolApplet0._ready) {
                            clearInterval(waitForReady);
                            try {
                                const content = \`${fileContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\`;
                                Jmol.script(jmolApplet0, 'load inline "' + content + '"');
                                console.log('Molecule loaded successfully');
                            } catch (e) {
                                console.error('Error loading molecule:', e);
                            }
                        }
                    }, 100);
                }
            `);
        });
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    log('Application closing');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});