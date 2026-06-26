export default {
    host: process.env.DBSERVER || process.env.DB_HOST || "m183-lb2-db",
    user: process.env.DB_USER || "m183_app",
    password: process.env.DB_PASSWORD || "Some.Real.Secr3t",
    database: process.env.DB_NAME || "m183_lb2",
    waitForConnections: true,
    connectionLimit: 10,
}
