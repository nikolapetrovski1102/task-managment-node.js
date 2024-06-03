import dotenv from 'dotenv';
dotenv.config();
import { Sequelize, DataTypes, Model } from 'sequelize'

const env = process.env

const sequelize = new Sequelize(env.DATABASE, env.DATABASE_USER, env.DATABASE_PASSWORD, {
    host: env.DATABASE_HOST,
    dialect: env.DATABASE_DIALECT
});

const roles = ['Boss', 'Super_Admin', 'Admin', 'User'];

class User extends Model {}

User.init({
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    finishedTasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    currentTasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    role: {
        type: DataTypes.ENUM(...roles),
        defaultValue: 'User'
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
});

// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//         await User.sync({ alter: true }); // Use { force: true } to drop and recreate the table, or { alter: true } to update it
//         console.log('User model was synchronized successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

export default User;