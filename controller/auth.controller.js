import PetOwner from "../model/petOwner.model.js";
import jwt from "jsonwebtoken";

// Signup function
export const signup = async (req, res) => {
  const { name, address, phone, email, password, whatsappNumber, businessName } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await PetOwner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new PetOwner({
      name,
      address,
      phone,
      email,
      password,
      whatsappNumber,
      businessName,
    });

    // Save the user in the database
    await newUser.save();

    // Create JWT token
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15d' });

    res.cookie("accessToken", accessToken, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Ensures it is sent over HTTPS in production
        maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expires after 15 days
      });
  
      // Respond with the user details (without password)
    const { password: userPassword, ...userData } = newUser.toObject(); // Exclude the password field
      // Respond with the user details (without password)
      res.status(201).json({ message: "User created successfully", user: userData });
  } catch (error) {
    console.error("Error in signup", error.message);
    res.status(500).json({ message: "Error signing up user" });
  }
};
// Login function
export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await PetOwner.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare the password
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Create a JWT token
      const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15d' });
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true,  // Makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production",  // Ensures the cookie is sent over HTTPS in production
        maxAge: 15 * 24 * 60 * 60 * 1000,  // Cookie expires after 15 days
      });
  
      // Exclude password from response
    const { password: userPassword, ...userData } = user.toObject();  // Exclude the password field

    // Respond with success and user details (without password)
    res.status(200).json({ message: "Login successful", user: userData });
    } catch (error) {
      console.error("Error in login", error.message);
      res.status(500).json({ message: "Error logging in user" });
    }
  };
  // Signout function
export const logout = async (req, res) => {
    try {
      // Clear the cookie containing the access token
      res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  
      // Respond with success
      res.status(200).json({ message: "Successfully signed out" });
    } catch (error) {
      console.error("Error in signout", error.message);
      res.status(500).json({ message: "Error signing out" });
    }
  };
  