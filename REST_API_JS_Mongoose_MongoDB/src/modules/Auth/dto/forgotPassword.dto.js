import BaseDto from "../../../common/dto/base.dto.js";
import Joi from "joi";
class ForgotPasswordDto extends BaseDto {
	static schema = Joi.object({
		email: Joi.string().email().required().messages({
			"string.email": "Please enter a valid email",
			"string.empty": "Email is required",
		}),
	});
}

export default ForgotPasswordDto;
