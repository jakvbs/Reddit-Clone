import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { createSub } from '../../../state/ducks/subs/operations';

const SubSchema = Yup.object().shape({
	name: Yup.string().min(3).max(25).required(),
	title: Yup.string().min(3).max(50).required(),
	description: Yup.string().min(3).max(100).required(),
});

const SubForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { errors: subErrors } = useSelector((state) => state.subs);

	const submitForm = async (values) => {
		await dispatch(createSub(values));

		history.push(`/r/${values.name}`);
	};

	return (
		<Formik
			initialValues={{
				name: '',
				title: '',
				description: '',
			}}
			validationSchema={SubSchema}
			onSubmit={submitForm}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="w-full">
					<div className="my-6">
						<p className="font-medium">Name</p>
						<p className="mb-2 text-xs text-gray-500">
							Community names including capitalization cannot be changed.
						</p>
						<Field
							className={classNames(
								'w-full bg-transparent px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600',
								{
									'border-red-500': errors.name && touched.name,
								}
							)}
							name="name"
							type="text"
						/>
						<ErrorMessage className="font-medium text-red-600" name="name" component="small" />
						{subErrors.name && <small className="font-medium text-red-600">{subErrors.name}</small>}
					</div>

					<div className="my-6">
						<p className="font-medium">Title</p>
						<p className="mb-2 text-xs text-gray-500">
							Community title represent the topic an you change it at any time.
						</p>
						<Field
							className={classNames(
								'w-full p-3 border bg-transparent rounded focus:outline-none focus:border-gray-600',
								{
									'border-red-500': errors.title && touched.title,
								}
							)}
							name="title"
							type="text"
						/>
						<ErrorMessage className="font-medium text-red-600" name="title" component="small" />
						{subErrors.title && <small className="font-medium text-red-600">{subErrors.title}</small>}
					</div>

					<div className="my-6">
						<p className="font-medium">Description</p>
						<p className="mb-2 text-xs text-gray-500">
							This is how new members come to understand your community.
						</p>
						<Field
							component="textarea"
							className={classNames(
								'w-full p-3 border bg-transparent rounded focus:outline-none focus:border-gray-600',
								{
									'border-red-500': errors.description && touched.description,
								}
							)}
							name="description"
							type="text"
						/>
						<ErrorMessage className="font-medium text-red-600" name="description" component="small" />
						{subErrors.description && (
							<small className="font-medium text-red-600">{subErrors.description}</small>
						)}
					</div>

					<div className="flex justify-end">
						<button className="px-4 py-1 text-sm font-semibold capitalize gray button" type="submit">
							Create Community
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default SubForm;
