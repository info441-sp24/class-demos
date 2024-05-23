import {promises as fs} from 'fs'
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

app.get("/api/getPterosaurs", async (req, res) => {
    const data = await fs.readFile("data/pterosaur.json")
    let pterosaurInfo = JSON.parse(data)

    // filter out any without images
    let filteredPterosaurInfo =
        pterosaurInfo.filter(onePterosaur => onePterosaur.img != "") 

    res.json(filteredPterosaurInfo)
})

export default app;
