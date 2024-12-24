import mongoose from "mongoose";
import bcrypt from "bcrypt";

const petOwnerSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (phone) => /^\+?[0-9]{7,15}$/.test(phone),
      message: "Invalid phone number format",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  whatsappNumber: {
    type: String,
    validate: {
      validator: (number) => /^\+?[0-9]{7,15}$/.test(number),
      message: "Invalid WhatsApp number format",
    },
  },
  businessName: {
    type: String,
    required: false,
  },
}, { timestamps: true });

// Pre-save hook to hash the password before saving
petOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
petOwnerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const PetOwner = mongoose.model("PetOwner", petOwnerSchema);
export default PetOwner;
