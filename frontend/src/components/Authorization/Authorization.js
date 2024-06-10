import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Auth from './LoginForm';
import logo from '../../images/Logo.png';

const { Header, Sider } = Layout;


const items2 = [
  {
    key: 'sub1',
    icon: React.createElement(UserOutlined),
    label: 'Profile',
    children: [
    ],
  },
  {
    key: 'sub2',
    icon: React.createElement(LaptopOutlined),
    label: 'Team',
    children: [
    ],
  },
];

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: "#000"
        }}
      >
        <img src={logo} alt="logo" style={{ width: '150px', height: '50px', marginLeft: '-2%', marginRight: '2%' }} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
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
          style={{
            background: '#141414',
          }}
        >
          <Menu
            disabled={true}
            mode="inline"
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Auth />
      </Layout>
    </Layout>
  );
};
export default App;