import React from 'react'
import 'antd/dist/antd.css';
import { Routes, Route } from 'react-router-dom'
import FormChat from './components/Form/FormChat';
import Chat from './components/Chat/Chat';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<FormChat/>}/>
            <Route path="/chat" element={<Chat/>}/>
        </Routes>
    )
}

export default App