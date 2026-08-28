import * as db from "../fw/db.js"
import { escapeHtml } from "../fw/security.js"

export async function html() {
    const [rows] = await db.query(
        `SELECT users.ID, users.username, roles.title AS roleTitle
         FROM users
         INNER JOIN permissions ON users.ID = permissions.userID
         INNER JOIN roles ON permissions.roleID = roles.ID
         ORDER BY username`
    )

    let htmlContent = `
    <h2>User List</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
        </tr>`

    rows.forEach((record) => {
        htmlContent += `<tr>
            <td>${escapeHtml(record.ID)}</td>
            <td>${escapeHtml(record.username)}</td>
            <td>${escapeHtml(record.roleTitle)}</td>
        </tr>`
    })

    htmlContent += "</table>"
    return htmlContent
}
