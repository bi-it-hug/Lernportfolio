const db = require('./fw/db');

async function handle(req) {
    const taskId = req.query.id;
    const userid = req.session.userid;

    if (!taskId) return;

    await db.executeStatement(
        'DELETE FROM tasks WHERE ID = ? AND userID = ?',
        [taskId, userid]
    );
}

module.exports = { handle };
