import express from 'express';
import validate from 'is-express-schema-valid';

import Topic from '../../models/User';
import errors from '../../../utils/errors';
import {
    validateAccessToken,
    validateUserRole
} from '../../../middleware';
import {
    createTopicSchema
} from './schema';


export default function () {
    let topics = express.Router();

    topics.get('/',
        returnTopics
    );

    topics.post('/',
        validateAccessToken,
        validateUserRole('superuser'),
        createTopic
    );

    async function returnTopic (req, res, next) {

    }

    async function createTopic (req, res, next) {

    }

    return topics;
}
