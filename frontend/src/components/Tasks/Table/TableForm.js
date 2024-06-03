import React, { useState, useEffect } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { Divider, Table, Button, Input } from 'antd';
import { Breadcrumb, Layout, theme, Modal } from 'antd';
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
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
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

const initData = [];

const App = () => {

  useEffect(() => {
    axios.get('http://localhost:8081/listTasksByUser', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then((response) => {
      console.log('Response data:', response.data);

      const tasks = response.data.tasks.map((task) => ({
        key: task.id,
        taskName: task.name,
        dueDate: task.dueDate,
        priority: task.priority,
        project: task.project,
        status: task.status,
      }));

      setData(tasks);
    }).catch((error) => {
      console.log(error);
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
  const [data, setData] = useState(initData);
  const [selectedRowEdit, setSelectedRowEdit] = useState(null);
  const [editDsiabled, setEditDisable] = useState(true);
  const [deleteDisabled, setDeleteDisable] = useState(true);

  // Disable buttons when no row is selected
  window.onload = function() {
    document.getElementById('delete_btn').disabled = true;
    document.getElementById('edit_btn').disabled = true;
  };
  // end disable buttons

  // Search bar
  const onSearch = (value) => {
    const filtered = initData.filter((item) =>
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
      onOk() {

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

  // Loading button
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };
  // end loading button


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
          <Button disabled={editDsiabled} id='edit_btn' type="primary" onClick={showModal}>
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
              navigate("/task/edit/" + record.key);
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
    </div>
    </Content>
    </Layout>
  );
};
export default App;