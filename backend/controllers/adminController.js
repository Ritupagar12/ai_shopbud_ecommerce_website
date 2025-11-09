// controllers/adminController.js

import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

// Get All Users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    // Get current page number from query string (e.g. ?page=2)
    // If no page provided, default to 1
    const page = parseInt(req.query.page) || 1;

    // Count total number of users in the database (role = "User")
    const totalUsersResult = await database.query("SELECT COUNT(*) FROM users WHERE ROLE = $1", ["User"]);

    // Convert the count result (which comes as a string) to a number
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Calculate pagination offset
    // limit = how many users per page (10)
    // offset = how many users to skip based on page number
    const limit = 10;
    const offset = (page - 1) * limit;

    // Fetch users for this page
    // Sorting users by most recently created first    
    const users = await database.query("SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", ["User", limit, offset]);

    // Send structured response
    res.status(200).json({
        success: true,
        totalUsers,  // Total number of users in DB
        currentPage: page,  // Current page requested
        users: users.rows,  // Array of users for this page
    });
});

// DELETE USER
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    // Extract user ID from route params
    const { id } = req.params;

    // Try to delete the user from the database and return the deleted record
    const deleteUser = await database.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    // If no record is returned, it means the user doesn't exist
    if (deleteUser.rows.length === 0) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // If the deleted user had an avatar, remove it from Cloudinary
    const avatar = deleteUser.rows[0].avatar;
    if (avatar?.public_id) {
        await cloudinary.uploader.destroy(avatar.public_id);
    }

    // Respond with a success message
    res.status(200).json({
        success: true,
        message: "User deleted successfully.",
    });
});

