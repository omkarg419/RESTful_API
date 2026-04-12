import ApiError from "../../common/utils/api-error.js";
import { generateResetToken } from "../../common/utils/jwt.utills.js";
import User from "./auth.model.js";

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
    console.log("userDB: ",user);
    

	// TODO: send an email to user with rowtoken to verify user

	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.verificationToken;
console.log("userOBJ: ",userObj);

	return userObj;
};

export { register };
