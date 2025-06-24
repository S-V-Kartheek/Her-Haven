import React from 'react';

const ChatIframe = () => (
  <div style={{ width: '100%', height: '90vh' }}>
    <iframe
      src="http://localhost:3000" // Update this if your CHAT app runs on a different port
      title="Chat App"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  </div>
);

export default ChatIframe; 