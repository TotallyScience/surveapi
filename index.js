import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import accountRouter from './routes/account_router.js';

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

//connect to mongodb
const dbURI = 'mongodb+srv://zach:Homeworksecure4321@surve.57fk2tb.mongodb.net/surve?retryWrites=true&w=majority';
mongoose
    .connect(dbURI)
    .then((result) => server.listen(port))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send(`Welcome!`);
});

app.use('/account', accountRouter);
