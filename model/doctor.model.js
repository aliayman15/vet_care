import mongoose from "mongoose";
import bcrypt from "bcrypt";

const doctorSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Normalize email
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Ensure a strong password
    select: false, // Exclude password from queries by default
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Pre-save hook to hash the password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
