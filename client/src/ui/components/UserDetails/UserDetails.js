import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import { getUserPosts } from '../../../state/ducks/posts/operations';
import PostCard from '../PostCard';
import UserSideBar from './UserSideBar';

const UserDetails = () => {
	const { id } = useParams();
	const history = useHistory();

	const dispatch = useDispatch();
	const posts = useSelector((state) =>
		state.entities.posts.byUserId[id]?.map((postId) => state.entities.posts.byId[postId])
	);

	const { data: userInfo, isPending, error } = useAxios(`/users/${id}`);

	useEffect(() => {
		if (!posts) {
			dispatch(getUserPosts(id));
		}
	}, [id]);

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

	if (!userInfo || isPending) {
		return (
			<div className="pt-12">
				<p className="text-lg font-bold text-center">Loading...</p>
			</div>
		);
	}

	return (
		<div className="container flex pt-16">
			<div className="w-160">
				{posts?.length ? posts.map((post) => <PostCard key={post.id} post={post} />) : 'The is no posts yet.'}
			</div>
			<UserSideBar userInfo={userInfo} />
		</div>
	);
};

export default UserDetails;
