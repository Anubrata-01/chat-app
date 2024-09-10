/* eslint-disable react/prop-types */
import { FaArrowLeft, FaTimes } from "react-icons/fa";

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
  export default ChatHeader