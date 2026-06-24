const db = require('./fw/db');

async function getHtml(req) {
    const userid = req.session.userid;
    let taskId = '';

    if (req.body.id !== undefined && req.body.id.length !== 0) {
        taskId = req.body.id;
        const existing = await db.executeStatement(
            'SELECT ID, userID FROM tasks WHERE ID = ?',
            [taskId]
        );
        if (existing.length === 0) {
            taskId = '';
        } else if (String(existing[0].userID) !== String(userid)) {
            return "<span class='info info-error'>Access denied.</span>";
        }
    }

    if (req.body.title !== undefined && req.body.state !== undefined) {
        const title = String(req.body.title).slice(0, 255);
        const validStates = ['open', 'in progress', 'done'];
        const state = validStates.includes(req.body.state) ? req.body.state : 'open';

        if (taskId === '') {
            await db.executeStatement(
                'INSERT INTO tasks (title, state, userID) VALUES (?, ?, ?)',
                [title, state, userid]
            );
        } else {
            await db.executeStatement(
                'UPDATE tasks SET title = ?, state = ? WHERE ID = ? AND userID = ?',
                [title, state, taskId, userid]
            );
        }

        return "<span class='info info-success'>Update successful</span>";
    }

    return "<span class='info info-error'>No update was made</span>";
}

module.exports = { html: getHtml };
