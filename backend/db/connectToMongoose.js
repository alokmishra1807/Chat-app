import mongoose from "mongoose"

const connectToMongoose = async() => {
 try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log("connection successful to mongodb")
 } catch (error) {
    console.log("Error in connecting Mongodb",error.message)
 }
}

export default connectToMongoose 