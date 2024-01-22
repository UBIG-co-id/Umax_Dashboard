import React, { useState } from 'react';
import logo from '../assets/logo.png';
import bgLogin from '../assets/bg-default.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignIn = () => {
  const navigate = useNavigate();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // ADD Data Campaigns

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    onSubmit: (values) => {
      // const { Token } = response.Data;
      fetch(`https://umaxxnew-1-d6861606.deta.app/login`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(values).toString(),
      })

        .then(response => response.json())
        .then(data => {
          const { Token } = data
          console.log("ini token", Token)
          console.log(data);
          localStorage.setItem('jwtToken', Token);

            // Arahkan ke Dashboard untuk pengguna non-staff
            navigate('/Dashboard');
        
        })
        .catch(error => {
          // Handle errors, e.g., network errors
          console.error(error);
        });

    },
  });

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await fetch('https://umaxxnew-1-d6861606.deta.app/login', {
  //       method: 'POST',
  //       headers: {
  //         accept: "application/json",
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //     });

  //     console.log('Response status:', response.status);

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       const { Token } = responseData.Data; 

  //       localStorage.setItem('jwtToken', Token);
  //       navigate('/Dashboard');
  //     } else {
  //       setError('Invalid email or password');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      <img src={bgLogin} alt="background" className="absolute -z-10" />
      <div>
        <img src={logo} alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <div className="flex flex-col items-center justify-center mt-5 sm:mt-0">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full  p-6 bg-white rounded-lg shadow-lg border-2"
        >
          <p className="font-semibold text-base text-[#5473E3] mb-5">Login</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <div className="relative flex items-center">
            <input
             type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <div
            className="absolute top-3 right-2  cursor-pointer"
            onClick={togglePasswordVisibility} 
          >
            {showPassword ? (
              <AiOutlineEye size={15} />
            ) : (
              <AiOutlineEyeInvisible size={15} />
            )}

          </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
          >
            SIGN IN
          </button>
          {/* <Link
            to="/register"
            className="mt-3 text-[#5473E3] hover:text-[#2347C5] hover:underline"
          >
            <p className="text-[#5473E3] mb-5">Don't have an account? Sign up</p>
          </Link> */}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
