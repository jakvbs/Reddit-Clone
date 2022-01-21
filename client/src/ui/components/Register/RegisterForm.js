import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { register } from '../../../state/ducks/auth/operations';

const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});

const RegisterForm = () => {
    const dispatch = useDispatch();
    const { errors: authErrors } = useSelector((state) => state.auth);

    const submitForm = async ({ email, username, password }) => {
        await dispatch(register({ email, username, password }));
    };

    return (
        <Formik
            initialValues={{
                email: '',
                username: '',
                password: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={submitForm}
            enableReinitialize
        >
            {({ errors, touched }) => (
                <Form>
                    <div className="mb-2">
                        <Field
                            className={classNames(
                                'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
                                {
                                    'border-red-500': (errors.email && touched.email) || authErrors?.email,
                                }
                            )}
                            name="email"
                            type="text"
                            placeholder="email"
                        />
                        <ErrorMessage className="font-medium text-red-600 " name="email" component="small" />
                        {authErrors?.email && <small className="font-medium text-red-600">{authErrors?.email}</small>}
                    </div>
                    <div className="mb-2">
                        <Field
                            className={classNames(
                                'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
                                {
                                    'border-red-500': errors.username && touched.username,
                                }
                            )}
                            name="username"
                            type="text"
                            placeholder="Username"
                        />
                        <ErrorMessage className="font-medium text-red-600 " name="username" component="small" />
                        {authErrors?.username && (
                            <small className="font-medium text-red-600">{authErrors?.username}</small>
                        )}
                    </div>
                    <div className="mb-2">
                        <Field
                            className={classNames(
                                'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
                                {
                                    'border-red-500': errors.password && touched.password,
                                }
                            )}
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        <ErrorMessage className="font-medium text-red-600 " name="password" component="small" />
                        {authErrors?.password && (
                            <small className="font-medium text-red-600">{authErrors?.password}</small>
                        )}
                    </div>
                    <button
                        className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;
