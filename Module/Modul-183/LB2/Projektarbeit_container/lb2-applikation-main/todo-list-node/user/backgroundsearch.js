import { ensureCsrfToken, csrfField } from "../fw/security.js"

export function html(req) {
    ensureCsrfToken(req)

    return `
<section id="search">
    <h2>Search</h2>
    <form id="search-form" method="post" action="/search">
        ${csrfField(req)}
        <div class="form-group">
            <label for="terms">terms</label>
            <input type="text" class="form-control size-medium" name="terms" id="terms" required>
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="search-submit" type="submit" class="btn size-auto" value="Submit" />
        </div>
    </form>
    <div id="messages">
        <div id="msg" class="hidden">The search is running. Results will be visible soon.</div>
        <pre id="result" class="hidden"></pre>
    </div>
    <script src="/search.js"></script>
</section>`
}
