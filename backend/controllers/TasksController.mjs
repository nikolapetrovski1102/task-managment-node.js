import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import Tasks from '../models/Tasks.mjs'
import jwt from 'jsonwebtoken';
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL)

var isTaskCreated = false;

export async function create_task(req, res) {
    const { name, description, priority, dueDate, assignedTo, assignedFrom, project } = req.body.task;

    const newTask = new Tasks({ name,description, priority, dueDate, assignedTo, assignedFrom, project })

    console.log(newTask);

    newTask.save()
    .then( () => {
        return res.status(200).send(JSON.parse( newTask ))
    })
    .catch( (err) => {
        return res.status(500).send(err.toString())
    })

}

export async function list_all_tasks(req, res){

    const tasks = await Tasks.find();

    return res.send({ task: tasks })

}