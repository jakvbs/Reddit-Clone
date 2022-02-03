import { ArrowSmDownIcon, ArrowSmUpIcon, DotsHorizontalIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useConfirm } from 'material-ui-confirm';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import useClickOutside from '../../../hooks/useClickOutside';
import { deleteComment, editComment, voteComment } from '../../../state/ducks/comments/operations';
import { Comment } from '../../../types';
import ActionButton from '../ActionButton';

const CommentSchema = Yup.object().shape({
	body: Yup.string().required('Comment cannot be empty'),
});

dayjs.extend(relativeTime);

const CommentCard = ({ comment }) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const toggleUserDropdown = () => setIsDropdownVisible(!isDropdownVisible);
	const dropDownRef = useRef();
	useClickOutside(dropDownRef, () => isDropdownVisible && setIsDropdownVisible(false));

	const [isEditing, setIsEditing] = useState(false);

	const history = useHistory();
	const confirm = useConfirm();
	const dispatch = useDispatch();
	const { authenticated, user } = useSelector((state) => state.auth);
	const { voteLoading } = useSelector((state) => state.comments);

	const hasPermission = authenticated && (user?.isAdmin || user?.id === comment.user.id);

	const handleVote = (value) => {
		if (!authenticated) {
			history.push('/login');
			return;
		}
		if (voteLoading) return;

		let newValue = value;
		if (value === comment.userVote) newValue = 0;

		dispatch(
			voteComment({
				commentId: comment.id,
				postId: comment.post.id,
				value: newValue,
			})
		);
	};

	const submitComment = ({ body }) => {
		dispatch(
			editComment({
				id: comment.id,
				postId: comment.post.id,
				body,
			})
		);
		setIsEditing(false);
	};

	const handleDeleteComment = (commentId) => {
		confirm({
			description: 'Are you sure you want to delete this comment?',
		})
			.then(() => {
				dispatch(deleteComment(commentId));
			})
			.catch(() => {});
	};

	return (
		<div className="flex mb-2 border-t">
			{/* Vote section */}
			<div className="flex-shrink-0 py-2 w-10 text-center rounded-l">
				{/* Upvote */}
				<div
					className="mx-auto w-6 text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-red-500"
					onClick={() => handleVote(1)}
				>
					<ArrowSmUpIcon
						className={classNames({
							'text-red-500': authenticated && comment.userVote === 1,
						})}
					/>
				</div>
				<p className="text-xs font-bold">{comment.voteScore}</p>
				{/* Downvote */}
				<div
					className="mx-auto w-6 text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-blue-600"
					onClick={() => handleVote(-1)}
				>
					<ArrowSmDownIcon
						className={classNames({
							'text-blue-600': authenticated && comment.userVote === -1,
						})}
					/>
				</div>
			</div>
			<div className="py-2 pr-2 w-full">
				<div className="mb-1 text-xs leading-none">
					<Link to={`/user/${comment.user.id}`} className="mr-1 font-bold hover:underline">
						{comment.user.username}
					</Link>
					<span className="flex items-center text-gray-600">
						{`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
						{hasPermission && (
							<div ref={dropDownRef} onClick={() => toggleUserDropdown()}>
								<ActionButton>
									<DotsHorizontalIcon className="w-5" />
								</ActionButton>
								{isDropdownVisible && (
									<div className="overflow-hidden absolute z-10 rounded border border-dark-border text-dark-100 bg-dark-100">
										<button
											className="block px-3 py-2 w-full text-sm bg-dark-400 w-50 hover:bg-dark-75"
											type="button"
											onClick={() => setIsEditing(true)}
										>
											Edit
										</button>
										<button
											className="block px-3 py-2 text-sm bg-dark-400 w-50 hover:bg-dark-75"
											type="button"
											onClick={() => handleDeleteComment(comment.id)}
										>
											Delete
										</button>
									</div>
								)}
							</div>
						)}
					</span>
				</div>
				{isEditing ? (
					<Formik
						initialValues={{
							body: comment.body,
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
											'w-full h-28 p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-gray-600',
											{
												'border-red-500': errors.body && touched.username,
											}
										)}
										name="body"
										type="text"
									/>
									<ErrorMessage className="font-medium text-red-600" name="body" component="small" />
								</div>
								<button className="px-3 py-1 gray button" type="submit" disabled={!values.body}>
									Edit
								</button>
							</Form>
						)}
					</Formik>
				) : (
					<p>{comment.body}</p>
				)}
			</div>
		</div>
	);
};

CommentCard.propTypes = {
	comment: Comment.isRequired,
};

export default CommentCard;
