import e, { text } from "express";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const sendMail = async (to, subject, html) => {
	await transporter.sendMail({
		from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
		to, // list of receivers
		subject, // Subject line
		html, // html body
	});
};

const sendVerificationEmail = async (to, token) => {
	// TODO: Construct the verification URL with the token
	const url = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;
	await sendMail(
		to,
		"Verify your email",
		` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
		<p>Thank you for registering. Please click the link below to verify your email address:</p>
		<a href="${url}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Verify Email</a>
		<p>If you did not register, please ignore this email.</p>
    `,
	);
};

const sendResetPasswordEmail = async (to, token) => {
	const url = `${process.env.CLIENT_URL}/api/auth/reset-password?token=${token}`;
	await sendMail(
		to,
		"Reset your password",

		`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${url}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
      
    </div>`,
	);
};

export { sendVerificationEmail, sendResetPasswordEmail };
