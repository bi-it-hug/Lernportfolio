import { ensureCsrfToken } from "../fw/security.js"

export function html(req) {
    const csrfToken = ensureCsrfToken(req)

    return `
<section id="search">
    <h2>Search</h2>
    <form id="form" method="post" action="#">
        <div class="form-group">
            <label for="terms">terms</label>
            <input type="text" class="form-control size-medium" name="terms" id="terms" required>
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Submit" />
        </div>
    </form>
    <div id="messages">
        <div id="msg" class="hidden">The search is running. Results will be visible soon.</div>
        <pre id="result" class="hidden"></pre>
    </div>
    <script>
        $(document).ready(function () {
            $('#form').on('submit', function (event) {
                event.preventDefault();
                const terms = $('#terms').val();
                $('#msg').show();
                $('#result').text('');
                $.ajax({
                    url: '/search',
                    method: 'POST',
                    data: {
                        terms: terms,
                        _csrf: ${JSON.stringify(csrfToken)}
                    },
                    success: function (data) {
                        $('#result').text(data);
                        $('#msg').hide(500);
                        $('#result').show(500);
                    },
                    error: function () {
                        $('#result').text('Search failed.');
                        $('#msg').hide();
                        $('#result').show();
                    }
                });
            });
        });
    </script>
</section>`
}
