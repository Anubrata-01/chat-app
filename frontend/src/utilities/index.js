

export const handleSignup = async (SIGNUP_URL,signupData,navigate) => {

    if (signupData.password !== signupData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Signup successful", data);
        navigate("/chat")
      } else {
        console.error("Signup failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  export  const handleLogin = async (SIGNIN_URL,loginData,navigate) => {
    try {
      const response = await fetch(SIGNIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful", data);
        navigate("/profile")
      } else {
        console.error("Login failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };