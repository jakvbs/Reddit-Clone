import PropTypes from 'prop-types';

const ActionButton = ({ children }) => {
    return (
        <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-dark-75">{children}</div>
    );
};

ActionButton.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default ActionButton;
