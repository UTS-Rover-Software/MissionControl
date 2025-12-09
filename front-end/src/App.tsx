import React, { useState, useEffect } from 'react';
import { Layout, Model, TabNode, Actions, DockLocation, Node } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import "./App.css";
import Navbar from './components/Navbar';
import { presets } from './presets';

// Import mission control widgets
import Nav2TargetQueue from './components/widgets/Nav2TargetQueue';
import BoundingBoxForWidgets from './components/widgets/BoundingBoxForWidgets';
import CameraFeed from './components/widgets/CameraFeed';
import PointCloudMap from './components/widgets/PointCloudMap';
import RosoutConsole from './components/widgets/RosoutConsole';
import VescInfoReadonly from './components/widgets/VescInfoReadonly';
import MachineUsageReadonly from './components/widgets/MachineUsageReadonly';
import RVIZ from './components/widgets/RVIZ';
import AerialMapSlam from './components/widgets/AerialMapSlam';
import ScienceWidget from './components/widgets/ScienceWidget';

// Xterm install
import "xterm/css/xterm.css"

const componentMap: Record<string, React.ComponentType> = {
  Nav2TargetQueue,
  BoundingBoxForWidgets,
  CameraFeed,
  PointCloudMap,
  RosoutConsole,
  VescInfoReadonly,
  MachineUsageReadonly,
  RVIZ,
  AerialMapSlam,
  ScienceWidget
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
