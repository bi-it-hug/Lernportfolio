import express from "express"
import session from "express-session"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import header from "./fw/header.js"
import footer from "./fw/footer.js"
import * as login from "./login.js"
import { html as indexHtml } from "./index.js"
import { html as adminUserHtml } from "./admin/users.js"
import { html as editTaskHtml } from "./edit.js"
import { handle as saveTaskHandle } from "./savetask.js"
import { handle as deleteTaskHandle } from "./deletetask.js"
import { search as searchHandler } from "./search.js"
import { search as searchProviderSearch } from "./search/v2/index.js"
import {
    isLoggedIn,
    isAdmin,
    validateCsrf,
    ensureCsrfToken,
    escapeHtml,
} from "./fw/security.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
            },
        },
    })
)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(join(__dirname, "public")))

app.use(
    session({
        secret: process.env.SESSION_SECRET || "dev-only-change-in-production",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
        },
    })
)

app.use((req, res, next) => {
    if (req.session) {
        ensureCsrfToken(req)
    }
    next()
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many login attempts. Please try again later.",
})

const searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many search requests. Please try again later.",
})

function requireLogin(req, res, next) {
    if (!isLoggedIn(req)) {
        return res.redirect("/login")
    }
    next()
}

function requireAdmin(req, res, next) {
    if (!isLoggedIn(req)) {
        return res.redirect("/login")
    }
    if (!isAdmin(req)) {
        return res.status(403).send("Forbidden")
    }
    next()
}

function requireCsrf(req, res, next) {
    if (!validateCsrf(req)) {
        return res.status(403).send("Invalid CSRF token")
    }
    next()
}

app.get("/", requireLogin, async (req, res) => {
    const html = await wrapContent(await indexHtml(req), req)
    res.send(html)
})

app.get("/admin/users", requireAdmin, async (req, res) => {
    const html = await wrapContent(await adminUserHtml(), req)
    res.send(html)
})

app.get("/edit", requireLogin, async (req, res) => {
    const html = await wrapContent(await editTaskHtml(req), req)
    res.send(html)
})

app.get("/login", (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/")
    }
    wrapContent(login.getHtml(req), req).then((html) => res.send(html))
})

app.post("/login", loginLimiter, requireCsrf, async (req, res) => {
    if (isLoggedIn(req)) {
        return res.redirect("/")
    }

    const result = await login.validateLogin(
        req,
        req.body.username,
        req.body.password
    )
    if (result.valid) {
        return res.redirect("/")
    }

    const html = await wrapContent(login.getHtml(req, result.msg), req)
    res.send(html)
})

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid")
        res.redirect("/login")
    })
})

app.get("/profile", requireLogin, (req, res) => {
    const username = escapeHtml(req.session.username)
    res.send(`<p>Welcome, ${username}! <a href="/logout">Logout</a></p>`)
})

app.post("/savetask", requireLogin, requireCsrf, async (req, res) => {
    await saveTaskHandle(req)
    res.redirect("/")
})

app.post("/delete", requireLogin, requireCsrf, async (req, res) => {
    await deleteTaskHandle(req)
    res.redirect("/")
})

app.post(
    "/search",
    requireLogin,
    searchLimiter,
    requireCsrf,
    async (req, res) => {
        const result = await searchHandler(req)
        res.type("text/plain").send(result)
    }
)

app.get("/search/v2/", requireLogin, searchLimiter, async (req, res) => {
    const result = await searchProviderSearch(req)
    res.type("text/plain").send(result)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

async function wrapContent(content, req) {
    const headerHtml = await header(req)
    return headerHtml + content + footer
}
