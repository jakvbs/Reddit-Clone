import React from 'react';
import { Link } from 'react-router-dom';
import Google from '../../images/google.png';
import LoginForm from './LoginForm';

const Login = () => {
    const google = () => {
        window.open('http://localhost:8080/api/auth/google', '_self');
    };

    return (
        <main className="flex bg-dark-600 flex-col justify-center items-center pl-6 h-screen w-screen">
            <div className="w-70 flex flex-col">
                <h1 className="mb-2 text-lg font-medium">Sign in</h1>
                <div
                    className="flex w-full justify-center py-3 rounded-md text-white items-center font-bold mb-5 cursor-pointer bg-google"
                    onClick={google}
                >
                    <img src={Google} alt="" className="w-5 h-5 mr-3" />
                    Google
                </div>
                <div className="flex items-center justify-center mb-6 mt-2">
                    <div className="w-full h-[1px] bg-gray-100" />
                    <div className="mx-3">OR</div>
                    <div className="w-full h-[1px] bg-gray-100" />
                </div>
                <LoginForm />
                <small>
                    Need an account?
                    <Link to="/register" className="ml-1 text-blue-500 uppercase">
                        Sign Up
                    </Link>
                </small>
            </div>
        </main>
    );
};

export default Login;
