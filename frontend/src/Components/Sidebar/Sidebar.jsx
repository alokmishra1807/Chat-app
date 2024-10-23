import React from 'react';
import SearchInput from './Search';
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  return (
    <div className='flex flex-col h-full p-2 md:p-4 border-r border-slate-500 w-full sm:w-64'>
      <SearchInput />
      <div className='divider px-3'></div>

  
      <div className='flex-grow overflow-auto mb-4 sm:mb-2'>
        <Conversations />
      </div>

   
      <div className='mt-auto sm:mt-2 mb-2'>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
