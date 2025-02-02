const Jobs = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/Job')

const getAllJobs = async (req,res)=>{
    const job = await Jobs.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({job, count:job.length})
}

const getJob = async (req,res)=>{
    const {user:{userId},params:{id:jobId}}= req
    const job = await Jobs.findOne({
        _id:jobId,createdBy:userId
    })
    if (!job) {
        throw new NotFoundError(`mo job with is${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req,res)=>{
    req.body.createdBy=req.user.userId
    const job = await Jobs.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req,res)=>{
    const{
        body:{company,position},
        user:{userId},
        params:{id:jobId}
    }=req

    if (company==='' || position==='') {
        throw new BadRequestError('company or position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId},req.body,{new:true, runValidators:true})
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req,res)=>{
    const{
        user:{userId},
        params:{id:jobId}
    }=req

    const job = await Job.findByIdAndRemove({
        _id:jobId,
        createdBy:userId
    })
    if (!job) {
        throw new NotFoundError(`no job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}
module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}