import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { deleteComment, voteComment } from '../../../state/ducks/comments/operations';

dayjs.extend(relativeTime);

const CommentList = ({ comments }) => {
    const history = useHistory();
    const confirm = useConfirm();
    const dispatch = useDispatch();
    const { authenticated, user } = useSelector((state) => state.auth);
    const { voteLoading } = useSelector((state) => state.comments);

    const hasPermission = (comment) => authenticated && (user?.isAdmin || user?.id === comment.user.id);

    const handleVote = (comment, value) => {
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

    const handleDeleteComment = (commentId) => {
        confirm({
            description: 'Are you sure you want to delete this comment?',
        })
            .then(() => {
                dispatch(deleteComment(commentId));
            })
            .catch(() => {});
    };

    if (!comments.length) {
        return null;
    }

    return comments.map((comment) => (
        <div className="flex mb-4 border-t" key={comment.id}>
            {/* Vote section */}
            <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                {/* Upvote */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-red-500"
                    onClick={() => handleVote(comment, 1)}
                >
                    <i
                        className={classNames('icon-arrow-up', {
                            'text-red-500': comment.userVote === 1,
                        })}
                    />
                </div>
                <p className="text-xs font-bold">{comment.voteScore}</p>
                {/* Downvote */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-blue-600"
                    onClick={() => handleVote(comment, -1)}
                >
                    <i
                        className={classNames('icon-arrow-down', {
                            'text-blue-600': comment.userVote === -1,
                        })}
                    />
                </div>
            </div>
            <div className="py-2 pr-2">
                <p className="mb-1 text-xs leading-none">
                    <Link to={`/user/${comment.user.id}`} className="mr-1 font-bold hover:underline">
                        {comment.user.username}
                    </Link>
                    <span className="flex items-center text-gray-600">
                        {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                        {hasPermission(comment) && (
                            <button
                                className="w-16 ml-2 text-gray-100 bg-red-600 button"
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                            >
                                Delete
                            </button>
                        )}
                    </span>
                </p>
                <p>{comment.body}</p>
            </div>
        </div>
    ));
};

CommentList.propTypes = {
    comments: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
    vote: PropTypes.func.isRequired,
};

CommentList.defaultProps = {
    comments: [],
};

export default CommentList;
