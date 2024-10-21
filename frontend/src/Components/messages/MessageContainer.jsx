const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();
  
    useEffect(() => {
      return () => setSelectedConversation(null);
    }, [setSelectedConversation]);
  
    return (
      <div className="flex flex-col h-full w-full md:min-w-[450px]">
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <>
            <div className="bg-slate-500 px-4 py-2 flex items-center justify-between mb-2">
              <span className="text-gray-900 font-bold">
                {selectedConversation.fullName}
              </span>
              <IoBackspaceSharp
                className="w-6 h-6 text-white cursor-pointer"
                onClick={() => setSelectedConversation(null)}
              />
            </div>
  
            <div className="flex-grow overflow-y-auto">
              <Messages />
            </div>
  
            <div className="mt-2">
              <MessageInput />
            </div>
          </>
        )}
      </div>
    );
  };
  