import mysql from "mysql2/promise"
import dbConfig from "../config.js"

const pool = mysql.createPool(dbConfig)

export async function query(sql, params = []) {
    return pool.query(sql, params)
}
