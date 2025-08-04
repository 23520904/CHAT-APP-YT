import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

const useSignup = () => {
  // Khoi tao state
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  //
  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;
    //Send request to server
    setLoading(true);

    try {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });
      //Get response
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      //Save user data
      localStorage.setItem("chat-user", JSON.stringify(data));
      //Update the context that this user has logged in
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, signup };
};
export default useSignup;
function handleInputErrors({
  fullName,
  username,
  password,
  confirmPassword,
  gender,
}) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }
  if (password != confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 charaters");
    return false;
  }
  return true;
}
