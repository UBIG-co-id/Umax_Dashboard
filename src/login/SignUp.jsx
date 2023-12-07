import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useFormik } from 'formik';
import bgLogin from '../assets/bg-default.svg';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


const SignUp = () => {
  const [passwordMatch, setPasswordMatch] = useState(true);

  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  // url base
  const umaxUrl = 'https://umaxx-1-v8834930.deta.app';

  const formik = useFormik({
    initialValues: {
      nama: '',
      email: '',
      password: '',
      konfirmasi_password: '',
      role: '',
    },
    onSubmit: (values) => {
      if (values.password !== values.konfirmasi_password) {
        setPasswordMatch(false);
        return;
    }
    
    const token = localStorage.getItem("jwtToken");
      // Send a POST request to your FastAPI backend with form data
      fetch(`${umaxUrl}/register`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        body: new URLSearchParams(values).toString(),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.message === 'Registration successful') {
            // Redirect based on user role
            if (values.role === 'admin') {
              navigate('/admin-dashboard');
            } else if (values.role === 'staff') {
              navigate('/staff-dashboard');
            } else {
              navigate('/login'); // Default for regular users
            }
          }
        })
        .catch(error => {
          console.error('Kesalahan Fetch:', error);
          // console.error(error);
        });
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <img src={bgLogin} className='absolute -z-10' />
      <div>
        <img src={logo} alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border-2"
      >
        <p className="font-semibold text-base text-[#5473E3] mb-5">Register</p>
        <input
          type="text"
          id="nama"
          name="nama"
          onChange={formik.handleChange}
          value={formik.values.nama}
          placeholder="Nama"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        <input
          type="text"
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="Email"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />

        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Password"
            className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
          />

          <div
            className="absolute top-3 right-2  cursor-pointer"
            onClick={togglePasswordVisibility} irm
          >
            {showPassword ? (
              <AiOutlineEye size={15} />
            ) : (
              <AiOutlineEyeInvisible size={15} />
            )}

          </div>
        </div>

        <div className="relative flex items-center">
          <input
            type={showKonfirmasiPassword ? 'text' : 'password'}
            id="konfirmasi_password"
            name="konfirmasi_password"
            onChange={formik.handleChange}
            value={formik.values.konfirmasi_password}
            placeholder="Konfirmasi Password"
            className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
          />
          <div
            className="absolute top-3 right-2  cursor-pointer flex items-center"
            onClick={toggleKonfirmasiPasswordVisibility} irm
          >
            {showKonfirmasiPassword ? (
              <AiOutlineEye size={15} />
            ) : (
              <AiOutlineEyeInvisible size={15} />
            )}

          </div>
        </div>
          {!passwordMatch && (
            <span className="text-red-500 text-sm relative bottom-0 left-0 mb-2 ml-2">
              Password tidak sama!
            </span>
          )}
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        >
          <option value="" hidden>Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          {/* Add more roles if needed */}
        </select>

        <button
          type="submit"
          className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
        >
          SIGN UP
        </button>
        <Link
          to="/login"
          className="block text-[#5473E3] mt-3 text-center hover:text-[#2347C5] hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
