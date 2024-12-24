import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const protectUser = async (req,res,next) => {
    try {
        const accessToken =req.cookies.accessToken
        console.log(accessToken)
        if(!accessToken){
            console.log("no access token")
            return res.status(400).json()
        }

        try {
            
            const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log(decoded)
            const user = await User.findById(decoded.userId).select("-password")
            if(!user){
                console.log('no user found')
                return res.status(404).json("user not found")
            }
            req.user=user
            next()
        } catch (error) {
            if(error.message == "TokenExpiredError"){
                return res.status(401).json({ message: "Unauthorized - Access token expired" });
            }
            throw error
        }
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
    }
}