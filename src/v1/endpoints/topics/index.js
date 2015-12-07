import express from 'express';
import {
    validateAccessToken,
    validateUserRole
} from '../../../middleware';


export default function () {
    let topics = express.Router();

    topics.get('/',
        returnTopics
    );

    topics.post('/',
        validateAccessToken,
        validateUserRole,
        createTopic
    );

    async function returnTopic (req, res, next) {

    }

    async function createTopic (req, res, next) {

    }

    return topics;
}
