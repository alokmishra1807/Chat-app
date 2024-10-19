import { useEffect } from "react";

import { useSocketContext } from "../context/soketContext";


import notificationSound from "../assets/sounds/notification.mp3";
import useConversation from "../Zustand/useConversation";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
		



			const sound = new Audio(notificationSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;