const db = require('./fw/db');
const bcrypt = require('bcryptjs');

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 5;

async function handleLogin(req, res) {
    let msg = '';
    let user = { username: '', userid: 0, role: '' };

    if (typeof req.body.username !== 'undefined' && typeof req.body.password !== 'undefined') {
        const identifier = req.body.username;
        const ip = req.ip || '';

        const locked = await isLockedOut(identifier, ip);
        if (locked) {
            msg = `<p class="info info-error">Too many failed attempts. Please wait ${LOCKOUT_MINUTES} minutes.</p>`;
            return { html: msg + getHtml(req.session.csrfToken), user };
        }

        const result = await validateLogin(identifier, req.body.password);
        await recordAttempt(identifier, ip, result.valid);

        if (result.valid) {
            user.username = identifier;
            user.userid = result.userId;
            user.role = result.role;
        } else {
            msg = `<p class="info info-error">${result.msg}</p>`;
        }
    }

    return { html: msg + getHtml(req.session.csrfToken), user };
}

function startUserSession(req, res, user) {
    req.session.regenerate((err) => {
        req.session.userid = user.userid;
        req.session.username = user.username;
        req.session.role = user.role;
        res.redirect('/');
    });
}

async function validateLogin(username, password) {
    let result = { valid: false, msg: '', userId: 0, role: '' };

    const sql = `SELECT u.id, u.username, u.password, r.title as role
                 FROM users u
                 LEFT JOIN permissions p ON u.id = p.userID
                 LEFT JOIN roles r ON p.roleID = r.ID
                 WHERE u.username = ?`;
    try {
        const results = await db.executeStatement(sql, [username]);

        if (results.length > 0) {
            const row = results[0];
            const match = await bcrypt.compare(password, row.password);
            if (match) {
                result.userId = row.id;
                result.role = row.role || 'User';
                result.valid = true;
            } else {
                result.msg = 'Invalid username or password';
            }
        } else {
            result.msg = 'Invalid username or password';
        }
    } catch (err) {
        console.error('Login error:', err.message);
        result.msg = 'An error occurred. Please try again.';
    }

    return result;
}

async function isLockedOut(identifier, ip) {
    const cutoff = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);
    const sql = `SELECT COUNT(*) as cnt FROM login_attempts
                 WHERE (identifier = ? OR ip_address = ?) AND success = 0 AND attempt_time > ?`;
    const rows = await db.executeStatement(sql, [identifier, ip, cutoff]);
    return rows[0].cnt >= MAX_ATTEMPTS;
}

async function recordAttempt(identifier, ip, success) {
    const sql = `INSERT INTO login_attempts (identifier, ip_address, success, attempt_time) VALUES (?, ?, ?, NOW())`;
    await db.executeStatement(sql, [identifier, ip, success ? 1 : 0]);
}

function getHtml(csrfToken) {
    return `
    <h2>Login</h2>
    <form id="form" method="post" action="/login">
        <input type="hidden" name="_csrf" value="${csrfToken || ''}">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control size-medium" name="username" id="username" maxlength="255" autocomplete="username">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control size-medium" name="password" id="password" maxlength="255" autocomplete="current-password">
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Login" />
        </div>
    </form>
    <p><a href="/register">Noch kein Konto? Registrieren</a></p>`;
}

module.exports = {
    handleLogin,
    startUserSession,
    getLoginForm: (req) => getHtml(req.session.csrfToken)
};
