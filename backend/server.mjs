import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from 'express';
import { delete_user_by_id, list_all_users, login, register, logout, checkUserRole, get_user_by_token } from './controllers/AuthController.mjs';
import { create_task, get_task_by_id, list_all_tasks, list_tasks_by_user, update_task, delete_tasks, delete_task_by_id, completed_tasks, list_tasks_by_user_id } from './controllers/TasksController.mjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: [ process.env.REACT_APP_CORS_LOCAL, process.env.REACT_APP_CORS_HOSTED ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    const newTask = {
        id: '1',
        name: 'New Task',
        description: 'This is a new task',
        priority: 'P0',
        assignedTo: 1,
        assignedFrom: 2,
        project: 'Hello Help Me',
        dueDate: '2022-12-31',
        currentEnvironment: 'Production',
        status: 'Pending',
        type: 'Task',
        createdAt: 'Sun Jun 09 2024 19:05:11 GMT+0200 (Central European Summer Time)'
    };

    const emailTo = {
        id: 1,
        fullname: 'Nikola Petrovski',
        email: 'npetrovski@ohanaone.com',
        password: 'password',
        isActive: 'true',
        adminId: '1',
        finishedTasks: '0',
        currentTasks: '0',
        role: 'User'
    }

    const task_from = {
        id: 2,
        fullname: 'Test User',
        email: 'npetrovski@ohanaone.com',
        password: 'password',
        isActive: 'true',
        adminId: '1',
        finishedTasks: '0',
        currentTasks: '0',
        role: 'User'
    }

    const ejsData = {
        emailTo: emailTo,
        newTask: newTask,
        task_from: task_from,
        process: { env: { REACT_APP_CORS_LOCAL: process.env.REACT_APP_CORS_LOCAL } }
    };

    res.render('CreateTaskTemplate.ejs', ejsData );

});
app.post('/delete_user_by_id/:id', authenticateToken, delete_user_by_id);
app.get('/list_all_users', authenticateToken, list_all_users);
app.post('/login', login);
app.post('/register', register);
app.post('/createTask', authenticateToken, create_task);
app.get('/listTasks', authenticateToken, list_all_tasks);
app.get('/listTasksByUser', authenticateToken, list_tasks_by_user);
app.get('/listTasksByUserId/:id', authenticateToken, list_tasks_by_user_id);
app.get('/getTask/:id', authenticateToken, get_task_by_id);
app.post('/updateTask/:id', authenticateToken, update_task);
app.post('/deleteTasks', authenticateToken, delete_tasks);
app.post('/delete_task_by_id/:id', authenticateToken, delete_task_by_id);
app.post('/logout', authenticateToken, logout);
app.get('/completed/tasks', authenticateToken, completed_tasks)
app.get('/checkUserRole', authenticateToken, checkUserRole)
app.get('/get_user_by_token', authenticateToken, get_user_by_token)

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