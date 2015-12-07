import { userRoles } from 'c0nfig';
import errors from '../utils/errors';
import User from '../v1/models/User';

export default function (role) {
    const roles = Array.isArray(role) ? role : (role ? [role] : userRoles);

    async function validateUserRole (req, res, next) {
        if (!req.email) {
            return next();
        }

        try {
            if (!req.userRole) {
                req.user = await User.findOne({email: req.email});
            }
            const userRole = req.userRole || req.user.role;
            if (userRole === 'superuser') {
                return next();
            }
            if (roles.indexOf(userRole) === -1) {
                let rolesString = roles.length > 1 ? roles.join(', ') : roles[0];
                return next(new errors.Forbidden(`Only ${rolesString} have permission to execute this operation`));
            }
            next();
        } catch (err) {
            next(err);
        }
    };

    if (role) {
        return validateUserRole;
    } else {
        return validateUserRole.apply(this, arguments);
    }
}
