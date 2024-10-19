import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
   

  },
  username: {
    type: String,
  
    unique: true,
  
  },
  password: {
    type: String,
   
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], 
   
  },
  profilePic: {
    type: String, 
    default: '',  
  },
},{timestamps:true} );

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
