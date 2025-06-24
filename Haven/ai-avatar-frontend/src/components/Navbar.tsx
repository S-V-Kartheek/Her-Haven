'use client';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="w-full h-16 p-4 flex items-center justify-between border-b shadow-sm">
      <Link
        to={'/'}
        className="font-bold text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
      >
        Haven
      </Link>
      <div className="flex items-center justify-center gap-10 font-medium text-gray-600">
        <Link
          to="/"
          className={`${
            isActive('/')
              ? 'text-blue-700 font-semibold'
              : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          Home
        </Link>
        <Link
          to="/chat"
          className={`${
            isActive('/chat')
              ? 'text-blue-700 font-semibold'
              : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          Chat
        </Link>
        <Link
          to="/law-bot"
          className={`${
            isActive('/law-bot')
              ? 'text-blue-700 font-semibold'
              : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          LawBot
        </Link>
        <Link
          to="/therapy-bot"
          className={`${
            isActive('/therapy-bot')
              ? 'text-blue-700 font-semibold'
              : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          TherapyBot
        </Link>
        <Link
          to="/stego-bot"
          className={`${
            isActive('/stego-bot')
              ? 'text-blue-700 font-semibold'
              : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          StegoBot
        </Link>
        <Link
          to="/health-report"
          className={`${
            isActive('/health-report')
              ? 'text-blue-700 font-semibold'
              : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          HealthReport
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
