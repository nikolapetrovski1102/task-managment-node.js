import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import { index, delete_user_by_id, list_all_users, login, register } from './controllers/HomeController.mjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

connect('mongodb://localhost:27017/local');

app.set('view engine', 'ejs');

const PORT = 8081;


app.get('/index', authToken, index)
app.get('/delete_user_by_id/:id', delete_user_by_id)
app.get('/list_all_users', authToken, list_all_users)
app.post('/login', login)
app.post('/register', register)

function authToken (req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    })

}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));