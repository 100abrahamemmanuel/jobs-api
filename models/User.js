const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        minLength:3,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide a valid email'
        ],
        unique:true,// creates a unikque index, it is not a validator, incase you are trying to crate a user with that email we will recieve a duplicate error message
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minLength:6,
    }
})

UserSchema.pre('save', async function(){
    // calling the bcrypt method
    const salt = await bcrypt.genSalt(10)
    // mapping it to the password or hashing the password in your document
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword= async function(candidatesPassword){
    const ismatch= await bcrypt.compare(candidatesPassword,this.password)
    return ismatch
} 
UserSchema.methods.createJWT= function (){
    return jwt.sign(
        {userID:this._id,name:this.name},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    )
}
module.exports = mongoose.model('Users',UserSchema)