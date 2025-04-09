# JSmol Electron Viewer

A desktop application for molecular visualization built with Electron and JSmol. This application provides a native desktop experience for the powerful JSmol molecular viewer.

## Features

- Native desktop application experience
- All JSmol molecular visualization capabilities:
  - 3D structure visualization
  - Support for multiple file formats (XYZ, PDB, MOL, CIF, MOLDEN)
  - Advanced orbital visualization with HOMO/LUMO identification
    - Easy orbital navigation with arrow keys
    - Orbital energy level display
    - Quick HOMO/LUMO switching
    - Visual distinction between HOMO and LUMO in the orbital list
  - Interactive controls for rotation and zoom
  - Different visualization styles (wireframe, spacefill, cartoon)
  - Spin animation
- Enhanced XYZ structure editor
  - Edit molecular coordinates directly
  - Live preview of changes
  - Structure optimization capability
  - Atom selection mode for precise editing
  - Save edited structures as XYZ files
  - Draggable and resizable editor window
- Drag and drop file loading
- Cross-platform support (Windows, macOS, Linux)

## Installation

### From Source

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the application:
```bash
npm start
```

### Building

To build the application:
```bash
npm run build
```

This will create installers in the `dist` directory.

## Development

This application is built with:
- Electron
- JSmol (JavaScript-based molecular viewer)
- Node.js

Project structure:
- `src/` - Electron application source code
- `jsmol/` - JSmol viewer files
- `build/` - Build assets including application icons

## Credits

- Electron application wrapper developed as JSmol Viewer
- JSmol is part of the Jmol project:
  - Original Jmol code conversion to JavaScript by Bob Hanson
  - Java2Script written by Zhou Renjian, et al.

## License

This project is licensed under LGPL-2.1.

## Documentation

For more information about the underlying JSmol viewer:
- [Jmol Documentation](http://jmol.sourceforge.net)
- [JSmol Documentation](http://jsmol.sourceforge.net)

## Using the XYZ Editor

The application includes a draggable XYZ structure editor that allows you to:
- View and edit molecular coordinates in XYZ format
- Switch between selection and edit modes
- Select individual atoms in the structure
- Optimize molecular geometry using JSmol's built-in minimization
- Preview changes in real-time in the 3D viewer 
- Save edited structures to XYZ files
- Move the editor window anywhere on screen by dragging its header
- Resize the editor window by dragging its bottom-right corner

To use the editor:
1. Load a molecular structure
2. Click the "Edit XYZ" button
3. Use Selection mode to highlight specific atoms
4. Switch to Edit mode to modify coordinates
5. Click "Optimize Structure" to improve geometry
6. Click "Update Structure" to apply your changes
7. Click "Save XYZ File" to save the current structure

## Orbital Visualization

The orbital viewer provides enhanced visualization of molecular orbitals:
- Interactive orbital list showing energy levels
- Color-coded HOMO and LUMO identifiers
- Keyboard navigation (↑/↓ arrow keys)
- Quick HOMO/LUMO access buttons
- Translucent orbital surface display
- Draggable and resizable control panel

To visualize orbitals:
1. Load a structure with orbital data (e.g., MOLDEN format)
2. Click "Show/Hide Orbitals" button
3. Use arrow keys or buttons to navigate orbitals
4. Click HOMO or LUMO buttons for quick access
5. Select specific orbitals from the energy-sorted list