import { create } from "zustand";

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }), // Fixed typo here
    messages: [],
    setMessages: (messages) => set({ messages }), // Ensure this uses set correctly
}));

export default useConversation;
