import Axios from 'axios';
import { ConfirmProvider } from 'material-ui-confirm';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import { validateToken } from './state/ducks/auth/operations';
import store from './state/store';
import './styles/icons.css';
import './styles/tailwind.css';
import NavBar from './ui/components/Navbar/NavBar';

Axios.defaults.baseURL = process.env.REACT_APP_API_URL;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(validateToken());
    }, []);

    return (
        <Router>
            <NavBar />
            <Routes />
        </Router>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfirmProvider>
                <App />
            </ConfirmProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
