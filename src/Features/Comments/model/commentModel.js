const mongoose = require("mongoose");
const validator = require("validator");
const commentSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Post"
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    content : {
        type: String,
        required : true,
        validate(value){
            if(value.length <= 0) throw new Error("Comment is require(db)")
        }
    }
})

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment