import type { Response, Request, NextFunction } from "express";
import { he } from "zod/locales";
import { verifyUserToken } from "../auth/utils/token.js";
import { db } from "../../db/index.js";

export function authenticationMiddleware() {
	return function (req: Request, res: Response, next: NextFunction) {
		const header = req.headers["authorization"];
		if (!header) next();

		if (!header?.startsWith("Bearer")) {
			return res
				.status(400)
				.json({ massage: "authorization header must start with Bearer" });
		}

		const token = header.split(" ")[1];

		if (!token) {
			return res.status(400).json({
				massage:
					"authorization header must start with Bearer and followed by token",
			});
		}
		const user = verifyUserToken(token);
		// @ts-ignore
		req.user = user;
		next();
	};
}

export function restrictToAuthenticatedUsers() {
	return function (req: Request, res: Response, next: NextFunction) {
		// @ts-ignore
		if (!req.user) {
			return res.status(401).json({ message: "Authentication required" });
		}
		next();
	};
}
