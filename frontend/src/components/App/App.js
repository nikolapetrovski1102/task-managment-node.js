import { Route, Routes } from 'react-router-dom';
import './App.css';

import Auth from '../Authorization/Authorization'
import TasksTable from '../Tasks/Table/TaskTable'

import EditTask from '../Tasks/Operations/TaskEdit/TaskEdit'
import TaskAdd from '../Tasks/Operations/TaskAdd/TaskAdd';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path='/tasks' element={<TasksTable />} />
        <Route path='/task/edit/:id' element={<EditTask />} />
        <Route path='/task/:id' element={<TasksTable />} />
        <Route path='/task/add' element={<TaskAdd />} />
      </Routes>
    </div>
  );
}

export default App;