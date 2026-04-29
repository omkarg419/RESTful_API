import { Router } from "express";

import AuthenticationController from "./controller.js";

const authController = new AuthenticationController();


export const authRouter:Router = Router();

authRouter.post("/signup",authController.signup.bind(authController));
authRouter.post("/signin",authController.signin.bind(authController));

authRouter.get("/me")