const db = require('./fw/db');
const { escapeHtml } = require('./fw/escape');

async function getHtml(req) {
    const username = req.session.username;

    const rows = await db.executeStatement(
        `SELECT ip_address, success, attempt_time
         FROM login_attempts
         WHERE identifier = ?
         ORDER BY attempt_time DESC
         LIMIT 50`,
        [username]
    );

    let html = `<h2>Login-History</h2>
    <table>
        <tr>
            <th>Datum / Zeit</th>
            <th>IP-Adresse</th>
            <th>Status</th>
        </tr>`;

    if (rows.length === 0) {
        html += `<tr><td colspan="3">Keine Einträge vorhanden.</td></tr>`;
    } else {
        rows.forEach(row => {
            const status = row.success
                ? `<span style="color:green">Erfolgreich</span>`
                : `<span style="color:red">Fehlgeschlagen</span>`;
            html += `<tr>
                <td>${escapeHtml(new Date(row.attempt_time).toLocaleString('de-CH'))}</td>
                <td>${escapeHtml(row.ip_address)}</td>
                <td>${status}</td>
            </tr>`;
        });
    }

    html += '</table>';
    return html;
}

module.exports = { getHtml };
