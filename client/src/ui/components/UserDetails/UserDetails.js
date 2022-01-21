import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserPosts } from '../../../state/ducks/posts/operations';
import PostCard from '../PostCard';
import UserSideBar from './UserSideBar';

const UserDetails = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [userActivity] = useState([]);

    const dispatch = useDispatch();
    const posts = useSelector((state) =>
        state.entities.posts.byUserId[id]?.map((postId) => state.entities.posts.byId[postId])
    );

    useEffect(() => {
        Axios.get(`/users/${id}`)
            .then(({ data }) => setUserInfo(data))
            .catch((err) => setError(err.message));

        console.log(posts);
    }, []);

    useEffect(() => {
        if (!posts) {
            dispatch(getUserPosts(id));
        }
        console.log(posts);
    }, [posts]);

    if (error) {
        return (
            <div className="container flex pt-16">
                <div className="w-full px-4 md:w-160 md:p-0">
                    <p className="text-lg text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (!userActivity || !userInfo || !posts) {
        return (
            <div className="container flex pt-16">
                <div className="w-full px-4 md:w-160 md:p-0">
                    <p className="text-lg text-center">Loading..</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex pt-16">
            <div className="w-160">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
            <UserSideBar userInfo={userInfo} />
        </div>
    );
};

export default UserDetails;
