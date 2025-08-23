import React from 'react';

export default function GradientOverlay() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 10% 20%, rgba(0, 114, 255, 0.1) 0%, rgba(0, 10, 40, 0) 40%)',
      zIndex: 1,
      pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 0, 230, 0.15) 0%, rgba(0, 10, 40, 0) 70%)',
        filter: 'blur(50px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 198, 255, 0.15) 0%, rgba(0, 10, 40, 0) 70%)',
        filter: 'blur(50px)'
      }} />
    </div>
  );
}