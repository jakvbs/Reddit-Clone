import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="flex flex-col items-center pt-12">
			<h1 className="mt-10 mb-4 text-5xl text-gray-800">Page Not Found</h1>
			<Link to="/" className="px-4 py-2 gray button">
				Home
			</Link>
		</div>
	);
};

export default NotFound;
