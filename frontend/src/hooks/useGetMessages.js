import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  console.log("🚀 useGetMessages hook called");
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  console.log("🔍 Hook state - selectedConversation:", selectedConversation);
  console.log("🔍 Hook state - messages:", messages);
  console.log("🔍 Hook state - loading:", loading);

  useEffect(() => {
    console.log("🔄 useEffect triggered with:", {
      selectedConversationId: selectedConversation?._id,
      hasSelectedConversation: !!selectedConversation,
    });

    if (!selectedConversation?._id) {
      console.log("❌ No selectedConversation, skipping fetch");
      setMessages([]);
      return;
    } else {
      console.log(`✅ Selected Conversation ID: ${selectedConversation._id}`);
    }

    const getMessages = async () => {
      console.log("🎯 Starting getMessages function");
      setLoading(true);
      try {
        console.log(
          "Fetching messages for conversation:",
          selectedConversation._id
        );

        const url = `/api/messages/${selectedConversation._id}`;
        console.log("Request URL:", url);

        const res = await fetch(url);
        console.log("Response status:", res.status);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("✅ Messages received:", data);
        console.log(
          "✅ Messages count:",
          Array.isArray(data) ? data.length : "Not an array"
        );

        setMessages(data);
      } catch (error) {
        console.error("❌ Fetch error:", error);
        toast.error(error.message);
        setMessages([]);
      } finally {
        console.log("🏁 Setting loading to false");
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, setMessages]);

  console.log("🔚 Hook returning:", { messages, loading });
  return { messages, loading };
};
export default useGetMessages;
