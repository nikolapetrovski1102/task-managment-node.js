import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import {
  Tag,
  Avatar,
  Spin,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  theme,
  Layout,
  Breadcrumb,
  Divider,
} from 'antd';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const FormDisabledDemo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [task, setTask] = useState(id);
  const [taskPriority, setTaskPriority] = useState('');
  const [users, setUsers] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const colorList = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#c30cba', 
    '#007bff', '#2db7f5', '#87d068', '#ff5500', '#f5222d', 
    '#faad14', '#13c2c2', '#52c41a', '#eb2f96', '#fa8c16', 
    '#eb2f96', '#1890ff', '#25b864', '#d9480f', '#ffc107', 
    '#6610f2', '#20c997', '#6610f2', '#e83e8c', '#e0a800', 
    '#38c172', '#1c7430', '#32a8a2', '#f012be', '#ff851b', 
    '#001f3f', '#85144b', '#3d9970', '#111111', '#aaaaaa', 
    '#39cccc', '#f56991', '#b10dc9', '#7fdbff', '#0074d9',
    '#9b4dca', '#6366f1', '#e11d48', '#fbbf24', '#10b981',
    '#6b7280', '#3b82f6', '#14b8a6', '#a855f7', '#ef4444',
    '#f97316', '#4ade80', '#2dd4bf', '#818cf8', '#d946ef',
    '#ec4899', '#fb7185', '#0d9488', '#06b6d4', '#fde047'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://cyberlink-001-site33.atempurl.com/getTask/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        console.log(response);
        setTask(response.data.task);
        setAssignTo(response.data.task.assignedTo);
        setDueDate(response.data.task.dueDate.split('T')[0]);
        setTaskPriority(response.data.task.priority);
        setTaskName(response.data.task.name);
        setDescription(response.data.task.description);
        setStatus(response.data.task.status);
        setProject(response.data.task.project);
      } catch (error) {
        console.log(error);
      }
    };

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

    fetchData();
    fetchUsers();

  }, []);

const saveTaskPost = async () => {

  setSpinning(true)

  const task = {
    name: taskName,
    status: status,
    priority: taskPriority,
    project: project,
    assignedTo: assignTo,
    dueDate: dueDate,
    assignedFrom: localStorage.getItem('access_token'),
    description: description,
    file: file,
  };

  try {
    const response = await axios.post(
      `http://cyberlink-001-site33.atempurl.com/updateTask/${id}`,
      task,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    console.log(response);
    if (response.status === 200)
      navigate('/tasks');
  } catch (error) {
    console.error('Error saving task:', error);
  }
};


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
      <Breadcrumb.Item href='/tasks' >Table</Breadcrumb.Item>
      <Breadcrumb.Item>Edit</Breadcrumb.Item>
      <Breadcrumb.Item>{id}</Breadcrumb.Item>
    </Breadcrumb>
    <Divider style={{ margin: '-.5% 0 1% 0' }} />
    <div>
    <Button onClick={ () => navigate('/tasks') } style={{ marginBottom: '1%' }} type="primary">
         back
      </Button>
    </div>
    <Content
      style={{
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        width: '100%', height: '92vh', overflow: "scroll", margin: 'auto'
      }}
    >
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{
          width: '100%',
          marginTop: '5%',
        }}
      >
        <Form.Item label="Task Name">
          <Input value={taskName} onInput={(e) => setTaskName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Status">
          <Select
            value={status} 
            onChange={(value) => setStatus(value)}
          >
            <Select.Option value="Finished">Finished</Select.Option>
            <Select.Option value="In progress">In progress</Select.Option>
            <Select.Option value="On hold">On hold</Select.Option>
            <Select.Option value="Not started">Not started</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Priority">
          <Select 
            value={taskPriority}
            onChange={(value) => setTaskPriority(value)}
           >
            <Select.Option value="P0"><Tag color="red">P0</Tag></Select.Option>
            <Select.Option value="P1"><Tag color="volcano">P1</Tag></Select.Option>
            <Select.Option value="P2"><Tag color="gold">P2</Tag></Select.Option>
            <Select.Option value="P3"><Tag color="green">P3</Tag></Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Project" rules={[{ required: true, message: 'Please select Project' }]} >
          <Select value={project} onSelect={(value) => setProject(value)} >
          <Select.Option value="Hello Help Me"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10415?size=medium'} ></Avatar> Hello Help Me</Select.Option>
            <Select.Option value="Axiom"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10419?size=medium'} ></Avatar> Axiom</Select.Option>
            <Select.Option value="Salesforce"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10423?size=medium'} ></Avatar> Salesforce</Select.Option>
            <Select.Option value="Reptil"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10414?size=medium'} ></Avatar> Reptil</Select.Option>
            <Select.Option value="Nikob"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10401?size=medium'} ></Avatar> Nikob</Select.Option>
            <Select.Option value="Balkanea"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10425?size=medium'} ></Avatar> Balkanea</Select.Option>
            <Select.Option value="ASK"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10402?size=medium'} ></Avatar> ASK</Select.Option>
            <Select.Option value="Paragon"> <Avatar style={{ marginBottom: '3px', marginRight: '5px' }} size={'small'} src={'https://ohanaone.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10408?size=medium'} ></Avatar> Paragon</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Assign To">
        <Select value={assignTo.id} onSelect={(value) => setTimeout(() => setAssignTo(value), 200)}>
        {users.map(user => (
          <Select.Option key={user.id} value={user.id}>
                        <Avatar
          style={{
            backgroundColor: colorList[user.id],
            verticalAlign: 'middle',
            marginRight: '10px',
            boxShadow: '0 0 0 2px #fff',
            marginBottom: '3px'
          }}
          size="small"
          gap={1}
        >
        {user.fullname.split(' ')[0][0]}{user.fullname.split(' ')[1] == null ? null : user.fullname.split(' ')[1][0]}
      </Avatar>
            {user.fullname}
          </Select.Option>
        ))}
      </Select>
        </Form.Item>
        <Form.Item label="Due Date">
          <DatePicker defaultValue={dayjs(dueDate.toString())} />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea value={ description } onInput={ (e) => setDescription(e.target.value)} rows={5} />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item style={{ alignContent: 'center' }} >
          <Button onClick={saveTaskPost} >Save</Button>
        </Form.Item>
      </Form>
      <Spin spinning={spinning} percent={percent} fullscreen />
    </Content>
    </Layout>
  );
};
export default () => <FormDisabledDemo />;