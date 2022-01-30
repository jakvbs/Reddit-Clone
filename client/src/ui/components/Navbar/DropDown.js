import { ChevronDownIcon, LoginIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useClickOutside from '../../../hooks/useClickOutside';
import { logout } from '../../../state/ducks/auth/operations';
import Avatar from '../../images/avatar.png';

const DropDown = () => {
    const history = useHistory();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const dropDownRef = useRef();

    const toggleUserDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    useClickOutside(dropDownRef, () => isDropdownVisible && setIsDropdownVisible(false));

    return (
        <div ref={dropDownRef}>
            <button
                className={classNames('flex ml-4 rounded-md hover:outline outline-1 outline-dark-border', {
                    outline: isDropdownVisible,
                })}
                onClick={() => toggleUserDropdown()}
                type="button"
            >
                {!user && <UserIcon className="m-1 w-6 h-6 text-dark-icon" />}
                {user && (
                    <div className="w-8 h-8 rounded-md">
                        <img src={Avatar} alt="" style={{ filter: 'invert(100%)' }} className="block" />
                    </div>
                )}

                <ChevronDownIcon className="m-1 mt-2 w-5 h-5 text-dark-icon" />
            </button>

            {isDropdownVisible && (
                <div className="overflow-hidden absolute right-0 top-8 z-10 border border-dark-400 text-dark-100 bg-dark-100">
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
                            <LoginIcon className="mr-2 w-5 h-5" />
                            Log In / Sign Up
                        </button>
                    )}
                    {user && (
                        <button
                            onClick={() => {
                                toggleUserDropdown();
                                dispatch(logout());
                            }}
                            className="block flex px-3 py-2 w-full text-sm bg-dark-400 border-dark-300 hover:bg-gray-300 hover:text-black"
                            type="button"
                        >
                            <LogoutIcon className="mr-2 w-5 h-5" />
                            Logout
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropDown;
