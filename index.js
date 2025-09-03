import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";
dotenv.config();
import userAuth from "./route/user.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

// Middlewares
app.use(cors({
  origin:["http://localhost:5173","https://google-auth-frontend-smoky.vercel.app"],
   methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));
app.use(express.json()); 
app.use(cookieParser());

//api 
app.get("/",(req,res)=>{
  res.send("backend")
})
//signIn
app.use("/api/auth",userAuth)
connectDb()

export default app
