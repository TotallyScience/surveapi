import express from 'express';
import welcome from './hello/index.mjs';

const app = express();

app.get('/', (req, res) => res.send(`${welcome}`));

const port = 3000;

app.listen(port, () => console.log(`${welcome}`));
