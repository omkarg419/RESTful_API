import ApiError from "../../common/utils/api-error.js";
import {
	generateAccessToken,
	generateRefreshToken,
	generateResetToken,
} from "../../common/utils/jwt.utills.js";
import User from "./auth.model.js";

const hashToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
	const existingUser = await User.findOne({ email });

	if (existingUser) throw ApiError.conflict("User email alredy exisits");

	const { rowToken, hashedToken } = generateResetToken();

	const user = await User.create({
		name,
		email,
		password,
		role,
		verificationToken: hashedToken,
	});

	// TODO: send an email to user with rowtoken to verify user

	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.verificationToken;

	return userObj;
};

const login = async ({ email, password }) => {
	const user = await User.findOne({ email }).select("+password");
	if (!user) throw ApiError.unauthorized("Invalid email or password");

	// somehow we check the password is correct or not

	if (!user.isVerified)
		throw ApiError.forbbiden("Please verify your email to login");

	const accessToken = generateAccessToken({ id: user._id, role: user.role });
	const refreshToken = generateRefreshToken({ id: user._id });

	user.refreshToken = hashToken(refreshToken);
	await user.save({ validateBeforeSave: false });

	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.refreshToken;

	return { user: userObj, accessToken, refreshToken };
};

export { register, login };
