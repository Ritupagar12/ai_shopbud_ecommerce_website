import pkg from "pg";       // Import 'pg' package. 'pkg' gives us all exports, 'Client' is the main class used to connect
import { config } from "dotenv"; // Importing dotenv config function to load environment variables from config.env
const {Client} = pkg;        // Import 'pg' package. 'pkg' gives us all exports, 'Client' is the main class used to connect

// Load environment variables from config.env file
config({ path: "./config/config.env" }); // load before using process.env


const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

// Try connecting to PostgreSQL server
try {
    await database.connect(); // Establish the connection
    console.log("Connected to database successfully!");
} catch(err) {
      // If connection fails, log error and exit process
    console.error("Database connection failed", err);
    process.exit(1);
}

// Export the connected database instance so it can be used in all table files
export default database;