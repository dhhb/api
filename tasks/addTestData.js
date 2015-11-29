import User from '../src/v1/models/User';
import Article from '../src/v1/models/Article';

async function addTestData(users = [], articles = []) {
    if (users.length) {
        await User.create(users);
    }
    if (articles.length) {
        await Article.create(articles);
    }
    console.log('added');
}

try {
    const user = {
        email: 'notpopadults@hotmail.com',
        createdAt: new Date()
    };

    addTestData([user]);
} catch (err) {
    console.log(err);
}

