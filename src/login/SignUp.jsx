    import React, { useState } from 'react';
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
        <div className="relative bg-gray-100 h-screen">
        <div>
            <img src={logo} alt="logo" className="mt-0 ml-16 w-40" />
        </div>
        <div className="flex flex-col items-center justify-center h-[30rem]">
            <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center outline-none p-6 bg-white rounded-lg shadow-lg"
            >
            <p className="place-self-start font-semibold text-base text-[#5473E3]">Register</p>
            <input
                type="text"
                id="nama"
                name="nama"
                onChange={formik.handleChange}
                value={formik.values.nama}
                placeholder="Nama"
                className="block w-[25rem] h-9 rounded-[10px] border border-blue mt-2 focus:outline-none focus:ring-1"
            
            />
            <input
            type="text"
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
                placeholder="Email"
                className="block w-[25rem] h-9 rounded-[10px] border border-blue mt-2 focus:outline-none focus:ring-1"
                
            />
            <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
                placeholder="password"
                className="block w-[25rem] h-9 rounded-[10px] border border-blue mt-2 focus:outline-none focus:ring-1"
                
            />
            <input
                type="password"
                id="konfirmasi_password"
                name="konfirmasi_password"
                onChange={formik.handleChange}
                value={formik.values.konfirmasi_password}
                placeholder="Konfirmasi Password"
                className="block w-[25rem] h-9 rounded-[10px] border border-blue mt-2 focus:outline-none focus:ring-1"
            
            />
            <button
                type="submit"
                className={`rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5`}
                onClick={onsubmit}
            >
                SIGN UP
            </button>
            <Link to="/login" className="hover:text-[#2347C5] hover:underline">
                <p className="text-[#5473E3] mb-5">Already have an account? Sign in</p>
            </Link>
            </form>
        </div>
        </div>
    );
    };

    export default SignUp;
