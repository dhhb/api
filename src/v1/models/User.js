import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import createdModifiedPlugin from '../../utils/mongooseCreatedModifiedPlugin';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required',
        validate: [validator.isEmail, 'Please fill a valid email address']
    },

    password: {
        type: String,
        validate: [ensurePassword, 'Password is required']
    },

    name: {
        type: String,
        required: 'Name is required'
    },

    profileImage: {
        url: String
    },

    role: {
        type: String,
        required: 'User role is required',
        enum: {
            values: ['superuser', 'writer', 'reader'],
            message: 'Value "{VALUE}" is not valid for field "{PATH}"'
        },
        default: 'reader'
    }
});

if (env === 'production') {
    UserSchema.set('autoIndex', false);
}
UserSchema.plugin(createdModifiedPlugin, { index: true });

const User = mongoose.model('User', UserSchema);

export default User;
