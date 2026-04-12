import crypto from "crypto";

const generateResetToken = () => {
	const rowToken = crypto.randomBytes(32).toString("hex");
	const hashedToken = crypto.createHash("sha256").update(rowToken).digest("hex");

	return { rowToken, hashedToken };
};

export { generateResetToken };
