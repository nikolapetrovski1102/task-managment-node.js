import dotenv from 'dotenv';
dotenv.config();
import { Sequelize, DataTypes, Model } from 'sequelize'
import User from './Users.mjs'
import Task from './Tasks.mjs'

const env = process.env

const sequelize = new Sequelize(env.DATABASE, env.DATABASE_USER, env.DATABASE_PASSWORD, {
    host: env.DATABASE_HOST,
    dialect: env.DATABASE_DIALECT
});

class FinishedTasks extends Model {}

FinishedTasks.init({

    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    finished_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    finished_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }

}, {
    sequelize,
    modelName: 'FinishedTasks',
    timestamps: false
});

// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//         await FinishedTasks.sync({ alter: true });
//         console.log('Task model was synchronized successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

export default FinishedTasks;