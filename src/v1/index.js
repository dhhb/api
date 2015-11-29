import express from 'express';

import graphql from './endpoints/graphql';

export default function () {
    var router = express.Router();

    // router.use('/graphql', graphql());

    return router;
}
