import React from 'react';

const Chat = () => (
  <div style={{ height: '100vh', width: '100%' }}>
    <iframe
      src="http://192.168.0.197:3000"
      title="Chat"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  </div>
);

export default Chat; 