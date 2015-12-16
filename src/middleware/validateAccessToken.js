import User from '../v1/models/User';
import errors from '../utils/errors';
import config from 'c0nfig';

const authCookieName = config.auth.cookieName;

export default function (req, res, next) {
    let token = req.headers['x-access-token'] || req.query.accessToken || (authCookieName && req.cookies[authCookieName]);

    if (!token) {
        return next(new errors.Unauthorized('Access token is missing'));
    }

    const userData = User.validateAccessToken(token);
    if (!userData) {
        return next(new errors.Unauthorized('User is not authorized'));
    }

    req.userId = userData._id;
    req.email = userData.email;
    req.userRole = userData.role;

    next();
}
