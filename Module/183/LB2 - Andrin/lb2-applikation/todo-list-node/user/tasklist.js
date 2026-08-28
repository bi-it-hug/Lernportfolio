const db = require('../fw/db');
const { escapeHtml } = require('../fw/escape');

async function getHtml(req) {
    let html = `
    <section id="list">
        <a href="edit">Create Task</a>
        <table>
            <tr>
                <th>ID</th>
                <th>Description</th>
                <th>State</th>
                <th></th>
            </tr>
    `;

    const userid = req.session.userid;
    const result = await db.executeStatement(
        'SELECT ID, title, state FROM tasks WHERE UserID = ?',
        [userid]
    );

    result.forEach(function(row) {
        html += `
            <tr>
                <td>${escapeHtml(row.ID)}</td>
                <td class="wide">${escapeHtml(row.title)}</td>
                <td>${escapeHtml(ucfirst(row.state))}</td>
                <td>
                    <a href="edit?id=${escapeHtml(row.ID)}">edit</a> | <a href="delete?id=${escapeHtml(row.ID)}">delete</a>
                </td>
            </tr>`;
    });

    html += `
        </table>
    </section>`;

    return html;
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { html: getHtml };
