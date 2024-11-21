import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js"


const generateAccessTokenAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    //save refresh token in the database
    user.refreshToken = refreshToken
    //validation yha nhi lagao direct save kr do database me
    await user.save({ validateBeforeSave: false })
    return {
      accessToken, refreshToken
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generation referesh and access token");
  }
}

//create a method for register user
const registerUser = asyncHandler(async (req, res) => {
  //json response de dete hai
  //  res.status(200).json({
  //     message:"ok"
  // })

  //get user details from frontend
  //validation - not empty
  //check if user already exists:username,email
  //check for images, check for avatar
  //upload them to cloudinary
  //create user object- create entry in db
  //remove password and refresh token field from response
  //check for user creation 
  //return response 
  //body se data aa rha hai  user details le rhe  
  const { fullName, email, username, password } = req.body
  //validation
  // if(fullName==="")
  // {
  // throw new ApiError(400,"FULLNAME Is required")
  // }

  if (
    [fullName, email, username, password].some((field) =>
      field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required")
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }]
  })
  if (existedUser) {
    throw new ApiError(409, "user with email already exists");
  }
  //multiple file ka access
  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");

  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username: toLowerCase()
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong")
  }
  return res.status(201).json({
    new ApiResponse(200, createdUser, "USER REGISTERED SUCCESSFULLY")
  })
})

const loginUser = asyncHandler(async (req, res) => {
  //req body ->data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username and email is required");
  }
  //find the user from login 
  const user = await User.findOne({
    $or: [{ email }, { username }]
  })
  //user can't registered
  if (!user) {
    throw new ApiError(400, "user does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials")
  }

  //generate access token and refresh token when the user login
  const { accessToken, refreshToken } = await generateAccessTokenAndRefereshToken(user._id)


  //.select field es liye use krte ki jo field user ko nhi denge response me
  const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken");

  //sends the access token and refresh token in cookies
  //sends the cookies to user cookies sirf server se hi 
  const options = {
    httpOnly: true,
    secure: true
  }
  return res.
    status(200).cookie("accessToken", accessToken, options).cookie(
      "refreshToken", refreshToken, options
    ).json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
      }, "user logged in successfully")
    )

  //send token in the cookies
})
const logOutUser = asyncHandler(async (req, res) => {

})

export default {
  registerUser,
  loginUser
};