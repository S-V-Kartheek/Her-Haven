import React from 'react';

const StegoBotIframe = () => (
  <div style={{ width: '100%', height: '90vh' }}>
    <iframe
      src="http://localhost:5000" // Update this if your StegoBot app runs on a different port
      title="StegoBot App"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  </div>
);

export default StegoBotIframe; 