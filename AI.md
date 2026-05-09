# Grubhub-Prototype AI Instructions

## Purpose
This is a legacy Node.js/Express academic prototype from 2019 demonstrating a restaurant delivery platform (Grubhub). It has been modernized with React 19 and Express 5.

## Tech Stack
- **Frontend**: React (v19), Redux, React-Bootstrap
- **Backend**: Node.js, Express (v5), Sequelize, MySQL
- **Testing**: Mocha, Chai
- **Workspaces**: NPM Workspaces (Monorepo)

## Project Layout
- `/Grubhub/client/`: React frontend.
- `/Grubhub/server/`: Express backend.
- `/Calculator/`: Secondary client/server app.

## Run Instructions
- **Root**: `npm install` at the root manages all sub-projects.
- **Backend**: `npm run start:grubhub-server`
- **Frontend**: `npm run start:grubhub-client`
