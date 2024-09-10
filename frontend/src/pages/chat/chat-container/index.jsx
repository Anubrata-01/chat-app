/* eslint-disable react/prop-types */

// import ChatHeader from "./ChatHeader";
// import MessageArea from "./MessageArea";
// import InputChatMessage from "./InputChatMessage";
// import { SocketProvider } from '../../../context/socketContext'
 

// const ChatContainer = ({ closeChat, contact, isMobileView }) => {
//   return (
//     <div className="flex flex-col h-full">
//       <SocketProvider>
//       <ChatHeader closeChat={closeChat} contact={contact} isMobileView={isMobileView} />
//       <MessageArea contact={contact} />
//       <InputChatMessage recipientId={contact?._id} />
//       </SocketProvider>
//     </div>
//   );
// };

// export default ChatContainer;

import ChatHeader from "./ChatHeader";
import MessageArea from "./MessageArea";
import InputChatMessage from "./InputChatMessage";

const ChatContainer = ({ closeChat, contact, isMobileView }) => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader closeChat={closeChat} contact={contact} isMobileView={isMobileView} />
      {contact ? (
        <>
          <MessageArea activeContactId={contact._id} />
          <InputChatMessage recipientId={contact._id} />
        </>
      ) : (
        <div className="text-center p-4">Select a contact to start chatting.</div>
      )}
    </div>
  );
};

export default ChatContainer;
