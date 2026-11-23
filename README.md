# CircuitWeb
### Browser-Based Circuit Design and Communication Systems Simulation Platform

CircuitWeb is a standalone educational electronics and circuit-design project.
It is designed to provide an interactive environment for students to explore
electronic components, construct circuits, connect pins, study circuit
schematics and use supported educational simulation tools.

CircuitWeb is maintained as a separate application. It is not part of EduLabX.

---

## 1. Project Overview

CircuitWeb aims to provide an accessible browser-based workspace for:

- Electronic circuit design
- Drag-and-drop component placement
- Pin-to-pin circuit connections
- Wire routing and editing
- Component property editing
- Circuit schematic visualization
- Code-view interface
- 3D scene visualization
- Oscilloscope and DSO-style visualization
- Supported educational circuit simulations
- Circuit editing and project management

The actual simulation capabilities depend on the components and models
implemented in the application.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| JavaScript | Application logic |
| JSX | React components |
| Vite 8 | Development server and build system |
| CSS | Interface styling |
| pnpm | Package management |
| Three.js | 3D graphics |
| React Three Fiber | React-based 3D rendering |
| Zustand | State management |
| Lucide React | Interface icons |

Additional dependencies and their exact versions are defined in
`client/package.json` and `client/pnpm-lock.yaml`.

## 3. Project Structure

```text
CircuitWeb/
|
├── README.md
├── .gitignore
|
└── client/
    |
    ├── public/
    |   ├── images/
    |   ├── icons.svg
    |   └── favicon.svg
    |
    ├── src/
    |   ├── App.jsx
    |   ├── App.css
    |   ├── main.jsx
    |   ├── Canvas.jsx
    |   ├── Sidebar.jsx
    |   ├── Toolbar.jsx
    |   ├── TopBar.jsx
    |   ├── CodeView.jsx
    |   ├── SchematicView.jsx
    |   ├── RealisticDSO.jsx
    |   ├── Scene3D.jsx
    |   |
    |   ├── components/
    |   |   ├── Canvas.jsx
    |   |   ├── CircuitIcons.jsx
    |   |   ├── ControlsPanel.jsx
    |   |   ├── DSOModal.jsx
    |   |   ├── GuidedLabUI.jsx
    |   |   ├── Oscilloscope.jsx
    |   |   ├── SandboxUI.jsx
    |   |   └── symbols/
    |   |
    |   ├── electrical/
    |   |   ├── breadboardContacts.js
    |   |   ├── directPinContacts.js
    |   |   ├── mcu8051Lcd.js
    |   |   ├── netlist.js
    |   |   ├── simulationEngine.js
    |   |   └── wireRouting.js
    |   |
    |   ├── store.js
    |   ├── wiring.js
    |   ├── pins.js
    |   ├── simulation.js
    |   └── metadata.js
    |
    ├── tests/
    |   ├── editor-toolbar-smoke.test.mjs
    |   ├── pin-breadboard-behavior.test.mjs
    |   ├── simulation-engine.test.mjs
    |   └── wire-routing.test.mjs
    |
    ├── package.json
    ├── pnpm-lock.yaml
    ├── index.html
    └── vite.config.js
```

Note: This is a representative source layout. Some files may be located
at the client root or under `client/src` depending on the current version.

## 4. Main Application Modules

### Circuit Editor
Provides the workspace for adding, selecting and arranging electronic
components.

### Component Library
Contains component definitions, symbols, pin information and metadata.

### Wiring System
Handles electrical connections between supported component pins.

### Electrical Engine
Contains electrical connectivity, netlist and simulation-related logic.

### Schematic View
Provides a schematic-oriented view of the circuit design.

### Code View
Provides the code editing interface. Actual code execution depends on
the implementation of the relevant runtime or emulator.

### DSO / Oscilloscope
Provides an interface for observing supported signals and waveforms.
Waveforms should be treated as simulated educational results, not
physical instrument measurements.

### 3D Scene
Provides a 3D visualization environment using the Three.js ecosystem.

