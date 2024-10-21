import React, { useState, useEffect } from "react";
import MessageContainer from "../../Components/messages/MessageContainer";
import Sidebar from "../../Components/Sidebar/Sidebar";
import useConversation from "../../Zustand/useConversation"; // Import Zustand hook

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { selectedConversation } = useConversation(); // Get the selected conversation from Zustand

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
      className={`flex flex-col md:flex-row sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0
      ${isMobile ? "p-2.5 h-[calc(100vh-20px)]" : ""}   
      `}
    >
      {isMobile ? (
        // Mobile view: show only one component at a time
        <>
          {selectedConversation ? (
            // If a conversation is selected, show the MessageContainer
            <MessageContainer />
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
