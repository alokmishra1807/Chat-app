import React, { useState, useEffect } from "react";
import MessageContainer from "../../Components/messages/MessageContainer";
import Sidebar from "../../Components/Sidebar/Sidebar";
import useConversation from "../../Zustand/useConversation"; 

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { selectedConversation } = useConversation(); 

  // Check for screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      {isMobile ? (
       
        <>
          {selectedConversation ? (
           
            <MessageContainer />
          ) : (
           
            <Sidebar />
          )}
        </>
      ) : (
       
        <>
          <Sidebar />
          <MessageContainer />
        </>
      )}
    </div>
  );
};

export default Home;
