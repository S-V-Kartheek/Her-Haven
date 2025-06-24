import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SupportSafeNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Function to check if a link is active based on the current path
  // Note: This simple check works best for internal routes like '/' or '/therapy-bot'.
  // For external links, we might need a different approach or just highlight based on section.
  // For now, let's match based on a simplified representation of the section.
  const isActive = (pathIdentifier: string) => {
      // Basic check, might need refinement based on how routes are handled in react-router
      return location.pathname.includes(pathIdentifier);
  };

  return (
    <nav className="supportsafe-navbar">
        <div className="supportsafe-nav-brand">
            <span>SupportSafe</span>
        </div>
        <div className="supportsafe-nav-links">
            {/* Links */} 
            {!user && (
                <a href="http://localhost:5173/" className={isActive('/') ? 'active' : ''}>Home</a> /* Assuming AI-Avatar home is root */
            )}

            {user && ( /* Render these links only when logged in */
                <>
                    <a href="http://192.168.0.197:3000/" className={isActive('chat') ? 'active' : ''}>Chat</a> {/* Updated Chat link */}
                    <a href="http://localhost:8000" className={isActive('law-bot') ? 'active' : ''}>Law Bot</a>
                    <a href="http://localhost:5001/" className={isActive('report') ? 'active' : ''}>Report</a>
                    <a href="/stego-bot" className={isActive('stego-bot') ? 'active' : ''}>Stego Bot</a>
                    <a href="/therapy-bot" className={isActive('therapy-bot') ? 'active' : ''}>Therapy Bot</a> {/* Assuming Therapy Bot is an internal route */}
                    {/* Logout Button */}
                    <button onClick={logout} className="supportsafe-nav-link">Logout</button>
                </>
            )}

        </div>
    </nav>
  );
}

export default SupportSafeNavbar; 