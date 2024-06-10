import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Tag,
  Avatar,
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
  Spin,
  Row,
  Col,
} from 'antd';
import { User } from '../Models/UserModel'

const { Content } = Layout;

const UserDetailsForm = () =>{
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
    const {
        token: { colorBgContainer, borderRadiusLG },
        } = theme.useToken();
    const { accessToken } = useParams();
    const [user, setUser] = useState<User>([]);
    const [role, setRole] = useState('');
    const [fullname, setFullname] = useState('');
    const [spinning, setSpinning] = React.useState(false);
    const [isPasswordDisabled, setIsPasswordDisabled] = React.useState(true)
    const [percent, setPercent] = React.useState(0);
    const [componentDisabled, setComponentDisabled] = React.useState(false);

    useEffect( () => {
        setSpinning(true);
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_user_by_token`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setSpinning(false);
                setUser(response.data);
                setFullname(response.data.fullname);
                setRole(response.data.role);
                if (response.data.role == 'User') {
                    setComponentDisabled(true);
                }
                } catch (error) {
                setSpinning(false);
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    
    }, [])

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
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
          <Breadcrumb.Item>{user.fullname}</Breadcrumb.Item>
        </Breadcrumb>
        <Divider style={{ margin: '-.5% 0 1% 0' }} />
        <Content
      style={{
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        width: '100%', height: '92vh', overflow: "scroll", margin: 'auto', overflowX: 'hidden',
      }}
    >
            <Avatar
          style={{
            backgroundColor: colorList[user.id],
            verticalAlign: 'middle',
            marginRight: '10px',
            boxShadow: '0 0 0 2px #fff',
            margin: '2% 0% 0% 5%',
          }}
          size={{ xs: 74, sm: 82, md: 90, lg: 114, xl: 130, xxl: 150 }}
          gap={1}
        >
        { fullname.split(' ').length > 1 ? fullname.split(' ')[0][0] + fullname.split(' ')[1][0] : fullname.split(' ')[0][0]}
      </Avatar>
      <Divider />
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="vertical"
        disabled={componentDisabled}
        style={{
          width: '100%',
          margin: '5% 0 0 9%',
        }}
        >
            <Row gutter={[48, 8]}>
                <Col span={12}>
                <Form.Item label="Email">
                    <Input value={user.email} />
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password disabled={isPasswordDisabled} />
                    <a style={{ color: 'blue' }} onClick={ () => setIsPasswordDisabled(false)} >Change password</a>
                </Form.Item>
                <Form.Item label='Tasks in progress'>
                    <Input disabled={true} type='number' value={user.currentTasks} />
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="Fullname">
                    <Input value={user.fullname} />
                </Form.Item>
                <Form.Item label="Role">
                    <Select
                        value={role} 
                        onChange={(value) => setRole(value)}
                    >
                        <Select.Option value="Boss">Boss</Select.Option>
                        <Select.Option value="Super_Admin">Super_Admin</Select.Option>
                        <Select.Option value="Admin">Admin</Select.Option>
                        <Select.Option value="User">User</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Finished tasks'>
                    <Input disabled={true} type='number' value={user.finishedTasks} />
                </Form.Item>
                </Col>
            </Row>

        </Form>
        <Spin spinning={spinning} fullscreen />
    </Content>
    </Layout>
    );
}

export default UserDetailsForm;