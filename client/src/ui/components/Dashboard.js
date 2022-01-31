import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Waypoint } from 'react-waypoint';
import useAxios from '../../hooks/useAxios';
import { changeSortOrder, getPostsPage } from '../../state/ducks/posts/operations';
import PostCard from './PostCard';

const sortOptions = [
	{ value: { sort: 'createdAt', order: 'desc' }, label: 'By date descending' },
	{ value: { sort: 'createdAt', order: 'asc' }, label: 'By date ascending' },
	{ value: { sort: 'voteScore', order: 'desc' }, label: 'By vote descending' },
	{ value: { sort: 'voteScore', order: 'asc' }, label: 'By vote ascending' },
];

const Dashboard = () => {
	const { data: topSubs, isPending, error } = useAxios('/subs?sort=postsCount&order=desc&limit=8');
	const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0].value);

	const dispatch = useDispatch();
	const { pageNumber } = useSelector((state) => state.posts);
	const posts = useSelector((state) => state.entities.posts.allIds.map((id) => state.entities.posts.byId[id]));
	const { authenticated } = useSelector((state) => state.auth);
	const { loading, errors } = useSelector((state) => state.posts);

	useEffect(() => {
		dispatch(changeSortOrder(selectedSortOption));
	}, []);

	const fetchMore = () => {
		dispatch(getPostsPage(pageNumber, selectedSortOption));
	};

	const handleSortChange = (selectedOption) => {
		if (selectedOption.value !== selectedSortOption) {
			dispatch(changeSortOrder(selectedOption.value));
			setSelectedSortOption(selectedOption.value);
		}
	};

	return (
		<main className="container flex pt-16">
			<div className="w-full px-4 md:w-160 md:p-0">
				<Select
					className="w-64 mb-4 text-black"
					options={sortOptions}
					defaultValue={sortOptions[0]}
					onChange={handleSortChange}
				/>
				{posts.map((post, i) => (
					<Fragment key={post.id}>
						<PostCard post={post} />
						{i === posts.length - 4 && <Waypoint onEnter={() => fetchMore()} />}
					</Fragment>
				))}
				{loading && <p className="text-lg text-center">Loading..</p>}
				{errors && Object.keys(errors)?.length ? <p className="text-lg text-center">Error..</p> : null}
			</div>
			<div className="hidden ml-6 md:block w-80">
				<div className="border rounded bg-dark-400 border-dark-border">
					<div className="p-4 border-b-2 border-dark-border">
						<p className="text-lg font-semibold text-center">Top Communities</p>
					</div>
					<div className="text-center">
						{/* eslint-disable-next-line no-nested-ternary */}
						{isPending ? (
							<div>Loading...</div>
						) : error ? (
							<div>An error has occurred</div>
						) : (
							topSubs?.map((sub) => (
								<div
									key={sub.name}
									className="flex items-center px-4 py-2 text-xs border-b border-dark-border"
								>
									<Link to={`/r/${sub.name}`}>
										<img src={sub.imageUrl} className="w-6 rounded-full cursor-pointer" alt="Sub" />
									</Link>
									<Link to={`/r/${sub.name}`} className="ml-2 font-bold hover:cursor-pointer">
										/r/{sub.name}
									</Link>
									<p className="ml-auto font-med">{sub.postsCount} posts</p>
								</div>
							))
						)}
					</div>
					{authenticated && (
						<div className="p-4 border-t-2 border-dark-border">
							<Link to="/subs/create" className="w-full px-2 py-1 gray button">
								Create Community
							</Link>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
