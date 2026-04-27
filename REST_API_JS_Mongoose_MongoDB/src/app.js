import express from "express";
import AuthRouter from "./modules/Auth/auth.routes.js";
import cookie from "cookie-parser";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRouter);

export default app;
