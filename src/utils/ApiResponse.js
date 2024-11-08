class ApiResponse{
    constructor(statusCode,data,message="Success",success){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode<400
    }
}

class ApiResponse {
    constructor(statusCode = 200, data = null, message = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode < 400; // Success if statusCode is < 400
        
        // Conditionally set the message if not provided
        if (message) {
            this.message = message;
        } else {
            this.message = this.success ? "Success" : "An error occurred";
        }
        
        // Optionally include stack traces for debugging on failure
        if (!this.success && Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiResponse };
