const roles = ['Boss', 'Super_Admin', 'Admin', 'User'] as const;

export interface User {
    id: number;
    fullname: string;
    email: string;
    password: string;
    isActive: boolean;
    adminId?: number;
    finishedTasks: number;
    currentTasks: number;
    role: typeof roles[number];
    createdDate: Date;
    updatedDate: Date;
}