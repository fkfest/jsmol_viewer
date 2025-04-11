# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2025-04-11

### Fixed
- Reduced minimum viewer height to 200px to match minimum width
- Added `set zoomLarge false` to JSmol initialization to allow smaller viewer dimensions
- Fixed resizing behavior when reducing viewer dimensions

### Added
- Added drag&minimize functionality
- Export image feature for JSmol viewer
- Browser compatibility (a browser option)

## [0.1.1] - 2025-04-10

Initial release with basic functionality.

### Added
- JSmol molecular viewer integration
- Desktop application wrapper using Electron
- Support for multiple file formats (XYZ, PDB, MOL, CIF, MOLDEN)
- Orbital visualization features
- Structure editing capabilities
- Cross-platform support
