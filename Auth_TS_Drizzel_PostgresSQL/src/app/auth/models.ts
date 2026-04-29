import { email, z } from "zod";

export const signupPayloadModel = z.object({
	firstName: z
		.string()
		.min(2, { message: "First name must be at least 2 characters long" }),
	lastName: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters long" })
		.nullable()
		.optional(),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});


export const signinPayloadModel = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});