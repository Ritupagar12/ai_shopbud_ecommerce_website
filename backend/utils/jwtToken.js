import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set cookie and send response
    res
        .status(statusCode).
        cookie("token", token, {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true, // Cookie cannot be accessed by JS in browser
            secure: process.env.NODE_ENV === "production", // required for https
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", //Allows cross-site cookies
        })
        .json({
            success: true,
            user, // Return user object
            message, // Custom success message
            token, // Return token as well (optional)
        });
};
