import moment from 'moment';
import mongoose from 'mongoose';
import User from '../src/v1/models/User';
import Article from '../src/v1/models/Article';

export function createTestEmail () {
    return moment().valueOf() + '@tests.com';
}

export function createTestUserData (role = 'writer') {
    return {
        email: createTestEmail(),
        password: 'qwerty',
        name: 'John Doe',
        role
    };
}

export async function getTestUser (role = 'writer') {
    let user = await User.create(createTestUserData(role));
    let accessToken = User.generateAccessToken(user);

    user = user.toJSON();
    user._id = user._id.toString();

    return { accessToken, user };
}

export async function generateArticles (writerId, num = 5) {
    for (let i = 0; i < num; i++) {
        await Article.create({
            author: writerId,
            title: `title${i}`,
            text: 'test'
        });
    }
}

export function generateAccessToken () {
    return User.generateAccessToken(createTestUserData());
}

export function generateMongoObjectId () {
    return mongoose.Types.ObjectId();
}
