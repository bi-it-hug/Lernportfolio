import bcrypt from "bcrypt"
import * as db from "./fw/db.js"
import { setSessionUser } from "./fw/auth.js"
import { escapeHtml, csrfField } from "./fw/security.js"

const GENERIC_LOGIN_ERROR = "Invalid username or password."

export async function validateLogin(req, username, password) {
    const result = { valid: false, msg: "" }

    if (!username || !password) {
        result.msg = GENERIC_LOGIN_ERROR
        return result
    }

    try {
        const [rows] = await db.query(
            "SELECT id, username, password FROM users WHERE username = ? LIMIT 1",
            [username]
        )

        if (rows.length === 0) {
            result.msg = GENERIC_LOGIN_ERROR
            return result
        }

        const user = rows[0]
        const passwordValid = await verifyPassword(
            password,
            user.password,
            user.id
        )

        if (!passwordValid) {
            result.msg = GENERIC_LOGIN_ERROR
            return result
        }

        await setSessionUser(req, user.id, user.username)
        result.valid = true
        return result
    } catch {
        console.error("Login error")
        result.msg = GENERIC_LOGIN_ERROR
        return result
    }
}

async function verifyPassword(plainPassword, storedPassword, userId) {
    if (storedPassword.startsWith("$2")) {
        return bcrypt.compare(plainPassword, storedPassword)
    }

    if (plainPassword !== storedPassword) {
        return false
    }

    const hash = await bcrypt.hash(plainPassword, 12)
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, userId])
    return true
}

export function getHtml(req, message = "") {
    const msgHtml = message
        ? `<p class="info info-error">${escapeHtml(message)}</p>`
        : ""

    return `
    ${msgHtml}
    <h2>Login</h2>

    <form id="form" method="post" action="/login">
        ${csrfField(req)}
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control size-medium" name="username" id="username" autocomplete="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control size-medium" name="password" id="password" autocomplete="current-password" required>
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Login" />
        </div>
    </form>`
}
