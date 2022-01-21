import { ChevronDownIcon, LoginIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useClickOutside from '../../../hooks/useClickOutside';
import { logout } from '../../../state/ducks/auth/operations';
import Avatar from '../../images/avatar.png';

const DropDown = () => {
    const history = useHistory();
    const [isDropdownVisivle, setIsDropdownVisivle] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const dropDownRef = useRef();

    const toggleUserDropdown = () => setIsDropdownVisivle(!isDropdownVisivle);

    useClickOutside(dropDownRef, () => isDropdownVisivle && setIsDropdownVisivle(false));

    return (
        <div ref={dropDownRef}>
            <button className="flex ml-4 rounded-md" onClick={() => toggleUserDropdown()} type="button">
                {!user && <UserIcon className="w-6 h-6 m-1 text-dark-icon" />}
                {user && (
                    <div className="w-8 h-8 rounded-md">
                        <img src={Avatar} alt="" style={{ filter: 'invert(100%)' }} className="block" />
                    </div>
                )}

                <ChevronDownIcon className="w-5 h-5 m-1 mt-2 text-dark-icon" />
            </button>
            {isDropdownVisivle && (
                <div className="absolute right-0 z-10 overflow-hidden border border-dark-400 text-dark-100 top-8 bg-dark-100">
                    {user && <span className="block px-3 py-2 text-sm bg-dark-400 w-50">Hello, {user.username}!</span>}
                    {!user && (
                        <button
                            onClick={() => {
                                toggleUserDropdown();
                                history.push('/login');
                            }}
                            className="flex px-3 py-2 text-sm bg-dark-400 w-50 hover:bg-dark-100 hover:text-black"
                            type="button"
                        >
                            <LoginIcon className="w-5 h-5 mr-2" />
                            Log In / Sign Up
                        </button>
                    )}
                    {user && (
                        <button
                            onClick={() => {
                                toggleUserDropdown();
                                dispatch(logout());
                            }}
                            className="flex block px-3 py-2 text-sm w-full bg-dark-400 border-dark-300 hover:bg-gray-300 hover:text-black"
                            type="button"
                        >
                            <LogoutIcon className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropDown;
