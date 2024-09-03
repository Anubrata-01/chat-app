import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UPDATEUSER_URL } from "@/constant";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userInfoAtom } from "@/stores/auth-slice";

const Profile = () => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    image: null,
    color: "#9B1212",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.profileSetup) {
      setProfileData({
        firstname: userInfo.firstname || "",
        lastname: userInfo.lastname || "",
        image: userInfo.image || null,
        color: userInfo.color || "#9B1212",
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(UPDATEUSER_URL, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          color: profileData.color,
          // assuming you want to store the image data as well
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        toast.success('Profile updated successfully!');
        navigate("/chat");
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 text-white flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-32 h-32" style={{
              borderColor: profileData.color,
              borderWidth: "4px",
              borderStyle: "solid",
            }}>
            {profileData.image ? (
              <AvatarImage src={profileData.image} />
            ) : (
              <AvatarFallback
                style={{ color: profileData.color, fontSize: "2rem" }}
              >
                {profileData.firstname.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <label
            htmlFor="image"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors mt-4 cursor-pointer"
          >
            Set Image
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Create Your Profile
          </h1>

          <input
            type="text"
            name="firstname"
            value={profileData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full p-2 mb-4 border rounded-lg text-black"
          />

          <input
            type="text"
            name="lastname"
            value={profileData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full p-2 mb-4 border rounded-lg text-black"
          />

          <label htmlFor="color" className="block text-gray-800 mb-2">
            Choose a color:
          </label>
          <input
            type="color"
            name="color"
            value={profileData.color}
            onChange={handleInputChange}
            className="w-20 h-10 p-2 mb-4 border rounded-lg"
          />

          <div className="flex gap-8 mt-5">
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition-colors mb-4"
            >
              Save
            </Button>

            <Button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
            >
              Edit 
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



