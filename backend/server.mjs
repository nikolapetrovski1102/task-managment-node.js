import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from 'express';
import { delete_user_by_id, list_all_users, login, register, logout } from './controllers/AuthController.mjs';
import { create_task, get_task_by_id, list_all_tasks, list_tasks_by_user, update_task, delete_tasks, delete_task_by_id } from './controllers/TasksController.mjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://cyberlink-001-site31.atempurl.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/delete_user_by_id/:id', delete_user_by_id);
app.get('/list_all_users', list_all_users);
app.post('/login', login);
app.post('/register', register);
app.post('/createTask', create_task);
app.get('/listTasks', list_all_tasks);
app.get('/listTasksByUser', list_tasks_by_user);
app.get('/getTask/:id', get_task_by_id);
app.post('/updateTask/:id', update_task);
app.post('/deleteTasks', delete_tasks);
app.post('/delete_task_by_id/:id', delete_task_by_id);
app.post('/logout', logout);

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

app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});