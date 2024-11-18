const express = require("express");
const commentRouter = express.Router();
const loginCheck = require("../../../middlewares/loginCheck.js");
const Comment = require("../model/commentModel.js");
const Post = require("../../Posts/model/postModel.js");
const jwt = require("jsonwebtoken")


const getUserId = (token) => {
    try {
        return jwt.verify(token, process.env.SECTRT_KEY);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

commentRouter.post("/addcomment/:postId",loginCheck, async(req,res)=>{
    try{
        const {content} = req.body
        const {token} = req.cookies;

        const user = getUserId(token);
        if(!user) throw new Error("Login again")

        const {postId} = req.params;
        const foundPost = await Post.findById(postId);
        if(!foundPost){ 
            throw new Error("Invalid request")
        }
        if(!content || content.length <= 0){
            throw new Error("Comment is require")
        }
        const newComment = new Comment({postId, userId:user._id, content});
        await newComment.save();

        foundPost.comment.push(newComment._id);
        await foundPost.save();
        console.log(foundPost);
        res.send(foundPost)
    }catch(err){
        res.status(400).json({"status":"failed to add comment", "error": err.message})
    }
})




//delete comment
commentRouter.delete("/delete/:postId/:cmntId",loginCheck, async(req,res)=>{
    try{
        const {token} = req.cookies;
        const {postId,cmntId} = req.params;
        const user = getUserId(token);
        if(!user) throw new Error("Login again")
        const foundComment = await Comment.findById(cmntId);
        if(!foundComment){ 
            throw new Error("Invalid request no comment found")
        }

        const foundPost = await Post.findById(postId);
        if(!foundPost){ 
            throw new Error("Invalid request no post found")
        }
        const newCmntArray = foundPost.comment.filter((c)=> {
            return c.toString() != cmntId;
        });
        foundPost.comment = newCmntArray;
        foundPost.save()
        await Comment.findByIdAndDelete(foundComment);

        res.status(200).send("Comment deleted")

    }catch(err){
        res.status(400).json({"status":"failed to delete comment", "error": err.message})
    }
})



module.exports = commentRouter;