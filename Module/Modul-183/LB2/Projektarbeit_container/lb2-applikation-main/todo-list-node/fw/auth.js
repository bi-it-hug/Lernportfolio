import * as db from "./db.js"
import { ADMIN_ROLE_TITLE } from "./security.js"

export async function loadUserRoles(userId) {
    const [rows] = await db.query(
        `SELECT roles.title AS rolename
         FROM users
         INNER JOIN permissions ON users.id = permissions.userID
         INNER JOIN roles ON permissions.roleID = roles.id
         WHERE users.id = ?`,
        [userId]
    )
    return rows.map((row) => row.rolename)
}

export async function setSessionUser(req, userId, username) {
    const roleNames = await loadUserRoles(userId)
    req.session.userId = userId
    req.session.username = username
    req.session.roleNames = roleNames
    req.session.isAdmin = roleNames.includes(ADMIN_ROLE_TITLE)
    req.session.loggedin = true
}
