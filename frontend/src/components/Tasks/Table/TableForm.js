import React, { useState, useEffect } from 'react';
import { renderMatches, useHistory, useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled, ReloadOutlined, DownOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, theme, Modal, Divider, Table, Button, Input, Spin, Tag, Avatar, Dropdown, Space } from 'antd';
import axios from 'axios';

const { Content } = Layout;
const { confirm } = Modal;
const { Search } = Input;

const columns = [
  {
    title: 'ID',
    dataIndex: 'key',
  },
  {
    title: 'Task Name',
    dataIndex: 'taskName',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
  },
  {
    title: 'Project',
    dataIndex: 'project',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  }
];

const App = () => {

  const task_statuses = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: '0',
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];

  const getColor = (priority) => {
    switch (priority) {
      case 'P0':
        return 'red';
      case 'P1':
        return 'volcano';
      case 'P2':
        return 'gold';
      case 'P3':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getProject = (project) => {
    switch (project) {
      case 'Hello Help Me':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10415?size=medium';
      case 'Axiom':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium';
      case 'Salesforce':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10423?size=medium';
      case 'Reptil':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10414?size=medium';
      case 'Nikob':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10401?size=medium';
      case 'Balkanea':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10425?size=medium';
      case 'ASK':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10402?size=medium';
      case 'Paragon':
        return 'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10408?size=medium';
      default:
        return ''
    }
  };

  useEffect(() => {
    setLoading(true);
    axios.get('http://cyberlink-001-site33.atempurl.com/listTasksByUser', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then((response) => {
      console.log('Response data:', response.data);

      const tasks = response.data.tasks.map((task) => ({
        proba: task.priority == 'P0' ? 'Priority' : '',
        key: task.id,
        taskName: task.name,
        dueDate: task.dueDate.split('T')[0],
        priority: <Tag color={getColor(task.priority)}>{task.priority}</Tag>,
        project:  <p style={{ marginBottom: '0' }} > <Avatar style={{ marginBottom: '1px' }} size={'small'} src={getProject(task.project)} ></Avatar> {task.project} </p>,
        status: task.status
      }));

      console.log(tasks);

      setData(tasks);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      if (error.response.status === 403) {
        if (localStorage.getItem('access_token'))
          localStorage.removeItem('access_token');
        navigate('/');
      setLoading(false);
      }
    });
  }, []);

  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [loadings, setLoadings] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRowEdit, setSelectedRowEdit] = useState(null);
  const [editDsiabled, setEditDisable] = useState(true);
  const [deleteDisabled, setDeleteDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  // Disable buttons when no row is selected
  window.onload = function() {
    document.getElementById('delete_btn').disabled = true;
    document.getElementById('edit_btn').disabled = true;
  };
  // end disable buttons

  // Loading button
  const enterLoading = (index) => {
    // Start the loader
    setLoadings( (prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    })

    axios.get('http://cyberlink-001-site33.atempurl.com/listTasksByUser', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then((response) => {

      const tasks = response.data.tasks.map((task) => ({
        key: task.id,
        taskName: task.name,
        dueDate: task.dueDate.split('T')[0],
        priority: <Tag color={getColor(task.priority)}>{task.priority}</Tag>,
        project: <p> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10415?size=medium'} ></Avatar> task.project </p>,
        status: task.status,
      }));

      setData(tasks);
      // After the data is fetched, stop the loader
      setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
      });
    }).catch((error) => {
      console.log(error);
      if (error.response.status === 403) {
        if (localStorage.getItem('access_token'))
          localStorage.removeItem('access_token');
        navigate('/');
      }
      // If there is an error, stop the loader
      setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
      });
    });

  };
  // end loading button

  // Search bar
  const onSearch = (value) => {
    if (value === '') enterLoading(2);
    const filtered = data.filter((item) =>
      item.taskName.toLowerCase().includes(value.toLowerCase())
    );
    setData(filtered);
  };
  // end search bar

  // Delete button
  const showDeleteConfirm = () => {
    if (!selectedRow) return;
    const taskNames = selectedRow.map((item) => item.taskName).join(', ');
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: `Are your sure you want to delete ${ taskNames }?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {

        const ids = selectedRow.map((item) => item.key);

          try {
            const response = await axios.post(`http://cyberlink-001-site33.atempurl.com/deleteTasks/`,
              ids,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            console.log(response);
            if (response.status === 200)
              enterLoading(2)
          } catch (error) {
            console.error('Error deleting task:', error);
          }
      },
      onCancel() {
      },
    });
  };
  // end delete button

  // Handle row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows);

      // document.getElementById('delete_btn').disabled = 
      if (selectedRowKeys.length > 1){
        setEditDisable(true);
        setDeleteDisable(false);
      }
      else if (selectedRowKeys.length === 1){
        setSelectedRowEdit(selectedRows[0]);
        setEditDisable(false);
        setDeleteDisable(false);
      }
      else if (selectedRowKeys.length === 0){
        setEditDisable(true);
        setDeleteDisable(true);
      }
      
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  // end handle row selection

  //Edit button
  const showModal = () => {
    setModalText('')
    setOpen(true);
  };
  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  // end edit button


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
      <Breadcrumb.Item>Table</Breadcrumb.Item>
    </Breadcrumb>
    <Divider style={{ margin: '-.5% 0 1% 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ width: '20%' }} > 
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={loadings[2]}
            onClick={() => enterLoading(2)}
            style={{
              margin: '0 1% 1% 0',
            }}
          >
          </Button>
          <Button style={{ margin: '0 0 0% 5%' }} onClick={ () => navigate('/task/add') } type="primary">
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button disabled={editDsiabled} id='edit_btn' type="primary" onClick={ () => navigate(`/task/edit/${selectedRow[0].key}`)}>
            Edit
          </Button>
          <Modal
            title="Title"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
              {selectedRow ? (
                <div>
                  <h3>Selected Task ID: {selectedRow.key}</h3>
                  <Input placeholder="Basic usage" value={selectedRow.taskName}/>
                </div>
              ) : (
                <p>No task selected</p>
              )}
          </Modal>
          <Button disabled={deleteDisabled} id='delete_btn' onClick={showDeleteConfirm} type="dashed" danger>
            Delete
          </Button>
          <Search placeholder="input search text" onSearch={onSearch} enterButton style={{ width: '100%' }} />
        </div>
      </div>
    <Content
      style={{
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
    <div>
    <Spin spinning={loading} size='large' tip='Loading data..'>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        style={{ cursor: 'pointer' }}
        size='small'
        columns={columns}
        dataSource={data}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/task/details/${record.key}`);
            },
            onClick: () => {
              setSelectedRow(record.key);
            },
            style: {
              backgroundColor: selectedRow === record.key ? '#f5f5f5' : '',
              cursor: 'pointer',
            },
          };
        }}
        pagination={{
          pageSize: 15,
          style: { marginTop: '2%' }
        }}

      />
      </Spin>
    </div>
    </Content>
    </Layout>
  );
};
export default App;