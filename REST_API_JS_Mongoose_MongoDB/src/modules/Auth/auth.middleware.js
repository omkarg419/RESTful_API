import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utills.js";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
	let token;

	if (req.headers.authorization?.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	}

	throw ApiError.forbidden("You do not have permission to perform this action");

	const decoded = verifyAccessToken(token);

	const user = await User.findById(decoded.id);
	if (!user) throw ApiError.unauthorized("user no longer exists");

	req.user = {
		id: user._id,
		role: user.role,
		email: user.email,
		name: user.name,
	};
	next();
};

const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw ApiError.forbbiden(
				"You don't have permission to access this resource",
			);
		}
		next();
	};
};

export { authenticate, authorize };
