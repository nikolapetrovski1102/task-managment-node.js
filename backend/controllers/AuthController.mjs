import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import jwt from 'jsonwebtoken';
import Redis from "ioredis";
import UserService from '../service/user.service.js'

const redisClient = new Redis(process.env.REDIS_URL);

const EXPIRATION = 3600;

var newUserFlag = false;

const userService = new UserService();

export async function delete_user_by_id(req, res) {
    try {
        await userService.delete_user(req.params.id);
        res.send('User has been deleted');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server Error');
    }
}

export async function login(req, res) {
    const { fullname, password } = req.body.user;

    try {
        const user = await User.findOne({ fullname });
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        const payload = { fullname: user.fullname, id: user._id };

        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: EXPIRATION }, async (err, token) => {
            if (err) {
                console.error('Error signing token:', err);
                return res.status(500).send('Server Error');
            }
            
            try {
                process.env.USER = fullname;
                await redisClient.set(`${fullname}_jwt`, token, 'EX', EXPIRATION);
            } catch (redisErr) {
                console.error('Error setting token in Redis:', redisErr);
                return res.status(500).send('Server Error');
            }

            return res.send({
                access_token: token,
                token_type: 'Bearer',
                expires_in: EXPIRATION
            });
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server Error');
    }
}


export async function register(req, res) {
    const { fullName, email, password, isActive, adminId, finishedTasks, currentTasks, role } = req.body.user;

    const newUser = new User({
        fullname: fullName,
        email: email,
        password: password, 
        isActive: isActive,
        adminId: adminId,
        finishedTasks: finishedTasks,
        currentTasks: currentTasks,
        role: role
    });

    try {
        await newUser.save();
        newUserFlag = true;
        return res.send({ user: newUser.toJSON() });
    } catch (err) {
        console.error('Error registering user:', err);
        return res.status(500).send('Server Error');
    }
}

export async function list_all_users(req, res) {
    try {
        return await userService.list_all_users();
        // const userList = await redisClient.get('users');

        // newUserFlag = false;

        // if (userList && !newUserFlag) {
        //     const users = JSON.parse(userList);
        //     return res.send(users);
        // } else {
        //     const users = userService.list_all_users();
        //     console.log(users);
        //     await redisClient.set('users', JSON.stringify(users));
        //     newUserFlag = false;
        //     res.send(users);
        // }
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server Error');
    }



}
