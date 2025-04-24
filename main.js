const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// Set up logging
const logFile = path.join(app.getPath('userData'), 'jsmol.log');
function log(message) {
    fs.appendFileSync(logFile, new Date().toISOString() + ': ' + message + '\n');
}

// Clear log file
fs.writeFileSync(logFile, '');
log('Application starting');
log('Working directory: ' + process.cwd());
log('Args: ' + JSON.stringify(process.argv));

let fileContent = null;

function getFileFromArgs() {
    const args = process.argv;
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg.includes('electron') && !arg.endsWith('.exe')) {
            log('Found potential file arg: ' + arg);
            
            // For installed version, just use the current working directory
            const filePath = path.resolve(process.cwd(), arg);
            log('Trying path: ' + filePath);
            
            if (fs.existsSync(filePath)) {
                log('Found file at: ' + filePath);
                return filePath;
            }
            log('File not found: ' + filePath);
        }
    }
    return null;
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
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });

    win.loadFile('index.html');
    win.setMenuBarVisibility(true);

    win.webContents.on('did-finish-load', () => {
        log('Window loaded, has file content: ' + !!fileContent);
        if (fileContent) {
            win.webContents.executeJavaScript(`
                (function loadMolecule() {
                    if (typeof Jmol !== 'undefined' && typeof jmolApplet0 !== 'undefined') {
                        console.log('Starting molecule load...');
                        const waitForReady = setInterval(() => {
                            if (jmolApplet0._ready) {
                                clearInterval(waitForReady);
                                console.log('JSmol ready, loading molecule...');
                                try {
                                    const content = \`${fileContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\`;
                                    Jmol.script(jmolApplet0, 'set echo top left; echo "Loading molecule...";');
                                    setTimeout(() => {
                                        Jmol.script(jmolApplet0, 'load inline "' + content + '";');
                                        Jmol.script(jmolApplet0, 'set echo top left; echo "";');
                                    }, 100);
                                } catch (err) {
                                    console.error('Error loading molecule:', err);
                                }
                            }
                        }, 100);
                        setTimeout(() => clearInterval(waitForReady), 10000); // Timeout after 10s
                    } else {
                        setTimeout(loadMolecule, 100);
                    }
                })();
            `);
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    log('Application closing');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});