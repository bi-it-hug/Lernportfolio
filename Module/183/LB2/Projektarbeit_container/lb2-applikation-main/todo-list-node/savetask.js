import * as db from "./fw/db.js"
import { isValidTaskState } from "./fw/security.js"

export async function handle(req) {
    const title =
        typeof req.body.title === "string" ? req.body.title.trim() : ""
    const state =
        typeof req.body.state === "string" ? req.body.state.trim() : ""

    if (!title || !isValidTaskState(state)) {
        return
    }

    const userId = req.session.userId
    const rawId = req.body.id
    const hasId = rawId !== undefined && String(rawId).length > 0

    if (!hasId) {
        await db.query(
            "INSERT INTO tasks (title, state, userID) VALUES (?, ?, ?)",
            [title, state, userId]
        )
        return
    }

    const taskId = parseInt(rawId, 10)
    if (!Number.isInteger(taskId) || taskId <= 0) {
        return
    }

    await db.query(
        "UPDATE tasks SET title = ?, state = ? WHERE ID = ? AND userID = ?",
        [title, state, taskId, userId]
    )
}
