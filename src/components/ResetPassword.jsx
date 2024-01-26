import React, { useState } from 'react';
import logo from '../assets/logo.png';
import bgLogin from '../assets/bg-default.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const formik = useFormik({
        initialValues: {
            token: '',
            new_password: '',
            konfirmasi_password: '',
        },
        onSubmit: (values) => {
            // const { Token } = response.Data;
            fetch(`https://umaxxnew-1-d6861606.deta.app/reset-password?`, {
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

                    // Tampilkan SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Password Berhasil Diperbarui silahkan login menggunakan password baru anda',
                        confirmButtonColor: '#3D5FD9',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Arahkan ke Dashboard untuk pengguna non-staff
                            navigate('/Login');
                        }
                    });

                })
                .catch(error => {
                    // Handle errors, e.g., network errors
                    console.error(error);
                });

        },
    });
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
                    <input
                        type="token"
                        name="token"
                        id="token"
                        placeholder="Token"
                        className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                        onChange={formik.handleChange}
                        value={formik.values.token}
                    />
                    <input
                        type="new_password"
                        name="new_password"
                        id="new_password"
                        placeholder="New Password"
                        className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                        onChange={formik.handleChange}
                        value={formik.values.new_password}
                    />
                    <input
                        type="konfirmasi_password"
                        name="konfirmasi_password"
                        id="konfirmasi_password"
                        placeholder="Konfirmasi Password"
                        className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                        onChange={formik.handleChange}
                        value={formik.values.konfirmasi_password}
                    />

                    <button
                        type="submit"
                        className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
                    >
                        OK
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
}

export default ResetPassword