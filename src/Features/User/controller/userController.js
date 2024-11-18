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
     res.status(200).json({"status":"user added"})
    }catch(err){
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
                return res.status(200).json({"status":"logged in"});
            }
        }
    }catch(err){
        res.status(400).json({"error":err.message})
    }
 })
userRouter.patch("/update/:id", loginCheck, async(req,res)=>{
    try{
        const{id} = req.params;
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

        let foundUser = await User.findByIdAndUpdate(req.loggedInUserId, userData,{runValidators:true});
        await foundUser.save()
        console.log(foundUser);
        res.status(200).json({"status":"updated", "result" : foundUser})
        }catch(err){
            res.status(400).json({"error":err.message})
        }


})
 userRouter.get("/test",loginCheck,(req,res)=>{
    res.send("this is test route for checking authentication")
 })

module.exports = userRouter;