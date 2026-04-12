import express from "express";
import AuthRouter from "./modules/Auth/auth.routes.js"
const app = express();

app.use("user/",AuthRouter)

export default app;
