const validator = require("validator")
const mongoose = require("mongoose")
const { validate } = require("../../User/model/userModel")
const postSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(value.length < 10) throw new Error("the title must be atleast 20-characters long " + value.length)
        }
    },
    postImgUrl : {
        type : String,
        trim : true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid post url type(db)")
            }
        }
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    comment:{
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Comment"
    },
    likes:{
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Like"
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;