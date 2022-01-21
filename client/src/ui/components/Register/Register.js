import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const Register = () => {
    return (
        <main className="flex bg-dark-600 flex-col justify-center items-center pl-6 h-screen w-screen">
            <div className="w-70">
                <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
                <RegisterForm />
                <small>
                    Already a ugeditor?
                    <Link to="/login" className="ml-1 text-blue-500 uppercase">
                        Log In
                    </Link>
                </small>
            </div>
        </main>
    );
};

export default Register;
