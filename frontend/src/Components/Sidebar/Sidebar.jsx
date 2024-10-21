import React from 'react';
import Search from './Search';
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';
import useConversation from '../../Zustand/useConversation';

const Sidebar = () => {
  const { selectedConversation } = useConversation();

  return (
    <div
      className={`border-r border-slate-500 p-4 flex flex-col 
      ${selectedConversation ? 'hidden sm:flex' : 'flex'}`}  // Hide on small screens if a conversation is selected
    >
      <Search />
      <div className='divider px-3'></div>
      <Conversations />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
