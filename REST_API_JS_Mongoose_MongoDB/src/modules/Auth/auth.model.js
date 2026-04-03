import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
		minLength: [3, "Name must be at least 3 characters long"],
		maxLength: [50, "Name must be less than 50 characters long"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		lowercase: true,
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
			"Please enter a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minLength: [6, "Password must be at least 6 characters long"],
		maxLength: [100, "Password must be less than 100 characters long"],
		select: false, // Exclude password from query results by default
	},
	role: {
		type: String,
		enum: ["customer", "seller", "admin"],
		default: "customer",
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
