import { Schema, model } from 'mongoose';

const UserDTO = new Schema({
    name: String,
    email: String,
    password: String,
});

export default model('UserDto', UserDTO);