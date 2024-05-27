import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import jwt from 'jsonwebtoken';
import userDto from '../models/UserDTO.mjs';
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL); // Ensure REDIS_URL is in your .env file

const EXPIRATION = 3600;

var newUserFlag = false;

export async function index(req, res) {
    try {
        await redisClient.set('name', 'Nikola');
        const redisGet = await redisClient.get('name');
        res.send(`Redis GET result: ${redisGet}`);
    } catch (err) {
        console.error('Error with Redis:', err);
        res.status(500).send('Server Error');
    }
}

export async function delete_user_by_id(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User has been deleted');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server Error');
    }
}

export async function login(req, res) {
    const { name, password } = req.body.user;

    try {
        const user = await User.findOne({ name });
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        const payload = { name: user.name, id: user._id };

        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: EXPIRATION }, async (err, token) => {
            if (err) {
                console.error('Error signing token:', err);
                return res.status(500).send('Server Error');
            }
            
            try {
                await redisClient.set(`${name}_jwt`, token, 'EX', EXPIRATION);
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
    const { name, email, password } = req.body.user;

    const newUser = new User({ name, email, password });

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
        const userList = await redisClient.get('users');

        if (userList && !newUserFlag) {
            const users = JSON.parse(userList);
            return res.send(users);
        } else {
            const users = await User.find();
            await redisClient.set('users', JSON.stringify(users));
            newUserFlag = false;
            res.send(users);
        }
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server Error');
    }



}
