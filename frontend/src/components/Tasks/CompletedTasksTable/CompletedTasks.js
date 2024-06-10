import React from 'react';
import { LaptopOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Tag } from 'antd';
import CompletedTasksForm from './CompletedTasksForm';
import logo from '../../../images/Logo.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const { Header, Sider } = Layout;


const items1 = [
  {
      key: '1',
      label: <a href='/tasks' >Active tasks</a>,
  },
  {
      key: '2',
      label: <a href='/completed/tasks' >Completed tasks</a>,
  },
]

const App = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [collapsed, setCollapsed] = useState(true);

  useEffect( () => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/list_all_users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [])

  const Logout = async () => {
    localStorage.removeItem('access_token');
    navigate('/')
  }

  const items2 = [
    {
      key: 'sub1',
      icon: React.createElement(UserOutlined),
      label: 'Profile',
      children: [
        { key: '1', label: <a onClick={Logout} >Logout</a> },
        { key: '2', label: 'Details' },
      ],
    },
    {
      key: 'sub2',
      icon: React.createElement(LaptopOutlined),
      label: 'Team',
      children: [
        ...users.map(user => ({ key: `user-${user.id}`, label: localStorage.getItem('user_role') == 'User' ? <p>{user.fullname}</p> : <a onClick={ () => navigate(`/user/table/${user.id}`) } >{user.fullname}</a> }))
      ],
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
        
      >
        <img src={logo} alt="logo" style={{ width: '150px', height: '50px', marginLeft: '-2%', marginRight: '2%' }} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: "#000"
          }}
        />
      </Header>
      <Layout>
      <Sider
          width={200}
          collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            style={{
              height: '100%',
              borderRight: 0,
              width: '100%',
              fontSize: '12px',
            }}
            items={items2}
          />
        </Sider>
            <CompletedTasksForm />
      </Layout>
    </Layout>
  );
};
export default App;