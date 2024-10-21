import React from 'react';
import Search from './Search';
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  return (
    <div
      className='border-r border-slate-500 p-4 flex flex-col h-full w-full sm:w-64 md:w-72 bg-gray-800 text-white'
    >
      {/* Top part - Search bar */}
      <div className='sm:mb-4 md:mb-0 lg:mb-0'>
        <Search />
      </div>

      {/* Middle part - Conversations (takes the most space on small screens) */}
      <div className='sm:flex-grow sm:overflow-y-auto md:flex-grow-0 lg:flex-grow-0'>
        <Conversations />
      </div>

      {/* Bottom part - Logout button */}
      <div className='sm:mt-4 md:mt-0 lg:mt-0'>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
