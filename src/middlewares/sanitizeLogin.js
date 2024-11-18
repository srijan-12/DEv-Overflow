const validator = require("validator");
const sanitizeLogin = async(req,res,next) =>{
    const {email,password} = req.body;
    try{
        if(!email || !validator.isEmail(email)){
            throw new Error("In-valid email")
        }
        if(!password || !validator.isStrongPassword(password)){
            throw new Error("Re-try with strong password")
        }
        next();
    }catch(err){
        res.status(400).json({"status":err.message});
    }
}

module.exports = sanitizeLogin