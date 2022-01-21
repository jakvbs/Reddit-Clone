import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { voteComment } from '../../../state/ducks/comments/operations';
import { votePost } from '../../../state/ducks/posts/operations';

dayjs.extend(relativeTime);

const VoteSection = () => {
    const history = useHistory();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { authenticated } = useSelector((state) => state.auth);
    const post = useSelector((state) => state.entities.posts.byId[id]);

    const vote = async (value, comment) => {
        // If not logged in go to login
        if (!authenticated) {
            history.push('/login');
            return;
        }

        // If vote is the same reset vote
        let newValue = value;
        if ((!comment && value === post.userVote) || (comment && comment.userVote === value)) newValue = 0;

        if (comment) {
            await dispatch(
                voteComment({
                    postId: id,
                    commentId: comment ? comment.id : null,
                    value: newValue,
                })
            );
            return;
        }
        await dispatch(votePost({ postId: id, value: newValue }));

        console.log('%cVoted!!!!!!!!!!!!!', 'color: green');
    };

    if (!post) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="alert alert-danger">
                            <strong>Error!</strong> Post not found.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
            <div
                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-red-500"
                onClick={() => vote(1)}
            >
                <i
                    className={classNames('icon-arrow-up', {
                        'text-red-500': post.userVote === 1,
                    })}
                />
            </div>
            <p className="text-xs font-bold">{post.voteScore}</p>
            <div
                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-blue-600"
                onClick={() => vote(-1)}
            >
                <i
                    className={classNames('icon-arrow-down', {
                        'text-blue-600': post.userVote === -1,
                    })}
                />
            </div>
        </div>
    );
};

export default VoteSection;
