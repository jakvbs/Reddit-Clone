import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Buttons = () => {
    const { authenticated, loading } = useSelector((state) => state.auth);

    return (
        <div className="hidden gap-6 md:flex">
            {loading || authenticated || (
                <>
                    <Link to="/login" className="hollow gray button">
                        Log In
                    </Link>
                    <Link to="/register" className="gray button">
                        Sign Up
                    </Link>
                </>
            )}
        </div>
    );
};

export default Buttons;
