import dotenv from 'dotenv';
dotenv.config();
import Task from '../models/Tasks.mjs';
import FinishedTasks from '../models/FinishedTasks.mjs';
import Emailer from '../config/Emailer.js';
import UserService from './user.service.js';
import jwt from 'jsonwebtoken';
import Redis from "ioredis";
import ejs from 'ejs';
import path from 'path';

const redisClient = new Redis(process.env.REDIS_URL);
const emailer = new Emailer();
const userService = new UserService();
const __dirname = path.resolve();

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
                if (task.assignedTo === parseInt(user_id) && task.status !== 'Finished') {
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

            const emailTo = await userService.get_user_by_id(parseInt(newTask.assignedTo))
            const task_from = await userService.get_user_by_id(parseInt(newTask.assignedFrom))

            
            await newTask.save();
            taskCreated = true;
            
            userService.increese_current_tasks(newTask.assignedTo)
            
            var createdAt = newTask.createdAt;
            createdAt = createdAt.toDateString() + ' ' + createdAt.toTimeString().split(' ')[0];

            var dueDate = newTask.dueDate;
            if (dueDate != null) dueDate = dueDate.toDateString();

            const ejsData = {
                emailTo: emailTo,
                newTask: newTask,
                task_from: task_from,
                createdAt: createdAt,
                dueDate: dueDate,
                process: { env: { REACT_APP_CORS_LOCAL: process.env.REACT_APP_CORS_LOCAL } }
            };

            ejs.renderFile(__dirname + '\\config\\EmailTemplates\\CreateTaskTemplate.ejs', ejsData, async function(err, data){
                if (err){
                        console.log(err);
                    }
                    else{
                        await emailer.sendMail(emailTo.email, `${newTask.project} [${newTask.id} - ${newTask.name}] Created with ${newTask.priority} priority`, data);
                    }
                });
                    
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

    async finish_task(task_id, user) {
        try {
            const task = await Task.findByPk(task_id);

            if (!task) return null;

            const finished_task = {
                task_id: task.id,
                created_at: task.createdAt,
                finished_at: new Date(),
                finished_by: parseInt(user.id),
            };

            const return_task = await FinishedTasks.create(finished_task);

            userService.increese_finished_tasks(finished_task.assignedTo)

            if (return_task) {
                return return_task;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async completed_tasks(user_token) {
        try {
            const user_id = jwt.verify(user_token, process.env.SECRET_KEY).id;

            const finished_tasks = await FinishedTasks.findAll({ where: { finished_by: user_id } });

            for (const task of finished_tasks) {
                const taskInfo = await Task.findByPk(task.task_id);
                task.task_id = taskInfo;
            }

            return finished_tasks;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async list_tasks_by_user_id_service(user_id){
        try{
            const tasks = await Task.findAll({ where: { assignedTo: user_id } });

            return tasks;
        }catch(err){
            console.log(err);
            return null;
        }
    }


}

export default TaskService;
