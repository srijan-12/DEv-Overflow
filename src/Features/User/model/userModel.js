const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    fName:{
        type: String,
        require:true,
        trim:true,
        validate(value){
            if(value.length<3){
                throw new Error("First Name must be atleast 3-characters long(db)");
            }
        }
    },
    lName:{
        type: String,
        require:true,
        trim:true,
        validate(value){
            if(value.length<3){
                throw new Error("Last Name must be atleast 3-characters long(db)");
            }
        }
    },
    email:{
        type: String,
        require:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid e-mail(db)")
            }
        }
    },
    password:{
        type: String,
        require:true,
        trim:true,
        minlength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Re-try with strong password(db)");
            }
        }
    },
    phoneNumber:{
        type: Number,
        require:true,
        trim:true,
        unique:true
    },
    age:{
        type: Number,
        require:true,
        trim:true,
        validate(value){
            if(value < 13){
                throw new Error("user must be above the age of 13(db)");
            }
        }
    },
    gender:{
        type: String,
        require:true,
        trim:true,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Invalid gender type(db)");
            }
        }
    },
    photoUrl:{
        type: String,
        trim:true,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url type(db)");
            }
        }
    },
    
},{timestamps:true})

userSchema.methods.getJWT = async function(){
    const thisUser = this;
    const token = await jwt.sign({_id:thisUser._id},process.env.SECTRT_KEY,{expiresIn:"1d"});
    return token;
}

const User = mongoose.model("User",userSchema)
module.exports = User;