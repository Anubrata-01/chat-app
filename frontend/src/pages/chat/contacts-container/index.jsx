/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import { GETUSERDATA_URL } from "@/constant";
/* eslint-disable react/prop-types */
import { LOGOUT_URL } from "@/constant";
import { userInfoAtom } from "@/stores/auth-slice";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { AiOutlineLogout } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchUserdata, fetchUserInfo, handleSearchContacts } from "@/utilities";
import { useSocket } from "@/context/socketContext";

const ContactsContainer = ({ onContactClick }) => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [searchContacts, setSearchContacts] = useState([]);
  const { data, isLoading, error } = useQuery("userInfo", fetchUserInfo);
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery("users", fetchUserdata);
  const navigate = useNavigate();
  const { notificationMessages } = useSocket(); // Use socket context to get notifications

  const backendURL = "http://localhost:8747";
  const userImagePath = data?.user?.image ? `${backendURL}${data.user.image}` : "/default-avatar.png";

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      });
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Search Contacts
  const debounce = (fn, delay) => {
    let timeId;
    return (...args) => {
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const debouncedSearch = debounce(handleSearchContacts, 400);

  if (isLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  if (error || usersError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="relative md:w-[25vw] lg:w-[25vw] bg-[#1b1c24] border-r-2 border-[#2f3b22] p-4">
      <div className="text-xl font-bold text-white mb-4 pr-10 flex justify-between">
        <p>Chat</p>
        <button className="text-lg font-extrabold text-red-400" onClick={handleLogout}>
          <AiOutlineLogout />
        </button>
      </div>

      {/* Search Contacts */}
      <div className="my-3">
        <div className="flex items-center justify-between pr-10">
          <Input
            type="text"
            placeholder="Search Contacts"
            className="text-black h-8"
            onChange={(e) => debouncedSearch(e.target.value, setSearchContacts)}
          />
        </div>
      </div>

      {/* Channels */}
      <div className="my-3">
        <div className="flex items-center justify-between pr-10">
          <Title text={"CHANNELS"} />
        </div>
      </div>

      {/* Contacts List with Notifications */}
      <div className="space-y-4 h-[60vh] overflow-y-scroll scrollbar-hide">
        <div>
          {searchContacts.length > 0
            ? searchContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 p-2 hover:bg-[#2f3b22] rounded-md cursor-pointer transition-colors"
                  onClick={() => onContactClick(contact)}
                >
                  <img
                    src={`${backendURL}${contact.image}`}
                    alt={`${contact.firstname || "First"}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">
                      {`${contact.firstname || "First"} ${contact.lastname || "Last"}`}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      hello
                    </p>
                  </div>
                  
                </div>
              ))
            : users?.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-1 p-2 hover:bg-[#2f3b22] rounded-md cursor-pointer transition-colors"
                  onClick={() => onContactClick(contact)}
                >
                  <img
                    src={`${backendURL}${contact.image}`}
                    alt={`${contact.firstname || "First"}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">
                      {`${contact.firstname || "First"} ${contact.lastname || "Last"}`}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      hello
                    </p>
                  </div>
                
                </div>
              ))}
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-6 flex items-center space-x-3">
        <img
          src={userImagePath || "/default-avatar.png"}
          alt={`${data?.user?.firstname || "User"}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-white">
          <span className="block text-sm font-semibold">
            {`${data?.user?.firstname || "First"} ${data?.user?.lastname || "Last"}`}
          </span>
          <span className="block text-xs text-gray-400">
            {data?.user?.email || "Email not available"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Title Component
const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;

