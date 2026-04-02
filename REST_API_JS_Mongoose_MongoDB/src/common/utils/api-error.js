class ApiError extends Error {
	constructor(statusCode, massage) {
		super(this.message);
		this.statusCode = statusCode;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(massage = "Bad Request") {
		return new ApiError(400, massage);
	}

	static unauthorized(massage = "Unauthorized") {
		return new ApiError(401, massage);
	}

    
}

export default ApiError;