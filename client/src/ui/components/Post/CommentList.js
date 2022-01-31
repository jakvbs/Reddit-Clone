import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import CommentCard from './CommentCard';

dayjs.extend(relativeTime);

const CommentList = ({ comments }) => {
	if (!comments?.length) {
		return null;
	}

	return comments.map((comment) => <CommentCard key={comment.id} comment={comment} />);
};

CommentList.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

CommentList.defaultProps = {
	comments: [],
};

export default CommentList;
