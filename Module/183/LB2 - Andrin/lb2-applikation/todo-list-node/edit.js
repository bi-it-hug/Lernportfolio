const db = require('./fw/db');
const { escapeHtml } = require('./fw/escape');

async function getHtml(req) {
    let title = '';
    let state = '';
    let taskId = '';
    let html = '';
    const options = ['Open', 'In Progress', 'Done'];

    if (req.query.id !== undefined) {
        taskId = req.query.id;
        const result = await db.executeStatement(
            'SELECT ID, title, state, userID FROM tasks WHERE ID = ?',
            [taskId]
        );

        if (result.length > 0) {
            if (String(result[0].userID) !== String(req.session.userid)) {
                return '<p class="info info-error">Access denied.</p>';
            }
            title = result[0].title;
            state = result[0].state;
        } else {
            return '<p class="info info-error">Task not found.</p>';
        }

        html += '<h1>Edit Task</h1>';
    } else {
        html += '<h1>Create Task</h1>';
    }

    html += `
    <form id="form" method="post" action="savetask">
        <input type="hidden" name="id" value="${escapeHtml(taskId)}" />
        <input type="hidden" name="_csrf" value="${req.session.csrfToken || ''}" />
        <div class="form-group">
            <label for="title">Description</label>
            <input type="text" class="form-control size-medium" name="title" id="title" value="${escapeHtml(title)}" maxlength="255">
        </div>
        <div class="form-group">
            <label for="state">State</label>
            <select name="state" id="state" class="size-auto">`;

    for (let i = 0; i < options.length; i++) {
        const selected = state === options[i].toLowerCase() ? 'selected' : '';
        html += `<option value='${options[i].toLowerCase()}' ${selected}>${escapeHtml(options[i])}</option>`;
    }

    html += `
            </select>
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Submit" />
        </div>
    </form>
    <script>
        $(document).ready(function () {
            $('#form').validate({
                rules: { title: { required: true } },
                messages: { title: 'Please enter a description.' },
                submitHandler: function (form) { form.submit(); }
            });
        });
    </script>`;

    return html;
}

module.exports = { html: getHtml };
