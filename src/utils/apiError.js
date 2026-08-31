 const apiError = (statusCode , message = "something went wrong" , errors =[])=>{

const err = new Error(message);
err.statusCode = statusCode ;
    err.errors = errors;
    return err;
}

module.exports = apiError;