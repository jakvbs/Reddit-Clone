import _ from 'lodash';
import qs from 'qs';
import Post from '../models/Post';
import Sub from '../models/Sub';
import User from '../models/User';

const getFilters = (model) => (req, _res, next) => {
    const availableFilters = Object.keys(model.schema.paths);
    const allFilters = qs.parse(req.query);

    const filters = _.pick(allFilters, availableFilters);

    const schemaFilters = _.mapValues(filters, (value) => new RegExp(value, 'gi'));

    req.filters = schemaFilters;
    next();
};

export const getSubFilters = getFilters(Sub);
export const getPostFilters = getFilters(Post);
export const getUserFilters = getFilters(User);
