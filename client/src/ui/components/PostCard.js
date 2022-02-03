import { ArrowSmDownIcon, ArrowSmUpIcon, ChatAltIcon, DotsHorizontalIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useConfirm } from 'material-ui-confirm';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';
import { deletePost, votePost } from '../../state/ducks/posts/operations';
import { Post } from '../../types';
import ActionButton from './ActionButton';

dayjs.extend(relativeTime);

const PostCard = ({ post: { id, title, body, createdAt, voteScore, commentCount, userVote, url, user, sub } }) => {
	const confirm = useConfirm();
	const history = useHistory();
	const dispatch = useDispatch();

	const { sub: subParam } = useParams();
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const toggleUserDropdown = () => setIsDropdownVisible(!isDropdownVisible);
	const dropDownRef = useRef();
	useClickOutside(dropDownRef, () => isDropdownVisible && setIsDropdownVisible(false));

	const { authenticated, user: loggedUser } = useSelector((state) => state.auth);
	const { voteLoading } = useSelector((state) => state.posts);

	const realCommentCount = useSelector((state) => state.entities.comments.byPostId[id]?.length) || commentCount;
	const isInSubPage = sub.name === subParam;
	const hasPermission = authenticated && (loggedUser?.isAdmin || loggedUser?.id === user.id);

	const handleVote = (value) => {
		if (!authenticated) {
			history.push('/login');
			return;
		}
		if (voteLoading) return;

		let newValue = value;
		if (value === userVote) newValue = 0;

		dispatch(
			votePost({
				postId: id,
				value: newValue,
			})
		);
	};

	const handleDeletePost = () => {
		confirm({
			description: 'Are you sure you want to delete this post?',
		})
			.then(() => {
				dispatch(deletePost(id));
			})
			.catch(() => {});
	};

	return (
		<div className="flex mb-4 rounded border border-dark-50 bg-dark-400 hover:border-gray-50" id={id}>
			{/* Vote section */}
			<div className="py-3 w-10 text-center rounded-l bg-dark-700">
				{/* Upvote */}
				<div
					className="mx-auto w-6 text-gray-400 rounded cursor-pointer hover:bg-dark-75 hover:text-red-500"
					onClick={() => handleVote(1)}
				>
					<ArrowSmUpIcon
						className={classNames({
							'text-red-500': authenticated && userVote === 1,
						})}
					/>
				</div>
				<p className="text-xs font-bold">{voteScore}</p>
				{/* Downvote */}
				<div
					className="mx-auto w-6 text-gray-400 rounded cursor-pointer hover:bg-dark-75 hover:text-blue-600"
					onClick={() => handleVote(-1)}
				>
					<ArrowSmDownIcon
						className={classNames({
							'text-blue-600': authenticated && userVote === -1,
						})}
					/>
				</div>
			</div>
			{/* Post data section */}
			<div className="p-2 w-full">
				<div className="flex items-center">
					{!isInSubPage && (
						<>
							<Link to={`/r/${sub.name}`}>
								<img
									src={sub.imageUrl}
									className="mr-1 w-6 h-6 rounded-full cursor-pointer"
									alt={sub.name}
								/>
							</Link>
							<Link to={`/r/${sub.name}`} className="text-xs font-bold cursor-pointer hover:underline">
								/r/{sub.name}
							</Link>
							<span className="mx-1 text-xs text-gray-500">•</span>
						</>
					)}
					<p className="text-xs text-gray-500">
						Posted by
						<Link to={`/user/${user.id}`} className="mx-1 hover:underline">
							{user.username}
						</Link>
						<Link to={url} className="mx-1 hover:underline">
							{dayjs(createdAt).fromNow()}
						</Link>
					</p>
				</div>
				<Link to={url} className="my-1 text-lg font-medium cursor-pointer">
					{title}
					{body && <p className="my-1 text-sm">{body}</p>}
				</Link>

				<div className="flex">
					<Link to={url}>
						<ActionButton>
							<ChatAltIcon className="inline-flex mr-1 w-5" />
							<span className="font-bold">{realCommentCount} Comments</span>
						</ActionButton>
					</Link>
					{hasPermission && (
						<div ref={dropDownRef} onClick={() => toggleUserDropdown()}>
							<ActionButton>
								<DotsHorizontalIcon className="w-5" />
							</ActionButton>
							{isDropdownVisible && (
								<div className="overflow-hidden absolute z-10 rounded border border-dark-border text-dark-100 bg-dark-100">
									<button
										className="block px-3 py-2 text-sm bg-dark-400 w-50 hover:bg-dark-75"
										type="button"
										onClick={() => {
											history.push(`/r/${sub.name}/comments/${id}/edit`);
										}}
									>
										Edit post
									</button>
									<button
										className="block px-3 py-2 text-sm w-full bg-dark-400 w-50 hover:bg-dark-75"
										type="button"
										onClick={handleDeletePost}
									>
										Delete
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

PostCard.propTypes = {
	post: Post.isRequired,
};

export default PostCard;
