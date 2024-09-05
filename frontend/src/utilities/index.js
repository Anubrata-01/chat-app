

export const handleSignup = async (SIGNUP_URL, signupData, navigate, setUserInfo) => {
  if (signupData.password !== signupData.confirmPassword) {
    return alert("Passwords do not match!");
  }

  try {
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
      credentials: "include"
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

export const handleLogin = async (SIGNIN_URL, loginData, navigate, setUserInfo) => {
  try {
      const response = await fetch(SIGNIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
          credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
          console.log("Login successful", data);
          setUserInfo(data);
          navigate("/profile");
      } else if (response.status === 401) {
          // Token expired, try to refresh
          await refreshAccessToken(navigate, setUserInfo);
      } else {
          console.error("Login failed", data);
      }
  } catch (error) {
      console.error("Error:", error);
  }
};

const refreshAccessToken = async (navigate, setUserInfo) => {
  try {
      const response = await fetch('/api/auth/refresh-token', {
          method: "POST",
          credentials: "include" // Send cookies
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

