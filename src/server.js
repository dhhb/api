import http from 'http';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { host, port, env } from 'c0nfig';

import { noClientCache } from './middleware';

const app = express();

if ('test' !== env) {
    app.use(logger('dev'));
}

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(noClientCache());

app.use('/v1', (req, res) => res.send('Hello'));

http.createServer(app).listen(port, () => {
    console.log(`D.H.H.B API is listening on http://${host}:${port} env=${env}`);
});
