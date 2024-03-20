import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useFormik } from 'formik';
import bgLogin from '../assets/bg-default.svg';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';


const SignUp = () => {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const registrationSuccessful = useState();
  const [errors, setErrors] = useState({});

  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  // url base
  const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Name is required';
      }
      if (!values.email) {
        errors.email = 'Email is required';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      }
      if (!values.confirm_password) {
        errors.confirm_password = 'Confirm password is required';
      } else if (values.password !== values.confirm_password) {
        errors.confirm_password = 'Passwords do not match';
      }
      if (!values.role) {
        errors.role = 'Role is required';
      }
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      // Proceed with form submission
      const token = localStorage.getItem('jwtToken');
      fetch(`${umaxUrl}/register`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams(values).toString(),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.message === 'Registration successful') {
            // Redirect based on user role
            if (values.role === 'admin') {
              navigate('/admin-dashboard');
            } else if (values.role === 'staff') {
              navigate('/staff-dashboard');
            } else if (values.role === 'client') {
              navigate('/client-dashboard');
            } else {
              navigate('/users-table'); // Default for regular users
            }
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });



  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("Esc key pressed");
        navigate(-1);
      };
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  
  const handleSignUpClick = () => {
    // Navigasi ke halaman UsersTable
    

    formik.handleSubmit();
    if (registrationSuccessful) {
      Swal.fire({
        title: 'Registration Successful!',
        text: 'Your data has been successfully registered.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/UsersTable');
        }
      });
    }
  };
  

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
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.nama}
          placeholder="Nama"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        {formik.errors.name && (
          <span className="text-red-500 text-sm">{formik.errors.name}</span>
        )}
        <input
          type="text"
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="Email"
          className="w-full h-9 rounded-md border pl-5 border-blue mt-2 focus:outline-none focus:ring-1 text-slate-500"
        />
        {formik.errors.email && (
          <span className="text-red-500 text-sm">{formik.errors.email}</span>
        )}
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
        {formik.errors.password && (
          <span className="text-red-500 text-sm">{formik.errors.password}</span>
        )}
        <div className="relative flex items-center">
          <input
            type={showKonfirmasiPassword ? 'text' : 'password'}
            id="confirm_password"
            name="confirm_password"
            onChange={formik.handleChange}
            value={formik.values.confirm_password}
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
        {formik.errors.confirm_password && (
          <span className="text-red-500 text-sm">{formik.errors.confirm_password}</span>
        )}
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
          <option value="client">Client</option>
          {/* Add more roles if needed */}
        </select>
        {formik.errors.role && (
          <span className="text-red-500 text-sm">{formik.errors.role}</span>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          onClick={handleSignUpClick}
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
  )
}

export default SignUp
