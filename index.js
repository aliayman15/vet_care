import express from "express"
import dotenv from"dotenv"
import cookieParser from 'cookie-parser';
import authRoutes from './router/auth.router.js'; 
import { connectToMongo } from "./lib/db.js"

dotenv.config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser());
app.use('/api/auth', authRoutes)


app.listen(port,()=>{
    console.log("app is running")
    connectToMongo()
})