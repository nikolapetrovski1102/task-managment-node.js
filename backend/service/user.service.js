import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import Redis from "ioredis";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const redisClient = new Redis(process.env.REDIS_URL);

var newUserFlag = false;
var userDeleted = false;

const saltRounds = 10

class UserService {
    async delete_user(user_id) {
        try {
            const user_delete = await User.findByPk(user_id);
            if (user_delete) {
                await user_delete.destroy();
                userDeleted = true;
            } else {
                console.log(`User with ID ${user_id} not found.`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    async list_all_users() {

        try{
            const redisUsers = await redisClient.get('users');
            
            if (redisUsers && !newUserFlag || !userDeleted){
                return JSON.parse(redisUsers);
            }else{
                const users = await User.findAll();
                
                const redisUsers = await redisClient.set('users', JSON.stringify(users));
                
                return JSON.stringify(redisUsers);
            }
        }
        catch(err){
            return null;
        }
    }

    async login(email, password) {
        try {
            const usersList = await this.list_all_users();

            for (const user of usersList) {
                if (user.email === email && bcrypt.compare(password, user.password)) {
                    const token = await jwt.sign({ email: user.email, id: user.id }, process.env.SECRET_KEY, { expiresIn: parseInt(process.env.TOKEN_EXPIRATION) });

                    redisClient.set(token, user.id, 'EX', parseInt(process.env.TOKEN_EXPIRATION));

                    return token;
                }
            }
    
            return null;
        } catch (err) {
            console.error('Error during login:', err);
            return null;
        }
    }
    
    async register(newUser) {

        bcrypt.hash(newUser.password, saltRounds, async (err, hashedPassword) => {
            if (err) return null;

            newUser.password = hashedPassword
            await newUser.save();
            newUserFlag = true;
            return newUser;
        })


    }

}

export default UserService;
