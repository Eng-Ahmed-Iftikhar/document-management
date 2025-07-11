class BaseError extends Error {
    public override readonly name: string;
    public readonly httpCode: number;
    public readonly isOperational: boolean;
    constructor(
        name: string,
        httpCode: number,
        description: string,
        isOperational: boolean
    ) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

export default BaseError;
