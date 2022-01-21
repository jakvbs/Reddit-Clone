import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getSubPosts } from '../../../state/ducks/posts/operations';
import { getSub } from '../../../state/ducks/subs/operations';
import SubSideBar from '../SubSideBar';
import Banner from './Banner';
import PostList from './PostList';

const SubDetails = () => {
    const history = useHistory();
    const { sub: subname } = useParams();

    const dispatch = useDispatch();
    const sub = useSelector((state) => state.entities.subs.byId[subname]);
    const posts = useSelector((state) =>
        state.entities.posts.bySubName[subname]?.map((id) => state.entities.posts.byId[id])
    );
    const { errors: subErrors } = useSelector((state) => state.subs);
    const { errors: postsErrors, loading: postsLoading } = useSelector((state) => state.posts);

    useEffect(() => {
        if (!sub) {
            dispatch(getSub(subname));
        }
        if (!posts?.length) {
            dispatch(getSubPosts(subname));
        }
    }, [subname]);

    const redirectToHomePage = () => {
        setInterval(() => {
            history.push('/');
        }, 2000);
    };

    if (!sub) {
        return (
            <div className="pt-12">
                <p className="text-lg text-center">Loading...</p>
            </div>
        );
    }

    if (Object.keys(subErrors).length) {
        redirectToHomePage();
        return (
            <div className="pt-12">
                <p className="text-lg text-center">
                    An error occurred while loading the sub. You will be redirected to the home page in 2 seconds.
                </p>
            </div>
        );
    }

    return (
        <div className="pt-12">
            {sub && (
                <>
                    <Banner sub={sub} />
                    <div className="container flex pt-5">
                        <div className="mx-2 w-160">
                            <PostList postsLoading={postsLoading} postsErrors={postsErrors} posts={posts} />
                        </div>
                        <SubSideBar sub={sub} isButtonVisible />
                    </div>
                </>
            )}
        </div>
    );
};

export default SubDetails;
