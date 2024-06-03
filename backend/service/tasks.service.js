import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import Task from '../models/Tasks.mjs'
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

var taskDeleted = true
var taskCreated = true

class TaskService {

    async list_all_tasks () {

        try{

            const tasks = await redisClient.get('tasks')

            if (tasks && !taskCreated || !taskDeleted){
                return JSON.parse(tasks)
            }else{

                const taskList = await Task.findAll();

                await redisClient.set("tasks", JSON.stringify(taskList));
                
                return taskList;
            }
        }
        catch(err){
            console.log(err);
            return null;
        }

    }

    async list_tasks_by_user(user_token){

        try{
            const user_id = await redisClient.get(user_token)

            const tasks = await this.list_all_tasks()

            var taskListByUser = Array()

            for (const task of tasks){
                if (task.assignedTo === parseInt(user_id)){
                    taskListByUser.push(task)
                }
            }

            return JSON.stringify(taskListByUser)
        }
        catch(err){
            console.log(err);
            return null;
        }

    }

    async create_task(newTask){

        try{
            taskCreated = true;
            return newTask.save();
        }
        catch(err){
            console.log(err);
            return null;
        }

    }

    async get_task_by_id(task_id){
            
        console.log(task_id);

            try{
                const tasks = await this.list_all_tasks()

                for (const task of tasks){
                    if (task.id === parseInt(task_id)){
                        return JSON.stringify(task)
                    }
                }
            }
            catch(err){
                console.log(err);
                return null;
            }
    }

}

export default TaskService;