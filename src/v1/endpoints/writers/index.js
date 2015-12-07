import express from 'express';

export default function () {
    let writers = express.Router();

    writers.get('/');
    writers.get('/:id');

    writers.post('/signup');
    writers.post('/login');
    writers.post('/login/facebook');

    return writers;
}
