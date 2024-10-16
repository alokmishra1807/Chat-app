import mongoose from "mongoose";
import User from "./user.modal.js";
import { type } from "os";
import { timeStamp } from "console";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    Ref: User,
    required:true,
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    Ref: User,
    required:true,
  },
  message:{
    type:String,
    required:true
  }
},
{timestamps:true}
);

const Message = mongoose.model("Message",messageSchema);

export default Message
