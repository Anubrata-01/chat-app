/* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
// import { GETMESSAGE_URL } from '@/constant';
// import { useSocket } from '@/context/socketContext';
// import { senderIdAtom } from '@/stores/chat-slice';
// import { useAtom } from 'jotai';
// import { useState, useEffect, useCallback } from 'react';

// const MessageArea = ({ activeContactId }) => {
//   const [messages, setMessages] = useState([]);
//   const [senderId] = useAtom(senderIdAtom);
//   const { socket, chatHistory, setChatHistory } = useSocket();

//   // Function to add a new message (either received or sent)
//   const addMessage = useCallback((newMessage) => {
//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     setChatHistory((prevHistory) => ({
//       ...prevHistory,
//       [activeContactId]: [...(prevHistory[activeContactId] || []), newMessage],
//     }));
//   }, [activeContactId, setChatHistory]);

//   // Listen for new messages from socket and update the state
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (message) => {
//       if (message.senderId === activeContactId || message.recipientId === activeContactId) {
//         addMessage(message);
//       }
//     };

//     socket.on('receive_message', handleMessage);

//     return () => {
//       if (socket) {
//         socket.off('receive_message', handleMessage);
//       }
//     };
//   }, [socket, addMessage, activeContactId]);

//   // Fetch all messages when a new contact is selected
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         if (!senderId || !activeContactId) return;

//         const queryParams = new URLSearchParams({
//           senderId,
//           recipientId: activeContactId,
//         });

//         const response = await fetch(`${GETMESSAGE_URL}?${queryParams.toString()}`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch messages');
//         }

//         const data = await response.json();
//         setMessages(data.messages || []);
        
//         // Update chatHistory with fetched messages
//         setChatHistory((prevHistory) => ({
//           ...prevHistory,
//           [activeContactId]: data.messages || [],
//         }));
//       } catch (error) {
//         console.log('The error:', error);
//       }
//     };

//     fetchMessages();
//   }, [senderId, activeContactId, setChatHistory]);

//   // Format timestamp for message display
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const formattedDate = date.toLocaleDateString();
//     const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     return `${formattedDate} ${formattedTime}`;
//   };

//   // Update messages when chat history changes or active contact changes
//   useEffect(() => {
//     if (activeContactId && chatHistory[activeContactId]) {
//       setMessages(chatHistory[activeContactId]);
//     } else {
//       setMessages([]);
//     }
//   }, [activeContactId, chatHistory]);

//   return (
//     <div className="message-area flex flex-col flex-1 p-4 overflow-y-auto">
//       {messages.length > 0 ? (
//         messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`message w-40 my-2 p-2 rounded-lg ${
//               msg.senderId === senderId ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'
//             }`}
//           >
//             <div
//               className={`text-sm ${
//                 msg.senderId === senderId ? 'text-gray-600 self-end' : 'text-blue-600 self-start'
//               }`}
//             >
//               {msg.content}
//             </div>
//             <div className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center text-gray-500">No messages yet</div>
//       )}
//     </div>
//   );
// };

// export default MessageArea;


import { GETMESSAGE_URL } from '@/constant';
import { useSocket } from '@/context/socketContext';
import { senderIdAtom } from '@/stores/chat-slice';
import { useAtom } from 'jotai';
import { useState, useEffect, useCallback } from 'react';

const MessageArea = ({ activeContactId }) => {
  const [messages, setMessages] = useState([]);
  const [senderId] = useAtom(senderIdAtom);
  const { socket, chatHistory, setChatHistory } = useSocket();

  const addMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some(
        msg => msg.timestamp === newMessage.timestamp && msg.content === newMessage.content
      );
      
      if (messageExists) {
        return prevMessages;
      }
      
      return [...prevMessages, newMessage];
    });

    setChatHistory((prevHistory) => {
      const existingMessages = prevHistory[activeContactId] || [];
      const messageExists = existingMessages.some(
        msg => msg.timestamp === newMessage.timestamp && msg.content === newMessage.content
      );
      
      if (messageExists) {
        return prevHistory; 
      }
      
      return {
        ...prevHistory,
        [activeContactId]: [...existingMessages, newMessage],
      };
    });
  }, [activeContactId, setChatHistory]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      if (message.senderId === activeContactId || message.recipientId === activeContactId) {
        addMessage(message);
      }
    };

    socket.on('receive_message', handleMessage);

    return () => {
      if (socket) {
        socket.off('receive_message', handleMessage);
      }
    };
  }, [socket, addMessage, activeContactId]);

  // Fetch all messages when a new contact is selected
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!senderId || !activeContactId) return;

        const queryParams = new URLSearchParams({
          senderId,
          recipientId: activeContactId,
        });

        const response = await fetch(`${GETMESSAGE_URL}?${queryParams.toString()}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages || []);
        
        // Update chatHistory with fetched messages
        setChatHistory((prevHistory) => ({
          ...prevHistory,
          [activeContactId]: data.messages || [],
        }));
      } catch (error) {
        console.log('The error:', error);
      }
    };

    fetchMessages();
  }, [senderId, activeContactId, setChatHistory]);

  // Format timestamp for message display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate} ${formattedTime}`;
  };

  // Update messages when chat history changes or active contact changes
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
            className={`message w-40 my-2 p-2 rounded-lg ${
              msg.senderId === senderId ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'
            }`}
          >
            <div
              className={`text-sm ${
                msg.senderId === senderId ? 'text-gray-600 self-end' : 'text-blue-600 self-start'
              }`}
            >
              {msg.content}
            </div>
            <div className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No messages yet</div>
      )}
    </div>
  );
};

export default MessageArea;