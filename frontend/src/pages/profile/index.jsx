import { userInfoAtom } from "@/stores/auth-slice";
import { useAtomValue } from "jotai";


const Profile = () => {
  const userInfo = useAtomValue(userInfoAtom);
    console.log(userInfo)
  if (!userInfo) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Email:</strong> {userInfo?.user?.email}</p>
      <p><strong>Profile Setup:</strong> {userInfo.profileSetup ? 'Complete' : 'Incomplete'}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Profile;

