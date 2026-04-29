import express from "express";
import type { Express } from "express";
import { authRouter } from "./auth/routes.js";
import {authenticationMiddleware} from "./middleware/auth-middleware.js"

export function createApplication(): Express {
	const app = express();

	// middleware
	app.use(express.json());
	app.use(authenticationMiddleware());

	// routes
	app.get("/", (req, res) => {
		res.json({ message: "Welcome to the Auth_TS_Drizzel_PostgreSQL API!" });
	});
	app.use("/auth", authRouter);
	return app;
}
