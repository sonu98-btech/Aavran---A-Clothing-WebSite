import { config } from "./config.js"
import mongoose from "mongoose"
import dns from "dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

const connectDB = async () => {
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to Database")
    }catch(err){
        console.error("Error connecting to Database", err)
        process.exit(1)
    }
}
export default connectDB

