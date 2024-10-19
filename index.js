const express = require("express");
const app = express();
const port = 3000;
const ConnectToDB = require("./dbConfig.js");

app.use("/",(req,res)=>{
    res.send("server is running");
})


ConnectToDB().then(()=>{
    console.log("Connection to database is successful");
    return app.listen(port, ()=>{
        console.log(`the server is up and running at port ${port}`);
    })
}).catch((err)=>{
    console.log(err.message);
})

