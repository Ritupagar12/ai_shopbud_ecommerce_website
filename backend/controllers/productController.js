import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"; // Wrap async functions to catch errors
import ErrorHandler from "../middlewares/errorMiddleware.js";   // Custom error handler class
import database from "../database/db.js";   // PostgreSQL client
import { v2 as cloudinary } from "cloudinary";  // Cloudinary for image upload
import { getAIRecommendation } from "../utils/getAIRecommendation.js";
import { getUsdToNzdRate } from "../utils/getExchangeRate.js";

// Controller to create a new product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body; // Product details from request
    const created_by = req.user.id; // Logged-in user ID from authentication middleware

    // Check if all required fields are provided
    if (!name || !description || !price || !category || !stock) {
        return next(new ErrorHandler("Plese provide complete product details.", 400));
    }

    // Handle product image uploads
    let uploadedImages = [];
    if (req.files && req.files.images) {
        // Convert single upload into an array for consistent handling
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        // Upload each image to Cloudinary and store its details
        for (const image of images) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "Ecommerce_Product_Images", // Cloudinary folder name
                width: 1000,     // Resize for consistency
                crop: "scale",  // Maintain aspect ratio
            });
            uploadedImages.push({
                url: result.secure_url, // Publicly accessible image URL of uploaded image
                public_id: result.public_id,    // Unique ID for Cloudinary image
            });
        }
    }

    // Insert the product into database
    const rate = await getUsdToNzdRate();   //fetch live rate
    console.log("USD -> NZD rates inside controller", rate);

    const product = await database.query(`INSERT INTO products (name, description, price, category, stock, images, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, description, price * rate, category, stock, JSON.stringify(uploadedImages), created_by]
    );

    // Respond with success and created product details
    res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product: product.rows[0],
    });
});

// Fetch all products with filters, search, and pagination
export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
    const { availability, price, category, ratings, search } = req.query;

    // Pagination setup (default 10 per page)
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const conditions = [];  // Will store SQL filter conditions
    let values = [];    // Will store parameterized query values
    let index = 1;  // Keeps track of placeholder positions ($1, $2, …)

    let paginationPlaceholders = {};    // Helps build dynamic LIMIT/OFFSET placeholders

    // Filter by stock availability
    if (availability === "in-stock") {
        conditions.push(`stock > 5`);
    } else if (availability === "limited") {
        conditions.push(`stock > 0 AND stock <= 5`);
    } else if (availability === "out-of-stock") {
        conditions.push(`stock = 0`);
    }

    // Filter by price range (e.g., price=100-500)
    if (price) {
        const [minPrice, maxPrice] = price.split("-");
        if (minPrice && maxPrice) {
            conditions.push(`price BETWEEN $${index} AND $${index + 1}`);
            values.push(minPrice, maxPrice);
            index += 2;
        }
    }

    //Filter by category (case-insensitive)
    if (category) {
        conditions.push(`category ILIKE $${index}`);
        values.push(`%${category}%`);
        index++;
    }


    // Filter by ratings
    if (ratings) {
        conditions.push(`ratings >= $${index} AND ratings < $${index + 1}`);
        values.push(ratings, parseInt(ratings) + 1);
        index += 2;
    }

    // Keyword search in product name or description
    if (search) {
        conditions.push(`(p.name ILIKE $${index} OR p.description ILIKE $${index})`);
        values.push(`%${search}%`);
        index++;
    }

    // Build WHERE clause dynamically
    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total product count for pagination info
    const totalProductsResult = await database.query(`SELECT COUNT(*) FROM products p ${whereClause}`, values);

    const totalProducts = parseInt(totalProductsResult.rows[0].count);

    // Add pagination placeholders
    paginationPlaceholders.limit = `$${index}`;
    values.push(limit);
    index++;

    paginationPlaceholders.offset = `$${index}`;
    values.push(offset);
    index++;

    // Fetch main products (with review count)
    const query = `
    SELECT p.*, 
    COUNT(r.id) AS review_count 
    FROM products p 
    LEFT JOIN reviews r ON p.id = r.product_id 
    ${whereClause} 
    GROUP BY p.id 
    ORDER BY p.created_at DESC 
    LIMIT ${paginationPlaceholders.limit} 
    OFFSET ${paginationPlaceholders.offset}
    `;
    const result = await database.query(query, values);

    // Fetch recently added products (last 30 days)
    const newProductsQuery = `
    SELECT p.*,
    COUNT (r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 8
    `;
    const newProductsResult = await database.query(newProductsQuery);

    // Fetch top-rated products (rating ≥ 4.5)
    const topRatedQuery = `
    SELECT p.*,
    COUNT (r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.ratings >= 4.5
    GROUP BY p.id
    ORDER BY p.ratings DESC, p.created_at DESC
    LIMIT 8
    `;
    const topRatedResult = await database.query(topRatedQuery);

    // Final response
    res.status(200).json({
        success: true,
        products: result.rows,  // Filtered + paginated products
        totalProducts,  // For frontend pagination
        newProducts: newProductsResult.rows,
        topRatedProducts: topRatedResult.rows,
    });
});

// Update product details (Admin only)
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;    // Extract product ID from URL params (/update/:productId)
    const { name, description, price, category, stock } = req.body; // Extract updated details from request body

    // Validate that all essential fields are provided before updating
    if (!name || !description || !price || !category || !stock) {
        return next(new ErrorHandler("Plese provide complete product details.", 400));
    }

    // Check if product exists in the database
    const product = await database.query("SELECT * FROM products WHERE id = $1", [productId]);

    // If no product found, stop execution and send error response
    if (product.rows.length === 0) {
        return next(new ErrorHandler("Product not found.", 404));
    }

    // Update product with new data in the database
    const rate = await getUsdToNzdRate(); //Live NZD rate
    const result = await database.query(
        `UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5 WHERE id = $6 RETURNING *`,
        [name, description, price * rate, category, stock, productId]
    );

    // Send updated product back as response

    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        updatedProduct: result.rows[0],
    });

})

// Delete a product (Admin only)
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;

    // Check if the product exists before deleting
    const product = await database.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (product.rows.length === 0) {
        // If no record found, throw 404
        return next(new ErrorHandler("Product not found.", 404));
    }

    // Extract images linked with product for deletion from Cloudinary
    const images = product.rows[0].images;

    // Delete product record from database
    const deleteResult = await database.query("DELETE FROM products WHERE id = $1 RETURNING *", [productId]);

    // If deletion fails (shouldn’t happen normally), throw error
    if (deleteResult.rows.length === 0) {
        return next(new ErrorHandler("Failed to delete product,", 500));
    }

    // Delete associated images from Cloudinary to avoid orphan files
    // Only runs if product had images stored in the database    
    if (images && images.length > 0) {
        for (const image of images) {
            // image.public_id is required to identify and delete the image from Cloudinary
            await cloudinary.uploader.destroy(image.public_id);
        }
    }

    // Step 5: Send success response with details of deleted product
    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
        deleteProduct: deleteResult.rows[0],    // Send back deleted data for confirmation/Logging
    });
});

// Fetch a single product by ID (Public route)
export const fetchSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;   // Extract product ID from URL

    // Fetch product details along with all reviews and reviewer info
    const result = await database.query(`
        SELECT 
            p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'review_id', r.id,
                            'rating', r.rating,
                            'comment', r.comment,
                            'reviewer', json_build_object(
                                'id', u.id,
                                'name', u.name,
                                'avatar', u.avatar
                            )
                        )
                    ) FILTER (WHERE r.id IS NOT NULL), '[]'
                ) AS reviews
            FROM products p
            LEFT JOIN reviews r ON p.id = r.product_id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE p.id = $1
            GROUP BY p.id
        `, [productId]);

    // Send product and all its reviews in response
    res.status(200).json({
        success: true,
        message: "Product fetched successfully.",
        product: result.rows[0],    // Includes nested reviews array
    });
});

// Controller to post or update a product review
export const postProductReview = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;   // Extract product ID from URL
    const { rating, comment } = req.body;   // Extract rating and comment from request body

    // Validate required fields
    if (!rating || !comment) {
        return next(new ErrorHandler("Please provide rating and comment.", 400));
    }

    // Check if user has purchased the product
    const purchaseCheckQuery = `
    SELECT oi.product_id
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN payments p ON p.order_id = o.id
    WHERE o.buyer_id = $1
    AND oi.product_id = $2
    AND p.payment_status = 'Paid'
    LIMIT 1
    `;


    // Execute query to verify purchase
    const { rows } = await database.query(purchaseCheckQuery, [req.user.id, productId,]);

    // If user has not purchased, block review
    if (rows.length === 0) {
        return res.status(403).json({
            success: true,
            message: "You can only review a product you've purchased."
        });
    }

    // Check if product exists
    const product = await database.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (product.rows.length === 0) {
        return next(new ErrorHandler("Product not found.", 404));
    }

    // Check if the user has already reviewed this product
    const isAlreadyReviewd = await database.query(`
        SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2
        `, [productId, req.user.id]
    );

    let review;
    // If review exists, update it; otherwise, insert a new review
    if (isAlreadyReviewd.rows.length > 0) {
        review = await database.query("UPDATE reviews SET rating = $1, comment = $2 WHERE product_id = $3 AND user_id = $4 RETURNING *",
            [rating, comment, productId, req.user.id]
        );
    } else {
        review = await database.query("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
            [productId, req.user.id, rating, comment]
        );
    }

    // Recalculate average rating for the product
    const allReviews = await database.query(`SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1`, [productId]);

    const newAvgRating = allReviews.rows[0].avg_rating;

    // Update product's average rating
    const updatedProduct = await database.query(`
        UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *`, [newAvgRating, productId]);

    // Send response with updated review and product
    res.status(200).json({
        success: true,
        message: "Review posted.",
        review: review.rows[0],
        product: updatedProduct.rows[0],
    });
});

// Import async error wrapper to automatically handle try/catch in async functions
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    // Extract product ID from URL parameters
    const { productId } = req.params;
    // Delete the review that matches the product and the currently logged-in user
    // Using `RETURNING *` so we can confirm what was deleted and return it in response
    const review = await database.query("DELETE FROM reviews WHERE product_id = $1 AND user_id = $2 RETURNING *", [productId, req.user.id]);

    // Check if a review was actually found and deleted
    // If not, that means either the user didn’t post a review or it doesn’t exist
    if (review.rows.length === 0) {
        return next(new ErrorHandler("Review not found.", 404));
    }

    // After deleting, calculate the new average rating for that product
    // We take all remaining reviews and compute their average rating
    const allReviews = await database.query(`SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1`, [productId]);

    // Store the newly calculated average rating (could be null if no reviews left)
    const newAvgRating = allReviews.rows[0].avg_rating || 0;

    // Update the product’s `ratings` column to reflect the new average
    // This keeps product data in sync with the review table    
    const updatedProduct = await database.query(`
        UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *`, [newAvgRating, productId]);

    // Step 6: Send a success response back to the client
    // Include the deleted review data and the updated product details
    res.status(200).json({
        success: true,
        message: "Your review has been deleted.",
        review: review.rows[0],  // The deleted review details
        product: updatedProduct.rows[0],     // Product with updated rating
    });
})

// Controller to fetch products filtered using both keyword search and AI recommendations.
// It combines database filtering (PostgreSQL full-text style search using ILIKE)
// and AI-powered filtering using Gemini.
export const fetchAIFilteredProducts = catchAsyncErrors(async (req, res, next) => {
    // Extract the user’s natural language query (the "prompt") from the request body.
    const { userPrompt } = req.body;

    // Basic validation: if userPrompt is missing or empty, send a 400 error.
    if (!userPrompt) {
        return next(new ErrorHandler("Provide a valid prompt.", 400));
    }

    // STEP 1: Extract useful keywords from the prompt
    // The idea here is to filter out common "stop words" like "the", "is", "for" etc.
    // so that the database query focuses only on meaningful words such as "shoes", "laptop", "organic", etc.
    const filterKeywords = (query) => {
        // A list of common English words and symbols that add no real search value.
        const stopWords = new Set([
            "the",
            "they",
            "them",
            "then",
            "I",
            "we",
            "you",
            "he",
            "she",
            "it",
            "is",
            "a",
            "an",
            "of",
            "and",
            "or",
            "to",
            "for",
            "from",
            "on",
            "who",
            "whom",
            "why",
            "when",
            "which",
            "with",
            "this",
            "that",
            "in",
            "at",
            "by",
            "be",
            "not",
            "was",
            "were",
            "has",
            "have",
            "had",
            "do",
            "does",
            "did",
            "so",
            "some",
            "any",
            "how",
            "can",
            "could",
            "should",
            "would",
            "there",
            "here",
            "just",
            "than",
            "because",
            "but",
            "its",
            "it's",
            "if",
            ".",
            ",",
            "!",
            "?",
            ">",
            "<",
            ";",
            "`",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
        ]);


        // Convert everything to lowercase → remove punctuation → split into words.
        // Example: "Show me latest Apple laptops" → ["show", "me", "latest", "apple", "laptops"]
        return query
            .toLowerCase()
            .replace(/[^\w\s]/g, "")    // removes punctuation/special chars
            .split(/\s+/)   // splits into individual words
            .filter(word => !stopWords.has(word))    // Filter out all stopwords
            .map((word) => `%${word}%`);           // For each keyword, wrap with `%` for SQL ILIKE partial matching
        // e.g., "apple" becomes "%apple%" so we can match substrings like "Apple Watch"
    };

    // Process user’s input through filter function to get clean search terms.
    const keywords = filterKeywords(userPrompt);

    // STEP 2: Run keyword-based filtering in the database
    // Using ILIKE ANY($1) allows matching any of the keywords (case-insensitive)
    // against product `name`, `description`, or `category`.
    // LIMIT 200 prevents over-fetching from the DB (useful if your product table is large).

    const result = await database.query(`
        SELECT * FROM products 
        WHERE name ILIKE ANY($1) 
        OR description ILIKE ANY($1) 
        OR category ILIKE ANY($1)
        LIMIT 200;
        `, [keywords]
    );

    // Get the filtered rows (array of products)
    const filteredProducts = result.rows;
    // STEP 3: If no matches found, return early message
    // No need to call AI here — if database finds nothing relevant, just respond directly.
    if (filteredProducts.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No products found matching your prompt.",
            products: [],
        });
    }

    // STEP 4: Call Gemini AI for intelligent re-filtering/ranking
    // The getAIRecommendation function takes the user's natural query and
    // the DB-filtered product list, then sends them to Gemini.
    // Gemini uses the product data and user intent to return the most relevant subset.
    const { success, products } = await getAIRecommendation(req, res, userPrompt, filteredProducts)

    // STEP 5: Send final AI-refined product list to user
    // This combines both database relevance and AI intelligence.
    res.status(200).json({
        success: success,
        message: "AI filtered products.",
        products,
    })
}) 