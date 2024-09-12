
/* eslint-disable react/prop-types */
import { useSocket } from "@/context/socketContext";
import {  senderIdAtom } from "@/stores/chat-slice";
import { fetchUserInfo } from "@/utilities";
import EmojiPicker from "emoji-picker-react";
import { useAtom } from "jotai";
import { useState } from "react";
import { FaPaperclip, FaPaperPlane, FaSmile } from "react-icons/fa";
import { useQuery } from "react-query";

const InputChatMessage = ({ recipientId }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { sendMessage } = useSocket();
  const [,setSenderId]=useAtom(senderIdAtom);
  // const [,setNotificationMessageContainer]=useAtom(notificationMessageContainerAtom);

  const { data, isLoading, error } = useQuery("userInfo", fetchUserInfo);

  const senderId = data?.user?._id;
  setSenderId(senderId)
  const handleSend = () => {
  
    if (message.trim() && senderId) { 
      sendMessage(recipientId, message, senderId); 
      // setNotificationMessageContainer(message,recipientId)
      setMessage(""); 
    } else {
      console.error("Cannot send message. Sender ID or message is missing.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user info</p>;

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
            <EmojiPicker
              onEmojiClick={(emojiObject) => setMessage(message + emojiObject.emoji)}
            />
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 rounded bg-[#1c1d25] text-white"
      />

      <button className="text-white text-xl ml-3" onClick={handleSend}>
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default InputChatMessage;


