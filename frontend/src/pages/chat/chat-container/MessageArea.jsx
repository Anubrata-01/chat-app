/* eslint-disable react/prop-types */
import { useSocket } from '@/context/socketContext';
import { useState, useEffect } from 'react';

const MessageArea = ({ activeContactId }) => {
  const [messages, setMessages] = useState([]);
  const { socket, chatHistory,setChatHistory } = useSocket();

  
  console.log(chatHistory)
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (message) => {
      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [message.senderId]: [...(prevHistory[message.senderId] || []), message],
      }));
    };

    socket.on('receive_message', handleMessage);

    return () => {
      if (socket) {
        socket.off('receive_message', handleMessage);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (activeContactId && chatHistory[activeContactId]) {
      setMessages(chatHistory[activeContactId]);
    } else {
      setMessages([]);
    }
  }, [activeContactId, chatHistory]);

  return (
    <div className="message-area flex-1 p-4 overflow-y-auto">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className="message my-2 p-2 bg-gray-100 rounded-lg">
            <div className="text-sm text-gray-600">
              {msg.content}
            </div>
            <div className="text-xs text-gray-500">
              {/* {formatTimestamp(msg.timestamp)} */}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No messages yet</div>
      )}
    </div>
  );
};

export default MessageArea;




