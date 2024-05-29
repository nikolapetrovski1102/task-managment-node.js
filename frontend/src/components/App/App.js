import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Auth from '../Authorization/Auth'
import Tasks from '../Tasks/TaskTable'
import Header from '../Header/Header'
import SideHeader from '../Header/SideHeader'

function App() {
  return (
    <div>
      <Header />
      <SideHeader />
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/tasks' element={<Tasks />} ></Route>
      </Routes>
    </div>
  );
}

export default App;