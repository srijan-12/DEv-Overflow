const validator = require("validator");
const sanatiseSignup = (req,res,next) =>{
    const{fName,lName,email,password,phoneNumber,age,gender,photoUrl} = req.body;
    try{
        if(!fName || fName.trim().length<3 || fName.trim().length>25){
            throw new Error("First Name must be atleast 3-characters long");
        }
        if(!lName || lName.trim().length<3 || lName.trim().length>25){
            throw new Error("Last Name must be atleast 3-characters long");
        }
        if(!email || !validator.isEmail(email)){
            throw new Error("e-Mail must be valid");
        }
        if(!password || !validator.isStrongPassword(password)){
            throw new Error("re-try wth strong passwrd");
        }
        if(!phoneNumber || !validator.isMobilePhone(phoneNumber)){
            throw new Error("Phone number must be valid");
        }
        if(!age || age<13){
            throw new Error("user must be above the age of 13");
        }
        if(!gender || !["male", "female", "others"].includes(gender)){
            throw new Error("Invalid gender type");
        }
        next();
    }catch(err){
        console.log("err found",err)
        res.status(400).json({"error":err.message})
    }
    
}

module.exports = sanatiseSignup