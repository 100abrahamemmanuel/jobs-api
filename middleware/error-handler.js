const { StatusCodes } = require('http-status-codes')

// why we are doing this is because we want to send more user friendly error messages than to send bunch of messages

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError ={
    //set default
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'something went wrong, try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name ==="ValidationError") {
    customError.msg=Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode=StatusCodes.NOT_FOUND
  } 
  if (err.code && err.code===11000) {
    customError.msg=`Duplicate value ${Object.keys(err.keyValue)} filed, please choose another value`
    customError.statusCode = StatusCodes.NOT_FOUND
  }
  if (err.name==="CastError"){
    customError.msg=` no items found with id: ${err.value}`
    customError.statusCode= StatusCodes.NOT_FOUND
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({msg:customError.msg })
}

module.exports = errorHandlerMiddleware
