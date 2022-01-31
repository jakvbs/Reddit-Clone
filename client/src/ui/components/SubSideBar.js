import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sub as subType } from '../../types';

const SubSideBar = ({ sub, isButtonVisible }) => {
	const { authenticated } = useSelector((state) => state.auth);

	return (
		<div className="hidden ml-6 md:block w-80">
			<div className="bg-dark-400 rounded">
				<p className="font-semibold text-dark-banner pt-3 pl-3">About Community</p>
				<div className="mt-4 p-3">
					<p className="mb-3 text-md">{sub.description}</p>
					<div className="border-t border-b mt-3 mb-2">
						<p className="my-3">
							<i className="mr-2 fas fa-birthday-cake" />
							Created {dayjs(sub.createdAt).format('D MMM YYYY')}
						</p>
						{authenticated && isButtonVisible && (
							<Link to={`/r/${sub.name}/submit`} className="w-full py-1 text-sm gray button mb-4">
								Create Post
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

SubSideBar.propTypes = {
	sub: subType.isRequired,
	isButtonVisible: PropTypes.bool.isRequired,
};

export default SubSideBar;
