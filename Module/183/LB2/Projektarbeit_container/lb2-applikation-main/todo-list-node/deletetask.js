import * as db from "./fw/db.js"

export async function handle(req) {
    const taskId = parseInt(req.body.id, 10)
    if (!Number.isInteger(taskId) || taskId <= 0) {
        return
    }

    await db.query("DELETE FROM tasks WHERE ID = ? AND userID = ?", [
        taskId,
        req.session.userId,
    ])
}
