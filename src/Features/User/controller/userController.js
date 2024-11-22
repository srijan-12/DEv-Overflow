const express = require("express")
const userRouter = express.Router();
const bcrypt = require("bcrypt")
const sanatiseSignup = require("../../../middlewares/sanatiseSignup.js");
const User = require("../model/userModel.js");
const sanitizeLogin = require("../../../middlewares/sanitizeLogin.js");
const loginCheck = require("../../../middlewares/loginCheck.js")

userRouter.post("/register",sanatiseSignup,async(req,res)=>{
    try{
     const{fName,lName,email,password,phoneNumber,age,gender,photoUrl} = req.body;
     const hashedPassword = await bcrypt.hash(password,10);
     const userX = new User({fName,lName,email,password:hashedPassword,phoneNumber,age,gender,photoUrl});
     await userX.save();
     const token = await userX.getJWT();
    res.cookie("token",token,{maxAge: 7*24*60*60*1000})
    return res.status(200).json({"status":"logged in", "user" : userX});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"error":err.message})
    }
 })

 userRouter.post("/login",sanitizeLogin, async(req,res)=>{
    const {email,password} = req.body;
    
    try{
        const foundUser = await User.findOne({email});
        
        if(!foundUser){
            throw new Error("User does not exists")
        }else{
            const result = await bcrypt.compare(password, foundUser.password);
            if(!result){
                throw new Error("invalid credentials")
            }else{
                const token = await foundUser.getJWT();
                res.cookie("token",token,{maxAge: 7*24*60*60*1000})
                return res.status(200).json({"status":"logged in", "user" : foundUser});
            }
        }
    }catch(err){
        console.log(err.message)
        res.status(400).json({"error":err.message})
    }
 })

userRouter.get("/getloggedinuser",loginCheck,async(req,res)=>{
    try{
        const {token} = req.cookies;
        if(!token) throw new Error("Login again");
        const userId = req.loggedInUserId;
        const foundUser = await User.findById(userId);
        if(!foundUser) throw new Error("No user found login again");
        return res.status(200).json({"user" : foundUser});

    }catch(err){
        res.status(400).json({"error":err.message})
    }
})


userRouter.patch("/update", loginCheck, async(req,res)=>{
    try{
        const userId = req.loggedInUserId;
        const {fName,lName,password,phoneNumber,age,photoUrl} = req.body;
        console.log(fName,lName,password,phoneNumber,age,photoUrl)
        const userData = {fName,lName,phoneNumber,age,photoUrl};
        const allowedFields = ["fName", "lName", "phoneNumber", "age", "photoUrl"];

        const permitted = Object.keys(userData).every((field)=>{
            console.log(field)
            return allowedFields.includes(field);
        })
        console.log(Object.keys(userData))

        if(!permitted) throw new Error("Action not allowed");

        let foundUser = await User.findByIdAndUpdate(userId, userData,{runValidators:true, new:true});
        await foundUser.save()
        res.status(200).json({"status":"updated", "result" : foundUser})
        }catch(err){
            res.status(400).json({"error":err.message})
        }


})
 userRouter.post("/logout",loginCheck,(req,res)=>{
    res.cookie("token", null),{
        maxAge : 0
    };
    res.status(200).json({"status" : "logged out"})
 })

module.exports = userRouter;