export const catchAsyncErrors = (theFunction) => {
    return (req, res, next) => {
        // Resolve the promise returned by the async function
        // If it rejects, pass the error to next() to be handled by errorMiddleware
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
} 