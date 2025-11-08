import subprocess
import sys
from pathlib import Path


def test_ruff_linting():
    """Test that ruff linting passes with no errors."""
    # Get the project root directory (backend/)
    project_root = Path(__file__).parent.parent.parent.parent

    # Run ruff check on the app directory
    result = subprocess.run(
        [sys.executable, "-m", "ruff", "check", "app/"],
        cwd=project_root,
        capture_output=True,
        text=True,
    )

    # Assert that ruff check passes (exit code 0)
    assert result.returncode == 0, (
        f"Ruff linting failed:\n{result.stdout}\n{result.stderr}"
    )


def test_ruff_formatting():
    """Test that code is properly formatted with ruff."""
    # Get the project root directory (backend/)
    project_root = Path(__file__).parent.parent.parent.parent

    # Run ruff format --check to verify formatting without making changes
    result = subprocess.run(
        [sys.executable, "-m", "ruff", "format", "--check", "app/"],
        cwd=project_root,
        capture_output=True,
        text=True,
    )

    # Assert that formatting is correct (exit code 0)
    assert result.returncode == 0, (
        f"Code formatting issues found:\n{result.stdout}\n{result.stderr}"
    )
