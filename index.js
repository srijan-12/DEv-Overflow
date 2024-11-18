const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const port = 3000;
const ConnectToDB = require("./dbConfig.js");
require('dotenv').config();
const userRouter = require("./src/Features/User/controller/userController.js")
const postRouter = require("./src/Features/Posts/controller/postController.js")
const commentRouter = require("./src/Features/Comments/controller/commentController.js")
const likeRouter = require("./src/Features/Likes/controller/likeController.js")
app.use(express.json())
app.use(cookieParser());
app.use("/api/user",userRouter)
app.use("/api/post", postRouter)
app.use("/api/comment", commentRouter)
app.use("/api/like",likeRouter)


ConnectToDB().then(()=>{
    console.log("Connection to database is successful");
    return app.listen(port, ()=>{
        console.log(`the server is up and running at port ${port}`);
    })
}).catch((err)=>{
    console.log(err.message);
})

