import React, { useState,useEffect} from 'react';
import imageLeft from '../assets/left-financial.svg';
import imageRight from '../assets/right-financial.svg';
import logo from '../assets/logo.png';
import { Link, useNavigate, } from 'react-router-dom';
import Cookies from 'js-cookie';


const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Check if a token already exists in local storage (e.g., after a previous login)
 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://umax-1-z7228928.deta.app/login/?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        // If the login is successful, extract the JWT token from the response
        const data = await response.json();
        const { token } = data;

        // Store the token in a cookie
        localStorage.setItem('jwtToken', token);
        console.log(localStorage.getItem('jwtToken'));


        // Navigate to the dashboard
        navigate('/Dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };




  return (
    <div className="relative bg-gray-100 h-screen">
      <div>
        <img src={logo} alt="logo" className="mt-0 ml-16 w-40" />
      </div>
      <div className="flex flex-col items-center justify-center h-[30rem]  ">
        <form onSubmit={handleSubmit} className="flex flex-col items-center outline-none p-6 bg-white rounded-lg shadow-lg">
          <p className="font-semibold text-base text-[#5473E3] mb-5">Login</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="block w-[25rem] h-9 rounded-[10px] border border-blue mt-2 focus:outline-none focus:ring-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="block w-[25rem] h-9 rounded-[10px] border border-blue mt-2 focus:outline-none focus:ring-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-[25rem] h-10 mt-5 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5]">
            SIGN IN
          </button>
          <Link to="/register" className="hover:text-[#2347C5] hover:underline">
            <p className="text-[#5473E3] mb-5">Don't have an account? Sign up</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
