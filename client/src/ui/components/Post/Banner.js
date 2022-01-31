import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Post } from '../../../types';

const Banner = ({ post, subname }) => {
	return (
		<div className="pt-12">
			<Link to={`/r/${subname}`}>
				<div className="flex items-center p-8 w-full h-20 bg-blue-banner">
					<div className="container flex">
						{post && (
							<div className="overflow-hidden mr-2 w-8 h-8 rounded-full">
								<img src={post.sub.imageUrl} alt="sub" />
							</div>
						)}
						<p className="text-xl font-semibold text-white">/r/{subname}</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

Banner.propTypes = {
	post: Post.isRequired,
	subname: PropTypes.string.isRequired,
};

export default Banner;