### 8051 Module
Contains 8051-related LCD and peripheral integration code. Hardware
behavior and instruction execution must be validated against the
implemented processor model.

## 5. System Requirements

Recommended development environment:

- Ubuntu Linux or another supported desktop operating system
- Node.js compatible with Vite 8
- pnpm package manager
- Git
- Internet connection for initial dependency installation
- Modern browser such as Chrome, Firefox or Edge

Check installed versions:

```bash
node --version
pnpm --version
git --version
```

## 6. Installation Guide

### Step 1: Install Node.js

Install a supported Node.js release.

Check:

```bash
node -v
npm -v
```

### Step 2: Enable pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

If Corepack is unavailable, install pnpm using its official installation
instructions.

### Step 3: Download the Repository

```bash
git clone https://github.com/1231248393/CircuitWeb.git
```

### Step 4: Enter the Frontend Directory

```bash
cd CircuitWeb/client
```

### Step 5: Install Dependencies

```bash
pnpm install
```

This installs the dependencies defined in package.json using the lockfile.

### Step 6: Start Development Server

```bash
pnpm dev
```

Open the local URL printed by Vite in your browser.
The default Vite address is usually:

http://localhost:5173

### Step 7: Create Production Build

```bash
pnpm build
```

The production output is generated in the `dist` directory.

### Step 8: Preview Production Build

```bash
pnpm preview
```

Open the preview URL printed in the terminal.

## 7. Available Commands

Run these commands from `CircuitWeb/client`:

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build |
| `pnpm run` | List available package scripts |

## 8. Testing

The project contains test files for:

- Editor toolbar behavior
- Pin and breadboard behavior
- Simulation engine behavior
- Wire routing behavior

Inspect the test setup before running tests.

For Node.js built-in test modules, the following command can be used:

```bash
node --test tests/*.test.mjs
```

A passing test suite does not replace manual browser testing.

## 9. Development Roadmap

### Stage 1 - Core Application
- React and Vite setup
- Main editor interface
- Basic component organization

### Stage 2 - Circuit Workspace
- Component placement
- Canvas interactions
- Circuit editing

### Stage 3 - Electrical Connectivity
- Pin definitions
- Wire routing
- Breadboard connectivity
- Component metadata
- Simulation-related engine development
- DSO and editor improvements

### Stage 4 - Advanced Development
Planned areas for continued development:

- Reliable circuit save and restore
- Improved circuit editing and validation
- Electrical simulation accuracy
- Improved DSO signal integration
- Schematic generation
- 8051 instruction and peripheral validation
- Expanded automated tests
- Performance and usability improvements

Roadmap items are development goals and should not be considered
completed until implemented and tested.

## 10. Project Data and Storage

The application includes state-management and storage-related source files.

Check the actual persistence implementation before relying on it for
long-term backups or cross-device synchronization.

Do not store passwords, private keys or sensitive credentials in
browser storage or public source files.

## 11. Important Development Notes

- CircuitWeb is an independent project.
- EduLabX is a separate educational portal.
- Do not merge the two application interfaces.
- Do not claim hardware-level simulation without hardware-accurate models.
- Clearly distinguish mathematical educational simulations from
  full electrical circuit simulation.
- Preserve working circuit profiles and existing functionality when
  introducing new features.
- Run lint, build and relevant tests after code changes.

## 12. GitHub Repository

Repository:
https://github.com/1231248393/CircuitWeb

Main branch:
`main`

## 13. Contribution Workflow

1. Clone the repository.
2. Create a development branch.
3. Make changes in the client application.
4. Run lint and production build.
5. Run relevant tests.
6. Review the changes.
7. Commit and push your work.
8. Create a GitHub release after verification.

Example:

```bash
git checkout -b feature/your-feature
git add README.md client/
git commit -m "Update CircuitWeb documentation and source"
git push -u origin feature/your-feature
```

## 14. License

A license has not yet been specified.
Add a suitable LICENSE file before granting permissions for reuse,
distribution or modification.

---

**CircuitWeb - Interactive Electronics Design and Learning Environment**
