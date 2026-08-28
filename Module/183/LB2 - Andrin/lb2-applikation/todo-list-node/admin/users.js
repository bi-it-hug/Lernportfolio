const db = require('../fw/db');
const { escapeHtml } = require('../fw/escape');

async function getHtml(req) {
    const result = await db.executeStatement(
        `SELECT u.ID, u.username, r.title as role
         FROM users u
         INNER JOIN permissions p ON u.ID = p.userID
         INNER JOIN roles r ON p.roleID = r.ID
         ORDER BY u.username`
    );

    let html = `
    <h2>User List</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
        </tr>`;

    result.forEach(record => {
        html += `<tr>
            <td>${escapeHtml(record.ID)}</td>
            <td>${escapeHtml(record.username)}</td>
            <td>${escapeHtml(record.role)}</td>
        </tr>`;
    });

    html += '</table>';
    return html;
}

module.exports = { html: getHtml };
