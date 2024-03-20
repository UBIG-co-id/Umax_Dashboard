import React, { useState } from 'react';
import logo from '../assets/logo.png';
import bgLogin from '../assets/bg-default.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await fetch(
                    `https://umaxxnew-1-d6861606.deta.app/send-password-reset-email`,
                    {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(values).toString(),
                    }
                );

                if (!response.ok) {
                    throw new Error('Gagal mengirim email reset');
                }

                const data = await response.json();
                const { Token } = data;

                // Anggap backend Anda mengembalikan token, Anda mungkin ingin menggunakannya untuk pemeriksaan keamanan tambahan.

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Silahkan cek email anda, token telah dikirim ke email anda',
                    confirmButtonColor: '#3D5FD9',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/ResetPassword');
                    }
                });
            } catch (error) {
                console.error(error);

                // Tangani kesalahan, tampilkan pesan kesalahan kepada pengguna jika diperlukan
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal mengirim email reset. Silahkan coba lagi.',
                    confirmButtonColor: '#FF5252',
                    confirmButtonText: 'OK',
                });
            }
        },

    });
    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
            <img src={bgLogin} alt="background" className="absolute -z-10" />
            <div className="w-full max-w-md mx-auto">
                <img src={logo} alt="logo" className="mx-auto pb-2 w-20" />
                <div className="flex flex-col items-center justify-center mt-5 sm:mt-0">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="w-full  p-6 bg-white rounded-lg shadow-lg border-2"
                    >
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            className="w-full h-12 rounded-lg pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
                            onChange={formik.handleChange}
                            value={formik.values.email}
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
        </div>
    );
}

export default ForgotPassword