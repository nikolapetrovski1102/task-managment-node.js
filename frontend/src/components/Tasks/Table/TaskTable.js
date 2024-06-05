import React from 'react';
import { LaptopOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Tag } from 'antd';
import Table from './TableForm';
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
      label: 'Completed tasks',
  },
]

const App = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect( () => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://cyberlink-001-site33.atempurl.com/list_all_users', {
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
        ...users.map(user => ({ key: `user-${user.id}`, label: user.fullname }))
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
          background: '#000 !important',
        }}
        
      >
        <img src={logo} alt="logo" style={{ width: '150px', height: '50px', marginLeft: '-2%', marginRight: '2%' }} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
              width: '100%',
              fontSize: '12px'
            }}
            items={items2}
          />
        </Sider>
        <Table />
      </Layout>
    </Layout>
  );
};
export default App;