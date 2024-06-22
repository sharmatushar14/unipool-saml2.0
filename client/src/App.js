import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import From from './Pages/From';
import To from './Pages/To';
import Chat from './Pages/Chat';
import Chatroom from './Pages/Chatroom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/from"  element={<From/>} />
        <Route path="/to" element={<To/>} />  
        <Route path="/chat" element={<Chat/>} />
        <Route path="/chatroom/:name/:my_uid/:his_uid" element={<Chatroom/>} />
      </Routes>
    </Router>
  );
}

export default App;
