import express from 'express';
import bodyParser from 'body-parser';

import articles from './endpoints/articles';
import writers from './endpoints/writers';
import topics from './endpoints/topics';

export default function () {
    var router = express.Router();

    router.use(bodyParser.json());
    // router.use('/articles', articles());
    router.use('/writers', writers());
    router.use('/topics', topics());

    return router;
}
