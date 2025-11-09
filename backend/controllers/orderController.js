import database from "../database/db.js";   //lets you run SQL queries against PostgreSQL.
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";   // wraps async functions so any thrown error automatically goes to Express’s error middleware.
import ErrorHandler from "../middlewares/errorMiddleware.js";   // custom error class to send consistent error responses.
import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";  // handles creating a Stripe payment intent and saving it in the payments table.

// ============================================================================
// CONTROLLER: placeNewOrder
// This controller handles the entire order placement process:
// 1. Validates user input (shipping + ordered items)
// 2. Calculates total cost with tax and shipping
// 3. Creates order + order items + shipping info in DB
// 4. Generates a Stripe Payment Intent
// ============================================================================

export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
    // Extracting required fields from request body
    const {
        full_name,
        state,
        city,
        country,
        address,
        pincode,
        phone,
        orderedItems
    } = req.body;
    // Validate shipping information
    if (
        !full_name ||
        !state ||
        !city ||
        !country ||
        !address ||
        !pincode ||
        !phone
    ) {
        return next(
            new ErrorHandler("Please provide complete shipping details.", 400)
        );
    }

    // Validate cart items 
    // Ensure orderedItems is a valid array
    const items = Array.isArray(orderedItems)
        ? orderedItems
        : JSON.parse(orderedItems);

    if (!items || items.length === 0) {
        return next(new ErrorHandler("No items in cart.", 400));
    }

    // Extract product IDs from items array
    const productIds = items.map((item) => item.product.id);
    // Fetch products from DB to verify stock and price
    const { rows: products } = await database.query(
        `SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])`,
        [productIds]
    );

    // Initialize total order price and placeholders for bulk inserts
    let total_price = 0;
    const values = [];  // To store order_items data
    const placeholders = [];     // To store ($1, $2, $3, ...) placeholders dynamically

    // Loop through each item in the cart
    items.forEach((item, index) => {
        // Match the product from DB
        const product = products.find((p) => p.id === item.product.id);
        if (!product) {
            return next(
                new ErrorHandler(`Product not found for ID: ${item.product.id}`, 404)
            );
        }

        // Check available stock
        if (item.quantity > product.stock) {
            return next(
                new ErrorHandler(
                    `Only ${product.stock} units available for ${product.name}`,
                    400
                )
            );
        }
        // Calculate price for this item
        const itemTotal = product.price * item.quantity;
        total_price += itemTotal;

        // Prepare values array for bulk insertion into order_items
        // Each row has: order_id (null for now), product_id, quantity, price, image_url, name
        values.push(
            null,
            product.id,
            item.quantity,
            product.price,
            item.product.images[0].url || "",
            product.name
        ); // null - order_id will be inserted after order creation

        // Build SQL placeholders dynamically: ($1, $2, $3, $4, $5, $6)
        const offset = index * 6;

        placeholders.push(
            `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`
        );
    });

    // Add tax and shipping
    const tax_price = 0.18;    // 18% tax
    const shipping_price = total_price >= 50 ? 0 : 2;   // flat rate shipping
    total_price = Math.round(
        total_price + total_price * tax_price + shipping_price
    );

    // Create order in the "orders" table
    const orderResult = await database.query(`INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price) VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.user.id, total_price, tax_price, shipping_price]
    );

    // Get order ID from the inserted order
    const orderId = orderResult.rows[0].id;

    // Insert all order items
    // Replace null placeholders (first column) with actual order ID
    for (let i = 0; i < values.length; i += 6) {
        values[i] = orderId;
    }

    await database.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, image, title)
        VALUES ${placeholders.join(", ")} RETURNING *`, values);

    // Insert shipping info
    await database.query(
        `INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
        [orderId, full_name, state, city, country, address, pincode, phone]
    );

    // Generate Stripe Payment Intent
    // Creates a Stripe payment intent and stores it in payments table
    const paymentResponse = await generatePaymentIntent(orderId, total_price);

    if (!paymentResponse.success) {
        return next(new ErrorHandler("Payment Failed. Try again.", 500));
    }

    // Send response back to frontend 
    // Returns Stripe clientSecret so frontend can complete payment securely
    res.status(200).json({
        success: true,
        message: "Order placed successfully. Please proceed to payment.",
        paymentIntent: paymentResponse.clientSecret,
        total_price,
    });
});

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
    // Extract the order ID from the URL path (e.g. /orders/:orderId)
    const { orderId } = req.params;

    // ------------------------------------------------------------------------
    // Query Explanation:
    // - Selects all fields from `orders` table (aliased as 'o')
    // - LEFT JOIN with `order_items` to include items even if order_items is empty
    // - LEFT JOIN with `shipping_info` to include address details if available
    // - Uses json_agg() to group multiple order_items into a single array
    // - Uses json_build_object() to neatly package item and shipping data into JSON
    // ------------------------------------------------------------------------
    const result = await database.query(`
        SELECT
            o.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'order_item_id', oi.id,
                        'order_id', oi.order_id,
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'image', oi.image,
                        'title', oi.title
                    )
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
            ) AS order_items,
            json_build_object(
            'full_name', s.full_name,
            'state', s.state,
            'city', s.city,
            'country', s.country,
            'address', s.address,
            'pincode', s.pincode,
            'phone', s.phone
        ) AS shipping_info
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN shipping_info s ON o.id = s.order_id
    WHERE o.id = $1
    GROUP BY o.id, s.id;
        `, [orderId]
    );


    // Check if the order exists
    // If no matching rows found, return 404 Not Found
    if (result.rows.length === 0) {
        return next(new ErrorHandler("Order not found.", 404));
    }

    // Send successful response with structured order data
    // 'orders' key contains all order details, including nested items and shipping info
    res.status(200).json({
        success: true,
        message: "Order fetched.",
        orders: result.rows[0],
    })
});

// fetchMyOrders controller
// This function retrieves all orders for the currently logged-in user along with detailed order items and shipping info.
export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
    // Execute a single SQL query to fetch orders, order items, and shipping info
    const result = await database.query(
        `SELECT 
            o.*, 
             COALESCE(
                json_agg(
                    json_build_object(
                        'order_item_id', oi.id,
                        'order_id', oi.order_id,
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'image', oi.image,
                        'title', oi.title
                    )
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
            ) AS order_items,
            json_build_object(
                'full_name', s.full_name,
                'state', s.state,
                'city', s.city,
                'country', s.country,
                'address', s.address,
                'pincode', s.pincode,
                'phone', s.phone
            ) AS shipping_info
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN shipping_info s ON o.id = s.order_id
        WHERE o.buyer_id = $1 AND o.paid_at IS NOT NULL
        GROUP BY o.id, s.id;
    `, [req.user.id]    // Pass the logged-in user’s ID as parameter to prevent SQL injection
    );

    // Send the response with all fetched orders
    res.status(200).json({
        success: true,
        message: "All your orders are fetched.",
        myOrders: result.rows,  // Array of orders with order items and shipping info
    })
})

// Controller to fetch all orders (for admin or dashboard purposes)
export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
    // Execute SQL query to fetch orders along with associated order items and shipping info
    const result = await database.query(
        `SELECT o.*,
       COALESCE(
           json_agg(
               json_build_object(
                   'order_item_id', oi.id,
                   'order_id', oi.order_id,
                   'product_id', oi.product_id,
                   'quantity', oi.quantity,
                   'price', oi.price,
                   'image', oi.image,
                   'title', oi.title
               )
           ) FILTER (WHERE oi.id IS NOT NULL), '[]'
       ) AS order_items,
       json_build_object(
           'full_name', s.full_name,
           'state', s.state,
           'city', s.city,
           'country', s.country,
           'address', s.address,
           'pincode', s.pincode,
           'phone', s.phone
       ) AS shipping_info
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN shipping_info s ON o.id = s.order_id
WHERE o.paid_at IS NOT NULL
GROUP BY o.id, s.id
`);

    // Send response to frontend
    res.status(200).json({
        success: true,  // Indicates request succeeded
        message: "All orders fetched.", // Informative message
        orders: result.rows,    // Array of orders with nested items and shipping info
    })
})

// Controller to update the status of a specific order
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    // Extract the new status from the request body
    const { status } = req.body;
    // Validate that a status is provided
    if (!status) {
        return next(new ErrorHandler("Provide a valid status for order.", 400));
    }

    // Extract the orderId from request parameters
    const { orderId } = req.params;
    // Check if the order exists in the database
    const results = await database.query(
        `SELECT * FROM orders WHERE id =$1`,
        [orderId]
    );

    // If no order found, return 404 error
    if (results.rows.length === 0) {
        return next(new ErrorHandler("Invalid order ID.", 404));
    }

    // Update the order_status field in the orders table
    const updatedOrder = await database.query(
        `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *`,
        [status, orderId]
    );

    // Send success response with updated order details
    res.status(200).json({
        success: true,  // Indicates the update succeeded
        message: "Order status updated.",    // Informative message
        updatedOrder: updatedOrder.rows[0], // Return the updated order object
    });
});

// Controller to delete a specific order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    // Extract orderId from request parameters
    const { orderId } = req.params;
    // Attempt to delete the order from the database
    // RETURNING * allows us to get the deleted row back
    const results = await database.query(
        `DELETE FROM orders WHERE id = $1 RETURNING *
        `, [orderId]
    );

    // If no rows were deleted, the orderId does not exist
    if (results.rows.length === 0) {
        return next(new ErrorHandler("Invalid Order ID.", 404));
    }

    // Send success response with deleted order details
    res.status(200).json({
        success: true,    // Indicates the deletion succeeded
        message: "Order deleted.",  // Informative message
        order: results.rows[0], // Return the deleted order object
    });
});
