const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'please peovide company name'],
        maxLength:50
    },
    position:{
        type:String,
        required:[true,'please peovide position'],
        maxLength:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    }
},{timestamps:true}) //created at and created by

module.exports= mongoose.model('Job',JobSchema)