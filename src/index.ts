import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import dotenv from "dotenv"
import path from "path"
import { User } from './entity/User';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('running');
})

AppDataSource
    .initialize()
    .then(() => {
        console.log('성공');
    })
    .catch((err) => {
        console.error(err);
    })

    app.post('/users', async (req, res) => {
        const user = await AppDataSource.getRepository(User).create(req.body);
        console.log(user);
        const results = await AppDataSource.getRepository(User).save(user);
        return res.send(results);
    })

    app.get('/users', async (req, res) => {
        const results = await AppDataSource.getRepository(User).find();
        res.json(results);
    })

    app.get('/users/:id', async (req, res) => {
        const results = await AppDataSource.getRepository(User).findOneBy({
            id: Number(req.params.id)
        })
        return res.json(results);
    })

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
})