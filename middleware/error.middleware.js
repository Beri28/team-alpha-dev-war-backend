const errorMiddleware =(err, req, res, next)=>{
    try {
      let error = { ...err }
 
      error.message = err.message
      console.error(err)
 
      //checking the type of error
      if(error.name === 'CastError'){
         const message = "Resource not found"
        error = new Error('Invalid ID')
        error.status = 404
      }
         if(error.code === 11000){
             const message = "Duplicate field value entered"
         error = new Error(message)
         error.status = 400
         }
 
          res.status(error.status || 500).json({ message: error.message || "Server Error" })
    } catch (error) {
       next(error)
    }
 }
 
 export default errorMiddleware