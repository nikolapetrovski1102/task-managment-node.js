import React, { useState, useEffect } from 'react';
import { renderMatches, useHistory, useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled, ReloadOutlined, DownOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, theme, Modal, Divider, Table, Button, Input, Spin, Tag, Avatar, Badge } from 'antd';
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

  const getStatus = (status) => {
    switch (status) {
      case 'In progress':
        return 'processing';
      case 'On hold':
        return 'default';
      case 'Not started':
        return 'warning';
      default:
        return 'error';
    }
  
  }

  useEffect( () => {
    setLoading(true);
      
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/checkUserRole`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        localStorage.setItem('user_role', response.data);
        setUserRole(response.data);
      }
      catch(error) {
        console.error('Error checking user role:', error);
      }
    };
    fetchUserRole();
    axios.get(`${process.env.REACT_APP_API_URL}/listTasksByUser`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then((response) => {
      // Map the response data to the desired format
      const tasks = response.data.tasks.map((task) => ({
        key: task.id,
        taskName: task.name,
        dueDate: task.dueDate != null ? task.dueDate.split('T')[0] : '',
        priority: <Tag color={getColor(task.priority)}>{task.priority}</Tag>,
        project: <p style={{ marginBottom: '0' }}><Avatar style={{ marginBottom: '1px' }} size={'small'} src={getProject(task.project)}></Avatar> {task.project}</p>,
        status: <Badge status={getStatus(task.status)} text={task.status} />
      }));
  
      const sortTasksByPriority = (a, b) => {
        const priorityOrder = ['P0', 'P1', 'P2', 'P3']; // Define your priority order here
        return priorityOrder.indexOf(a.priority.props.children) - priorityOrder.indexOf(b.priority.props.children);
      };
  
      const sortedTasks = tasks.sort(sortTasksByPriority);

      setData(sortedTasks);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      if (error.response.status === 403) {
        if (localStorage.getItem('access_token'))
          localStorage.removeItem('access_token');
        navigate('/');
      }
      setLoading(false);
    });
  }, []);

  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRowEdit, setSelectedRowEdit] = useState(null);
  const [editDsiabled, setEditDisable] = useState(true);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [deleteDisabled, setDeleteDisable] = useState(true);
  const [userRole, setUserRole] = useState('');
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

    axios.get(`${process.env.REACT_APP_API_URL}/listTasksByUser`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then((response) => {
  
      // Map the response data to the desired format
      const tasks = response.data.tasks.map((task) => ({
        key: task.id,
        taskName: task.name,
        dueDate: task.dueDate != null ? task.dueDate.split('T')[0] : '',
        priority: <Tag color={getColor(task.priority)}>{task.priority}</Tag>,
        project: <p style={{ marginBottom: '0' }}><Avatar style={{ marginBottom: '1px' }} size={'small'} src={getProject(task.project)}></Avatar> {task.project}</p>,
        status: task.status
      }));
  
      const sortTasksByPriority = (a, b) => {
        const priorityOrder = ['P0', 'P1', 'P2', 'P3'];
        return priorityOrder.indexOf(a.priority.props.children) - priorityOrder.indexOf(b.priority.props.children);
      };
  
      const sortedTasks = tasks.sort(sortTasksByPriority);

      setData(sortedTasks);

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
      item.key.toString().includes(value) || item.taskName.toLowerCase().includes(value.toLowerCase())
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

          var ids = selectedRow.map((item) => item.key);

          try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteTasks/`,
              ids,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
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
      if (selectedRowKey != null) {
        return;
      };

      setSelectedRow(selectedRows);

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
      disabled: selectedRowKey !== null,
    }),

  };

  const handleRowClick = (record) => {
    if (selectedRowKey === record.key){
      setSelectedRow(null);
      setSelectedRowKey(null);
      setEditDisable(true);
      setDeleteDisable(true);
    }
    else{
      setEditDisable(false);
      setDeleteDisable(false);
      setSelectedRowKey(record.key);
      setSelectedRow([record]);
    }
  }

  return (
    <Layout
    style={{
      padding: '0 24px 24px',
      height: '93vh',
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
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1%', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
        <div style={{ width: '20%' }} > 
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={loadings[2]}
            onClick={() => enterLoading(2)}
            style={{
              margin: '0 0% 0% 0%',
            }}
          >
          </Button>
          {userRole === 'Admin' && 
            <Button style={{ margin: '0 0 0% 5%' }} onClick={ () => navigate('/task/add') } type="primary">
              Add
            </Button>
          }
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button disabled={editDsiabled} id='edit_btn' type="primary" onClick={ () => navigate(`/task/edit/${selectedRow[0].key}`)}>
            Edit
          </Button>
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
        borderRadius: '15px',
      }}
    >
    <div>
    <Spin spinning={loading} size='large' tip='Loading data..'>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        size='small'
        columns={columns}
        dataSource={data}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/task/details/${record.key}`);
            },
            onClick: () => {
              handleRowClick(record);
            },
            style: {
              color: selectedRowKey === record.key ? 'white' : '',
              backgroundColor: selectedRowKey === record.key ? '#333' : '',
              cursor: 'pointer',
            },
            className: selectedRowKey === record.key ? 'selected-row' : '',
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