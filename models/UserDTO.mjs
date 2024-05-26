import { Schema, model } from 'mongoose';

const UserDTO = new Schema({
    name: String,
    password: String
});

export default model('UserDto', UserDTO);