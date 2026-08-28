import { html as tasklistHtml } from "./user/tasklist.js"
import { html as bgSearchHtml } from "./user/backgroundsearch.js"
import { escapeHtml } from "./fw/security.js"

export async function html(req) {
    const taskList = await tasklistHtml(req)
    const username = escapeHtml(req.session.username)
    return (
        `<h2>Welcome, ${username}!</h2>` +
        taskList +
        "<hr />" +
        bgSearchHtml(req)
    )
}
