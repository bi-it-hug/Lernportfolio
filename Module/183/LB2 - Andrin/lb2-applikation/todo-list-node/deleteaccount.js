const db = require('./fw/db');
const bcrypt = require('bcryptjs');

async function handleDeleteAccount(req, res) {
    let msg = '';

    if (req.method === 'POST') {
        const password = req.body.password || '';

        const rows = await db.executeStatement(
            'SELECT password FROM users WHERE ID = ?', [req.session.userid]
        );
        const match = rows.length > 0 && await bcrypt.compare(password, rows[0].password);

        if (!match) {
            msg = `<p class="info info-error">Falsches Passwort. Account wurde nicht gelöscht.</p>`;
        } else {
            const userid = req.session.userid;
            await db.executeStatement('DELETE FROM tasks WHERE userID = ?', [userid]);
            await db.executeStatement('DELETE FROM permissions WHERE userID = ?', [userid]);
            await db.executeStatement('DELETE FROM login_attempts WHERE identifier = ?', [req.session.username]);
            await db.executeStatement('DELETE FROM users WHERE ID = ?', [userid]);

            req.session.destroy(() => {
                res.redirect('/login');
            });
            return;
        }
    }

    return msg + getHtml(req);
}

function getHtml(req) {
    const csrf = req.session.csrfToken || '';
    return `
    <h2>Account löschen</h2>
    <p class="info info-error">Achtung: Diese Aktion ist unwiderruflich. Dein Account und alle deine Tasks werden permanent gelöscht.</p>
    <form id="form" method="post" action="/delete-account">
        <input type="hidden" name="_csrf" value="${csrf}">
        <div class="form-group">
            <label for="password">Passwort zur Bestätigung</label>
            <input type="password" class="form-control size-medium" name="password" id="password">
        </div>
        <div class="form-group">
            <label></label>
            <input type="submit" class="btn size-auto" value="Account unwiderruflich löschen" />
        </div>
    </form>
    <p><a href="/">Abbrechen</a></p>`;
}

module.exports = { handleDeleteAccount };
