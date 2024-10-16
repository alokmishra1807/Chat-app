import User from "../Models/user.modal.js";

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id;

        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");//$ne ensures that loggedinuser donot come when request is sent

        res.status(200).json(filteredUser);


    } catch (error) {
        console.error("error in getUsersForSidebar :",error.message);
         res.status(500).json({error:"Internal Server Error"});
    }
}