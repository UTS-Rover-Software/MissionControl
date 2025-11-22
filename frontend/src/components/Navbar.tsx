import React from 'react';
import { Button } from './ui/button';
import {
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

const presets = [
  'Navigation',
  'Multi-Camera',
  'Science',
  'Autonomous',
  'Mapping + ROS Console',
  'Diagnostics',
  'Post-Landing',
  'Excavation',
  'Space Resources',
  'Construction'
];

const widgets = [
  'Nav2TargetQueue',
  'BoundingBoxForWidgets',
  'CameraFeed',
  'PointCloudMap',
  'RosoutConsole',
  'VescInfoReadonly',
  'MachineUsageReadonly',
  'RVIZ',
  'AerialMapSlam',
  'ScienceWidget'
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
          {presets.map((preset, index) => (
            <Button
              key={preset}
              variant={currentPreset === preset ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPresetChange(preset)}
              className="h-7 w-7 p-0 text-xs"
              title={preset}
            >
              {index + 1}
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