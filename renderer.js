function showElemCoPanel() {
    document.getElementById('elemcoPanel').style.display = 'block';
    updateElemCoInput();
}

function hideElemCoPanel() {
    document.getElementById('elemcoPanel').style.display = 'none';
}

function updateElemCoInput() {
    const method = document.getElementById('elemco-method').value;
    const basis = document.getElementById('elemco-basis').value;
    const charge = document.getElementById('elemco-charge').value;
    const multiplicity = document.getElementById('elemco-multiplicity').value;
    
    // Get current molecular structure from JSmol
    const xyzData = Jmol.evaluateVar(jmolApplet0, 'write("xyz")');
    if (!xyzData) {
        document.getElementById('elemco-input').value = '# Please load a molecule first';
        return;
    }

    // Format ElemCo.jl input
    let elemcoInput = `using ElemCo
using Molecules

# Molecule specification
atoms = """
${xyzData.trim()}
"""

mol = Molecule(atoms)
set_charge!(mol, ${charge})
set_multiplicity!(mol, ${multiplicity})

# Method and basis set
method = "${method}"
basis = "${basis}"

# Run calculation
result = elemco_calculation(mol, method=method, basis=basis)
`;

    document.getElementById('elemco-input').value = elemcoInput;
}

function generateElemCoInput() {
    updateElemCoInput();
    document.getElementById('status').innerHTML = 'ElemCo.jl input generated';
}

function copyElemCoInput() {
    const input = document.getElementById('elemco-input');
    input.select();
    document.execCommand('copy');
    document.getElementById('status').innerHTML = 'Input copied to clipboard';
}

// Add event listeners for input changes when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('elemco-method')?.addEventListener('change', updateElemCoInput);
    document.getElementById('elemco-basis')?.addEventListener('change', updateElemCoInput);
    document.getElementById('elemco-charge')?.addEventListener('input', updateElemCoInput);
    document.getElementById('elemco-multiplicity')?.addEventListener('input', updateElemCoInput);
});