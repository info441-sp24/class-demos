import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware to be run on api calls (after static file server has already taken file requests)
app.use((req, res, next) => {
    console.log("This is the first additional piece of middleware that I made")
    next()
    console.log(`The first middleware gets a last chance to do something, 
    for example I could be tracking how long it took to handle the request`)
})

app.use((req, res, next) => {
    console.log("second middleware adds info to the request to be used later")
    req.testValue = 3
    next()
})

app.use((req, res, next) => {
    console.log("Third middleware, looks up the testValue in the req, which is",
    req.testValue)
    next()
})
app.use('/users', usersRouter);

export default app;
