import React, { useState, useEffect } from "react";
import MessageContainer from "../../Components/messages/MessageContainer";
import Sidebar from "../../Components/Sidebar/Sidebar";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

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
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      {isMobile ? (
        // Show one component at a time on mobile
        <>
          <Sidebar /> {/* Or MessageContainer */}
        </>
      ) : (
        // Show both components on medium and large screens
        <>
          <Sidebar />
          <MessageContainer />
        </>
      )}
    </div>
  );
};

export default Home;
