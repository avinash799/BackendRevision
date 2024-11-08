import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express()
//cookie parser and cors

//middlewares aur configuration jab use krte hai ((use))hai ye sb app bne ke baad configure honge
// app.use(cors())
app.use(cors({
    //kon kon sa origin allow krna hai kaha se req aa rha hai
    origin:process.env.CORS_ORIGIN ,
    credentials:true
}))
//form se data aayega aur json me aayega tab use krenge configuration kke liye use kre app.use(())
app.use(express.json({limit:"16kb"}))
//url encoded space ke  liye  %20 use krte hai url me
app.use(express.urlencoded({extended:true,limit:"16kb"}));
//app.use(express.urlencoded())
//app.use(cookieParser())
//public assests bna deta hai jaise pdf aur images aati hai toh use krte  hai apne server pe images upload krne ke liye use krte hai
app.use(express.static("public"))


//routes import
import UserRouter from "./routes/user.routes.js"
 //routes declaration
app.use("/api/v1/users",UserRouter)

export default app; 

//(err,req,res,next) next use for middleware
// app.use((err, req, res, next) => {
//     res.status(err.statusCode || 500).json({
//         success: false,
//         message: err.message || "Server Error"
//     });
// });
