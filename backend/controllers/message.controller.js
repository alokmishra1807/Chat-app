import mongoose from "mongoose"; // Import mongoose to use ObjectId
import Conversation from "../Models/conversation.modal.js";
import Message from "../Models/message.modal.js";


import { getReceiverSocketId, io } from "../Soket/soket.js";
export const sendMessages = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      message,
    });

    //  await conversation.save();
    //  await newMessage.save();

 

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);


const receiverSocketId = getReceiverSocketId(recieverId);
if(receiverSocketId){
  io.to(receiverSocketId).emit("newMessage",newMessage);
}


    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in message controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getMessages = async(req,res)=>{
try {
  const {id :userToChatId} = req.params;
  const senderId = req.user._id;
  const conversation = await Conversation.findOne({
    participants:{$all:[senderId,userToChatId]},//$all checks the array in any order but senderId and recieverId must be present
  }).populate("messages");//Not reference but actual message is passes


if(!conversation){
 return res.status(200).json([]);
}
const messages = conversation.messages;

res.status(200).json(messages);

} catch (error) {
  console.log("Error in getmessage controller:", error.message);
  return res.status(500).json({ error: "Internal Server Error" });
}
}