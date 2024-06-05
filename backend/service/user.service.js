import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import Redis from "ioredis";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const redisClient = new Redis(process.env.REDIS_URL);

var newUserFlag = false;

const saltRounds = 10

class UserService {

    async list_all_users() {

        try{
            const redisUsers = await redisClient.get('users');

            if (redisUsers && true){
                return JSON.parse(redisUsers);
            }else{
                const users = await User.findAll();
                
                newUserFlag = false;
                const redisUsers = await redisClient.set('users', JSON.stringify(users));
                
                return JSON.parse(users);
            }
        }
        catch(err){
            return null;
        }
    }

    async login(email, password, remember_me) {
        try {
            const usersList = await this.list_all_users();
            for (const user of usersList) {
                if (user.email === email && await bcrypt.compare(password, user.password)) {
                    const expiresIn = remember_me ? parseInt(process.env.TOKEN_EXPIRATION_REMEMBER_ME) : parseInt(process.env.TOKEN_EXPIRATION);
                    const token = await jwt.sign({ email: user.email, id: user.id }, process.env.SECRET_KEY, { expiresIn });
    
                    redisClient.set(token, user.id, 'EX', expiresIn);
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

    async get_user_by_id(user_id) {
    
        console.log(user_id);

        try{
            const usersList = await this.list_all_users();
    
            for (const user of usersList){
                if (user.id === user_id){
                    return user;
                }
            }
    
            return null;
        }
        catch(err){
            return null;
        }

    }

    async logout (token){
        try{
            const user_id = await redisClient.get(token);
    
            if (user_id){
                await redisClient.del(token);
                return true;
            }
            return false;
        }
        catch(err){
            return false;
        }
    }

}

export default UserService;
