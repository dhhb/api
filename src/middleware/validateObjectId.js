import mongoose from 'mongoose';
import errors from '../utils/errors';

export default function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new errors.BadRequest('Invalid id'));
    }
    next();
}
