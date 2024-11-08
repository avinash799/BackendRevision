import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

// import express from express;
// const app =express();
// require ('dotenv').config({path:'./env'})
//as early as possible in your application import and configure dotenv.
dotenv.config({
    path:'./env'
})
connectDB( )
.then(()=>{
  app.listen(process.env.PORT ||8000,()=>
{
    console.log(`Server is running at port ${process.env.PORT}`);
})
})
.catch((err)=>{
    console.log("Mongo Db connection failed!!!",err)
});

//IFFES 
// (async()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${
//           DB_NAME }`)
//         //listen
            //express ki app jb baat nhi kr paa rhi hogi database tb use krenge
//           app.on("error",(error)=>{
//             console.log("ERROR",error);
//             throw error;
//           })
//           app.listen(process.env.port,()=>{
//             console.log(`App is listening on port ${process.env.port}`)
//           })
//     }catch(error){
//       console.log("ERROR",error)
//       throw err
//     }
//   })()




// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}\${Db_name}`)
//         //listen
//         app.listen(process.env.port,()=>{
//                console.log(`app listen on port ${process.env.POrt}`)
//         })
//     } catch (error) {
//         console.log("errror",error);
        
//     }
// })()

app.listen(process.env.PORT,()=>{
    console.log(`app is listenging on port ${process.env.PORT}`)
})