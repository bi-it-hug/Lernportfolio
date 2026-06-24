const db = require('./fw/db');
const bcrypt = require('bcryptjs');
const { escapeHtml } = require('./fw/escape');

async function handleRegister(req) {
    let error = '';
    let success = false;

    if (req.method === 'POST') {
        const username = (req.body.username || '').trim();
        const password = req.body.password || '';
        const passwordConfirm = req.body.password_confirm || '';

        if (!username || !password) {
            error = 'Benutzername und Passwort sind erforderlich.';
        } else if (username.length < 3 || username.length > 50) {
            error = 'Benutzername muss zwischen 3 und 50 Zeichen lang sein.';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            error = 'Benutzername darf nur Buchstaben, Zahlen und _ enthalten.';
        } else if (password.length < 8) {
            error = 'Passwort muss mindestens 8 Zeichen lang sein.';
        } else if (password !== passwordConfirm) {
            error = 'Passwörter stimmen nicht überein.';
        } else {
            const existing = await db.executeStatement(
                'SELECT ID FROM users WHERE username = ?', [username]
            );
            if (existing.length > 0) {
                error = 'Dieser Benutzername ist bereits vergeben.';
            } else {
                const hash = await bcrypt.hash(password, 12);
                await db.executeStatement(
                    'INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]
                );
                const newUser = await db.executeStatement(
                    'SELECT ID FROM users WHERE username = ?', [username]
                );
                await db.executeStatement(
                    'INSERT INTO permissions (userID, roleID) VALUES (?, 2)', [newUser[0].ID]
                );
                success = true;
            }
        }
    }

    return getHtml(req, error, success);
}

function getHtml(req, error, success) {
    const csrfToken = req.session.csrfToken || '';
    let html = '<h2>Registrieren</h2>';

    if (error) {
        html += `<p class="info info-error">${escapeHtml(error)}</p>`;
    }
    if (success) {
        return html + `<p class="info info-success">Registrierung erfolgreich!</p><p><a href="/login">Zum Login</a></p>`;
    }

    html += `
    <form id="form" method="post" action="/register">
        <input type="hidden" name="_csrf" value="${csrfToken}">
        <div class="form-group">
            <label for="username">Benutzername</label>
            <input type="text" class="form-control size-medium" name="username" id="username" maxlength="50" autocomplete="username">
        </div>
        <div class="form-group">
            <label for="password">Passwort (min. 8 Zeichen)</label>
            <input type="password" class="form-control size-medium" name="password" id="password" autocomplete="new-password">
        </div>
        <div class="form-group">
            <label for="password_confirm">Passwort bestätigen</label>
            <input type="password" class="form-control size-medium" name="password_confirm" id="password_confirm" autocomplete="new-password">
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Registrieren" />
        </div>
    </form>
    <p><a href="/login">Bereits ein Konto? Einloggen</a></p>`;

    return html;
}

module.exports = { handleRegister };
