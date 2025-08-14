import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    email :{
        type : String,
        required : true,
        unique : true
    },
    firstname :{
        type : String,
        required : true
    },
    lastname :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    phone: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    role:{
        type : String,
        required : true,
        default :"customer"
    },
    isBlocked :{
        type : Boolean,
        required : true,
        default : false
    },
    img : {
        type : String,
        required : false,
        default : "asfff.jpg"
    }   
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User