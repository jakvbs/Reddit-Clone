import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { votePost } from '../../../state/ducks/posts/operations';

dayjs.extend(relativeTime);

const VoteSection = () => {
	const history = useHistory();
	const { id } = useParams();
	const dispatch = useDispatch();
	const { authenticated } = useSelector((state) => state.auth);
	const post = useSelector((state) => state.entities.posts.byId[id]);
	const { voteLoading } = useSelector((state) => state.posts);

	const handleVote = (value) => {
		if (!authenticated) {
			history.push('/login');
			return;
		}
		if (voteLoading) return;

		let newValue = value;
		if (value === post.userVote) newValue = 0;

		dispatch(votePost({ postId: id, value: newValue }));
	};

	return (
		<div className="flex-shrink-0 py-2 w-10 text-center rounded-l">
			<div
				className="mx-auto w-6 text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-red-500"
				onClick={() => handleVote(1)}
			>
				<ArrowSmUpIcon
					className={classNames({
						'text-red-500': post.userVote === 1,
					})}
				/>
			</div>
			<p className="text-xs font-bold">{post.voteScore}</p>
			<div
				className="mx-auto w-6 text-gray-400 rounded cursor-pointer hover:bg-dark-icon_hover hover:text-blue-600"
				onClick={() => handleVote(-1)}
			>
				<ArrowSmDownIcon
					className={classNames({
						'text-blue-600': post.userVote === -1,
					})}
				/>
			</div>
		</div>
	);
};

export default VoteSection;
