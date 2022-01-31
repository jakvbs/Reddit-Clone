import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import RedditLogo from '../../images/reddit-logo.svg';
import Buttons from './Buttons';
import DropDown from './DropDown';
import SearchInput from './SearchInput';

const NavBar = () => {
	const { authenticated, loading } = useSelector((state) => state.auth);

	return (
		<nav className="flex fixed inset-x-0 top-0 z-10 justify-between items-center px-5 h-12 border-b border-dark-300 bg-dark-400">
			<div className="flex">
				<Link to="/">
					<img className="mr-2 w-8 max-w-none h-8" alt="Reddit Logo" src={RedditLogo} />
				</Link>
				<span className="hidden text-2xl font-semibold text-dark-100 lg:block">
					<Link to="/">ugedit</Link>
				</span>
			</div>

			<SearchInput />
			<div className="flex flex-row">
				{authenticated || loading || <Buttons />}
				<DropDown />
			</div>
		</nav>
	);
};

export default NavBar;
