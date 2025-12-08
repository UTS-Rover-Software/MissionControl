import React, { useMemo } from 'react';

interface CompassProps {
  /**
   * Heading in degrees (0-360)
   * 0 = North, 90 = East, 180 = South, 270 = West
   */
  heading?: number;
  /**
   * Size of the compass in pixels
   */
  size?: number;
  /**
   * Whether to show cardinal direction labels
   */
  showLabels?: boolean;
}

/**
 * Compass component for displaying rover heading/orientation.
 * Shows IMU heading reference with cardinal directions.
 */
const Compass: React.FC<CompassProps> = ({
  heading = 0,
  size = 100,
  showLabels = true,
}) => {
  const normalizedHeading = ((heading % 360) + 360) % 360;

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    position: 'relative',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 20px rgba(0, 0, 255, 0.3) inset',
  };

  const needleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 4,
    height: size / 2.5,
    background: 'linear-gradient(to top, #00ccff, #0066ff)',
    top: 0,
    left: '50%',
    marginLeft: -2,
    transformOrigin: `center ${size / 2}px`,
    transform: `rotate(${normalizedHeading}deg)`,
    borderRadius: '2px',
    boxShadow: '0 0 10px rgba(0, 204, 255, 0.8)',
  };

  const centerDot: React.CSSProperties = {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#00ccff',
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -6,
    boxShadow: '0 0 8px rgba(0, 204, 255, 0.8)',
    zIndex: 10,
  };

  const labelStyle = (angle: number): React.CSSProperties => {
    const radius = (size - 20) / 2;
    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const y = -Math.cos((angle * Math.PI) / 180) * radius;

    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      color: angle === 0 || angle === 180 ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)',
      fontSize: size * 0.12,
      fontWeight: 'bold',
      textShadow: '0 0 4px rgba(0, 0, 0, 0.8)',
    };
  };

  const headingTextStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: size * 0.08,
    width: '100%',
    textAlign: 'center',
    color: '#00ccff',
    fontSize: size * 0.14,
    fontWeight: 'bold',
    textShadow: '0 0 4px rgba(0, 0, 0, 0.8)',
  };

  const cardinalDirections = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ];

  return (
    <div style={containerStyle}>
      {/* Needle pointing north */}
      <div style={needleStyle} />

      {/* Cardinal direction labels */}
      {showLabels &&
        cardinalDirections.map((dir) => (
          <div key={dir.label} style={labelStyle(dir.angle)}>
            {dir.label}
          </div>
        ))}

      {/* Center dot */}
      <div style={centerDot} />

      {/* Heading in degrees */}
      <div style={headingTextStyle}>{Math.round(normalizedHeading)}°</div>
    </div>
  );
};

export default Compass;
