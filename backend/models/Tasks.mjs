import dotenv from 'dotenv';
dotenv.config();
import { Sequelize, DataTypes, Model } from 'sequelize'
import User from './Users.mjs'

const env = process.env

const sequelize = new Sequelize(env.DATABASE, env.DATABASE_USER, env.DATABASE_PASSWORD, {
    host: env.DATABASE_HOST,
    dialect: env.DATABASE_DIALECT
});

const priority = ['P0', 'P1', 'P2', 'P3'];
const projects = ['Hello Help Me', 'Nikob', 'Axiom', 'Balkanea', 'ASK', 'Paragon', 'Reptil', 'Salesforce'];
const status = ['Finished', 'In progress', 'On hold', 'Not started'];
const environments = ['Production', 'Stage', 'Local'];
const types = ['Bug', 'Feature', 'Task'];

class Task extends Model {}

Task.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [priority]
        }
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    assignedFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    project: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [projects]
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [status]
        }
    },
    currentEnvironment: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [environments]
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [types]
        }   
    }
}, {
    sequelize,
    modelName: 'Task',
    timestamps: true
});

// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//         await Task.sync({ alter: true });
//         console.log('Task model was synchronized successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

export default Task;