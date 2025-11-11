import express from "express"; // Importing Express — the framework we use to build our server and handle routes
import { config } from "dotenv"; // Importing dotenv config function to load environment variables from config.env
import cors from "cors"; // Importing CORS to allow frontend (React app) to talk to backend
import cookieParser from "cookie-parser"; // Importing cookie-parser to read/write cookies in the browser
import fileUpload from "express-fileupload"; // Importing fileUpload middleware to handle file uploads (like product images)
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import database from "./database/db.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30"
})

// Initialize express app
const app = express();

// Enable CORS for your frontend and dashboard URLs
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL], // Allowed origins
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        credentials: true, // Allow cookies and credentials to be sent
    })
);

// app.use(
//     cors({
//         origin: ["https://shopbud-admin.onrender.com",
//             "https://shopbud-frontend.onrender.com"
//         ],
//         methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//         credentials: true,
//     })
// )

app.post(
    "/api/v1/payment/webhook",
    express.raw({ type: "application/json" }), // Use raw body parser because Stripe requires the raw payload
    async (req, res) => {
        const sig = req.headers["stripe-signature"];    // Stripe sends a signature header for security
        let event;
        try {
            // Verify the Stripe webhook signature to prevent tampering
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (error) {
            // Invalid webhook signature or bad payload
            return res.status(400).send(`Webhook Error: ${error.message || error}`);
        }

        // Only process successful payment intents
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent_client_secret = event.data.object.client_secret;
            try {
                // Update the payment status in your `payments` table
                const updatedPaymentStatus = "Paid";
                const paymentTableUpdateResult = await database.query(
                    `UPDATE payments SET payment_status = $1 WHERE payment_intent_id = $2 RETURNING *`,
                    [updatedPaymentStatus, paymentIntent_client_secret]
                );

                // Update the `paid_at` timestamp in the corresponding `orders` table
                await database.query(
                    `UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING *`,
                    [paymentTableUpdateResult.rows[0].order_id]
                );

                const orderId = paymentTableUpdateResult.rows[0].order_id;

                // 3. Reduce stock quantity for each purchased product
                const { rows: orderedItems } = await database.query(
                    `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
                    [orderId]
                );

                for (const item of orderedItems) {
                    await database.query(
                        `UPDATE products SET stock = stock - $1 WHERE id =$2`,
                        [item.quantity, item.product_id]
                    );
                }
            } catch (error) {
                return res
                    .status(500)
                    .send(`Error updating paid_at timestamp in orders table.`)
            }
        }
        // Respond to Stripe immediately to acknowledge receipt
        res.status(200).send({ received: true });
    }
);

app.use(cookieParser()); // Enable cookie parsing (so we can use req.cookies)

app.use(express.json()); // Parse incoming JSON data (so backend can understand JSON request bodies)

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data (used when forms are submitted)


// Enable file uploads and store temp files before sending to Cloudinary
app.use(
    fileUpload({
        tempFileDir: "./upload", // Temporary folder for uploads
        useTempFiles: true, // Use temp files instead of keeping them in memory
    })
);

// ----Routes----
// Authentication routes (register, login, logout, profile, password reset)
app.use("/api/v1/auth", authRouter);

// Product routes (create, fetch, update, delete products)
app.use("/api/v1/product", productRouter);

// Admin panel routes (fetch users, etc.)
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/order", orderRouter);

// Create tables when server starts (auto-runs table setup if not exists)
createTables();

// This catches any errors thrown in your route handlers
app.use(errorMiddleware);

// Export app so we can use it in server.js
export default app;

