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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Nav2 Target Queue', component: 'Nav2TargetQueue' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: '2D Aerial Map Slam', component: 'AerialMapSlam' }] }
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
  'Science': {
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Science Widget', component: 'ScienceWidget' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Camera Feed', component: 'CameraFeed' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Rosout Console', component: 'RosoutConsole' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Machine Usage Readonly', component: 'MachineUsageReadonly' }] }
          ]
        }
      ]
    }
  },
  'Autonomous': {
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Nav2 Target Queue', component: 'Nav2TargetQueue' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: '2D Aerial Map Slam', component: 'AerialMapSlam' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Point Cloud Map', component: 'PointCloudMap' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'RVIZ', component: 'RVIZ' }] }
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
            { type: 'tabset', weight: 100, children: [{ type: 'tab', name: '2D Aerial Map Slam', component: 'AerialMapSlam' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Rosout Console', component: 'RosoutConsole' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'RVIZ', component: 'RVIZ' }] }
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Vesc Info Readonly', component: 'VescInfoReadonly' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Machine Usage Readonly', component: 'MachineUsageReadonly' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Rosout Console', component: 'RosoutConsole' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Camera Feed', component: 'CameraFeed' }] }
          ]
        }
      ]
    }
  },
  'Post-Landing': {
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Science Widget', component: 'ScienceWidget' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Rosout Console', component: 'RosoutConsole' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Vesc Info Readonly', component: 'VescInfoReadonly' }] }
          ]
        }
      ]
    }
  },
  'Excavation': {
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Science Widget', component: 'ScienceWidget' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Point Cloud Map', component: 'PointCloudMap' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Machine Usage Readonly', component: 'MachineUsageReadonly' }] }
          ]
        }
      ]
    }
  },
  'Space Resources': {
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Science Widget', component: 'ScienceWidget' }] }
          ]
        },
        {
          type: 'column',
          weight: 50,
          children: [
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Rosout Console', component: 'RosoutConsole' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Vesc Info Readonly', component: 'VescInfoReadonly' }] }
          ]
        }
      ]
    }
  },
  'Construction': {
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
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Science Widget', component: 'ScienceWidget' }] },
            { type: 'tabset', weight: 50, children: [{ type: 'tab', name: 'Machine Usage Readonly', component: 'MachineUsageReadonly' }] }
          ]
        }
      ]
    }
  }
};