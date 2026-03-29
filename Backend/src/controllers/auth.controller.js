const userModel=require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const blacklistTokenModel=require("../models/blacklist.model")

/**
 * @description register user controller
 * @route POST register a new user,except a email,username and password 
 * @access public
 */

async function registerUserController(req,res){
  
    const {username,email,password}=req.body

    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    const isUserExist=await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserExist){
        /*
        if username or email already exists
        */
        return res.status(400).json({message:"User already exists"})
    }
    const hashedPassword=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hashedPassword
    })
    
    const token=jwt.sign({id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"})
    
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token",token,{
        httpOnly:true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge:3600000
    })

    res.status(201).json({message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }})
}


/**
 * @description login user controller
 * @route POST login a user,except a email,username and password 
 * @access public
 */

async function loginUserController(req,res){
    const {username,email,password}=req.body
    if((!username && !email) || !password){
        return res.status(400).json({message:"Email or username and password are required"})
    }
    const queryConditions = [];
    if (email) {
        queryConditions.push({ email: email });
        queryConditions.push({ username: email });
    }
    if (username) {
        queryConditions.push({ username: username });
        queryConditions.push({ email: username });
    }

    const user = await userModel.findOne({
        $or: queryConditions
    })
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid password"})
    }
    const token=jwt.sign({id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"})
    
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token",token,{
        httpOnly:true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge:3600000
    })
    
    res.status(200).json({message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }})
}

/**
 * @description logout user controller
 * @route GET /api/auth/logout
 * @access public
 */

async function logoutUserController(req,res){
    const token=req.cookies.token
    if(!token){
        return res.status(400).json({message:"No token found"})
    }
    const isTokenBlacklisted=await blacklistTokenModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(400).json({message:"Token already blacklisted"})
    }
    const blacklistToken=await blacklistTokenModel.create({token})
    res.clearCookie("token")
    res.status(200).json({message:"User logged out successfully"}) 
}

/**
 * @description get current user controller
 * @route GET /api/auth/me
 * @access private
 */

async function getCurrentUserController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({message:"User  fetched successfully",user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={registerUserController,
    loginUserController,
    logoutUserController,
    getCurrentUserController
}