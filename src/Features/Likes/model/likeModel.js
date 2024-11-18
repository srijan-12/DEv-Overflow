const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
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
})

const Like =  mongoose.model("Like", likeSchema);
module.exports = Like;