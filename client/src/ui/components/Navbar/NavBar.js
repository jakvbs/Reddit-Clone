import { Link } from 'react-router-dom';
import RedditLogo from '../../images/reddit-logo.svg';
import Buttons from './Buttons';
import DropDown from './DropDown';
import SearchInput from './SearchInput';

const NavBar = () => {
    return (
        <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 border-b border-dark-300 bg-dark-400">
            <div className="flex">
                <Link to="/">
                    <img className="w-8 h-8 mr-2 max-w-none" alt="Reddit Logo" src={RedditLogo} />
                </Link>
                <span className="hidden text-2xl font-semibold text-dark-100 lg:block">
                    <Link to="/">ugedit</Link>
                </span>
            </div>
            <SearchInput />
            <div className="flex flex-row">
                <Buttons />
                <DropDown />
            </div>
        </nav>
    );
};

export default NavBar;
