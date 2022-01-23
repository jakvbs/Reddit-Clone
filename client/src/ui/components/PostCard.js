import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { deletePost, votePost } from '../../state/ducks/posts/operations';
import { Post } from '../../types';
import ActionButton from './ActionButton';

dayjs.extend(relativeTime);

const PostCard = ({ post: { id, title, body, createdAt, voteScore, commentCount, userVote, url, user, sub } }) => {
    const confirm = useConfirm();
    const history = useHistory();
    const dispatch = useDispatch();
    const { authenticated, user: loggedUser } = useSelector((state) => state.auth);
    const { sub: subParam } = useParams();

    const realCommentCount = useSelector((state) => state.entities.comments.byPostId[id]?.length) || commentCount;

    const isInSubPage = sub.name === subParam;

    const hasPermission = authenticated && (loggedUser?.isAdmin || loggedUser?.id === user.id);

    const handleVote = (value) => {
        if (!authenticated) {
            history.push('/login');
            return;
        }

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
        <div className="flex mb-4 border rounded border-dark-50 bg-dark-400 hover:border-gray-50" id={id}>
            {/* Vote section */}
            <div className="w-10 py-3 text-center rounded-l bg-dark-700">
                {/* Upvote */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-dark-75 hover:text-red-500"
                    onClick={() => handleVote(1)}
                >
                    <i
                        className={classNames('icon-arrow-up', {
                            'text-red-500': authenticated && userVote === 1,
                        })}
                    />
                </div>
                <p className="text-xs font-bold">{voteScore}</p>
                {/* Downvote */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-dark-75 hover:text-blue-600"
                    onClick={() => handleVote(-1)}
                >
                    <i
                        className={classNames('icon-arrow-down', {
                            'text-blue-600': authenticated && userVote === -1,
                        })}
                    />
                </div>
            </div>
            {/* Post data section */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    {!isInSubPage && (
                        <>
                            <Link to={`/r/${sub.name}`}>
                                <img
                                    src={sub.imageUrl}
                                    className="w-6 h-6 mr-1 rounded-full cursor-pointer"
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
                            /user/{user.username}
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
                            <i className="mr-1 fas fa-comment-alt fa-xs" />
                            <span className="font-bold">{realCommentCount} Comments</span>
                        </ActionButton>
                    </Link>
                    {hasPermission && (
                        <button
                            className="w-16 ml-2 text-gray-100 bg-red-600 button"
                            type="button"
                            onClick={handleDeletePost}
                        >
                            Delete
                        </button>
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
