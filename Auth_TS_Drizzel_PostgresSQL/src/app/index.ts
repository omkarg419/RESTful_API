import  express  from "express";
import type { Express } from "express";
export function createApplication():Express {
    const app = express();

    // middleware
    app.use(express.json());

    // routes
    app.get("/",(req,res)=>{
      res.json({message:"Welcome to the Auth_TS_Drizzel_PostgreSQL API!"})
    })
    return app;
}