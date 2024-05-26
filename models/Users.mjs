import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    id: String,
    name: String,
    email: String,
    password: String
});

export default model('User', UserSchema);