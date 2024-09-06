/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaTimes, FaPaperclip, FaSmile, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
const ChatHeader = ({ closeChat, contact, isMobileView }) => {
    return (
      <div className="flex items-center justify-between p-4 border-b border-[#2f3b22]">
        {isMobileView && (
          <button className="text-white text-xl mr-2" onClick={closeChat}>
            <FaArrowLeft />
          </button>
        )}
        <h2 className="text-lg font-bold text-white">{`${contact?.firstname || "First"} ${contact?.lastname || "Last"}`}</h2>
        {!isMobileView && (
          <button className="text-white text-xl" onClick={closeChat}>
            <FaTimes />
          </button>
        )}
      </div>
    );
  };
const MessageArea = () => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">

      <div className="text-gray-300">
        <p>This is where your chat messages will appear.</p>
      
      </div>
    </div>
  );
};

const InputChatMessage = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage(''); 
    }
  };

  return (
    <div className="relative flex items-center p-4 border-t border-[#2f3b22] bg-[#2f3b22]">
      <button className="text-white text-xl mr-3">
        <FaPaperclip />
      </button>

      <div className="relative">
        <button
          className="text-white text-xl mr-3"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="flex-1 p-2 rounded bg-[#1c1d25] text-white"
      />

      <button className="text-white text-xl ml-3" onClick={handleSend}>
        <FaPaperPlane />
      </button>
    </div>
  );
};


const ChatContainer = ({ closeChat, contact, isMobileView }) => {
    return (
      <div className="flex flex-col h-full ">
        <ChatHeader closeChat={closeChat} contact={contact} isMobileView={isMobileView} />
        <MessageArea />
        <InputChatMessage />
      </div>
    );
  };
export default ChatContainer;