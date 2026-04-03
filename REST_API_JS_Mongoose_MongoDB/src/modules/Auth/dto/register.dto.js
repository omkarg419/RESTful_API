import BaseDto from "../../../common/dto/base.dto.js";
import Joi from "joi";

class RegisterDto extends BaseDto {
	static schema = Joi.object({
		name: Joi.string().min(2).max(50).required(),
		email: Joi.string().email().required().lowercase(),
		password: Joi.string().min(8).required().max(100).message("Password must be between 8 and 100 characters long"),
        role: Joi.string().valid("customer", "seller").default("customer"),
	});
}

export default RegisterDto; 