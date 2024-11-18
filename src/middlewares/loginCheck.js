const jwt = require("jsonwebtoken")
const User = require("../Features/User/model/userModel.js")
const loginCheck = async(req,res,next) =>{
    try{
        const {token} = req.cookies;
        if(!token) throw new Error("Log in again")
        const result = jwt.verify(token,process.env.SECTRT_KEY);
        const foundUser = await User.findById(result._id);
        if(!foundUser) throw new Error("Log in again");
        req.loggedInUserId = foundUser._id;
        next()
    }catch(err){
        return res.status(400).json({"error":err.message});
    }

}

module.exports = loginCheck;