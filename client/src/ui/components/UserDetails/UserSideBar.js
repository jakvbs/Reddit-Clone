import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const UserSideBar = ({ userInfo }) => {
	return (
		<div className="ml-6 w-80">
			<div className="bg-dark-400 border border-dark-50 rounded">
				<div className="p-3 bg-blue-banner rounded-t">
					<img
						src={userInfo.imageUrl}
						alt="user avatar"
						className="w-16 h-16 mx-auto border-2 border-white rounded-full"
					/>
				</div>
				<div className="p-3 text-center">
					<h1 className="mb-3 text-xl">{userInfo.username}</h1>
					<hr />
					<p className="mt-3">Joined {dayjs(userInfo.createdAt).format('MMM YYYY')}</p>
				</div>
			</div>
		</div>
	);
};

UserSideBar.propTypes = {
	userInfo: PropTypes.instanceOf(Object).isRequired,
};

export default UserSideBar;
