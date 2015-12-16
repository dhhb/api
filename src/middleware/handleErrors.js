const ErrorHandlers = {
    'SchemaValidationError'(err) {
        let { errors } = err;

        errors = Object.keys(errors)
            .reduce((memo, key) => {
                return memo.concat(errors[key]);
            }, [])
            .map(err => {
                return { field: err.key, message: err.message };
            });

        return { status: 400, errors };
    },

    'ValidationError'(err) {
        let { errors } = err;

        if (!errors) {
            return [{message: 'Validation Error'}];
        }

        errors = Object.keys(errors).map(key => {
            return { field: key, message: errors[key].message };
        });

        return { status: 400, errors };
    },

    'MongoError'(err) {
        if (err.code === 11000) {
            let errors = [{message: 'Instance has unique index and is already created in database'}];
            return { status: 409, errors };
        }

        return defaultHandler(err);
    }
};

function defaultHandler (err) {
    let status = err.status || 500;
    let errors = Array.isArray(err) ? err : [err];

    if (status === 500) {
        console.error(err.stack);
        errors = [{message: 'Internal Server Error'}];
    }

    return { status, errors };
}

// http://jsonapi.org/format/#errors
export default function (err, req, res, next) { // eslint-disable-line no-unused-vars
    let errorHandler = ErrorHandlers[err.name] || defaultHandler;
    let { status, errors } = errorHandler(err);
    res.status(status).json({ errors });
}
