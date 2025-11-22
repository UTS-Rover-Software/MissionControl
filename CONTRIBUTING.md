# Contributing to Mission Control

This guide covers the process for developing new mission control widgets, including backend and frontend implementation, testing, and PR requirements.

## Overview

Each widget requires:

- Backend: API endpoint, service logic, data models, tests
- Frontend: Component, WebSocket integration, mocks, tests
- Integration: Real-time data flow via WebSocket

## Backend Development

### 1. Create API Endpoint

- Add route in appropriate router (e.g., `backend/app/routers/v1/cameras.py`)
- Use FastAPI with Pydantic models for request/response
- Example:

```python
@router.get("/status", response_model=StatusResponse)
async def get_status():
    # Implementation
```

### 2. Implement Service Logic

- Add business logic in a service module if needed
- Handle ROS communication via rclpy
- Standardize units and error handling

### 3. Add Data Models

- Define Pydantic models for requests/responses
- Use SI units for telemetry data

### 4. Write Tests

- Create test in `backend/app/tests/v1/test_[router].py`
- Use pytest with async support
- Mock ROS dependencies
- Example red test:

```python
def test_get_status():
    # Arrange
    # Act
    # Assert - initially fail
```

- Green: Implement minimal code to pass
- Refactor: Improve code quality

## Frontend Development

### 1. Create Component

- Add `.tsx` file in `frontend/src/components/widgets/`
- Use React hooks for state/WebSocket
- Follow existing patterns

### 2. Handle WebSocket Data

- Subscribe to backend topics in component
- Update state on messages
- Handle connection errors

### 3. Add Mocks for Testing

- Use `mock-socket` for WebSocket in tests
- Mock API responses with Jest

### 4. Write Tests

- Create `__tests__/WidgetName.test.tsx`
- Use `@testing-library/react` and Jest
- Test rendering, interactions, WebSocket updates
- Red-Green-Refactor cycle

### 5. Run Tests and Lint

- `npm test` for unit tests
- `npm run lint` for ESLint
- Fix all issues before PR

## Red-Green-Refactor in This Codebase

1. **Red**: Write failing test first

   - Backend: `def test_feature(): assert False`
   - Frontend: `test('feature', () => { expect(false).toBe(true); });`

2. **Green**: Minimal code to pass test

   - Implement basic functionality
   - No optimization yet

3. **Refactor**: Improve code
   - Extract functions, improve naming
   - Ensure tests still pass
   - Run lint/format

## PR Template for Widgets

```
## Widget: [Widget Name]

### Backend Changes
- [ ] New endpoint in [router].py
- [ ] Service logic implemented
- [ ] Models added
- [ ] Tests written (red-green-refactor)
- [ ] All tests pass

### Frontend Changes
- [ ] Component created in widgets/
- [ ] WebSocket integration
- [ ] Mocks added
- [ ] Tests written (red-green-refactor)
- [ ] All tests pass
- [ ] Linting passes

### Integration
- [ ] WebSocket topics match backend
- [ ] Real-time updates work
- [ ] Error handling implemented

### Documentation
- [ ] Updated widget list in HLD
- [ ] Added to presets if needed

## Pre-Submit Checklist

### Backend
- [ ] API endpoint returns expected JSON structure
- [ ] Error handling implemented for edge cases
- [ ] ROS topics/services integrated (if applicable)
- [ ] Unit tests cover success and failure scenarios
- [ ] Code passes `ruff format` and `ruff check`

### Frontend
- [ ] React component renders without crashes
- [ ] WebSocket subscriptions update component state
- [ ] Loading and error UI states implemented
- [ ] Jest tests verify user interactions and data flow
- [ ] New component registered in `App.tsx` componentMap
- [ ] ESLint passes with no errors

### General
- [ ] No runtime errors in browser console (dev mode)
- [ ] Compatible with Chrome and Firefox
- [ ] Code follows existing patterns and conventions
- [ ] Pull request description includes all required sections
```
