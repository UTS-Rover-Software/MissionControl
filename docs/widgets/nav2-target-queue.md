# Nav2 Target Queue

## Description

Dynamic queue showing planned navigation targets for autonomous tasks. Displays name and location for each target.

Task specific: Yes (autonomous)  
Guaranteed to be used: Yes (3.5/5 importance)

## Implementation

### Data Communication
- WebSocket connection (not polling)
- Receives updates from Nav2: goal reached, path edits

### Queue Management
- Dequeue when target reached
- Replace list on path edit messages

### Frontend Component
- List view with target names and locations
- Real-time updates

### Technologies
- React, WebSockets