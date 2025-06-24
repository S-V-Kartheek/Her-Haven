import React, { useState } from 'react';

function SignUp({ onSwitchToSignIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setVerificationSent(false);
    setLoading(true);

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          setVerificationSent(true);
        } else {
          setError(result.message || 'An error occurred during registration.');
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

  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h2>
        
        {loading ? (
          <div className="text-center space-y-4">
            <p className="text-blue-600 font-semibold text-lg">Registering...</p>
          </div>
        ) : !verificationSent ? (
          <form onSubmit={handleSignUp} className="space-y-6">
             {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>} 
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 text-center" htmlFor="name"> 
                Name
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" 
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 text-center" htmlFor="password"> 
                Password
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" 
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                type="submit"
                disabled={loading}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="inline-block align-baseline font-semibold text-sm text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-semibold text-lg">Verification email sent!</p>
            <p className="text-gray-700">Please check your email inbox (and spam folder) for a verification link.</p>
            <p className="text-gray-700">After verifying your email, you can proceed to Sign In.</p>
             <button
                type="button"
                onClick={onSwitchToSignIn}
                className="inline-block align-baseline font-semibold text-sm text-blue-600 hover:text-blue-800 mt-4"
              >
                Back to Sign In
              </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp; 