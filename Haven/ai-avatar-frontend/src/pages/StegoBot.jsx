import React from 'react';

const StegoBot = () => (
  <div style={{
    width: '100vw',
    height: 'calc(100vh - 64px)',
    margin: 0,
    padding: 0,
    background: '#f3f4f6',
    position: 'relative',
    top: 0,
    left: 0,
    zIndex: 1,
  }}>
    <iframe
      src="http://localhost:5175" // Change this to your Stego Bot's local/network URL if needed
      style={{
        width: '100vw',
        height: '100%',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        background: 'white',
        display: 'block',
        margin: 0,
        padding: 0,
      }}
      title="Stego Bot"
      allow="clipboard-read; clipboard-write"
    />
  </div>
);

export default StegoBot; 