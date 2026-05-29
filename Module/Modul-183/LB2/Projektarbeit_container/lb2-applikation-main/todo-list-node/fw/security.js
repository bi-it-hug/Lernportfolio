import crypto from "crypto"

export const TASK_STATES = ["open", "in progress", "done"]
export const ADMIN_ROLE_TITLE = "Admin"

export function escapeHtml(value) {
    if (value === null || value === undefined) {
        return ""
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

export function ensureCsrfToken(req) {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString("hex")
    }
    return req.session.csrfToken
}

export function csrfField(req) {
    return `<input type="hidden" name="_csrf" value="${escapeHtml(ensureCsrfToken(req))}" />`
}

export function validateCsrf(req) {
    const token = req.body._csrf || req.headers["x-csrf-token"]
    return Boolean(
        token && req.session.csrfToken && token === req.session.csrfToken
    )
}

export function isLoggedIn(req) {
    return Boolean(req.session && req.session.userId)
}

export function isAdmin(req) {
    return Boolean(req.session && req.session.isAdmin)
}

export function isValidTaskState(state) {
    return TASK_STATES.includes(state)
}