// Dashboard Stats
export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
    // 1. Define Important Dates     
    // Get the current date (today)
    const today = new Date();

    // Convert today's date into YYYY-MM-DD format (for easy date comparison in SQL)
    const todayDate = today.toISOString().split("T")[0];

    // Get yesterday’s date by subtracting 1 day from today
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    // Define start of current month (e.g., 2025-10-01)
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Define end of current month
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Define start and end of previous month for growth comparison
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // 2. Fetch global counts
    // Fetch total revenue ever generated from all orders
    const totalRevenueAllTimeQuery = await database.query(`
        SELECT SUM(total_price) FROM orders WHERE paid_at IS NOT NULL
    `);
    // Convert result to a number (Postgres returns string for SUM)
    const totalRevenueAllTime = parseFloat(totalRevenueAllTimeQuery.rows[0].sum) || 0;
    // Count total number of regular users (exclude admins)
    const totalUsersCountQuery = await database.query(`
        SELECT COUNT(*) FROM users WHERE role = 'User'
    `);
    // Convert result to number
    const totalUsersCount = parseInt(totalUsersCountQuery.rows[0].count) || 0;

    // 3. Fetch order status distribution
    // Get how many orders are currently in each status (Processing, Shipped, Delivered, etc.)
    const orderStatusCountsQuery = await database.query(`
        SELECT order_status, COUNT(*) FROM orders WHERE paid_at IS NOT NULL GROUP BY order_status
    `);
    // Initialize all possible order statuses with zero (so missing ones don't cause errors)
    const orderStatusCounts = {
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
    };

    // Fill in actual counts from DB query
    orderStatusCountsQuery.rows.forEach((row) => {
        orderStatusCounts[row.order_status] = parseInt(row.count);
    });

    // 4. Daily revenue
    // Fetch total revenue for *today* (based on created_at date)
    const todayRevenueQuery = await database.query(`
        SELECT SUM(total_price) 
        FROM orders 
        WHERE created_at::date = $1 AND paid_at IS NOT NULL
    `, [todayDate]);

    const todayRevenue = parseFloat(todayRevenueQuery.rows[0].sum) || 0;

    // Fetch total revenue for *yesterday*
    const yesterdayRevenueQuery = await database.query(`
        SELECT SUM(total_price) 
        FROM orders 
        WHERE created_at::date = $1 AND paid_at IS NOT NULL
    `, [yesterdayDate]);

    const yesterdayRevenue = parseFloat(yesterdayRevenueQuery.rows[0].sum) || 0;

    // 5. Monthly saled trend
    // Get total sales per month (used to draw line charts in admin dashboard)
    // DATE_TRUNC groups by month and aggregates total revenue.
    const monthlySalesQuery = await database.query(`
        SELECT 
            TO_CHAR(created_at, 'Mon YYYY') AS month,
            DATE_TRUNC('month', created_at) as date,
            SUM(total_price) as totalsales
        FROM orders WHERE paid_at IS NOT NULL
        GROUP BY month, date
        ORDER BY date ASC
    `);

    // Convert each row to a clean JS object for frontend use
    const monthlySales = monthlySalesQuery.rows.map((row) => ({
        month: row.month,
        totalsales: parseFloat(row.totalsales) || 0,
    }));

    // 6. Top selling products
    // Find top 5 best-selling products (join order_items with products)
    const topSellingProductsQuery = await database.query(`
            SELECT 
                p.name,
                p.images->0->>'url' AS image,
                p.category,
                p.ratings,
                SUM(oi.quantity) AS total_sold
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            JOIN orders o ON o.id = oi.order_id
            WHERE o.paid_at IS NOT NULL
            GROUP BY p.name, p.images, p.category, p.ratings
            ORDER BY total_sold DESC
            LIMIT 5
        `);

    // This result can be displayed in a dashboard section (e.g. "Top 5 Selling Products")
    const topSellingProducts = topSellingProductsQuery.rows;

    // 7. Current month sales
    // Calculate revenue only for this month’s date range
    const currentMonthSalesQuery = await database.query(`
            SELECT SUM(total_price) AS total
            FROM orders 
            WHERE paid_at IS NOT NULL AND created_at BETWEEN $1 AND $2
            `, [currentMonthStart, currentMonthEnd]
    );

    const currentMonthSales = parseFloat(currentMonthSalesQuery.rows[0].total) || 0;

    // 8. Low stock products
    // Fetch all products that are about to run out of stock (<=5 items left)
    const lowStockProductsQuery = await database.query(`
        SELECT name, stock 
        FROM products 
        WHERE stock <= 5
        `);

    const lowStockProducts = lowStockProductsQuery.rows;

    // 9. Revenue growth calculation
    // Fetch previous month’s total revenue to calculate growth % 
    const lastMonthRevenueQuery = await database.query(`
    SELECT SUM(total_price) AS total
    FROM orders
    WHERE paid_at IS NOT NULL AND created_at BETWEEN $1 AND $2
    `, [previousMonthStart, previousMonthEnd]);

    const lastMonthRevenue = parseFloat(lastMonthRevenueQuery.rows[0].total) || 0;

    // Calculate month-over-month revenue growth
    let revenueGrowth = "0%";
    if (lastMonthRevenue > 0) {
        const growthRate = ((currentMonthSales - lastMonthRevenue) / lastMonthRevenue) * 100;
        // Add + sign for positive growth, keep two decimal precision
        revenueGrowth = `${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(2)}%`;
    }

    // 10. New users this month
    // Count how many new users registered since the start of this month
    const newUsersThisMonthQuery = await database.query(`
        SELECT COUNT(*) 
        FROM users 
        WHERE created_at >= $1 AND role = 'User'
        `, [currentMonthStart]);

    const newUsersThisMonth = parseInt(newUsersThisMonthQuery.rows[0].count) || 0;

    // 11. Send final response
    res.status(200).json({
        success: true,
        message: "Dashboard Stats fetched successfully,",
        totalRevenueAllTime,    // lifetime total sales
        todayRevenue,    // revenue today
        yesterdayRevenue,   // revenue yesterday
        totalUsersCount, // total registered users
        orderStatusCounts,  // how many orders per status
        monthlySales,   // month-wise total sales (for charts)
        currentMonthSales,  // revenue this month
        topSellingProducts, // top 5 products by quantity sold
        lowStockProducts,   // items with low inventory
        revenueGrowth,  // growth % compared to last month
        newUsersThisMonth,  // new signups this month
    });

});