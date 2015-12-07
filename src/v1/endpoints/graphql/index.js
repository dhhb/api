import express from 'express';
import bodyParser from 'body-parser';
import graffiti from '@risingstack/graffiti';
import { getSchema } from '@risingstack/graffiti-mongoose';

import User from '../../models/User';
import Topic from '../../models/Topic';
import Article from '../../models/Article';

const MongooseGraphQLSchema = getSchema([User, Topic, Article]);

export default function () {
    var router = express.Router();

    router.use(bodyParser.text({
        type: 'application/graphql'
    }));
    router.use(graffiti.express({
        schema: MongooseGraphQLSchema,
        graphiql: true
    }));

    return router;
}
