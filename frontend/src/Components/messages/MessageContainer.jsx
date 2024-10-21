import { useEffect } from "react";
import useConversation from "../../Zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { IoBackspaceSharp } from "react-icons/io5";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  return (
    <div className="flex flex-col h-full w-full min-w-[350px] sm:min-w-[300px]">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 flex items-center justify-between mb-2">
            <span className="text-gray-900 font-bold">
              {selectedConversation.fullName}
            </span>
            <IoBackspaceSharp
              className="w-6 h-6 text-white cursor-pointer"
              onClick={() => setSelectedConversation(null)}
            />
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto h-[calc(100vh-180px)] sm:h-auto">
           
            <Messages />
          </div>

          {/* Message Input */}
          <div className="mt-2">
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const authUser = { fullName: "User" };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center text-lg text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl text-center" />
      </div>
    </div>
  );
};

export default MessageContainer;
