// import mongoose,{Schema} from "mongoose";
// import { Jwt } from "jsonwebtoken";
// import bcrypt from 'bcrypt'

// const UserSchema=new Schema(
//     { 
//         username:{
//             type:String,
//             required:true,
//             unique:true,
//             lowercase:true,
//             trim:true,
//             index:true
//         },
//         email:{
//             type:String,
//             required:true,
//             unique:true,
//             lowercase:true,
//             trim:true,
//         },
//         fullname:{
//             type:String,
//             required:true,
//             trim:true,
//             index:true,
//         },
//         avatar:{
//             type:String,// cloudinary url
//             required:true,
//         },
//         coverImage:{
//             type:String,//clodinary url
//         },
//         watchHistory:[
//             {
//                 type:Schema.Types.ObjectId,
//                 ref:'video'
//             }
//         ],

//         password:{
//             type:string,
//             required:[true,'password is required']

//         },
//         refreshToken:{
//             type:String,
//         },
//     },
//     {
//     timestamp:true,
//     },
// )
// UserSchema.pre("save",async function(next){
//     if(!this.isModified("password"))return  next();
//      this.password=bcrypt.hash(this.password,20)
//      next()
// })

// //check password user and encrypt
// UserSchema.methods.isPasswordCorrect=async function(password){
//      return await bcrypt.compare(password,this.password)
// }

// UserSchema.methods.generateAccessToken=function(){
//     jwt.sign(
//         {
//         _id:this._id,
//         email:this.email,
//         username:this.username,
//         fullname:this.fullname,
//         },

//     )
// }
// UserSchema


// export const User=mongoose.model("User",UserSchema);

import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            //searchable bnane ke liye index use krte hai
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true, 
        },
        fullName:{
            type:String,
            required:true,
            trim:true, 
            lowercase:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url dega usko db me store kra lenge
            required:true,
            
        },
        coverImage:{
            type:String,
        },
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
      
        ],
        password:{

            type:String,
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String
        }

    }
, {timestamps:true}
)


//hooks -> middlewares  ->event-> save delete etc 
//arrow function use nhi krte hai kyuki current context pta nhi hota hai
//mongoose hooks provide krta hai
userSchema.pre("save",async function(next){
    //jab password modified nhi hoga tb use krenge
     // Only hash if the password is modified
    if(!this.isModified("password")) return next(); //modified nhi rahega toh below walla use krenge
    this.password=await bcrypt.hash(this.password,10)
    next()
})
//custom methods  userSchema me object hota hai methods //check password 
//mongoose methods deta hai
// Method to check password correctness
userSchema.methods.isPasswordCorrect=async function 
    (password){ 
        //return and true and false
    return await bcrypt.compare(password,this.password)
}

//jwt bearer token hota hai -> jo usko bear krta usko data bhej dega
//jwt token dono
// Method to generate access token
userSchema.methods.generateAccessToken=function(){
return jwt.sign(
        {

        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        //expiresIn object ke andar jata hai
        {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//both are jwt token->refersh token and access token
userSchema.methods.generateRefreshToken=function(){
jwt.sign(
        {

        _id:this._id,
        // email:this.email,
        // username:this.username,
        // fullName:this.fullName
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)