// src/components/LoadingOverlay.js
import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const spinnerStyle = {
  border: '8px solid #f3f3f3',
  borderTop: '8px solid #3498db',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  animation: 'spin 1s linear infinite',
};

const LoadingOverlay = () => (
  <div style={overlayStyle}>
    <div style={spinnerStyle}/>
  </div>
);

export default LoadingOverlay;