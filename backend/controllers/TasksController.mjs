import dotenv from 'dotenv';
dotenv.config();
import TaskService from '../service/tasks.service.js'
import Task from '../models/Tasks.mjs'

var isTaskCreated = false;

const taskService = new TaskService();

export async function create_task(req, res) {
    const { name, description, priority, dueDate, assignedTo, assignedFrom, project } = req.body.task;

    const newTask = new Task({ name,description, priority, dueDate, assignedTo, assignedFrom, project })

    console.log(newTask);

    try{
        return res.status(200).send(await taskService.create_task(newTask))
    }
    catch(err){
        console.log(err);
        return res.status(500);
    }

}

export async function list_all_tasks(req, res){

    const taskList = await taskService.list_all_tasks();

    return res.send({ tasks: taskList })

}

export async function list_tasks_by_user(req, res){

    const user_token = req.headers.authorization.split(' ')[1];

    const taskListByUser = await taskService.list_tasks_by_user(user_token);

    return res.send({ tasks: JSON.parse(taskListByUser) })

}

export async function get_task_by_id(req, res){

    const task_id = req.params.id;

    const task = await taskService.get_task_by_id(task_id);

    return res.send({ task: JSON.parse(task) })

}