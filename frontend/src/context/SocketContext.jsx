import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      // Create socket connection when user is logged in
      const newSocket = io("https://chat-app-v2-lgjx.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      // Listen for 'getOnlineUsers' event
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup function - close socket when component unmounts or authUser changes
      return () => {
        newSocket.close();
      };
    } else {
      // If no authUser, close existing socket and clear state
      setSocket((prevSocket) => {
        if (prevSocket) {
          prevSocket.close();
        }
        return null;
      });
      setOnlineUsers([]); // Clear online users when logged out
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
