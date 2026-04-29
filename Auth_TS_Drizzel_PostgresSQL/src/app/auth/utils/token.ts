import JWT from "jsonwebtoken";

export interface UserTokenPayload {
	id: string;
}

const JWt_SECRET_KEY =
	"your_secret_key_here_change_this_to_a_secure_random_string";

export function createUserToken(payload: UserTokenPayload) {
	const token = JWT.sign(payload, JWt_SECRET_KEY);
	return token;
}
export function verifyUserToken(token: string) {
	try {
		const payload = JWT.verify(token, JWt_SECRET_KEY) as UserTokenPayload;
		return payload;
	} catch (error) {
		return null;
	}
}
