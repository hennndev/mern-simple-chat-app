import React, { useState } from 'react'
import { Button, Form, Input, Select, Typography, Space } from 'antd';
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
const { Title } = Typography

const FormChat = () => {

    const navigate = useNavigate()
    const [data, setData] = useState({
        username: '',
        room: ''
    })
    const handleNavigate = () => {
        if(data.username && data.room) {
            navigate(`/chat?username=${data.username}&room=${data.room}`)
        }
    }
    const handleUsername = (e) => {
        setData({
            ...data,
            username: e.target.value
        })
    }
    const handleRoom = (val) => {
        setData({
            ...data,
            room: val
        })
    }
    
    return (
        <Container direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
            <Form layout="vertical" autoComplete="off" onFinish={handleNavigate}>
                <Title strong level={4}>Join Room Chat</Title>
                <Form.Item label="Username" name="username"  
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    ]}
                >
                    <Input value={data.username} onChange={handleUsername}/>
                </Form.Item>

                <Form.Item label="Room" name="room"
                    rules={[
                        {
                            required: true,
                            message: 'Please select your room!',
                        },
                    ]}
                >
                    <Select value={data.room} onChange={handleRoom}>
                        <Select.Option value="">Select room chat</Select.Option>
                        <Select.Option value="Sistem_Informasi">S1 Sistem Informasi</Select.Option>
                        <Select.Option value="Universitas_Terbuka">Universitas Terbuka</Select.Option>
                    </Select>
                </Form.Item>
                <Space direction="horizontal" style={{width: '100%', justifyContent: 'center', marginTop: '10px'}}>
                    <Button type="primary" htmlType="submit">Enter Chat</Button>
                </Space>
            </Form>
        </Container>
    )
}



const Container = styled(Space)`
    margin-top: 70px;
    padding: 0 15px;
    form {
        width: 250px;
    }
    h4 {
        text-align: center;
        margin-bottom: 15px;
    }
`
export default FormChat