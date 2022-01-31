import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

const PostSchema = Yup.object().shape({
	title: Yup.string()
		.min(2, 'Title must be at least 2 characters long')
		.max(100, 'Title must be less than 100 characters long')
		.required('Title is required'),
	body: Yup.string()
		.min(2, 'Body must be at least 2 characters long')
		.max(1000, 'Body must be less than 1000 characters long')
		.required('Body is required'),
});

const PostForm = ({ submitForm, initialValues }) => {
	const { sub: subname } = useParams();
	return (
		<Formik
			initialValues={{
				title: initialValues.title || Cookies.get(`posts/${subname}/title`) || '',
				body: initialValues.body || Cookies.get(`posts/${subname}/body`) || initialValues.body || '',
			}}
			validationSchema={PostSchema}
			onSubmit={submitForm}
			enableReinitialize
		>
			{({ errors, touched, values, setValues }) => (
				<Form>
					<div className="relative mb-2">
						<Field
							className={classNames(
								'w-full bg-transparent px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600',
								{
									'border-red-500': errors.title && touched.title,
								}
							)}
							name="title"
							type="text"
							placeholder="Title"
							value={values.title}
							onChange={(e) => {
								Cookies.set(`posts/${subname}/title`, e.target.value);
								setValues({ ...values, title: e.target.value });
							}}
						/>
						<ErrorMessage className="font-medium text-red-600" name="title" component="small" />
					</div>
					<Field
						component="textarea"
						className={classNames(
							'w-full h-48 p-3 border bg-transparent border-gray-300 rounded focus:outline-none focus:border-gray-600',
							{
								'border-red-500': errors.body && touched.body,
							}
						)}
						name="body"
						type="text"
						placeholder="Body"
						value={values.body}
						onChange={(e) => {
							Cookies.set(`posts/${subname}/body`, e.target.value);
							setValues({ ...values, body: e.target.value });
						}}
					/>
					<ErrorMessage className="font-medium text-red-600" name="body" component="small" />
					<div className="flex justify-end">
						<button className="py-1 mt-2 gray button" type="submit">
							Submit
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

PostForm.propTypes = {
	submitForm: PropTypes.func.isRequired,
	initialValues: PropTypes.instanceOf(Object),
};

PostForm.defaultProps = {
	initialValues: {
		title: '',
		body: '',
	},
};

export default PostForm;
