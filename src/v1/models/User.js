import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import config from 'c0nfig';
import createdModifiedPlugin from '../../utils/mongooseCreatedModifiedPlugin';
import pick from 'lodash/object/pick';

const { userRoles, env } = config;
const { hashRounds } = config.bcrypt;
const { signKey, tokenTTL, resetPasswordTTL } = config.auth;

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
        required: 'Password is required'
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
            values: userRoles,
            message: 'Value "{VALUE}" is not valid for field "{PATH}"'
        },
        default: 'reader'
    }
});

function storePassword (next) {
    let user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(hashRounds, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
}

function comparePassword (passwordToCompare) {
    return new Promise((resolve, reject) => {
        if (!passwordToCompare) {
            return resolve(false);
        }

        let { password } = this;
        bcrypt.compare(passwordToCompare, password, (err, same) => {
            return err ? reject(err) : resolve(same);
        });
    });
}

function generateAccessToken (user) {
    const userJWTData = {
        _id: user._id,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(userJWTData, signKey, {expiresIn: tokenTTL / 1000});
    const tokenBase64 = new Buffer(token).toString('base64');

    return tokenBase64;
}

function validateAccessToken (token) {
    try {
        const decoded = new Buffer(token, 'base64').toString();
        const userObj = jwt.verify(decoded, signKey);
        return userObj;
    } catch(err) {
        if (env !== 'test') {
            console.error(err);
        }
    }

    return false;
}

UserSchema.statics.generateAccessToken = generateAccessToken;
UserSchema.statics.validateAccessToken = validateAccessToken;

UserSchema.methods.comparePassword = comparePassword;

UserSchema.pre('save', storePassword);

if (env === 'production') {
    UserSchema.set('autoIndex', false);
}

UserSchema.set('toJSON', {
    versionKey: false,
    transform: (doc, ret) => {
        const publicUser = pick(ret, ['_id', 'email', 'role', 'name', 'profileImage']);
        return publicUser;
    }
});
UserSchema.plugin(createdModifiedPlugin, { index: true });

const User = mongoose.model('User', UserSchema);

export default User;
