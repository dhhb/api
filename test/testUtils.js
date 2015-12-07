import moment from 'moment';
import mongoose from 'mongoose';
import User from '../src/v1/models/User';
import Property from '../src/v1/models/Property';

export function createTestEmail () {
    return moment().valueOf() + '@tests.com';
}

export function createTestUserData (role) {
    return {
        email: createTestEmail(),
        password: 'qwerty',
        name: 'John Doe',
        role: role || 'writer',
    };
}
