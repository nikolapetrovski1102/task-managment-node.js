import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/getTask/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        console.log(response.data);
        setTask(response.data.task);
        setTaskPriority(response.data.task.priority);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [id]);

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
          <Input value={ task.name } />
        </Form.Item>
        <Form.Item label="Status">
          <Select defaultValue={task == null ? 'Not started' : task.status } >
            <Select.Option value="Finished">Finished</Select.Option>
            <Select.Option value="In progress">In progress</Select.Option>
            <Select.Option value="On hold">On hold</Select.Option>
            <Select.Option value="Not started">Not started</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Priority">
          <Select defaultValue={taskPriority} >
            <Select.Option value="P0">P0</Select.Option>
            <Select.Option value="P1">P1</Select.Option>
            <Select.Option value="P2">P2</Select.Option>
            <Select.Option value="P3">P3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Assign To">
          <Select>
            <Select.Option value="P0">Nikola</Select.Option>
            <Select.Option value="P1">Anita</Select.Option>
            <Select.Option value="P2">Hristijan</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Due Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea value={ task.description } rows={5} />
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
          <Button>Save</Button>
        </Form.Item>
      </Form>
    </Content>
    </Layout>
  );
};
export default () => <FormDisabledDemo />;