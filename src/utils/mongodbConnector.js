import mongoose from 'mongoose';
import { mongodb, env } from 'c0nfig';

let db = mongoose.connection;

db.on('connected', () => {
    if ('test' !== env) {
        console.log(`Connected to ${mongodb.connection}`);
    }
});
db.on('error', err => console.error(`Failed to connect to ${mongodb.connection}`, err));
db.on('disconnected', () => console.log(`Disconnected from ${mongodb.connection}`));
db.on('close', () => console.log(`Closed connection to ${mongodb.connection}`));

mongoose.connect(mongodb.connection, mongodb.options);
