import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // ... (kode Anda untuk pengecekan login)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="relative bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div>
        <img src={logo} alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
      >
        <p className="font-semibold text-base text-[#5473E3] mb-5">Login</p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="w-full h-9 rounded-md border border-blue mt-2 focus:outline-none focus:ring-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="w-full h-9 rounded-md border border-blue mt-2 focus:outline-none focus:ring-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
        >
          SIGN IN
        </button>
        <Link
          to="/register"
          className="block text-[#5473E3] mt-3 text-center hover:text-[#2347C5] hover:underline"
        >
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
};

export default SignIn;
