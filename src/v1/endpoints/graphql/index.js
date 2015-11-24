import express from 'express';
import graffiti from '@risingstack/graffiti';
import { getSchema } from '@risingstack/graffiti-mongoose';
// import graphqlHTTP from 'express-graphql';

import User from '../../models/User';
import Article from '../../models/Article';

const MongooseGraphQLSchema = getSchema([User, Article]);

export default function () {
    var router = express.Router();

    router.use('/',
        graffiti.express({
            schema: MongooseGraphQLSchema,
            graphiql: true
        })
    );

    return router;
}
