
import { useState, useEffect } from 'react';
import ContactsContainer from './contacts-container';
import ChatContainer from './chat-container';
import EmptyChatContainer from './emptychat-container';

export default function Chat() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 408);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="flex h-screen text-white overflow-hidden">
     
      <div className={`
        ${isMobileView && chatOpen ? 'hidden' : 'block'}
        ${!isMobileView ? 'w-1.2/3 md:w-1.1/4 lg:w-1.2/5' : 'w-full'}
        bg-[#1b1c24] border-r border-[#2f3b22]
      `}>
        <ContactsContainer onContactClick={handleContactClick} />
      </div>
      
      <div className={`
        ${isMobileView && !chatOpen ? 'hidden' : 'flex flex-col'}
        flex-1 bg-[#101015]
      `}>
        {selectedContact ? (
          <ChatContainer 
            closeChat={handleCloseChat} 
            contact={selectedContact}
            isMobileView={isMobileView}
          />
        ) : (
          <EmptyChatContainer />
        )}
      </div>
    </div>
  );
}