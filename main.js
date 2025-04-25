const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const { version } = require('./package.json')

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
        resizable: true,
        icon: path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : process.platform === 'darwin' ? 'icon.icns' : 'icons/512x512.png'),
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
        // Pass version information to renderer
        win.webContents.executeJavaScript(`window.appVersion = "${version}";`);
        
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

// Function to update method options based on DF toggle
function updateMethodOptions() {
    const dfEnabled = document.getElementById('elemco-df').checked;
    const methodSelect = document.getElementById('elemco-method');
    const selectedMethod = methodSelect.value;
    
    // Store all available methods
    const allMethods = {
        standard: ['HF', 'MP2', 'DCSD', 'CCSD(T)', 'CCSDT', 'DC-CCSDT'],
        df: ['HF', 'MP2', 'SVD-DCSD']
    };

    // Clear existing options
    methodSelect.innerHTML = '';

    // Add appropriate methods based on DF toggle
    const methods = dfEnabled ? allMethods.df : allMethods.standard;
    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.text = method;
        methodSelect.appendChild(option);
    });

    // Try to maintain selected method if it's still available
    if (methods.includes(selectedMethod)) {
        methodSelect.value = selectedMethod;
    }

    // Update the input text
    updateElemCoInput();
}

// Update the updateElemCoInput function to handle DF
function updateElemCoInput() {
    const dfEnabled = document.getElementById('elemco-df').checked;
    const method = document.getElementById('elemco-method').value;
    const basis = document.getElementById('elemco-basis').value;
    const charge = parseInt(document.getElementById('elemco-charge').value) || 0;
    const multiplicity = parseInt(document.getElementById('elemco-multiplicity').value) || 0;
    
    // Get current molecular structure from JSmol
    const xyzData = Jmol.evaluateVar(jmolApplet0, 'write("xyz")');
    if (!xyzData) {
        document.getElementById('elemco-input').value = '# Please load a molecule first';
        return;
    }

    // Format ElemCo.jl input with complete XYZ specification
    let elemcoInput = `using ElemCo

# Molecule specification
geometry = """
${xyzData.trim()}
"""

# Set basis set
basis = "${basis}"

`;

    // Add charge and multiplicity settings only if they are non-zero
    if (charge !== 0 || multiplicity !== 0) {
        elemcoInput += `# Set charge and multiplicity\n@set wf charge=${charge} ms2=${multiplicity}\n\n`;
    }

    // Add calculation commands
    elemcoInput += `# Run HF calculation first\n${dfEnabled ? '@dfhf' : '@hf'}\n`;

    // Add coupled cluster calculation if method is not HF
    if (method !== 'HF') {
        const ccCommand = dfEnabled ? '@dfcc' : '@cc';
        elemcoInput += `\n# Run ${method} calculation\n${ccCommand} ${method.toLowerCase()}\n`;
    }

    document.getElementById('elemco-input').value = elemcoInput;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    log('Application closing');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});