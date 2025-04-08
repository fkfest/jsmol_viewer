# JSmol Electron Viewer

A desktop application for molecular visualization built with Electron and JSmol. This application provides a native desktop experience for the powerful JSmol molecular viewer.

## Features

- Native desktop application experience
- All JSmol molecular visualization capabilities:
  - 3D structure visualization
  - Support for multiple file formats (XYZ, PDB, MOL, CIF, MOLDEN)
  - Orbital visualization with HOMO/LUMO identification
  - Interactive controls for rotation and zoom
  - Different visualization styles (wireframe, spacefill, cartoon)
  - Spin animation
- Draggable XYZ structure editor
  - Edit molecular coordinates directly
  - Live preview of changes
  - Save edited structures as XYZ files
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
- Preview changes in real-time in the 3D viewer 
- Save edited structures to XYZ files
- Move the editor window anywhere on screen by dragging its header
- Resize the editor window by dragging its bottom-right corner

To use the editor:
1. Load a molecular structure
2. Click the "Edit XYZ" button
3. Make changes to the coordinates in the editor
4. Click "Update Structure" to see your changes
5. Click "Save XYZ File" to save the current structure