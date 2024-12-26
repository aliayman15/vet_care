import Doctor from "../model/doctor.model.js";
import jwt from "jsonwebtoken";

// Signup function for Doctor
export const doctorSignup = async (req, res) => {
  const { name, specialty, email, password } = req.body;

  try {
    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor with this email already exists" });
    }

    // Create a new doctor
    const newDoctor = new Doctor({
      name,
      specialty,
      email,
      password,
    });

    // Save the doctor in the database
    await newDoctor.save();

    // Create JWT token
    const accessToken = jwt.sign({ doctorId: newDoctor._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15d' });

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures it is sent over HTTPS in production
      maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expires after 15 days
    });

    // Respond with the doctor details (without password)
    const { password: doctorPassword, ...doctorData } = newDoctor.toObject(); // Exclude the password field
    res.status(201).json({ message: "Doctor account created successfully", doctor: doctorData });
  } catch (error) {
    console.error("Error in doctor signup", error.message);
    res.status(500).json({ message: "Error signing up doctor" });
  }
};

// Login function for Doctor
export const doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ email }).select("+password");
    if (!doctor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordCorrect = await doctor.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const accessToken = jwt.sign({ doctorId: doctor._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15d' });

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
      maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expires after 15 days
    });

    // Exclude password from response
    const { password: doctorPassword, ...doctorData } = doctor.toObject(); // Exclude the password field
    res.status(200).json({ message: "Doctor login successful", doctor: doctorData });
  } catch (error) {
    console.error("Error in doctor login", error.message);
    res.status(500).json({ message: "Error logging in doctor" });
  }
};

// Logout function for Doctor
export const doctorLogout = async (req, res) => {
  try {
    // Clear the cookie containing the access token
    res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Respond with success
    res.status(200).json({ message: "Doctor successfully signed out" });
  } catch (error) {
    console.error("Error in doctor signout", error.message);
    res.status(500).json({ message: "Error signing out doctor" });
  }
};
