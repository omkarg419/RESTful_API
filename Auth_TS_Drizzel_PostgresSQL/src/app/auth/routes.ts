import { Router } from "express";

import AuthenticationController from "./controller.js";
import { restrictToAuthenticatedUsers } from "../middleware/auth-middleware.js";

const authController = new AuthenticationController();

export const authRouter: Router = Router();

authRouter.post("/signup", authController.signup.bind(authController));
authRouter.post("/signin", authController.signin.bind(authController));

authRouter.get(
	"/me",
	restrictToAuthenticatedUsers(),
	authController.me.bind(authController),
);
