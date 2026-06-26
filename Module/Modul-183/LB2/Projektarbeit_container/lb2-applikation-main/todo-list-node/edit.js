import * as db from "./fw/db.js"
import { escapeHtml, csrfField, TASK_STATES } from "./fw/security.js"

export async function html(req) {
    let title = ""
    let state = ""
    let taskId = ""
    let htmlContent = ""

    if (req.query.id !== undefined) {
        const parsedId = parseInt(req.query.id, 10)
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return '<p class="info info-error">Invalid task.</p>'
        }

        const [rows] = await db.query(
            "SELECT ID, title, state FROM tasks WHERE ID = ? AND userID = ?",
            [parsedId, req.session.userId]
        )

        if (rows.length === 0) {
            return '<p class="info info-error">Task not found.</p>'
        }

        title = rows[0].title
        state = rows[0].state
        taskId = String(rows[0].ID)
        htmlContent += "<h1>Edit Task</h1>"
    } else {
        htmlContent += "<h1>Create Task</h1>"
    }

    htmlContent += `
    <form id="task-form" method="post" action="/savetask">
        ${csrfField(req)}
        <input type="hidden" name="id" value="${escapeHtml(taskId)}" />
        <div class="form-group">
            <label for="title">Description</label>
            <input type="text" class="form-control size-medium" name="title" id="title" value="${escapeHtml(title)}" required>
        </div>
        <div class="form-group">
            <label for="state">State</label>
            <select name="state" id="state" class="size-auto" required>`

    for (const option of TASK_STATES) {
        const selected = state === option ? "selected" : ""
        htmlContent += `<option value="${escapeHtml(option)}" ${selected}>${escapeHtml(option)}</option>`
    }

    htmlContent += `
            </select>
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Submit" />
        </div>
    </form>`

    return htmlContent
}
