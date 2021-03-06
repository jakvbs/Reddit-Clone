import PropTypes from 'prop-types';
import PostCard from '../PostCard';

const PostList = ({ postsLoading, postsErrors, posts }) => {
	if (postsLoading) {
		return <p className="text-lg font-bold text-center">Loading..</p>;
	}

	if (postsErrors && Object.keys(postsErrors).length) {
		return <p className="text-lg font-bold text-center">While loading posts, an error occurred.</p>;
	}

	if (posts?.length === 0) {
		return <p className="text-lg font-bold text-center">No posts submitted yet.</p>;
	}

	return posts?.map((post) => <PostCard key={post.id} post={post} />);
};

PostList.propTypes = {
	postsLoading: PropTypes.bool.isRequired,
	postsErrors: PropTypes.instanceOf(Object),
	posts: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

PostList.defaultProps = {
	posts: [],
	postsErrors: {},
};

export default PostList;
