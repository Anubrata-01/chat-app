/* eslint-disable react/prop-types */
import { useSocket } from '@/context/socketContext';
import { senderIdAtom } from '@/stores/chat-slice';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';

const MessageArea = ({ activeContactId }) => {
  const [messages, setMessages] = useState([]);
  const [senderId] = useAtom(senderIdAtom);

  const { socket, chatHistory, setChatHistory } = useSocket();

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
  }, [socket, setChatHistory]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    if (activeContactId && chatHistory[activeContactId]) {
      setMessages(chatHistory[activeContactId]);
    } else {
      setMessages([]);
    }
  }, [activeContactId, chatHistory]);

  return (
    <div className="message-area flex flex-col flex-1 p-4 overflow-y-auto">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message w-40  my-2 p-2 rounded-lg ${msg.senderId === senderId ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'}`}
          >
            <div className={`text-sm ${msg.senderId === senderId ? 'text-gray-600 self-end' : 'text-blue-600 self-start'}`}>
              {msg.content}
            </div>
            <div className="text-xs text-gray-500">
              {formatTimestamp(msg.timestamp)}
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





