# CircuitWeb

**A browser-based circuit design and educational simulation workspace.**

GitHub: https://github.com/1231248393/CircuitWeb

CircuitWeb is a standalone React and Vite application for exploring
electronic circuit design, component connections, schematic views,
and supported educational simulations.

> CircuitWeb is a separate project. It is not part of EduLabX.

## 1. Project Overview

The project provides a frontend workspace for:

- Placing and arranging electronic components.
- Working with component pins and wire connections.
- Editing circuit layouts and component properties.
- Viewing circuit schematic representations.
- Exploring supported educational simulations.
- Viewing signal information through the DSO/oscilloscope interface.
- Exploring code and 3D scene interfaces.

Actual behavior depends on the implementation of each component and
simulation model. This project should not be considered a complete
SPICE replacement or a physical hardware emulator.

## 2. Technology Stack

The repository uses:

- React 19
- Vite 8
- JavaScript and JSX
- CSS
- Three.js and React Three Fiber
- Zustand state management
- Lucide React icons
- pnpm package management

The exact dependency versions are recorded in `client/package.json`
and `client/pnpm-lock.yaml`.

## 3. Project Structure

```text
CircuitWeb/
├── README.md
├── .gitignore
└── client/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── index.html
    ├── vite.config.js
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── Canvas.jsx
    │   ├── Sidebar.jsx
    │   ├── Toolbar.jsx
    │   ├── TopBar.jsx
    │   ├── CodeView.jsx
    │   ├── SchematicView.jsx
    │   ├── RealisticDSO.jsx
    │   ├── Scene3D.jsx
    │   ├── components/
    │   ├── electrical/
    │   ├── simulationEngine.js
    │   ├── wiring.js
    │   ├── pins.js
    │   └── store.js
    └── tests/
        ├── editor-toolbar-smoke.test.mjs
        ├── pin-breadboard-behavior.test.mjs
        ├── simulation-engine.test.mjs
        └── wire-routing.test.mjs
```

Some files and folders may change as development continues.

## 4. Requirements

Recommended development environment:

- Windows 10/11 or Ubuntu Linux.
- 64-bit operating system.
- Node.js 24 LTS.
- pnpm 12.
- Git.
- Internet connection for downloading dependencies.
- A modern browser such as Chrome, Firefox or Edge.

Vite 8 requires Node.js 20.19+ or 22.12+.

## 5. Installation on Windows 10/11

### Step 1 — Install Node.js

1. Open https://nodejs.org/en/download/
2. Download the Windows LTS installer.
3. Run the `.msi` installer.
4. Keep the recommended installation options.
5. Finish installation.
6. Open a new PowerShell window.

Verify:

```powershell
node --version
npm --version
```

### Step 2 — Install Git

Download Git for Windows:

https://git-scm.com/download/win

Complete the installation and open PowerShell again.

Verify:

```powershell
git --version
```

### Step 3 — Install pnpm

```powershell
npm install -g pnpm@12
```

Verify:

```powershell
pnpm --version
```

### Step 4 — Download CircuitWeb

```powershell
git clone https://github.com/1231248393/CircuitWeb.git
cd CircuitWeb
```

### Step 5 — Enter the frontend folder

```powershell
cd client
```

### Step 6 — Install dependencies

```powershell
pnpm install --frozen-lockfile
```

### Step 7 — Start CircuitWeb

```powershell
pnpm dev
```

Open the local address printed in the terminal, normally:

http://localhost:5173

## 6. Installation on Ubuntu / Linux

### Step 1 — Update packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2 — Install Git and utilities

```bash
sudo apt install -y git curl ca-certificates
```

Verify:

```bash
git --version
```

### Step 3 — Install Node.js using NVM

Install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```

Load NVM into the current terminal:

```bash
source ~/.bashrc
```

Install Node.js 24:

```bash
nvm install 24
nvm use 24
nvm alias default 24
```

Verify:

```bash
node --version
npm --version
```

### Step 4 — Install pnpm

```bash
npm install -g pnpm@12
```

Verify:

```bash
pnpm --version
```

### Step 5 — Clone the repository

```bash
git clone https://github.com/1231248393/CircuitWeb.git
cd CircuitWeb
```

### Step 6 — Open the frontend

```bash
cd client
```

### Step 7 — Install dependencies

```bash
pnpm install --frozen-lockfile
```

### Step 8 — Run the application

```bash
pnpm dev
```

Open:

http://localhost:5173

## 7. Development Commands

Run these commands from the `client` directory.

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |

### Production build

```bash
pnpm build
```

The generated production files are normally stored in:

```text
client/dist/
```

### Preview production build

```bash
pnpm preview
```

Use the local URL printed by Vite.

## 8. Automated Tests

The repository contains test files under:

```text
client/tests/
```

They cover areas including:

- Editor toolbar behavior.
- Pin and breadboard behavior.
- Simulation engine behavior.
- Wire routing behavior.

Run the Node.js test runner from `client`:

```bash
node --test tests/*.test.mjs
```

A passing test suite does not replace manual testing of the complete application.

## 9. Important Modules

| Module | Responsibility |
|---|---|
| `Canvas.jsx` | Circuit workspace |
| `Sidebar.jsx` | Component library interface |
| `Toolbar.jsx` | Editor tools |
| `TopBar.jsx` | Main navigation |
| `CodeView.jsx` | Code view |
| `SchematicView.jsx` | Schematic representation |
| `RealisticDSO.jsx` | DSO interface |
| `Scene3D.jsx` | 3D scene |
| `simulationEngine.js` | Simulation calculations |
| `wiring.js` | Wire-related logic |
| `pins.js` | Pin definitions |
| `store.js` | Application state |

## 10. Troubleshooting

### pnpm command not found

Close and reopen the terminal. Verify:

```bash
node --version
npm --version
pnpm --version
```

### Dependency installation problems

From `client`:

```bash
pnpm install
```

Do not delete the lockfile as a first troubleshooting step.

### Port 5173 is already in use

Start Vite on another port:

```bash
pnpm dev -- --port 5174
```

### Build errors

Run:

```bash
pnpm lint
pnpm build
```

Read the first reported error and resolve it before continuing.

### Clean generated dependencies

From `client`, if a clean reinstall is necessary:

```bash
rm -rf node_modules
pnpm install --frozen-lockfile
```

Do not remove `pnpm-lock.yaml`.

## 11. Development Roadmap

Potential future development areas:

- Improved component library.
- Reliable pin-to-pin wiring.
- Circuit validation.
- More educational circuit simulation models.
- Improved CRO/DSO measurements.
- 8051 trainer and peripheral integration.
- Automatic schematic layout.
- Project import and export.
- Improved editor testing and documentation.

These are development goals, not a claim that every feature is already complete.

## 12. Limitations

- A schematic view is not automatically proof of electrical simulation.
- The code editor does not automatically execute hardware firmware.
- Educational simulation results depend on the supported mathematical models.
- Physical hardware behavior requires separate hardware testing.
- Browser storage is not a cloud database.

## 13. Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run lint and build checks.
5. Test the affected functionality.
6. Submit a pull request with a clear explanation.

Repository:

https://github.com/1231248393/CircuitWeb

## 14. License

No license has been specified in this repository yet.
Check the repository license before redistributing or reusing the source.

---

**CircuitWeb — Electronic Circuit Design and Educational Simulation**
