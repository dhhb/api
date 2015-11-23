import graphqlHTTP from 'express-graphql';

export default function () {
    var router = express.Router();

    router.get('/graphql', graphqlHTTP);

    return router;
}
