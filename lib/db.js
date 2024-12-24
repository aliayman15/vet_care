import mongoose from "mongoose";

export const connectToMongo = async()=>{
    try{
    const connect = await mongoose.connect(process.env.MONGODB)

        console.log(`connected to mongodb`)
    }catch(err){
        console.log(`error in mongo connection ${err.message}`)
        process.exit(1)
    }
}