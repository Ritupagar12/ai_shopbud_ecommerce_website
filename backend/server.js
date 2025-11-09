import app from "./app.js"; // Import the Express app instance that you created in app.js
import {v2 as cloudinary} from "cloudinary"; // Import Cloudinary (v2) — the SDK that allows us to upload images to the cloud

// Configure Cloudinary using credentials from your config.env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME, // Your Cloudinary account name
    api_key: process.env.CLOUDINARY_CLIENT_API, //Public API key (acts like a username)
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET, // Secret key
});

// Start the server and make it listen on the port defined in config.env
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);   // Log a message when server successfully starts
});