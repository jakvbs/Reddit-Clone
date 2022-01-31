import Axios from 'axios';
import { ConfirmProvider } from 'material-ui-confirm';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useMqttSub from './hooks/useMqttSub';
import Routes from './routes';
import { validateToken } from './state/ducks/auth/operations';
import store from './state/store';
import './styles/tailwind.css';
import NavBar from './ui/components/Navbar/NavBar';

Axios.defaults.baseURL = process.env.REACT_APP_API_URL;
Axios.defaults.withCredentials = true;

const App = () => {
	useMqttSub();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(validateToken());
	}, []);

	return (
		<Router>
			<ToastContainer />
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
