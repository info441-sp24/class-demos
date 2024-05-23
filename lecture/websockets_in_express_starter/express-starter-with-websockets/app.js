import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import enableWs from 'express-ws'

import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
enableWs(app)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

let socketCounter = 1
let allSockets = []

app.ws('/chatSocket', (ws, res) => {
    let mySocketNum = socketCounter
    socketCounter++
    console.log("user " + mySocketNum + " connected via websocket")

    // add this ws to the global array tracking all websockets
    allSockets.push(ws)

    ws.on('message', chatMsg => {
        console.log(`msg (user ${mySocketNum}):  ${chatMsg}`)
        // I want to send the message I got to all the other
        // browsers connected (using their websockets)
        allSockets.forEach(socket => {
            socket.send(`${mySocketNum}: ${chatMsg}`)
        })
    })

    ws.on('close', () => {
        console.log(`user ${mySocketNum} disconnected`)
        console.log("I should probably delete them from the array or something")
    })

})

export default app;
