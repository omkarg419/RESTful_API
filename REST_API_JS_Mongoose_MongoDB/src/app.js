import express from "express";
import AuthRouter from "./modules/Auth/auth.routes.js"
const app = express();

app.use(express.json());
app.use("/api/auth", AuthRouter);

export default app;
