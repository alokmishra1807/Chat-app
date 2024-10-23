import React from 'react';
import Search from './Search';
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  return (
    <div className='flex flex-col h-full p-2 md:p-4 border-r border-slate-500 w-full sm:w-64'>
      <Search />
      <div className='divider px-3'></div>
      <div className='flex-grow overflow-auto'>
        <Conversations />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
