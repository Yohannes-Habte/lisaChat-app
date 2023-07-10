import React, { useContext, useState } from 'react'
import TopNavbar from '../../components/chatComponents/topNavbar/TopNavbar';
import MyChats from '../../components/chatComponents/myChats/MyChats';
import ChatBox from '../../components/chatComponents/chatBox/ChatBox';
import './Chat.scss';
import { UserChatContext } from '../../context/ChatProvider';

const Chat = () => {
    const { user } = useContext(UserChatContext);
    const [fetchAgain, setFetchAgain] = useState(false);
  
    return (
      <main className="chat-page">
        <div className="chat-container">
          {user && <TopNavbar />}
  
          <div className="chat-section">
            {user && (
              <MyChats fetchAgain={fetchAgain} />
            )}
            {user && (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />
            )}
          </div>
        </div>
      </main>
    );
}

export default Chat