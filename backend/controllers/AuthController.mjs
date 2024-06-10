import dotenv from 'dotenv';
dotenv.config();
import User from '../models/Users.mjs';
import UserService from '../service/user.service.js'

const userService = new UserService();

export async function delete_user_by_id(req, res) {
    try {
        await userService.delete_user(req.params.id);
        res.send('User has been deleted');
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

export async function login(req, res) {
    
    const { email, password, remember_me } = req.body.user;

    try {
        const userToken = await userService.login(email, password, remember_me);

        if (!userToken) {
            return res.status(401).send('Invalid credentials');
        }

        return res.send({
            access_token: userToken,
            token_type: 'Bearer',
            expires_in: remember_me == false ? process.env.TOKEN_EXPIRATION : process.env.TOKEN_EXPIRATION_REMEMBER_ME
        });

    } catch (err) {
        console.error('Error signing token:', err);
        return res.status(500).send('Server Error');
    }

}


export async function register(req, res) {
    const { fullname, email, password, isActive, adminId, finishedTasks, currentTasks, role } = req.body.user;

    const newUser = new User({ fullname, email, password, isActive, adminId, finishedTasks, currentTasks, role });

    const user = userService.register(newUser)

    try {
        return res.send(JSON.stringify(user));
    } catch (err) {
        console.error('Error registering user:', err);
        return res.status(500).send('Server Error');
    }
}

export async function list_all_users(req, res) {
    try {

        const users = await userService.list_all_users();

        if (users != null){
            return res.status(200).send(users);
        }
        else return res.status(500);


    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server Error');
    }

}

export async function logout(req, res) {
    try {
        await userService.logout(req.body.token);
        res.send('User has been logged out');
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

export async function checkUserRole(req, res) {

    const user_token = req.headers.authorization.split(' ')[1];

    const user_role = await userService.get_user_role(user_token);

    if (user_role) return res.send(user_role);

}

export async function get_user_by_token(req, res) {

    const user_token = req.headers.authorization.split(' ')[1];

    const user = await userService.get_user_by_redis_token(user_token);

    console.log(user);

    if (user){
        return res.status(200).send(user);
    } 
    else{
        return res.status(500);
    }

}