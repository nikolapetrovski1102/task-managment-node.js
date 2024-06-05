import { Route, Routes } from 'react-router-dom';
import './App.css';

import Auth from '../Authorization/Authorization'
import TasksTable from '../Tasks/Table/TaskTable'

import EditTask from '../Tasks/Operations/TaskEdit/TaskEdit'
import TaskAdd from '../Tasks/Operations/TaskAdd/TaskAdd';
import DailyTasks from '../Tasks/Operations/DailyTasks/DailyTasks'
import TaskDetails from '../Tasks/Operations/TaskDetails/TaskDetails'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path='/tasks' element={<TasksTable />} />
        <Route path='/task/edit/:id' element={<EditTask />} />
        <Route path='/task/:id' element={<TasksTable />} />
        <Route path='/task/add' element={<TaskAdd />} />
        <Route path='/daily/task' element={<DailyTasks />} />
        <Route path='/task/details/:id' element={<TaskDetails />} />
      </Routes>
    </div>
  );
}

export default App;