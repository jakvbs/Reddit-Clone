import { Link } from 'react-router-dom';

const Buttons = () => {
	return (
		<div className="hidden gap-6 md:flex">
			<Link to="/login" className="hollow gray button">
				Log In
			</Link>
			<Link to="/register" className="gray button">
				Sign Up
			</Link>
		</div>
	);
};

export default Buttons;
