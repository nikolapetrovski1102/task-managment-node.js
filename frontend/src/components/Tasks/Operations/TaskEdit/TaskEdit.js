import React, { useState } from 'react';
import { LaptopOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import logo from '../../../../images/Logo.png'
import TaskFrom from './TaskEditForm';

const { Header, Sider } = Layout;


const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));
  
  const items2 = [
    {
      key: 'sub1',
      icon: React.createElement(UserOutlined),
      label: 'Profile',
      children: [
        { key: '1', label: 'Logout' },
        { key: '2', label: 'Details' },
      ],
    },
    {
      key: 'sub2',
      icon: React.createElement(LaptopOutlined),
      label: 'Team',
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
        { key: '7', label: 'Option 7' },
        { key: '8', label: 'Option 8' },
      ],
    },
  ];

const FormDisabledDemo = () => {
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
        defaultSelectedKeys={['2']}
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
          height: '92vh',
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{
            height: '100%',
            borderRight: 0,
          }}
          items={items2}
        />
      </Sider>
          <TaskFrom />
      </Layout>
    </Layout>
  );
};
export default () => <FormDisabledDemo />;