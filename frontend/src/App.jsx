import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/homePage/Home';
import Chat from './views/chatPage/Chat';
import './Styles/Background.scss';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
