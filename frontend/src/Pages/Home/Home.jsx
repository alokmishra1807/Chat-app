import React, { useState, useEffect } from "react";
import MessageContainer from "../../Components/messages/MessageContainer";
import Sidebar from "../../Components/Sidebar/Sidebar";
import useConversation from "../../Zustand/useConversation"; // Import Zustand hook

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { selectedConversation, setSelectedConversation } = useConversation(); // Get the selected conversation from Zustand

  // Check for screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Set to true if screen width is less than 768px (small screens)
    };

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`flex flex-col sm:h-screen sm:w-screen p-2 sm:p-4 bg-gray-400 rounded-lg ${
        isMobile ? "overflow-auto" : "overflow-hidden"
      }`}
      style={{ padding: "10px" }} // Add padding for small screens
    >
      {isMobile ? (
        // Mobile view: show only one component at a time
        <>
          {selectedConversation ? (
            // If a conversation is selected, show the MessageContainer with a Back button
            <>
              <button
                onClick={() => setSelectedConversation(null)} // Set selectedConversation to null on Back
                className="text-white bg-blue-500 p-2 rounded mb-4"
              >
                Back
              </button>
              <MessageContainer />
            </>
          ) : (
            // If no conversation is selected, show the Sidebar
            <Sidebar />
          )}
        </>
      ) : (
        // Larger screens: show both Sidebar and MessageContainer side by side
        <>
          <Sidebar />
          <MessageContainer />
        </>
      )}
    </div>
  );
};

export default Home;
