// Function to generate a nicely formatted HTML email template
export const generateEmailTemplate = (resetPasswordUrl) => {
  return `
    <div 
      style="
        font-family: Arial, sans-serif; 
        max-width: 600px; 
        margin: 0 auto; 
        padding: 20px; 
        border: 1px solid #ddd; 
        border-radius: 8px; 
        background-color: #000; 
        color: #fff;
      "
    >
      <!-- Email Header -->
      <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>

      <!-- Greeting -->
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>

      <!-- Instructions -->
      <p style="font-size: 16px; color: #ccc;">
        You requested to reset your password. Please click the button below to proceed:
      </p>

      <!-- Reset Button -->
      <div style="text-align: center; margin: 20px 0;">
        <a 
          href="${resetPasswordUrl}"
          style="
            display: inline-block; 
            font-size: 16px; 
            font-weight: bold; 
            color: #000; 
            text-decoration: none; 
            padding: 12px 20px; 
            border: 1px solid #fff; 
            border-radius: 5px; 
            background-color: #fff;
          "
        >
          Reset Password
        </a>
      </div>

      <!-- Info about expiry -->
      <p style="font-size: 16px; color: #ccc;">
        If you did not request this, please ignore this email. 
        The link will expire in 15 minutes.
      </p>

      <!-- Fallback plain link -->
      <p style="font-size: 16px; color: #ccc;">
        If the button above doesn’t work, copy and paste the following URL into your browser:
      </p>

      <!-- Display plain link -->
      <p style="font-size: 16px; color: #fff; word-wrap: break-word;">
        ${resetPasswordUrl}
      </p>

      <!-- Footer -->
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you,<br>Ecommerce Team</p>
        <p style="font-size: 12px; color: #444;">
          This is an automated message. Please do not reply to this email.
        </p>
      </footer>
    </div>
    `;
};
