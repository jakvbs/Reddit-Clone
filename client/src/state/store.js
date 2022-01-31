import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { authReducer } from './ducks/auth/reducers';
import { commentReducer } from './ducks/comments/reducers';
import { entities } from './ducks/entities/reducers';
import { postReducer } from './ducks/posts/reducers';
import { subReducer } from './ducks/subs/reducers';

const middlewares = [thunk, apiMiddleware];
if (process.env.NODE_ENV !== 'production') {
	middlewares.push(logger);
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
	entities,
	auth: authReducer,
	subs: subReducer,
	posts: postReducer,
	comments: commentReducer,
});

const store = createStore(combinedReducers, composeEnhancers(applyMiddleware(...middlewares)));

export default store;
