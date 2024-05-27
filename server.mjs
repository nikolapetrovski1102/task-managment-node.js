import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import { index, delete_user_by_id, list_all_users, login, register } from './controllers/AuthController.mjs';
import jwt from 'jsonwebtoken';
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

connect('mongodb://localhost:27017/local');

app.set('view engine', 'ejs');

const PORT = 8081;


app.get('/index', authenticateToken, index)
app.get('/delete_user_by_id/:id', delete_user_by_id)
app.get('/list_all_users', authenticateToken, list_all_users)
app.post('/login', login)
app.post('/register', register)

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access token missing');
    }

    const token = authHeader.split(' ')[1];
    try {
        const isAuthorized = await redisClient.get(token);
        if (isAuthorized) {
            return res.status(401).send('Invalid token');
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).send('Invalid token');
            }

            req.user = user;
            next();
        });
    } catch (err) {
        console.error('Error checking token:', err);
        res.status(500).send('Server Error');
    }
}


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));