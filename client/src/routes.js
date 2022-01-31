import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './ui/components/Dashboard';
import Login from './ui/components/Login/Login';
import NotFound from './ui/components/NotFound';
import CreatePost from './ui/components/Post/CreatePost';
import EditPost from './ui/components/Post/EditPost';
import PostDetails from './ui/components/Post/PostDetails';
import Register from './ui/components/Register/Register';
import Settings from './ui/components/Settings/Settings';
import CreateSub from './ui/components/Sub/CreateSub';
import SubPage from './ui/components/Sub/SubDetails';
import UserDetails from './ui/components/UserDetails/UserDetails';

const Switches = () => {
	const { authenticated } = useSelector((state) => state.auth);

	return (
		<Switch>
			<Route path="/" exact>
				<Dashboard />
			</Route>

			<Route path="/user/:id">
				<UserDetails />
			</Route>

			<Route path="/subs/create">
				<CreateSub />
			</Route>

			<Route path="/r/:sub/comments/:id/edit">
				<EditPost />
			</Route>

			<Route path="/r/:sub/comments/:id">
				<PostDetails />
			</Route>

			<Route path="/r/:sub/submit">
				<CreatePost />
			</Route>

			<Route path="/r/:sub">
				<SubPage />
			</Route>

			<Route path="/settings">{authenticated ? <Settings /> : <Redirect to="/login" />}</Route>

			<Route path="/register" exact>
				{authenticated ? <Redirect to="/" /> : <Register />}
			</Route>

			<Route path="/login" exact>
				{authenticated ? <Redirect to="/" /> : <Login />}
			</Route>

			<Route path="*">
				<NotFound />
			</Route>
		</Switch>
	);
};

export default Switches;
