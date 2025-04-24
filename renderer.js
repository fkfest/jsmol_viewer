function showElemCoPanel() {
    document.getElementById('elemcoPanel').style.display = 'block';
    updateElemCoInput(); // Remove initializeElemCoListeners call since we handle it in DOMContentLoaded
}

function hideElemCoPanel() {
    document.getElementById('elemcoPanel').style.display = 'none';
}

function updateElemCoInput() {
    const dfEnabled = document.getElementById('elemco-df').checked;
    const method = document.getElementById('elemco-method').value;
    const aoBasis = document.getElementById('elemco-basis').value;
    const jkfitBasis = document.getElementById('elemco-jkfit').value;
    const mpfitBasis = document.getElementById('elemco-mpfit').value;
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

# Set basis set`;

    // Handle basis set configuration based on selected options
    if (jkfitBasis === 'auto' && mpfitBasis === 'auto') {
        // Use simple basis set specification if no auxiliary basis sets are selected
        elemcoInput += `\nbasis = "${aoBasis}"\n`;
    } else {
        // Build the basis dictionary with selected auxiliary basis sets
        elemcoInput += `\nbasis = Dict(\n    "ao" => "${aoBasis}"`;
        
        if (jkfitBasis !== 'auto') {
            elemcoInput += `,\n    "jkfit" => "${jkfitBasis}"`;
        }
        
        if (mpfitBasis !== 'auto') {
            elemcoInput += `,\n    "mpfit" => "${mpfitBasis}"`;
        }
        
        elemcoInput += "\n)\n";
    }

    // Add charge and multiplicity settings only if they are non-zero
    if (charge !== 0 || multiplicity !== 0) {
        elemcoInput += `\n# Set charge and multiplicity\n@set wf charge=${charge} ms2=${multiplicity}\n`;
    }

    // Add calculation commands
    elemcoInput += `\n# Run HF calculation first\n${dfEnabled ? '@dfhf' : '@dfhf'}\n`;

    // Add coupled cluster calculation if method is not HF
    if (method !== 'HF') {
        const ccCommand = dfEnabled ? '@dfcc' : '@cc';
        elemcoInput += `\n# Run ${method} calculation\n${ccCommand} ${method.toLowerCase()}\n`;
    }

    document.getElementById('elemco-input').value = elemcoInput;
}

function generateElemCoInput() {
    updateElemCoInput();
    document.getElementById('status').innerHTML = 'ElemCo.jl input reset to default';
}

function copyElemCoInput() {
    const input = document.getElementById('elemco-input');
    input.select();
    document.execCommand('copy');
    document.getElementById('status').innerHTML = 'Input copied to clipboard';
}

// Add event listeners for input changes when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const method = document.getElementById('elemco-method');
    const aoBasis = document.getElementById('elemco-basis');
    const jkfitBasis = document.getElementById('elemco-jkfit');
    const mpfitBasis = document.getElementById('elemco-mpfit');
    const charge = document.getElementById('elemco-charge');
    const multiplicity = document.getElementById('elemco-multiplicity');
    const dfToggle = document.getElementById('elemco-df');

    // Add event listeners
    method?.addEventListener('change', updateElemCoInput);
    aoBasis?.addEventListener('change', updateElemCoInput);
    jkfitBasis?.addEventListener('change', updateElemCoInput);
    mpfitBasis?.addEventListener('change', updateElemCoInput);
    charge?.addEventListener('input', updateElemCoInput);
    multiplicity?.addEventListener('input', updateElemCoInput);
    dfToggle?.addEventListener('change', () => {
        updateMethodOptions();
        updateElemCoInput();
    });
});