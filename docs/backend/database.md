# Database

## Overview

The backend uses SQLAlchemy with async SQLite for data persistence. This provides reliable storage for mission data, telemetry logs, and command history.

## Configuration

Database connection is configured via environment variable:

```bash
DATABASE_URL=sqlite+aiosqlite:///./mission_control.db
```

Defaults to local SQLite file if not set.

## Schema

### Mission Table

```sql
CREATE TABLE missions (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    status TEXT DEFAULT 'active'
);
```

- Tracks mission lifecycle
- Status: active, completed, failed

### TelemetryLog Table

```sql
CREATE TABLE telemetry_logs (
    id INTEGER PRIMARY KEY,
    mission_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    topic TEXT,
    data TEXT  -- JSON string
);
```

- Stores all telemetry data by topic
- JSON data allows flexible schema
- Indexed by mission_id and topic

### CommandLog Table

```sql
CREATE TABLE command_logs (
    id INTEGER PRIMARY KEY,
    mission_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    command TEXT,
    parameters TEXT,  -- JSON string
    status TEXT DEFAULT 'sent'
);
```

- Logs all commands sent to rover
- Status tracking: sent, acknowledged, failed

## Database Operations

### Initialisation

```python
from database import init_db

# Called on app startup
await init_db()
```

Creates all tables if they don't exist.

### Session Management

```python
from database import get_db

async def endpoint(db: AsyncSession = Depends(get_db)):
    # Use session for operations
    pass
```

Provides async session with automatic cleanup.

## Migration Strategy

For schema changes:

1. Update model classes in `database.py`
2. SQLAlchemy handles table creation/updates automatically
3. For production, consider proper migration tools like Alembic

## Performance Considerations

- **Async Operations**: All database operations are async
- **Connection Pooling**: SQLAlchemy manages connection pooling
- **Indexing**: Proper indexes on frequently queried columns
- **JSON Storage**: Efficient for variable telemetry data

## Backup and Recovery

- SQLite files can be easily backed up
- Mission data is critical - implement regular backups
- Consider export functionality for data migration