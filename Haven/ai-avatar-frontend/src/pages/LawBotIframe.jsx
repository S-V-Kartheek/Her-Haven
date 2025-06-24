import React from 'react';

const LawBotIframe = () => (
  <div style={{ width: '100%', height: '90vh' }}>
    <iframe
      src="http://localhost:8000" // Update this if your LawBot app runs on a different port
      title="LawBot App"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  </div>
);

export default LawBotIframe; 