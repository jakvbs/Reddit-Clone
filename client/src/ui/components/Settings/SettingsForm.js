import Axios from 'axios';
import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const SettingsSchema = Yup.object().shape({
	imageUrl: Yup.string(),
	username: Yup.string()
		.matches(/^[A-Za-z0-9\s]+$/i, 'Must be alphanumeric')
		.required('Username is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().min(8, 'Password must be at least 8 characters long'),
});

const SettingsForm = () => {
	const { user } = useSelector((state) => state.auth);

	const [apiErrors, setApiErrors] = useState({});

	const submitForm = ({ imageUrl, username, email, password }) => {
		Axios.put(`/users/${user.id}`, { imageUrl, username, email, password })
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				setApiErrors(err.response.data);
			});
	};

	return (
		<Formik
			initialValues={{
				imageUrl: user.imageUrl,
				username: user.username,
				email: user.email,
				password: '',
			}}
			validationSchema={SettingsSchema}
			onSubmit={submitForm}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form>
					<div className="mb-4">
						<Field
							className={classNames(
								'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
								{
									'border-red-500': errors.imageUrl && touched.imageUrl,
								}
							)}
							name="imageUrl"
							type="text"
							placeholder="URL of profile picture"
						/>
						<ErrorMessage className="font-medium text-red-600 " name="imageUrl" component="small" />
					</div>
					<div className="mb-4">
						<Field
							className={classNames(
								'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
								{
									'border-red-500': (errors.username && touched.username) || apiErrors.username,
								}
							)}
							name="username"
							type="text"
							placeholder="Username"
						/>
						<ErrorMessage className="font-medium text-red-600 " name="username" component="small" />
						{apiErrors.username && <small className="font-medium text-red-600">{apiErrors.username}</small>}
					</div>
					<div className="mb-4">
						<Field
							className={classNames(
								'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
								{
									'border-red-500': (errors.email && touched.email) || apiErrors.email,
								}
							)}
							name="email"
							type="text"
							placeholder="Email"
						/>
						<ErrorMessage className="font-medium text-red-600 " name="email" component="small" />
						{apiErrors.email && <small className="font-medium text-red-600">{apiErrors.email}</small>}
					</div>
					<div className="mb-4">
						<Field
							className={classNames(
								'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-transparent',
								{
									'border-red-500': (errors.password && touched.password) || apiErrors.password,
								}
							)}
							name="password"
							type="password"
							placeholder="New Password"
						/>
						<ErrorMessage className="font-medium text-red-600 " name="password" component="small" />
						{apiErrors.password && <small className="font-medium text-red-600">{apiErrors.password}</small>}
					</div>
					<button
						className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
						type="submit"
					>
						Update Settings
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default SettingsForm;
