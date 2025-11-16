import React from 'react';
import { Button } from './ui/button';
import {
  Compass,
  Camera,
  Scan,
  Network,
  Map,
  Activity,
  RotateCcw,
  Save
} from 'lucide-react';

interface NavbarProps {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
  onAddWidget: (widget: string) => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
}

const presetIcons = [
  { name: 'Navigation', icon: Compass },
  { name: 'Multi-Camera', icon: Camera },
  { name: 'RFID + Image Quality', icon: Scan },
  { name: 'Network + Camera + Light Control', icon: Network },
  { name: 'Mapping + ROS Console', icon: Map },
  { name: 'Diagnostics', icon: Activity },
];

const presets = [
  'Navigation',
  'Multi-Camera',
  'RFID + Image Quality',
  'Network + Camera + Light Control',
  'Mapping + ROS Console',
  'Diagnostics',
  '7',
  '8',
  '9',
  '10'
];

const widgets = [
  'CameraFeed',
  'ObsbotsCameraControl',
  'ImageQualityControl',
  'PointCloudMap',
  'MiniMap',
  'TasksWidget',
  'TaskGraph',
  'RobotArm',
  'Telemetry',
  'SystemStatus',
  'VESCStatus',
  'ThermalTrend',
  'MassSpec',
  'AtmospherePanel',
  'DrillSystemPanel',
  'HazardDetectPanel',
  'NetworkPanel',
  'NearbyNetworks',
  'LinkSpeedPanel',
  'LightControl',
  'LogConsole',
  'RosNodeBrowser',
  'RosSummary',
  'RFIDScanner',
  'RFIDHistory',
  'EmptyWidget'
];

const Navbar: React.FC<NavbarProps> = ({ currentPreset, onPresetChange, onAddWidget, onSaveLayout, onResetLayout }) => {
  const [selectedWidget, setSelectedWidget] = React.useState('');

  const handleWidgetSelect = (widget: string) => {
    if (widget) {
      onAddWidget(widget);
      setSelectedWidget('');
    }
  };

  const handleResetLayout = () => {
    if (window.confirm('Are you sure you want to reset to the default layout? This will clear your current layout.')) {
      onResetLayout();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border h-10">
      <div className="flex items-center space-x-3">
        <img src="/rover_logo_white.svg" alt="Rover Logo" className="h-8 w-auto" />
        <div className="flex space-x-1">
          {presets.slice(0, 6).map((preset, index) => {
            const IconComponent = presetIcons[index].icon;
            return (
              <Button
                key={preset}
                variant={currentPreset === preset ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPresetChange(preset)}
                className="h-7 w-7 p-0"
                title={preset}
              >
                <IconComponent className="h-5 w-5" />
              </Button>
            );
          })}
          {presets.slice(6).map((preset) => (
            <Button
              key={preset}
              variant={currentPreset === preset ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPresetChange(preset)}
              className="h-7 w-7 p-0 text-xs"
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetLayout}
          className="h-7 w-7 p-0"
          title="Reset to Default Layout"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <select
          value={selectedWidget}
          onChange={(e) => handleWidgetSelect(e.target.value)}
          className="px-3 py-1 bg-input border border-border rounded text-sm text-foreground h-7 min-w-48"
        >
          <option value="">Add Widget</option>
          {widgets.map(widget => (
            <option key={widget} value={widget}>{widget}</option>
          ))}
        </select>
        <Button
          size="sm"
          variant="outline"
          onClick={onSaveLayout}
          className="h-7 w-7 p-0"
          title="Save Layout"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;