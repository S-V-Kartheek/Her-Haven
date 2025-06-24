import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import banner from '../assets/banner.png'; // Temporarily removed
import SupportSafeNavbar from '../components/SupportSafeNavbar';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useAuth } from '../context/AuthContext';

// Modal component - basic implementation
const Modal = ({ children, show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800">
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [currentForm, setCurrentForm] = useState(null); // 'signin', 'signup', or null
  const { user } = useAuth(); // Get the user from AuthContext

  const handleShowSignIn = () => {
    setCurrentForm('signin');
  };

  const handleShowSignUp = () => {
    setCurrentForm('signup');
  };

  const handleCloseForm = () => {
    setCurrentForm(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <SupportSafeNavbar />
      <div className="flex flex-col h-full max-w-6xl mx-auto w-full pt-16">
        <div className="flex items-center mt-12 mb-16 gap-32">
          <div className="flex flex-col gap-5">
            <h1 className="font-extrabold text-[40px] text-gray-800">
              Empower Your Support Experience with{' '}
              <span className="text-blue-700">SupportSafe</span>
            </h1>
            <p className="text-[20px] text-gray-600 leading-relaxed">
              At SupportSafe, we're dedicated to ensuring every issue gets
              the attention it deserves. Easily create support tickets, monitor
              real-time updates, and even help resolve community tickets. Your
              support journey starts here, and we're with you every step of
              the way! 🚀
            </p>

            {/* Buttons to toggle Sign In / Sign Up forms */}
            {!user && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleShowSignIn}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-lg text-white rounded-lg shadow-md transform hover:scale-105 duration-200 ease-in-out font-semibold"
              >
                Sign In
              </button>
              <button
                onClick={handleShowSignUp}
                className="px-6 py-3 text-lg text-blue-700 rounded-lg border border-blue-700 shadow-md transform hover:scale-105 hover:bg-blue-700 hover:text-white duration-200 ease-in-out font-semibold"
              >
                Create Account
              </button>
            </div>
            )}

            {/* Show user info and navigation if logged in */}
            {user && (
              <div className="flex flex-col gap-4">
                <p className="text-lg text-gray-700">
                  Welcome back, <span className="font-semibold text-blue-700">{user.name}</span>!
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    to="/therapy-bot"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-lg text-white rounded-lg shadow-md transform hover:scale-105 duration-200 ease-in-out font-semibold"
                  >
                    Start Therapy Session
                  </Link>
                  <Link
                    to="/law-bot"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-lg text-white rounded-lg shadow-md transform hover:scale-105 duration-200 ease-in-out font-semibold"
                  >
                    Legal Assistant
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* Temporarily removed banner image
          <img
            src={banner}
            width={500}
            height={500}
            alt="banner"
            className="scale-x-[-1]"
          />
          */}
        </div>

        {/* Modal for Sign In / Sign Up forms */}
        <Modal show={currentForm !== null} onClose={handleCloseForm}>
          {currentForm === 'signin' && <SignIn />}
          {currentForm === 'signup' && <SignUp onSwitchToSignIn={handleShowSignIn} />}
        </Modal>

      </div>
    </div>
  );
}

export default Home; 