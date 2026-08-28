const db = require('./fw/db');
const bcrypt = require('bcryptjs');
const { escapeHtml } = require('./fw/escape');

async function handleChangePassword(req) {
    let msg = '';

    if (req.method === 'POST') {
        const currentPassword = req.body.current_password || '';
        const newPassword = req.body.new_password || '';
        const newPasswordConfirm = req.body.new_password_confirm || '';

        if (!currentPassword || !newPassword || !newPasswordConfirm) {
            msg = `<p class="info info-error">Alle Felder sind erforderlich.</p>`;
        } else if (newPassword.length < 8) {
            msg = `<p class="info info-error">Neues Passwort muss mindestens 8 Zeichen lang sein.</p>`;
        } else if (newPassword !== newPasswordConfirm) {
            msg = `<p class="info info-error">Neue Passwörter stimmen nicht überein.</p>`;
        } else {
            const rows = await db.executeStatement(
                'SELECT password FROM users WHERE ID = ?', [req.session.userid]
            );
            const match = rows.length > 0 && await bcrypt.compare(currentPassword, rows[0].password);

            if (!match) {
                msg = `<p class="info info-error">Aktuelles Passwort ist falsch.</p>`;
            } else {
                const hash = await bcrypt.hash(newPassword, 12);
                await db.executeStatement(
                    'UPDATE users SET password = ? WHERE ID = ?', [hash, req.session.userid]
                );
                msg = `<p class="info info-success">Passwort erfolgreich geändert.</p>`;
            }
        }
    }

    return msg + getHtml(req);
}

function getHtml(req) {
    const csrf = req.session.csrfToken || '';
    return `
    <h2>Passwort ändern</h2>
    <form id="form" method="post" action="/change-password">
        <input type="hidden" name="_csrf" value="${csrf}">
        <div class="form-group">
            <label for="current_password">Aktuelles Passwort</label>
            <input type="password" class="form-control size-medium" name="current_password" id="current_password">
        </div>
        <div class="form-group">
            <label for="new_password">Neues Passwort (min. 8 Zeichen)</label>
            <input type="password" class="form-control size-medium" name="new_password" id="new_password">
        </div>
        <div class="form-group">
            <label for="new_password_confirm">Neues Passwort bestätigen</label>
            <input type="password" class="form-control size-medium" name="new_password_confirm" id="new_password_confirm">
        </div>
        <div class="form-group">
            <label></label>
            <input type="submit" class="btn size-auto" value="Passwort ändern" />
        </div>
    </form>`;
}

module.exports = { handleChangePassword };
