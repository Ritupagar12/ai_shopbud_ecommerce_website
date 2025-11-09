import crypto from "crypto";
// 'crypto' is a built-in Node.js module used for generating random tokens and hashes securely

// Function to generate a secure reset password token
export const generateResetPasswordToken = () => {
    // Step 1: Create a random token (20 bytes, converted to hex string)
    // This is the token you’ll send to the user (in email)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Step 2: Hash the token using SHA-256
    // You store the hashed version in the database for security (not the plain token)
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Step 3: Set expiration time (15 minutes from now)
    // So users must reset their password before this expires
    const resetPasswordExpireTime = Date.now() + 15 * 60 * 1000;

    // Step 4: Return all three values so they can be used where needed
    // resetToken → plain token (sent in email)
    // hashedToken → stored in DB
    // resetPasswordExpireTime → stored in DB
    return { resetToken, hashedToken, resetPasswordExpireTime };
};