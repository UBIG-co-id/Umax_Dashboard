import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useFormik } from 'formik';

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nama: '',
      email: '',
      password: '',
      konfirmasi_password: '',
    },
    onSubmit: (values) => {
      // Send a POST request to your FastAPI backend with form data
      fetch('https://umax-1-z7228928.deta.app/register/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(values).toString(),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the backend (e.g., success message or error)
          console.log(data);
          if (data.message === 'Registration successful') {
            // Redirect to the dashboard page
            navigate('/dashboard');
          }
        })
        .catch(error => {
          // Handle errors, e.g., network errors
          console.error(error);
        });
    },
  });

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div>
        <img src={logo} alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
      >
        <p className="font-semibold text-base text-[#5473E3] mb-5">Register</p>
        <input
          type="text"
          id="nama"
          name="nama"
          onChange={formik.handleChange}
          value={formik.values.nama}
          placeholder="Nama"
          className="w-full h-9 rounded-md border border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        <input
          type="text"
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="Email"
          className="w-full h-9 rounded-md border border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Password"
          className="w-full h-9 rounded-md border border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        <input
          type="password"
          id="konfirmasi_password"
          name="konfirmasi_password"
          onChange={formik.handleChange}
          value={formik.values.konfirmasi_password}
          placeholder="Konfirmasi Password"
          className="w-full h-9 rounded-md border border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
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
