const express = require("express");
const likeRouter = express.Router();
const loginCheck = require("../../../middlewares/loginCheck.js");
const jwt = require("jsonwebtoken");
const User = require("../../User/model/userModel.js");
const Post = require("../../Posts/model/postModel.js");
const Like = require("../model/likeModel.js");
const getUserId = (token) => {
    try {
        return jwt.verify(token, process.env.SECTRT_KEY);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

likeRouter.post("/liked/:postid",loginCheck,async(req,res)=>{
    try{
        const {token} = req.cookies;
        const{postid} = req.params;
        const user = getUserId(token);
        if(!user) throw new Error("Invalid request..login again");
        const foundUser = await User.findById(user._id);
        if(!foundUser) throw new Error("Invalid request from user..user not found");
        const foundPost = await Post.findById(postid);
        if(!foundPost) throw new Error("Invalid request from user.. post not found");


        const newLike = new Like({postId:foundPost._id, userId:user._id})
        console.log(newLike);
        const foundLike = await Like.findOne({postId:foundPost._id, userId:user._id})
        console.log(foundLike);
        if(foundLike){
            const updatedLikeArray = foundPost.likes.filter((l)=>l.toString() != foundLike._id);
            console.log(updatedLikeArray);
            foundPost.likes = updatedLikeArray;
            await Like.findByIdAndDelete(foundLike._id);
            await foundPost.save();
            return res.status(200).json({"status":"unliked", "result" : foundPost})
        }else{
            foundPost.likes.push(newLike._id);
            await newLike.save();
            await foundPost.save();
            return res.status(200).json({"status":"liked", "result" : foundPost})
        }
    }catch(err){
        res.status(400).json({"status":"failed to delete comment", "error": err.message})
    }
})

module.exports = likeRouter;