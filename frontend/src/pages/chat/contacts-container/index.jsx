/* eslint-disable react/prop-types */
const ContactsContainer = ({ onContactClick }) => {
  const contacts = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      avatar: "/path/to/avatar1.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      avatar: "/path/to/avatar2.jpg",
    },
  ];

  return (
    <div className="relative  md:w-[25vw] lg:w-[25vw]  bg-[#1b1c24] border-r-2 border-[#2f3b22] p-4">
      <div className="text-xl font-bold text-white mb-4 pr-10">Chat</div>
      <div className="my-3">
        <div className="flex items-center justify-between pr-10">
          <Title text={"DIRECT MESSAGE"} />
        </div>
      </div>
      <div className="my-3">
        <div className="flex items-center justify-between pr-10">
          <Title text={"CHANNELS"} />
        </div>
      </div>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center space-x-1 p-2 hover:bg-[#2f3b22] rounded-md cursor-pointer transition-colors"
            onClick={() => onContactClick(contact)}
          >
            <img
              src={contact.avatar}
              alt={`${contact.name} avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">
                {contact.name}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {contact.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;