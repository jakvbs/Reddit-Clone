import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { addPost, getSubPosts } from '../../../state/ducks/posts/operations';
import { getSub } from '../../../state/ducks/subs/operations';
import SubSideBar from '../SubSideBar';
import PostForm from './PostForm';

const CreatePost = () => {
    const history = useHistory();
    const { sub: subname } = useParams();

    const posts = useSelector((state) =>
        state.entities.posts.bySubName[subname]?.map((id) => state.entities.posts.byId[id])
    );
    const sub = useSelector((state) => state.entities.subs.byId[subname]);
    const { errors: subErrors } = useSelector((state) => state.subs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sub) {
            dispatch(getSub(subname));
        }
        if (!posts?.length) {
            dispatch(getSubPosts(subname));
        }
    }, []);

    const submitPost = ({ title, body }) => {
        const post = {
            title,
            subname,
        };
        if (body) {
            post.body = body;
        }
        dispatch(addPost(post));

        history.push(`/r/${sub.name}`);
    };

    if (Object.keys(subErrors).length) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="alert alert-danger">
                            <strong>Error!</strong> {subErrors.message}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex pt-16">
            <div className="w-160">
                <div className="p-4 rounded bg-dark-400">
                    <h1 className="text-lg">Submit a post to /r/{subname}</h1>
                    <PostForm submitForm={submitPost} />
                </div>
            </div>
            {sub && <SubSideBar sub={sub} isButtonVisible={false} />}
        </div>
    );
};

export default CreatePost;
