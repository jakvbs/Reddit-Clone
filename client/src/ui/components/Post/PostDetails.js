import { ChatAltIcon, DotsHorizontalIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useConfirm } from 'material-ui-confirm';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import useClickOutside from '../../../hooks/useClickOutside';
import { getPostComments } from '../../../state/ducks/comments/operations';
import { deletePost, getPost } from '../../../state/ducks/posts/operations';
import ActionButton from '../ActionButton';
import SubSideBar from '../SubSideBar';
import Banner from './Banner';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
import VoteSection from './VoteSection';

dayjs.extend(relativeTime);

const PostDetails = () => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const toggleUserDropdown = () => setIsDropdownVisible(!isDropdownVisible);
	const dropDownRef = useRef();
	useClickOutside(dropDownRef, () => isDropdownVisible && setIsDropdownVisible(false));

	const history = useHistory();
	const { sub: subname, id } = useParams();
	const dispatch = useDispatch();

	const { authenticated, user } = useSelector((state) => state.auth);
	const post = useSelector((state) => state.entities.posts.byId[id]);
	const comments = useSelector((state) =>
		state.entities.comments.byPostId[id]?.map((commentId) => state.entities.comments.byId[commentId])
	);
	const { error } = useSelector((state) => state.posts);

	const hasPermission = authenticated && (user?.isAdmin || user?.id === post?.user.id);

	useEffect(() => {
		if (!post) {
			dispatch(getPost(id));
		}
		if (!comments) {
			dispatch(getPostComments(id));
		}
	}, [id]);

	const confirm = useConfirm();
	const handleDeletePost = () => {
		confirm({
			description: 'Are you sure you want to delete this post?',
		})
			.then(() => {
				dispatch(deletePost(id));
				history.push(`/r/${subname}`);
			})
			.catch(() => {});
	};

	if (error) {
		setTimeout(() => {
			history.push('/');
		}, 3000);
		return (
			<div className="pt-12">
				<p className="text-lg font-bold text-center">
					An error occurred, you will be redirected to the home page.
				</p>
			</div>
		);
	}
	if (!post) {
		return (
			<div className="pt-12">
				<p className="text-2xl font-bold text-center">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<Banner post={post} subname={subname} />
			<div className="container flex px-4 pt-5">
				{/* Post */}
				<div className="w-160">
					<div className="rounded bg-dark-400">
						<div className="flex">
							<VoteSection />
							<div className="py-2 pr-2">
								<div className="flex">
									<p className="text-xs text-gray-500">
										Posted by
										<Link to={`/user/${post.user.id}`} className="mx-1 hover:underline">
											/user/{post.user.username}
										</Link>
										<Link to={post.url} className="mx-1 hover:underline">
											{dayjs(post.createdAt).fromNow()}
										</Link>
									</p>
								</div>
								<h1 className="my-1 text-xl font-medium">{post.title}</h1>
								<p className="my-3 text-sm">{post.body}</p>
								<div className="flex">
									<div className="flex">
										<Link to={post.url}>
											<ActionButton>
												<ChatAltIcon className="inline-flex mr-1 w-5" />
												<span className="font-bold">{comments?.length || 0} Comments</span>
											</ActionButton>
										</Link>
										{hasPermission && (
											<div ref={dropDownRef} onClick={() => toggleUserDropdown()}>
												<ActionButton>
													<DotsHorizontalIcon className="w-5" />
												</ActionButton>
												{isDropdownVisible && (
													<div className="overflow-hidden absolute z-10 border border-dark-400 text-dark-100 bg-dark-100">
														<button
															className="block px-3 py-2 text-sm  bg-dark-400 w-50 hover:bg-dark-75"
															type="button"
															onClick={() => {
																history.push(`/r/${subname}/comments/${id}/edit`);
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
						</div>
						<CommentCreate />
						<CommentList comments={comments} />
					</div>
				</div>
				<SubSideBar sub={post.sub} isButtonVisible />
			</div>
		</>
	);
};

export default PostDetails;
