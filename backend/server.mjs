import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from 'express';
import { delete_user_by_id, list_all_users, login, register } from './controllers/AuthController.mjs';
import { create_task, list_all_tasks } from './controllers/TasksController.mjs';
import jwt from 'jsonwebtoken';
import cors from 'cors'
import http from 'http'
import sql from 'mssql'

http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Hello, world!');
}).listen(process.env.PORT);


const app = express();

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))



app.set('view engine', 'ejs');

app.post('/delete_user_by_id/:id', delete_user_by_id)
app.get('/list_all_users', list_all_users)
app.post('/login', login)
app.post('/register', register)
app.post('/createTask', authenticateToken, create_task)
app.get('/listTasks', authenticateToken, list_all_tasks)

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access token missing');
    }

    const token = authHeader.split(' ')[1];
    try {

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


app.listen(8081, () => console.log(`Server is running on port ${8081}`));