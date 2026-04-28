import { Request, Response } from "express";
import { signupPayloadModel } from "./models.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

class AuthenticationController {
	public async signup(req: Request, res: Response) {
		const validationResult = await signupPayloadModel.safeParseAsync(req.body);

		if (validationResult.error) {
			return res
				.status(400)
				.json({ message: "Invalid input data", error: validationResult.error });
		}

		const { firstName, lastName, email, password } = validationResult.data;

		const userEmailResult = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

    if(userEmailResult.length >0){
      return res.status(400).json({message:`User with email ${email} already exists`,error:`duplicate entry`})
    }

    const salt= crypto.randomBytes(32).toString('hex');
    const hash= crypto.createHmac('sha256',salt).update(password).digest('hex');

    const newUser = await db.insert(usersTable).values({
      firstName,
      lastName,
      email,
      password:hash,
      salt
    }).returning({id:usersTable.id,email:usersTable.email,firstName:usersTable.firstName,lastName:usersTable.lastName});

    return res.status(201).json({message:"User created successfully", user: newUser[0]});
	}

}

export default AuthenticationController;
