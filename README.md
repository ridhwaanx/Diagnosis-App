# Diagnosis App #

This project is a full-stack AI-powered medical diagnosis system that helps users identify potential illnesses based on symptoms.
It includes a TypeScript + Next.js + MUI frontend and a FastAPI + Python backend with optional MongoDB integration.

## Getting Started ##

### Prerequisites ###

Node.js >= 18

Python >= 3.9

npm or yarn

MongoDB (optional for persistent storage)

Available Scripts

## Frontend (Next.js) ##

### In the root directory: ###

    npm install

### Installs all dependencies for the frontend. ###

    npm run dev

### Runs the app in development mode. ###
Open http://localhost:3000 to view it in the browser.
The page reloads on file changes.

    npm test

### Launches the test runner in interactive watch mode. ###

## Backend (FastAPI) ##

### Navigate to the server/ directory: ###

### Install dependencies ###

    pip install fastapi uvicorn scikit-learn joblib

### Run the backend ###

    uvicorn main:app --reload --port 8000

The API will be accessible at http://localhost:8000.
