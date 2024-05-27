import { Schema, model } from 'mongoose';
import User from './Users.mjs';  // Correctly import the User model

const priority = ['P0', 'P1', 'P2', 'P3'];
const projects = ['Hello Help Me', 'Nikob', 'Axiom', 'Balkanea', 'ASK', 'Paragon', 'Reptil', 'Salesforce'];

const TaskSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    priority: { type: String, enum: priority, required: true },
    dueDate: { type: Date, required: false },
    assignedTo: { type: Schema.Types.ObjectId, ref: User, required: true },
    assignedFrom: { type: Schema.Types.ObjectId, ref: User, required: true },
    project: { type: String, enum: projects, required: true }
}, {
    timestamps: true
});

export default model('Task', TaskSchema);
