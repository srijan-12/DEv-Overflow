const express = require("express")
const Post = require("../model/postModel.js");
const loginCheck = require("../../../middlewares/loginCheck.js");
const postRouter = express.Router()
const jwt = require("jsonwebtoken");

const getUserId = (token) =>{
    return jwt.verify(token, process.env.SECTRT_KEY);
}
//create post 
postRouter.post("/createpost",loginCheck,async(req,res)=>{
    try{
        const{title,postImgUrl} = req.body;
        const {token} = req.cookies;
        const userId = getUserId(token);
        console.log(userId._id)
        const newPostObject = {title,postImgUrl,userId};
        console.log(newPostObject);
        const postObj = new Post(newPostObject);
        await postObj.save();
        res.status(200).json({"status":"created", "post" : postObj})
    }catch(err){
        res.status(400).json({"status":"failed to create a post", "err" : err.message})
    }
})
//update post
postRouter.patch("/updatepost/:id", loginCheck,async(req,res)=>{
    try{
        const{id} = req.params;
        const {token} = req.cookies
        const userId = getUserId(token);
        const postUser = await Post.findById(id);
        if(userId._id == postUser.userId) {
            const {title} = req.body;
             if(!title) throw new Error("title is required");
             const updatedPost = await Post.findByIdAndUpdate(id, {title},{runValidators:true, new:true});
             res.status(200).json({"status":"updated", "result":updatedPost});
        }
    }catch(err){
        res.status(400).json({"status":"failed to update post", "error": err.message})
    }
}) 
//delete post
postRouter.delete("/deletepost/:id",loginCheck,async(req,res)=>{
    try{
        const{id} = req.params;
        const {token} = req.cookies
        const userId = getUserId(token);
        const postUser = await Post.findById(id);
        if(userId._id == postUser.userId) {
            
            await Post.findByIdAndDelete(postUser._id);
            res.status(200).json({"status":"deleted"});
        }
    }catch(err){
        res.status(400).json({"status":"failed to delete post", "error": err.message})
    }
}) 
//get all post 
postRouter.get("/getallposts", loginCheck, async(req,res)=>{
    try{
        const allPost = await Post.find({});
        if(allPost.length === 0){
            return res.status(400).json({"error":"nothing to show"});
        }
       return res.status(200).json({"allPost":allPost});
    }catch(err){
        console.log(err);
        res.status(400).json({"status":"failed to delete post", "error": err.message})
    }
})
module.exports = postRouter;