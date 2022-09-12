import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import queries from 'query-string'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Typography, Input, Modal, Button } from 'antd'
import { MoreOutlined, SendOutlined } from '@ant-design/icons'
const { Text, Title } = Typography
let socket = io.connect('http://localhost:5000')

const Chat = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [userList, setUserList] = useState([])
    const [msgValue, setMsgValue] = useState('')
    const [messages, setMessages] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const queryParsed = queries.parse(location.search)
    const username = queryParsed.username
    const room = queryParsed.room.replace('_', ' ')


    useEffect(() => {
        document.querySelector('.ant-card-body').scrollTop = document.querySelector('.ant-card-body').scrollHeight

        socket.emit('join', {username, room})
        socket.on('displayed_users', users => setUserList(users))
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [socket, location.search])


    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages])
    


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleMessage = () => {
        socket.emit('send_message', {sender: username, text:msgValue})
        setMsgValue('')
    }
    return (
        <ChatContainer>
            <Modal 
                title="Member Group" 
                open={isModalOpen} 
                onOk={handleCancel} 
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                      Cancel
                    </Button>,
                    <ButtonLeave
                      key="link"
                      href="http://localhost:3000"
                      type="primary"
                    >
                      Leave Room
                    </ButtonLeave>,
                ]}>
                {userList.map(user => (
                    <p key={user.id}>{user.username}</p>
                ))}
            </Modal>
            <ChatBox 
                title={room.replace('_', ' ')} 
                extra={<MoreIcon onClick={() => setIsModalOpen(true)}/>}
                actions={[
                    <Input.Group size='large'>
                        <Input
                            addonAfter={<SendOutlined style={{cursor: 'pointer'}} onClick={handleMessage}/>}
                            value={msgValue}
                            onChange={(e) => setMsgValue(e.target.value)}
                            placeholder="Type message here..."
                        />
                    </Input.Group>
                  ]}>
                {messages.map(msg => (
                    <ChatItem key={msg.id} currentUser={msg.sender === username}>
                        {msg.sender !== 'Admin' && (
                            <div className='chat-item-header'>
                                <Text>{msg.sender} <span className="chat-item-date">{msg.sendAt}</span></Text>
                            </div>
                        )}
                        <Title level={5} style={{color: msg.sender === 'Admin' && '#595959', fontSize: msg.sender === 'Admin' && '14px'}}>{msg.text}</Title>
                    </ChatItem>
                ))}
            </ChatBox>
        </ChatContainer>
    )
}


const ChatContainer = styled.section`
    width: 100%;
    display: flex; 
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #212121;
    padding: 30px 15px;
`
const MoreIcon = styled(MoreOutlined)`
    cursor: pointer;
`
const ChatBox = styled(Card)`
    width: 500px;
    .ant-card-body {
        background-color: #F9F9F9;
        overflow-y: scroll;
        scrollbar-width: none;
        height: 450px;
        position: relative;
    }
    .ant-card-actions {
        padding: 0 15px;
    }
    .ant-card-body::-webkit-scrollbar { 
        display: none;  /* Safari and Chrome */     
    }
    @media (max-width: 500px) {
        width: 100%;
        .ant-card-body {
            height: 600px;
        }
    }
`
const ChatItem = styled.div`
    background: #fff;
    padding: 3px 10px;
    border-radius: 6px;
    width: fit-content;
    margin-bottom: 10px;
    margin-left: ${({currentUser}) => currentUser && 'auto'};

    .chat-item-header {
        span {
            color: gray;
        }
        .chat-item-date {
            margin-left: 6px;
            font-size: 12px;
        }
    }
`

const ButtonLeave = styled(Button)`
    background: #FF4A4A;
    border-color: transparent;
    :hover {
        background-color: #E64848;
        border-color: transparent;
    }
`

export default Chat