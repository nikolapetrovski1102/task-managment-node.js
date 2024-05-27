import { Schema, model } from 'mongoose';

const roles = ['Super_Admin', 'Admin', 'User'];

const UserSchema = new Schema({
    Fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true, default: false },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    finishedTasks: { type: Number, default: 0 },
    currentTasks: { type: Number, default: 0 },
    role: { type: String, enum: roles, default: 'User' }
}, {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
});

export default model('User', UserSchema);
