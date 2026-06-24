const db = require('../../fw/db');
const { escapeHtml } = require('../../fw/escape');

async function search(req) {
    const userid = req.session && req.session.userid ? req.session.userid : null;
    const terms = req.query.terms;

    if (!userid || !terms) {
        return 'Not enough information to search';
    }

    const stmt = await db.executeStatement(
        'SELECT ID, title, state FROM tasks WHERE userID = ? AND title LIKE ?',
        [userid, '%' + terms + '%']
    );

    if (stmt.length === 0) return 'No results found';

    return stmt.map(row => `${escapeHtml(row.title)} (${escapeHtml(row.state)})<br />`).join('');
}

module.exports = { search };
