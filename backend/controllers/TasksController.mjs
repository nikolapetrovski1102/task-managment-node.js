import dotenv from 'dotenv';
dotenv.config();
import TaskService from '../service/tasks.service.js'
import Task from '../models/Tasks.mjs'

var isTaskCreated = false;

const taskService = new TaskService();

export async function create_task(req, res) {
    const { name, description, priority, dueDate, assignedTo, assignedFrom, project, status } = req.body;

    const newTask = new Task({ name,description, priority, dueDate, assignedTo, assignedFrom, project, status })
    
    console.log(newTask);

    try{
        const taskSaved = await taskService.create_task(newTask, newTask.assignedFrom)
        if (taskSaved){
            return res.status(200).send(taskSaved)
        }else{
            return res.status(500).send("An error occurred while creating the task")
        }
    }
    catch(err){
        console.log(err);
        return res.status(500);
    }

}

export async function list_all_tasks(req, res){

    console.log("List all tasks");

    const taskList = await taskService.list_all_tasks();

    return res.send({ tasks: taskList })

}

export async function list_tasks_by_user(req, res){

    const user_token = req.headers.authorization.split(' ')[1];

    console.log('List tasks by user');

    const taskListByUser = await taskService.list_tasks_by_user(user_token);

    return res.send({ tasks: JSON.parse(taskListByUser) })

}

export async function get_task_by_id(req, res) {
    const task_id = req.params.id;

    try {
        const task = await taskService.get_task_by_id(task_id);

        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }

        return res.json({ task });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "An error occurred while retrieving the task" });
    }
}

export async function update_task(req, res) {

    try{
        const task_id = req.params.id;
        const { name, description, priority, dueDate, assignedTo, assignedFrom, project, status } = req.body;

        const task = new Task({ name, description, priority, dueDate, assignedTo, assignedFrom, project, status });

        const updatedTask = await taskService.update_task(task_id, task);

        console.log(updatedTask);

        if (updatedTask){
            return res.status(200).send(updatedTask)
        }else{
            return res.status(500).send("An error occurred while updating the task")
        }
    }catch(err){
        console.log(err);
        return res.status(500);
    }

}

export async function delete_tasks(req, res) {
    const task_ids = req.body;

    try {
        const result = await taskService.delete_tasks(task_ids)

        console.log(result);

        if (result != null){
            return res.status(200).send('Task has been deleted')
        }
        else return res.status(404).send('Task not found')
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }

}

export async function delete_task_by_id(req, res) {
    const task_id = req.params.id;

    console.log(task_id);

    try {
        const isTaskDeleted = await taskService.delete_task_by_id(task_id);

        if (isTaskDeleted){
            return res.status(200).send('Task has been deleted')
        }
        else return res.status(404).send('Task not found')
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
}