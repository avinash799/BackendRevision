//apiError class extends the built-in Error class.

class ApiError extends Error{
    constructor(
        statusCode,//https status coded
        message="something went wrong" ,//inherits properties from Error
        errors=[],//multiple error dena hoga tb use krenge
        stack=""
    ){
        super(message)//this calls the constructor of the parent Error class witht the message. This ensure that the standard behaviour of an Error 
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.errors=errors;
        //api error jab badi files hogi toh use krenge
        if(stack){
              this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}


// The ApiError class extends the built-in Error class.
//  In JavaScript/TypeScript, 
// the Error class is used for handling errors.

// super(message)
// This calls the constructor of the parent Error
//  class with the message. 
//  This ensures that the standard behavior 
//  of an Error object is retained, 
// like setting the error message.


// {
//     "statusCode": 400,
//     "data": null,
//     "message": "Invalid input data",
//     "success": false,
//     "errors": ["email is required", "password must be at least 6 characters"],
//     "stack": "..."
//   }
  