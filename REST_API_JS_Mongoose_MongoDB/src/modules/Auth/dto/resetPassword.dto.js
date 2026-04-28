import BaseDto from "../../../common/dto/base.dto.js";
import Joi from "joi";

class ResetPasswordDto extends BaseDto {
	static schema = Joi.object({
		newPassword: Joi.string().min(6).required().messages({
			"string.base": "New password must be a string",
			"string.empty": "New password is required",
			"string.min": "New password must be at least 6 characters long",
			"any.required": "New password is required",
		}),
	});
}

export default ResetPasswordDto;
