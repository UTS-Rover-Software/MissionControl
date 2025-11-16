import type { IJsonModel } from 'flexlayout-react';

export const presets: Record<string, IJsonModel> = {
  'Navigation': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Camera Feed', component: 'CameraFeed' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Point Cloud Map', component: 'PointCloudMap' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Tasks Widget', component: 'TasksWidget' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Task Graph', component: 'TaskGraph' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Robot Arm', component: 'RobotArm' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Mini Map', component: 'MiniMap' }] }
          ]
        }
      ]
    }
  },
  'Multi-Camera': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Front Camera', component: 'CameraFeed' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Payload1 Camera', component: 'CameraFeed' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Back Camera', component: 'CameraFeed' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Payload2 Camera', component: 'CameraFeed' }] }
          ]
        }
      ]
    }
  },
  'RFID + Image Quality': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 33, children: [{ type: 'tab', name: 'RFID Scanner', component: 'RFIDScanner' }] },
            { type: 'tabset', weight: 33, children: [{ type: 'tab', name: 'Image Quality Control', component: 'ImageQualityControl' }] },
            { type: 'tabset', weight: 34, children: [{ type: 'tab', name: 'Obsbots Camera Control', component: 'ObsbotsCameraControl' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'System Controls', component: 'SystemStatus' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'RFID History', component: 'RFIDHistory' }] }
          ]
        }
      ]
    }
  },
  'Network + Camera + Light Control': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Camera Feed', component: 'CameraFeed' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Network Panel', component: 'NetworkPanel' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 33, children: [{ type: 'tab', name: 'Nearby Networks', component: 'NearbyNetworks' }] },
            { type: 'tabset', weight: 33, children: [{ type: 'tab', name: 'Link Speed Panel', component: 'LinkSpeedPanel' }] },
            { type: 'tabset', weight: 34, children: [{ type: 'tab', name: 'Light Control', component: 'LightControl' }] }
          ]
        }
      ]
    }
  },
  'Mapping + ROS Console': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 100, children: [{ type: 'tab', name: 'Mini Map', component: 'MiniMap' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Log Console', component: 'LogConsole' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'ROS Node Browser', component: 'RosNodeBrowser' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'ROS Summary', component: 'RosSummary' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'ROS Info Panel', component: 'RosSummary' }] } // Assuming RosSummary is the info panel
          ]
        }
      ]
    }
  },
  'Diagnostics': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 20, children: [{ type: 'tab', name: 'Telemetry', component: 'Telemetry' }] },
            { type: 'tabset', weight: 20, children: [{ type: 'tab', name: 'System Status', component: 'SystemStatus' }] },
            { type: 'tabset', weight: 20, children: [{ type: 'tab', name: 'VESC Status', component: 'VESCStatus' }] },
            { type: 'tabset', weight: 20, children: [{ type: 'tab', name: 'Thermal Trend', component: 'ThermalTrend' }] },
            { type: 'tabset', weight: 20, children: [{ type: 'tab', name: 'Mass Spec', component: 'MassSpec' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Atmosphere Panel', component: 'AtmospherePanel' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Drill System Panel', component: 'DrillSystemPanel' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Hazard Detect Panel', component: 'HazardDetectPanel' }] },
            { type: 'tabset', weight: 25, children: [{ type: 'tab', name: 'Log Console', component: 'LogConsole' }] }
          ]
        }
      ]
    }
  },
  '7': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 100,
          children: [{ type: 'tab', name: 'Empty Widget', component: 'EmptyWidget' }]
        }
      ]
    }
  },
  '8': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 100,
          children: [{ type: 'tab', name: 'Empty Widget', component: 'EmptyWidget' }]
        }
      ]
    }
  },
  '9': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 100,
          children: [{ type: 'tab', name: 'Empty Widget', component: 'EmptyWidget' }]
        }
      ]
    }
  },
  '10': {
    global: { tabEnableClose: true },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 100,
          children: [{ type: 'tab', name: 'Empty Widget', component: 'EmptyWidget' }]
        }
      ]
    }
  }
};