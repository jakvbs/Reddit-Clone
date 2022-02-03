import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { login } from '../../../state/ducks/auth/operations';

const LoginSchema = Yup.object().shape({
	username: Yup.string()
		.matches(/^[A-Za-z0-9]+$/i, 'Must be alphanumeric')
		.required('Username is required'),
	password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
	const dispatch = useDispatch();
	const { errors: authErrors } = useSelector((state) => state.auth);

	const submitForm = ({ username, password }) => {
		dispatch(login({ username, password }));
	};

	return (
		<Formik
			initialValues={{
				username: '',
				password: '',
			}}
			validationSchema={LoginSchema}
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
									'border-red-500': (errors.username && touched.username) || authErrors?.username,
								}
							)}
							name="username"
							type="text"
							placeholder="Username"
						/>
						<ErrorMessage className="font-medium text-red-600" name="username" component="small" />
						{authErrors?.username && (
							<small className="font-medium text-red-600">{authErrors?.username}</small>
						)}
					</div>
					<div className="mb-2">
						<Field
							className={classNames(
								'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
								{
									'border-red-500': (errors.password && touched.password) || authErrors?.password,
								}
							)}
							name="password"
							type="password"
							placeholder="Password"
						/>
						<ErrorMessage className="font-medium text-red-600" name="password" component="small" />
						{authErrors?.password && (
							<small className="font-medium text-red-600">{authErrors?.password}</small>
						)}
					</div>
					<button
						className="py-2 mb-4 w-full text-xs font-bold text-white uppercase bg-blue-500 rounded border border-blue-500"
						type="submit"
					>
						Login
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default LoginForm;
