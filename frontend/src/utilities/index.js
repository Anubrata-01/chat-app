import { GETALLUSER_URL, GETUSERDATA_URL, REFRESH_TOKEN_URL, SEARCH_CONTACTS_URL } from "@/constant";
export const handleSignup = async (
  SIGNUP_URL,
  signupData,
  navigate,
  setUserInfo
) => {
  if (signupData.password !== signupData.confirmPassword) {
    return alert("Passwords do not match!");
  }

  try {
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Signup successful", data);
      setUserInfo(data); // Store user info
      navigate("/profile");
    } else if (response.status === 401) {
      // If token expires, attempt to refresh it
      await refreshAccessToken(navigate, setUserInfo);
    } else {
      console.error("Signup failed", data);
    }
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

export const handleLogin = async (
  SIGNIN_URL,
  loginData,
  navigate,
  setUserInfo
) => {
  try {
    const response = await fetch(SIGNIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
      credentials: "include",
    });

    // Check if the response is valid JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      data = {}; // Handle invalid JSON scenario gracefully
    }

    if (response.ok) {
      console.log("Login successful", data);
      // setUserInfo(data);
      navigate("/chat");
      setUserInfo(data);
    } else if (response.status === 401) {
      // Token expired or invalid, try to refresh
     await refreshAccessToken(navigate, setUserInfo);
    } else {
      console.error("Login failed", data);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};


const refreshAccessToken = async (navigate, setUserInfo) => {
  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      credentials: "include", // Send cookies
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Token refreshed", data);
      setUserInfo(data);
      navigate("/profile");
    } else {
      console.error("Token refresh failed", data);
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};

export const fetchUserInfo = async () => {
  const response = await fetch(GETUSERDATA_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export const fetchUserdata = async () => {
  try {
    const response = await fetch(GETALLUSER_URL, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response of fetchUserdata was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};



export const handleSearchContacts = async (searchText,setSearchContacts) => {
  try {
    if (searchText.length > 0) {
      const response = await fetch(SEARCH_CONTACTS_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchText }), 
      });
      
      if (response.status === 200) {
        const data = await response.json();
        console.log(data)
        setSearchContacts(data.contacts); 
      } else {
        console.log("Error: ", response.status);
      }
    } else {
      setSearchContacts([]); 
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
