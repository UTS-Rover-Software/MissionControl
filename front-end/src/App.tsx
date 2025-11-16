import React, { useState, useEffect } from 'react';
import { Layout, Model, TabNode, Actions, DockLocation, Node } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import "./App.css";
import Navbar from './components/Navbar';
import { presets } from './presets';

// Import all widgets
import CameraFeed from './components/widgets/CameraFeed';
import ObsbotsCameraControl from './components/widgets/ObsbotsCameraControl';
import ImageQualityControl from './components/widgets/ImageQualityControl';
import PointCloudMap from './components/widgets/PointCloudMap';
import MiniMap from './components/widgets/MiniMap';
import TasksWidget from './components/widgets/TasksWidget';
import TaskGraph from './components/widgets/TaskGraph';
import RobotArm from './components/widgets/RobotArm';
import Telemetry from './components/widgets/Telemetry';
import SystemStatus from './components/widgets/SystemStatus';
import VESCStatus from './components/widgets/VESCStatus';
import ThermalTrend from './components/widgets/ThermalTrend';
import MassSpec from './components/widgets/MassSpec';
import AtmospherePanel from './components/widgets/AtmospherePanel';
import DrillSystemPanel from './components/widgets/DrillSystemPanel';
import HazardDetectPanel from './components/widgets/HazardDetectPanel';
import NetworkPanel from './components/widgets/NetworkPanel';
import NearbyNetworks from './components/widgets/NearbyNetworks';
import LinkSpeedPanel from './components/widgets/LinkSpeedPanel';
import LightControl from './components/widgets/LightControl';
import LogConsole from './components/widgets/LogConsole';
import RosNodeBrowser from './components/widgets/RosNodeBrowser';
import RosSummary from './components/widgets/RosSummary';
import RFIDScanner from './components/widgets/RFIDScanner';
import RFIDHistory from './components/widgets/RFIDHistory';
import EmptyWidget from './components/widgets/EmptyWidget';

const componentMap: Record<string, React.ComponentType> = {
  CameraFeed,
  ObsbotsCameraControl,
  ImageQualityControl,
  PointCloudMap,
  MiniMap,
  TasksWidget,
  TaskGraph,
  RobotArm,
  Telemetry,
  SystemStatus,
  VESCStatus,
  ThermalTrend,
  MassSpec,
  AtmospherePanel,
  DrillSystemPanel,
  HazardDetectPanel,
  NetworkPanel,
  NearbyNetworks,
  LinkSpeedPanel,
  LightControl,
  LogConsole,
  RosNodeBrowser,
  RosSummary,
  RFIDScanner,
  RFIDHistory,
  EmptyWidget
};

function App() {
  const [currentPreset, setCurrentPreset] = useState('Navigation');
  const [model, setModel] = useState<Model>(() => {
    const saved = localStorage.getItem(`layout-${currentPreset}`);
    if (saved) {
      return Model.fromJson(JSON.parse(saved));
    }
    return Model.fromJson(presets[currentPreset]);
  });

  useEffect(() => {
    const saved = localStorage.getItem(`layout-${currentPreset}`);
    if (saved) {
      setModel(Model.fromJson(JSON.parse(saved)));
    } else {
      setModel(Model.fromJson(presets[currentPreset]));
    }
  }, [currentPreset]);

  const handlePresetChange = (preset: string) => {
    setCurrentPreset(preset);
  };

  const handleAddWidget = (widget: string) => {
    let tabsetId: string | undefined;
    model.visitNodes((node: Node) => {
      if (node.getType() === 'tabset' && !tabsetId) {
        tabsetId = node.getId();
      }
    });
    if (tabsetId) {
      model.doAction(Actions.addNode({ type: 'tab', name: widget, component: widget }, tabsetId, DockLocation.CENTER, -1));
    }
  };

  const handleSaveLayout = () => {
    const json = model.toJson();
    localStorage.setItem(`layout-${currentPreset}`, JSON.stringify(json));
  };

  const handleResetLayout = () => {
    localStorage.removeItem(`layout-${currentPreset}`);
    setModel(Model.fromJson(presets[currentPreset]));
  };

  const factory = (node: TabNode) => {
    const componentName = node.getComponent();
    const Component = componentMap[componentName || ''];
    return Component ? <Component /> : <div>Unknown Component</div>;
  };

  return (
    <div className="h-screen flex flex-col">
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <Navbar
          currentPreset={currentPreset}
          onPresetChange={handlePresetChange}
          onAddWidget={handleAddWidget}
          onSaveLayout={handleSaveLayout}
          onResetLayout={handleResetLayout}
        />
      </div>
      <div className="flex-1 overflow-hidden" style={{ position: 'relative' }}>
        <Layout
          model={model}
          factory={factory}
          onModelChange={(newModel: Model) => setModel(newModel)}
        />
      </div>
    </div>
  );
}

export default App;
