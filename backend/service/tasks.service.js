import dotenv from 'dotenv';
dotenv.config();
import Task from '../models/Tasks.mjs'
import Redis from "ioredis";
import Emailer from '../config/Emailer.js';
import UserService from './user.service.js';
import e from 'express';

const redisClient = new Redis(process.env.REDIS_URL);
const emailer = new Emailer();
const userService = new UserService();

var taskCreated = false
var taskDeleted = false

class TaskService {

    async list_all_tasks() {
    
        try {
            const tasks = await redisClient.get('tasks');
    
            if (tasks && !taskCreated && !taskDeleted) {
                    return JSON.parse(tasks);
            } else {
                const taskList = await Task.findAll();

                taskCreated = false;
                taskDeleted = false;

                await redisClient.set("tasks", JSON.stringify(taskList));
    
                return taskList;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    
    async list_tasks_by_user(user_token) {
        try {
            const user_id = await redisClient.get(user_token);
    
            const tasks = await this.list_all_tasks();
    
            if (!tasks || !Array.isArray(tasks)) {
                throw new Error("Failed to retrieve tasks");
            }
    
            var taskListByUser = [];
    
            for (const task of tasks) {
                if (task.assignedTo === parseInt(user_id)) {
                    taskListByUser.push(task);
                }
            }
    
            return JSON.stringify(taskListByUser);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async create_task(newTask, user_token){

        try{
            const user_id = await redisClient.get(user_token)
            if (!user_id){
                return null;
            }
            newTask.assignedFrom = parseInt(user_id);
            await newTask.save();
            
            const emailTo = await userService.get_user_by_id(newTask.assignedTo);

            await emailer.sendMail(emailTo.email, 'Task Created', `A new task has been created for you: ${newTask.name}`, `<p>A new task has been created for you: ${newTask.name} you can check it <a href='http://localhost:3001/task/edit/${newTask.id}' >here</a> </p>`)

            taskCreated = true;
            return newTask;
        }
        catch(err){
            console.log(err);
            return null;
        }

    }

    async get_task_by_id(task_id) {
        try {
            var tasks = await this.list_all_tasks();

            for (const task of tasks) {
                if (task.id === parseInt(task_id)) {
                    const foundTask = { ...task };
                    const assignedToUser = await userService.get_user_by_id(foundTask.assignedTo);
    
                    if (!assignedToUser) {
                        throw new Error(`User with id ${foundTask.assignedTo} not found`);
                    }
    
                    console.log(assignedToUser);
                    foundTask.assignedTo = assignedToUser;
                    return foundTask;
                }
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    
    async update_task(task_id, updatedTask) {
        try {
          const tasks = await this.list_all_tasks();
          
          let taskToEdit = tasks.find(task => task.id === parseInt(task_id));
          
          if (!taskToEdit) {
            return null; 
          }
      
          taskToEdit.name = updatedTask.name;
          taskToEdit.description = updatedTask.description;
          taskToEdit.priority = updatedTask.priority;
          taskToEdit.dueDate = updatedTask.dueDate;
          taskToEdit.assignedTo = updatedTask.assignedTo.id;
          taskToEdit.assignedFrom = await redisClient.get(updatedTask.assignedFrom);
          taskToEdit.project = updatedTask.project;
          taskToEdit.status = updatedTask.status;
      
          const updated = await Task.update(taskToEdit, { where: { id: task_id } })
          
          taskCreated = true;

          return updated;
        } catch (err) {
          console.log(err);
          return null;
        }
      }

      async delete_tasks(task_ids){

        try{
            const taskList = await this.list_all_tasks();

            for (const task of taskList){
                for (const id of task_ids){
                    if (task.id == id){
                        await Task.destroy({where: {id: task.id}})
                        taskDeleted = true;
                    }
                }
            }

            return taskDeleted;

        }catch(err){
            console.log(err);
            return null;
        }

      }

    async delete_task_by_id (task_id) {
        try {
            
            if (task_id == null) {
                return false;
            }
    
            await Task.destroy({ where: { id: task_id } });
    
            taskDeleted = true;
    
            return taskDeleted;
        } catch (err) {
            console.log(err);
            return false;
        }
    } 

}

export default TaskService;