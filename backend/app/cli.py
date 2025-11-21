import os
import subprocess
import sys
import uvicorn


def dev():
    """Run development server with hot reload"""
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=True,
        log_level=os.getenv("LOG_LEVEL", "info"),
    )


def start():
    """Run production server"""
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        workers=int(os.getenv("WORKERS", "4")),
        log_level=os.getenv("LOG_LEVEL", "info"),
    )


def lint():
    """Run linting and formatting checks"""
    try:
        # Run ruff check
        subprocess.run([sys.executable, "-m", "ruff", "check", "app/"], check=True)
        # Run ruff format check
        subprocess.run(
            [sys.executable, "-m", "ruff", "format", "--check", "app/"], check=True
        )
        print("All linting checks passed!")
    except subprocess.CalledProcessError as e:
        print(f"Linting failed with exit code {e.returncode}")
        sys.exit(e.returncode)


def test():
    """Run test suite"""
    try:
        subprocess.run([sys.executable, "-m", "pytest"], check=True)
        print("All tests passed!")
    except subprocess.CalledProcessError as e:
        print(f"Tests failed with exit code {e.returncode}")
        sys.exit(e.returncode)
