import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "DLwWg8y6ds%JFL",
    database: process.env.DB_NAME || "lb3",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export { pool };
