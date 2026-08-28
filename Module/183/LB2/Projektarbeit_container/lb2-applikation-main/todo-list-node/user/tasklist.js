import * as db from "../fw/db.js"
import { escapeHtml, csrfField } from "../fw/security.js"

export async function html(req) {
    const [rows] = await db.query(
        "SELECT ID, title, state FROM tasks WHERE userID = ? ORDER BY ID",
        [req.session.userId]
    )

    let htmlContent = `
    <section id="list">
        <a href="/edit">Create Task</a>
        <table>
            <tr>
                <th>ID</th>
                <th>Description</th>
                <th>State</th>
                <th></th>
            </tr>`

    rows.forEach((row) => {
        htmlContent += `
            <tr>
                <td>${escapeHtml(row.ID)}</td>
                <td class="wide">${escapeHtml(row.title)}</td>
                <td>${escapeHtml(ucfirst(row.state))}</td>
                <td>
                    <a href="/edit?id=${encodeURIComponent(row.ID)}">edit</a> |
                    <form method="post" action="/delete" style="display:inline">
                        ${csrfField(req)}
                        <input type="hidden" name="id" value="${escapeHtml(row.ID)}" />
                        <button type="submit" class="link-button">delete</button>
                    </form>
                </td>
            </tr>`
    })

    htmlContent += `
        </table>
    </section>`

    return htmlContent
}

function ucfirst(string) {
    if (!string) {
        return ""
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}
