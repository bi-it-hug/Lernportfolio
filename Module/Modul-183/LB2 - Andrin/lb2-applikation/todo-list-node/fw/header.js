const { escapeHtml } = require('./escape');

async function getHtml(req) {
    const isLoggedIn = req.session && req.session.userid;
    const isAdmin = isLoggedIn && req.session.role === 'Admin';

    let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TBZ 'Secure' App</title>
    <meta name="csrf-token" content="${req.session.csrfToken || ''}">
    <link rel="stylesheet" href="/style.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.21.0/jquery.validate.min.js"></script>
</head>
<body>
    <header>
        <div>TBZ M183 App</div>`;

    if (isLoggedIn) {
        content += `
        <nav>
            <ul>
                <li><a href="/">Tasks</a></li>
                <li><a href="/history">Login-History</a></li>
                <li><a href="/change-password">Passwort ändern</a></li>
                <li><a href="/delete-account">Account löschen</a></li>`;
        if (isAdmin) {
            content += `<li><a href="/admin/users">User List</a></li>`;
        }
        content += `
                <li><a href="/logout">Logout (${escapeHtml(req.session.username)})</a></li>
            </ul>
        </nav>`;
    }

    content += `
    </header>
    <main>`;

    return content;
}

module.exports = getHtml;
