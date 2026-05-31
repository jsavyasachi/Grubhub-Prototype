# Grubhub-Prototype

A modernized restaurant delivery platform prototype. Originally built as an academic project, now updated with contemporary engineering standards.

## Stack

<a href="https://react.dev"><img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=000" alt="React" /></a>
<a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" /></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
<a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express" /></a>
<a href="https://www.mysql.com"><img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" alt="MySQL" /></a>

## Features

- **Monorepo Architecture**: Managed via NPM Workspaces.
- **Native ESM**: Backend fully migrated to native Node.js ESM.
- **Vite Build**: High-performance frontend build pipeline.
- **Security**: Patched where non-breaking dependency updates are available; legacy transitive advisories are tracked separately.

## Getting Started

### Prerequisites

- Node.js (v20+)
- MySQL

### Installation

1. Clone the repository.
2. Install dependencies at the root:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Apps

The project consists of the main Grubhub app and a secondary Calculator app.

- **Start Grubhub Server**: `npm run start:grubhub-server`
- **Start Grubhub Client**: `npm run start:grubhub-client`
- **Start Calculator Server**: `npm run start:calculator-server`
- **Start Calculator Client**: `npm run start:calculator-client`
