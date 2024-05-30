import User from '../models/Users.mjs';
import { Sequelize } from 'sequelize';

class UserService {
    async delete_user(user_id) {
        try {
            const user_delete = await User.findByPk(user_id);
            if (user_delete) {
                await user_delete.destroy();
                console.log(`User with ID ${user_id} was deleted.`);
            } else {
                console.log(`User with ID ${user_id} not found.`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    async list_all_users() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

}

export default UserService;
