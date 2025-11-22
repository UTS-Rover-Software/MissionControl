# Development Workflow

## Red-Green-Refactor TDD Cycle

> **Note:** I won't force you to do TDD, but I highly recommend it :)

1. **Red**: Write a failing test first

   - Backend: `def test_feature(): assert False`

   - Frontend: `test('feature', () => { expect(false).toBe(true); });`

2. **Green**: Implement minimal code to pass the test

   - Focus on functionality over optimization

3. **Refactor**: Improve code quality

   - Extract functions, improve naming

   - Ensure tests still pass

   - Run linting and formatting

## Commit Conventions

Use conventional commit format:

```

type(scope): description

[optional body]

[optional footer]

```

Types:

- `feat`: New feature

- `fix`: Bug fix

- `docs`: Documentation changes

- `style`: Code style changes (formatting, etc.)

- `refactor`: Code refactoring

- `test`: Adding or updating tests

- `chore`: Maintenance tasks

Examples:

- `feat(widgets): add camera feed component`

- `fix(backend): handle websocket disconnection`

- `docs(setup): update installation instructions`