import { Router } from "express";
import * as controller from "./auth.controller.js";
import RegisterDto from "./dto/register.dto.js";
import validate from "../../common/middleware/validate.middleware.js";
import { authenticate } from "./auth.middleware.js";
import LoginDto from "./dto/login.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
router.post("/login", validate(LoginDto), controller.login);

// Protected routes
router.get("/me", authenticate, controller.getMe);
router.post("/logout", authenticate, controller.logout);

export default router;
