function getHtml(req) {
    return `
<section id="search">
    <h2>Search</h2>
    <form id="form" method="post" action="">
        <div class="form-group">
            <label for="terms">Terms</label>
            <input type="text" class="form-control size-medium" name="terms" id="terms">
        </div>
        <div class="form-group">
            <label for="submit"></label>
            <input id="submit" type="submit" class="btn size-auto" value="Search" />
        </div>
    </form>
    <div id="messages">
        <div id="msg" class="hidden">Searching...</div>
        <div id="result" class="hidden"></div>
    </div>
    <script>
        $(document).ready(function () {
            $('#form').validate({
                rules: { terms: { required: true } },
                messages: { terms: 'Please enter search terms.' },
                submitHandler: function (form) {
                    var terms = $("#terms").val();
                    var csrf = $('meta[name="csrf-token"]').attr('content');
                    $("#msg").show();
                    $("#result").html("");
                    $.post("search", { terms: terms, _csrf: csrf }, function(data) {
                        $("#result").html(data);
                        $("#msg").hide(500);
                        $("#result").show(500);
                    });
                    return false;
                }
            });
        });
    </script>
</section>`;
}

module.exports = { html: getHtml };
