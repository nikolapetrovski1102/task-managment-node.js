import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Space, Table, theme, Divider, Button, Input } from 'antd';
import { Breadcrumb, Layout } from 'antd';

const { Content } = Layout;

const items = [
  {
    key: '1',
    label: 'Action 1',
  },
  {
    key: '2',
    label: 'Action 2',
  },
];

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const createNewTask = () => {
    const newKey = tableData.length.toString();
    const newRow = {
      key: newKey,
      name: 'New Task',
      creator: 'Jas',
      createdAt: 'Today',
      isNew: true,
    };
    setData([...tableData, newRow]);
  };

  const [data, setData] = useState([
    {
      key: `create`,
      date: '',
      name: <a onClick={createNewTask}>Create new task</a>,
      status: '',
      upgradeNum: '',
      isCreateTask: true,
    }
  ]);

  const [tableData, setTableData] = useState([
    {
      key: '0',
      name: 'Screen',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    },
    {
      key: '1',
      name: 'Screen',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    },
    {
      key: '2',
      name: 'Screen',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    },
  ]);

  const addNewRow = () => {
    const newKey = tableData.length.toString();
    const newRow = {
      key: newKey,
      name: '',
      platform: '',
      version: '',
      upgradeNum: '',
      creator: '',
      createdAt: '',
      isNew: true,
    };
    setTableData([...tableData, newRow]);
  };

  const handleInputChange = (e, key, column) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => key === item.key);
    newData[index][column] = e.target.value;
    setTableData(newData);
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Status',
        key: 'state',
        render: () => <Badge status="success" text="Finished" />,
      },
      {
        title: 'Upgrade Status',
        dataIndex: 'upgradeNum',
        key: 'upgradeNum',
      },
      {
        title: 'Action',
        key: 'operation',
        render: () => (
          <Space size="middle">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown
              menu={{
                items,
              }}
            >
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        record.isNew ? <Input value={text} onChange={(e) => handleInputChange(e, record.key, 'name')} /> : text
      ),
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      render: (text, record) => (
        record.isNew ? <Input value={text} onChange={(e) => handleInputChange(e, record.key, 'creator')} /> : text
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => (
        record.isNew ? <Input value={text} onChange={(e) => handleInputChange(e, record.key, 'createdAt')} /> : text
      ),
    },
    {
      title: 'Action',
      key: 'operation',
      render: () => <Button type='dashed' danger>Delete</Button>,
      render: (text, record) => ( record.isNew ? <Button type='primary'>Save</Button> : null ),
    },
  ];

  return (
    <Layout
      style={{
        padding: '0 24px 24px',
        height: '92vh',
      }}
    >
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Daily</Breadcrumb.Item>
        <Breadcrumb.Item>Tasks</Breadcrumb.Item>
      </Breadcrumb>
      <Divider style={{ margin: '-.5% 0 1% 0' }} />
      <Content
        style={{
          margin: 0,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Button type="primary" onClick={addNewRow}>Add New Row</Button>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: tableData.map(item => item.key),
          }}
          dataSource={tableData}
        />
      </Content>
    </Layout>
  );
};

export default App;
