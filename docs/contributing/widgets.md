# Contributing to Widgets

Guidelines for developing and contributing new widgets to Mission Control.

## Widget Development Process

Each widget requires both backend and frontend implementation, following the Red-Green-Refactor TDD cycle.

## Backend Implementation

### 1. Create API Endpoint
- Add route in appropriate router file (`backend/app/routers/v1/`)
- Use FastAPI with Pydantic models
- Example:
```python
@router.get("/widget-data", response_model=WidgetResponse)
async def get_widget_data():
    return await service.get_data()
```

### 2. Implement Service Logic
- Add business logic in `backend/app/services/`
- Handle ROS communication if needed
- Standardize error handling

### 3. Add Data Models
- Define Pydantic models in router or separate schemas
- Use consistent units

### 4. Write Tests
- Create `backend/app/tests/v1/test_widget.py`
- Use pytest with async support
- Mock ROS dependencies
- Follow red-green-refactor

## Frontend Implementation

### 1. Create Component
- Add `WidgetName.tsx` in `front-end/src/components/widgets/`
- Use React hooks for state management
- Follow existing component patterns

### 2. WebSocket Integration
- Subscribe to backend topics
- Handle real-time updates
- Implement error states

### 3. Add Mocks
- Use `mock-socket` for WebSocket testing
- Mock API responses

### 4. Write Tests
- Create `__tests__/WidgetName.test.tsx`
- Use React Testing Library
- Test rendering, interactions, data updates

### 5. Register Component
- Add to component map in `App.tsx`
- Update presets if needed

## Integration Testing

- Ensure WebSocket topics match between backend and frontend
- Test real-time data flow
- Verify error handling

## Documentation

- Add widget to `docs/widgets/index.md`
- Create detailed page in `docs/widgets/`
- Include description, implementation details, importance

## PR Requirements

Use the widget PR template and ensure:

- Backend: endpoint, service, models, tests
- Frontend: component, WebSocket, mocks, tests
- Integration: real-time updates working
- Documentation: updated docs
- All tests pass, linting passes