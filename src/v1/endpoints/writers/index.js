import express from 'express';
import validate from 'is-express-schema-valid';
import { inviteSharedKey } from 'c0nfig';

import User from '../../models/User';
import errors from '../../../utils/errors';
import {
    signupSchema,
    loginSchema
} from './schema';
import {
    validateAccessToken,
    validateObjectId,
    validateUserRole
} from '../../../middleware';

export default function () {
    let writers = express.Router();

    writers.get('/',
        validateAccessToken,
        validateUserRole('writer'),
        returnAllWriters
    );

    writers.get('/:id',
        validateAccessToken,
        validateObjectId,
        validateUserRole('writer'),
        findWriterByEmail,
        returnWriter
    );

    writers.get('/:id/articles',
        validateAccessToken,
        validateObjectId,
        validateUserRole('writer'),
        returnWriterArtilces,
    );

    writers.post('/signup',
        validate(signupSchema),
        validateInviteCode,
        findWriterByEmail,
        signupWriter,
        generateAccessToken,
        returnWriter
    );

    writers.post('/login',
        validate(loginSchema),
        findWriterByEmail,
        loginWriter,
        generateAccessToken,
        returnWriter
    );
    writers.post('/login/facebook');

    function validateInviteCode (req, res, next) {
        const inviteCode = req.headers['x-invite-code'] || req.query.invite_code;
        if (inviteCode !== inviteSharedKey) {
            return next(new errors.Forbidden('No valid invitation code'));
        }
        next();
    }

    async function returnAllWriters (req, res, next) {
        try {
            const writers = await User.find({role: 'writer'});
            res.json(writers || []);
        } catch (err) {
            next(err);
        }
    }

    async function returnWriterArtilces (req, res, next) {
        try {
            const articles = await Artilce.find({author: req.userId });
            res.json(articles || []);
        } catch (err) {
            next(err);
        }
    }

    async function findWriterByEmail (req, res, next) {
        try {
            const email = req.email || req.body.email;
            req.user = await User.findOne({ email, role: 'writer' });
            next();
        } catch (err) {
            next(err);
        }
    }

    async function signupWriter (req, res, next) {
        if (req.user) {
            return next(new errors.BadRequest('Email is already registered'));
        }

        try {
            const data = Object.assign({}, req.body, {role: 'writer'});
            req.user = await User.create(data);
            next();
        } catch (err) {
            next(err);
        }
    }

    async function loginWriter (req, res, next) {
        if (!req.user) {
            return next();
        }

        try {
            const isSamePassword = await req.user.comparePassword(req.body.password);
            if (!isSamePassword) {
                return next(new errors.BadRequest('Password is not matching email address'));
            }
            next();
        } catch (err) {
            next(err);
        }
    }

    async function generateAccessToken (req, res, next) {
        if (!req.user) {
            return next();
        }

        try {
            req.accessToken = await User.generateAccessToken(req.user);
            next();
        } catch (err) {
            next(err);
        }
    }

    function returnWriter (req, res, next) {
        const { user } = req;

        if (!user) {
            return next(new errors.NotFound('User is not found'));
        }

        const data = req.accessToken ? { accessToken: req.accessToken, user } : user;
        res.json(data);
    }

    return writers;
}
