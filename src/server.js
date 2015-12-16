import './utils/mongodbConnector';

import http from 'http';
import path from 'path';
import express from 'express';
import serveFavicon from 'serve-favicon';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { host, port, env } from 'c0nfig';

import {
    noClientCache,
    handleErrors,
    handleNotFound
} from './middleware';

import rest from './v1';
// import graphql from './v1/endpoints/graphql';

const app = express();

if ('test' !== env) {
    app.use(logger('dev'));
}

app.use(serveFavicon(path.join(__dirname, '/favicon.png')));
app.use(cors());
app.use(cookieParser());
app.use(noClientCache());

app.use('/v1', rest());
app.use(handleNotFound);
app.use(handleErrors);
// app.use(graphql()); // experimental

http.createServer(app).listen(port, () => {
    console.log(`D.H.H.B API is listening on http://${host}:${port} env=${env}`);
});
