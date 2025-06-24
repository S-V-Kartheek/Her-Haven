import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: email }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          setOtpSent(true);
        } else {
          setError(result.message || 'An error occurred.');
        }
      } else {
        setError(result.message || 'An error occurred on the server.');
        console.error('Backend error:', result);
      }
    } catch (apiError) {
      setError('Could not connect to the server. Please try again later.');
      console.error('API call error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!otp) {
      setError('Please enter the OTP.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ otp: otp }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          const userData = result.user || { name: email.split('@')[0] || 'User', email: email };
          login(userData);
          window.location.href = '/';
        } else {
          setError(result.message || 'OTP verification failed.');
        }
      } else {
        setError(result.message || 'An error occurred during OTP verification.');
        console.error('Backend error:', result);
      }
    } catch (apiError) {
      setError('Could not connect to the server for OTP verification. Please try again later.');
      console.error('API call error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign In with OTP</h2>
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {loading ? (
            <div className="text-center space-y-4">
              <p className="text-blue-600 font-semibold text-lg">Loading...</p>
            </div>
          ) : !otpSent ? (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-center" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
                type="submit"
                disabled={loading}
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600 text-sm">OTP sent to {email}</p>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-center" htmlFor="otp">
                  One-Time Password (OTP)
                </label>
                <input
                  className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
                type="submit"
                disabled={loading}
              >
                Verify OTP
              </button>
            </>
          )}

          {!otpSent && (
            <div className="text-center mt-4">
              <Link to="/signup" className="inline-block align-baseline font-semibold text-sm text-blue-600 hover:text-blue-800">
                Don't have an account? Sign Up
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignIn; 