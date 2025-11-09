import ErrorHandler from "../middlewares/errorMiddleware.js"; // Custom error handler
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"; // Wrap async functions
import database from "../database/db.js"; // PostgreSQL client
import bcrypt from "bcrypt";  // For hashing passwords
import { sendToken } from "../utils/jwtToken.js";  // Utility to generate JWT and set cookie
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js"; // Utility to generate secure reset token
import { generateEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js"; // HTML template for password reset email
import { sendMail } from "../utils/sendEmail.js"; // Utility to send emails using nodemailer
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { url } from "inspector";

// Register User
// This route handles registration. It ensures all fields are provided, checks for duplicates, hashes the password, stores the user, and returns a JWT token.
export const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {     // Check if all required fields are provided
        return next(new ErrorHandler("Please provide all required fields.", 400));
    }
    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }
    // Check if user already exists in DB
    const isAlreadyRegistered = await database.query(`SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (isAlreadyRegistered.rows.length > 0) {
        return next(new ErrorHandler("User already registered with this email.", 400));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const user = await database.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
    );
    // Send JWT token and cookie along eith user info
    sendToken(user.rows[0], 201, "User Registered Successfully!", res);
});

// Login User
// Validates credentials, compares hashed passwords, and sends a JWT token if successful.
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        // Check if email and password are provided
        return next(new ErrorHandler("Please provide email and password.", 400));
    }
    // Fetch user from database
    const user = await database.query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);
    // If user not found, throw error
    if (user.rows.length === 0) {
        return next(new ErrorHandler("Invalid email or password.", 401));
    }
    // Compare hashed password with entered password
    const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password)
    // If password doesn't match, throw error
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password.", 401));
    }
    // Send JWT token in cookie and return response
    sendToken(user.rows[0], 200, "Logged In.", res);

});

// Get USer Details
// Fetches the currently logged-in user. Requires authentication middleware (isAuthenticated) to populate req.user.
export const getUser = catchAsyncErrors(async (req, res, next) => {
    // User is attached to req by isAuthenticated middleware
    const { user } = req;
    res.status(200).json({
        success: true,
        user, // Send user data
    });
});

// Logout User
// Clears the JWT cookie to log the user out.
export const logout = catchAsyncErrors(async (req, res, next) => {
    // Clear the JWT token cookie by setting it to empty and expiring immediately
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()), // Expire immediately
        httpOnly: true, // Only accessible by the server
    }).json({
        success: true,
        message: "Logged out successfully!",
    });
});

// Forgot Password
// This handles the forgot password flow: generates a token, stores its hash in DB, creates an email template, sends the email, and handles errors.
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const { frontendUrl } = req.query;  // URL to redirect user for password reset
    // Find user by email
    let userResult = await database.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );
    if (userResult.rows.length === 0) {
        return next(new ErrorHandler("User not found with this email.", 404));
    }
    const user = userResult.rows[0];

    //Generate reset token and hashed version
    const { hashedToken, resetPasswordExpireTime, resetToken } =
        generateResetPasswordToken();

    // Store hashed token and expiry in DB
    await database.query('UPDATE users SET reset_password_token = $1, reset_password_expire = to_timestamp($2) WHERE email = $3',
        [hashedToken, resetPasswordExpireTime / 1000, email]  //to_timestamp requires seconds
    );

    // Generate the reset password URL to be sent in email
    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

    // Generate HTML email content
    const message = generateEmailTemplate(resetPasswordUrl);

    try {
        // Send the email
        await sendMail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });
    } catch (err) {
        // If email fails, clear token in DB
        await database.query(
            `UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE email = $1`,
            [email]
        );
        return next(new ErrorHandler("Email could not be sent.", 500));
    }

});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    // Find user by hashed token and check expiry
    const user = await database.query("SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",
        [resetPasswordToken]
    );
    if (user.rows.length === 0) {
        return next(new ErrorHandler("Invalid or expired reset token.", 400));
    }

    // Password confirmation check
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match.", 400));
    }
    // Password length validation
    if (req.body.password?.length < 8 || req.body.password?.length > 16 || req.body.confirmPassword?.length < 8 || req.body.confirmPassword?.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update user in DB and remove reset token
    const updatedUser = await database.query(`UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2 RETURNING *`,
        [hashedPassword, user.rows[0].id]
    );
    // Send new JWT token to log user in automatically
    sendToken(updatedUser.rows[0], 200, "Password Reset Successfully", res);
})

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    // Destructure current, new, and confirmation passwords from request body
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    // Check if all required fields are provided
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please provide all required fields.", 400));
    }
    // Compare current password with hashed password stored in DB
    const isPasswordMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 401));
    }
    // Ensure new password and confirmation match
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New passwords do not match.", 400));
    }
    // Validate password length (8–16 characters)
    if (newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await database.query("UPDATE users SET password = $1 where id = $2", [hashedPassword, req.user.id]);

    // Respond with success
    res.status(200).json({
        success: true,
        message: "Password updated successfully.",
    });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, email } = req.body;
    // Check if both name and email are provided
    if (!name || !email) {
        return next(new ErrorHandler("Please provide all required fields.", 400));
    }
    // Ensure name and email are not empty strings
    if (name.trim().length === 0 || email.trim().length === 0) {
        return next(new ErrorHandler("Name and Email cannot be empty.", 400));
    }

    let avatarData = {};  // Object to store avatar info if user uploads a new image
    let user;   // Variable to store updated user data from the database

    // Check if a new avatar is uploaded
    if (req.files && req.files.avatar) {
        const { avatar } = req.files;
        // If the user already has an avatar stored, remove it from Cloudinary
        if (req.user?.avatar?.public_id) {
            await cloudinary.uploader.destroy(req.user.avatar.public_id);
        }
        // Upload new avatar to Cloudinary
        const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "Ecommerce_Avatars", // Folder in Cloudinary
            width: 150, // Resize width
            crop: "scale", // Maintain aspect ratio while scaling
        })

        // Save Cloudinary public_id and URL to avatarData
        avatarData = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url,
        };

        // Update user in DB
        if (Object.keys(avatarData).length === 0) {
            // If no new avatar, update only name and email
            user = await database.query(
                "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
                [name, email, req.user.id]
            );
        } else {
            // If avatar uploaded, update name, email, and avatar
            user = await database.query("UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING *",
                [name, email, avatarData, req.user.id]
            )
        };
    }
    // Send response with updated user data
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: user.rows[0],
    });
});