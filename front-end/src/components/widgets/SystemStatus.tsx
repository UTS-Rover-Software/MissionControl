import React from 'react';

const SystemStatus: React.FC = () => {
  const systems = [
    { name: 'Navigation', status: 'online', color: 'text-green-400' },
    { name: 'Communication', status: 'online', color: 'text-green-400' },
    { name: 'Power System', status: 'warning', color: 'text-orange-400' },
    { name: 'Sensors', status: 'online', color: 'text-green-400' },
    { name: 'Actuators', status: 'offline', color: 'text-red-400' },
    { name: 'Cameras', status: 'online', color: 'text-green-400' },
  ];

  return (
    <div className="p-4 h-full">
      <h3 className="text-lg font-medium mb-4 text-foreground">System Status</h3>
      <div className="space-y-3">
        {systems.map((system, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-card rounded border border-border">
            <span className="text-sm font-medium text-foreground">{system.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground capitalize">{system.status}</span>
              <div className={`w-2 h-2 rounded-full ${system.color.replace('text-', 'bg-')}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;