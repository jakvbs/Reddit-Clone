import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { editPost, getPost } from '../../../state/ducks/posts/operations';
import { getSub } from '../../../state/ducks/subs/operations';
import SubSideBar from '../SubSideBar';
import PostForm from './PostForm';

const EditPost = () => {
	const history = useHistory();
	const { sub: subname, id } = useParams();

	const post = useSelector((state) => state.entities.posts.byId[id]);
	const sub = useSelector((state) => state.entities.subs.byId[subname]);
	const dispatch = useDispatch();

	const { authenticated, user } = useSelector((state) => state.auth);
	const hasPermission = authenticated && (user?.isAdmin || user?.id === post?.user.id);

	if (!hasPermission) {
		history.push('/');
	}

	useEffect(() => {
		if (!sub) {
			dispatch(getSub(subname));
		}
		if (!post) {
			dispatch(getPost(id));
		}
	}, []);

	const submitPost = ({ title, body }) => {
		const editedPost = {
			id,
			title,
			subname,
		};
		if (body) {
			editedPost.body = body;
		}
		dispatch(editPost(editedPost));

		history.push(post.url);
	};

	if (!post || !sub) {
		return (
			<div className="pt-12">
				<p className="text-lg font-bold text-center">Loading...</p>
			</div>
		);
	}

	return (
		<div className="container flex pt-16">
			<div className="w-160">
				<div className="p-4 rounded bg-dark-400">
					<h1 className="text-lg">Submit a post to /r/{subname}</h1>
					<PostForm submitForm={submitPost} initialValues={{ title: post.title, body: post.body || '' }} />
				</div>
			</div>
			{sub && <SubSideBar sub={sub} isButtonVisible={false} />}
		</div>
	);
};

export default EditPost;
