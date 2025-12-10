/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PointCloudMap from '../PointCloudMap';

// Mock Three.js
jest.mock('three', () => ({
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  OrthographicCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  BufferGeometry: jest.fn(),
  BufferAttribute: jest.fn(),
  PointsMaterial: jest.fn(),
  Points: jest.fn(),
  Color: jest.fn(),
  AmbientLight: jest.fn(),
}));

jest.mock('three/examples/jsm/loaders/PLYLoader', () => ({
  PLYLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
}));

describe('PointCloudMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLElement.prototype.addEventListener = jest.fn();
    HTMLElement.prototype.removeEventListener = jest.fn();
  });

  it('should render without crashing', () => {
    const { container } = render(<PointCloudMap />);
    expect(container).toBeInTheDocument();
  });

  it('should render control bar with title', () => {
    render(<PointCloudMap />);
    expect(screen.getByText('Point Cloud Map')).toBeInTheDocument();
  });

  it('should have camera mode toggle buttons', () => {
    render(<PointCloudMap />);
    expect(screen.getByText('3D')).toBeInTheDocument();
    expect(screen.getByText('2D')).toBeInTheDocument();
  });

  it('should have data source toggle buttons', () => {
    render(<PointCloudMap />);
    expect(screen.getByText('Local')).toBeInTheDocument();
    expect(screen.getByText('WebRTC')).toBeInTheDocument();
  });

  it('should toggle between camera modes', () => {
    render(<PointCloudMap />);
    const button2d = screen.getByText('2D');
    fireEvent.click(button2d);
    expect(button2d).toHaveStyle({ background: '#0066cc' });
  });

  it('should toggle between data sources', () => {
    render(<PointCloudMap />);
    const buttonWebRTC = screen.getByText('WebRTC');
    fireEvent.click(buttonWebRTC);
    expect(buttonWebRTC).toHaveStyle({ background: '#00cc66' });
  });

  it('should render canvas container', () => {
    const { container } = render(<PointCloudMap />);
    const canvasContainer = container.querySelector('div[style*="flex: 1"]');
    expect(canvasContainer).toBeInTheDocument();
  });

  it('should handle viewport resize', async () => {
    render(<PointCloudMap />);
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => {
      expect(screen.getByText('Point Cloud Map')).toBeInTheDocument();
    });
  });

  it('should display instructions for 3D mode', () => {
    render(<PointCloudMap />);
    expect(screen.getByText(/Drag to rotate/)).toBeInTheDocument();
  });

  it('should update instructions when switching to 2D mode', async () => {
    render(<PointCloudMap />);
    const button2d = screen.getByText('2D');
    fireEvent.click(button2d);
    await waitFor(() => {
      expect(screen.getByText(/Drag to pan/)).toBeInTheDocument();
    });
  });
});
