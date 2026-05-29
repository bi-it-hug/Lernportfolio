import * as db from "../../fw/db.js"
import { escapeHtml } from "../../fw/security.js"

export async function search(req) {
    if (!req.session || !req.session.userId) {
        return "Unauthorized"
    }

    const terms = req.query.terms
    if (!terms || typeof terms !== "string" || terms.length === 0) {
        return "Not enough information to search"
    }

    const userId = req.session.userId
    const [rows] = await db.query(
        "SELECT ID, title, state FROM tasks WHERE userID = ? AND title LIKE ?",
        [userId, `%${terms}%`]
    )

    if (rows.length === 0) {
        return "No results found!"
    }

    return rows
        .map((row) => `${escapeHtml(row.title)} (${escapeHtml(row.state)})`)
        .join("\n")
}
