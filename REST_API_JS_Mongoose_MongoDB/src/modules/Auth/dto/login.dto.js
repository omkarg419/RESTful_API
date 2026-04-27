import BaseDto from "../../../common/dto/base.dto.js";
import Joi from "joi";


class LoginDto extends BaseDto{
  static schema=Joi.object({
    email:Joi.string().email().required().messages({
      "string.email":"Please enter a valid email",
      "string.empty":"Email is required",
    }),
    password:Joi.string().min(6).max(100).required().messages({
      "string.min":"Password must be at least 6 characters long",
      "string.empty":"Password is required",
    }),
  })
}

export default LoginDto;