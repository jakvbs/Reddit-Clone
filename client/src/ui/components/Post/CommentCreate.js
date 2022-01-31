import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { addComment } from '../../../state/ducks/comments/operations';

dayjs.extend(relativeTime);

const CommentSchema = Yup.object().shape({
	body: Yup.string().required('Comment cannot be empty'),
});

const CommentCreate = () => {
	const { authenticated, user } = useSelector((state) => state.auth);

	const { id } = useParams();
	const dispatch = useDispatch();

	const submitComment = ({ body }, { resetForm }) => {
		dispatch(
			addComment({
				body,
				postId: id,
			})
		);
		resetForm();
	};

	return (
		<div className="pb-3 pl-10 pr-6">
			{authenticated ? (
				<div>
					<p className="mb-1 text-xs">
						Comment as{' '}
						<Link to={`/user/${user.id}`} className="font-semibold text-blue-500">
							{user.username}
						</Link>
					</p>
					<Formik
						initialValues={{
							body: '',
						}}
						validationSchema={CommentSchema}
						onSubmit={submitComment}
						enableReinitialize
					>
						{({ errors, touched, values }) => (
							<Form>
								<div className="mb-2">
									<Field
										component="textarea"
										className={classNames(
											'w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-gray-600',
											{
												'border-red-500': errors.body && touched.username,
											}
										)}
										name="body"
										type="text"
									/>
									<ErrorMessage className="font-medium text-red-600 " name="body" component="small" />
								</div>
								<button className="px-3 py-1 gray button" type="submit" disabled={!values.body}>
									Comment
								</button>
							</Form>
						)}
					</Formik>
				</div>
			) : (
				<div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
					<p className="font-semibold text-gray-400">Log in to leave a comment</p>
					<div>
						<Link to="/login" className="px-4 py-1 mr-4 gray button ">
							Login
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default CommentCreate;
