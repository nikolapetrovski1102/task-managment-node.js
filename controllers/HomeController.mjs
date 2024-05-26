import dotenv from 'dotenv';
dotenv.config();
import user from '../models/Users.mjs';
import jwt from 'jsonwebtoken';
import userDto from '../models/UserDTO.mjs';
import Redis from "ioredis"

const redisClient = new Redis("rediss://default:Ac2_AAIncDEzMzAzZDNiOGE3OGE0NDFlOGJlNGJlODY3YzFhMjVkMXAxNTI2NzE@witty-leopard-52671.upstash.io:6379");

// const redisClient = createClient({
//     password: 'vDeAZ3CGMlJg6cqQp9FNAnrHR1ZlA13v',
//     socket: {
//         host: 'redis-16764.c55.eu-central-1-1.ec2.redns.redis-cloud.com',
//         port: 16764
//     }
// });

// redisClient.connect();

// redisClient.on('error', (err) => console.log('Redis Client Error', err));

const EXPIRATION = 3600;

var newUserFlag = false;

export async function index(req, res) {
    await redisClient.set('name', 'Nikola');
    const redisGet = await redisClient.get('name');
    res.send(`Redis GET result: ${redisGet}`);
}

export async function delete_user_by_id(req, res) {
    try {
        await user.findByIdAndDelete(req.params.id);
        res.send('User has been deleted');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

export async function login(req, res) {
    const userBody = req.body.user;

    const userLogin = new userDto({
        name: userBody.name,
        password: userBody.password
    });

    const payload = { name: userLogin.name };

    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: EXPIRATION }, (err, token) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        return res.send({
            access_token: token.toString(),
            token_type: 'Bearer',
            expires_in: EXPIRATION
        });
    });
}

export async function register(req, res) {
    const newUserBody = req.body.user;

    const newUser = new user({
        name: newUserBody.name,
        email: newUserBody.email,
        password: newUserBody.password
    });

    try {
        await newUser.save();
        newUserFlag = false;
        return res.send({ user: newUser.toJSON() });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Something went wrong');
    }
}

export async function list_all_users(req, res) {

    const userList = await redisClient.get('users');

    if (userList && newUserFlag) {
        const users = JSON.parse(userList);
        return res.send(users);
    }else{
        try {
            const users = await user.find();
            await redisClient.set('users', JSON.stringify(users));
            newUserFlag = true;
            res.send(users);
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        }
    }
};
