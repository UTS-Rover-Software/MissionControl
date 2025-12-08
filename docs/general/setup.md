# Setup

This page outlines the setup process for the frontend and backend applications.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.12+ (for backend)
- uv (Python package manager)

## Frontend Installation

### Using Nix/Direnv (Recommended)

If you have Nix and Direnv set up:

1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Allow direnv:
   ```bash
   direnv allow
   ```

That's it! The environment will be automatically configured.

### Manual Setup

1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

## Backend Installation

### Using Nix/Direnv (Recommended)

If you have Nix and Direnv set up:

1. Allow direnv in the backend directory:
   ```bash
   cd backend
   direnv allow
   ```

That's it! The environment will be automatically configured.

### Manual Setup

If you prefer manual setup:

1. Install Python 3.13 and uv.

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Start the development server:
   ```bash
   uv run dev
   ```

## Usage

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`