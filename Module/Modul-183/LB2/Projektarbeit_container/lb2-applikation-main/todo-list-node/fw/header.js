import { escapeHtml, ensureCsrfToken } from "./security.js"

export default async function getHtml(req) {
    const csrfToken = req.session ? ensureCsrfToken(req) : ""

    let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="${escapeHtml(csrfToken)}">
    <title>TBZ Secure App</title>
    <link rel="stylesheet" href="/style.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0P+vQKVYj+qCtig8CzGpaFjVMInopra=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>
    <header>
        <div>This is the m183 test app</div>`

    if (req.session && req.session.userId) {
        content += `
        <nav>
            <ul>
                <li><a href="/">Tasks</a></li>`

        if (req.session.isAdmin) {
            content += `<li><a href="/admin/users">User List</a></li>`
        }

        content += `
                <li><a href="/logout">Logout</a></li>
            </ul>
        </nav>`
    }

    content += `
    </header>
    <main>`

    return content
}
