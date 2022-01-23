import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getPostComments, voteComment } from '../../../state/ducks/comments/operations';
import { getPost, votePost } from '../../../state/ducks/posts/operations';
import ActionButton from '../ActionButton';
import SubSideBar from '../SubSideBar';
import Banner from './Banner';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
import VoteSection from './VoteSection';

dayjs.extend(relativeTime);

const PostDetails = () => {
    const { authenticated, user } = useSelector((state) => state.auth);

    const history = useHistory();
    const { sub: subname, id } = useParams();
    const dispatch = useDispatch();

    const post = useSelector((state) => state.entities.posts.byId[id]);
    const comments = useSelector((state) =>
        state.entities.comments.byPostId[id]?.map((commentId) => state.entities.comments.byId[commentId])
    );

    const hasPermission = authenticated && (user?.isAdmin || user?.id === post?.user.id);

    useEffect(() => {
        if (!post) {
            dispatch(getPost(id));
        }
        if (!comments) {
            dispatch(getPostComments(id));
        }
    }, [id]);

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
    };

    if (!post) {
        return null;
    }

    return (
        <>
            <Banner post={post} subname={subname} />
            <div className="container flex px-4 pt-5">
                {/* Post */}
                <div className="w-160">
                    <div className="rounded bg-dark-400">
                        {post && (
                            <>
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
                                            <Link to={post.url}>
                                                <ActionButton>
                                                    <i className="mr-1 fas fa-comment-alt fa-xs" />
                                                    <span className="font-bold">{comments?.length || 0} Comments</span>
                                                </ActionButton>
                                            </Link>
                                            {hasPermission && (
                                                <Link
                                                    to={`${post.url}/edit`}
                                                    className="w-20 ml-2 text-gray-100 bg-blue-500 button"
                                                    type="button"
                                                >
                                                    Edit post
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <CommentCreate />
                                <CommentList comments={comments} vote={vote} />
                            </>
                        )}
                    </div>
                </div>
                {post && <SubSideBar sub={post.sub} isButtonVisible />}
            </div>
        </>
    );
};

export default PostDetails;
