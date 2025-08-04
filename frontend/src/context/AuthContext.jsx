import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

//eslint-disable-next-line react-refres/only-export-components

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
