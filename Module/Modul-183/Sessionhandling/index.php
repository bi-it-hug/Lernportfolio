<?php
session_start();

if (isset($_POST['logout'])) {
    session_destroy();
    header("location:./index.php");
    exit();
}

if (isset($_POST['login'])) {
    $_SESSION['username'] = $_POST['username'];
    $_SESSION['role'] = 'user';

    if ($_SESSION['username'] == 'admin') {
        $_SESSION['role'] = 'admin';
    }
}

if (isset($_POST['speichern'])) {
    $_SESSION['secret_message'] = $_POST['message'];
}

?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Webseite</title>
    <link rel="stylesheet" href="styles.css">
    <script defer src="scripts.js"></script>
</head>

<body>
    <header>
        <h1>Willkommen auf meiner Webseite</h1>
    </header>

    <main>
        <section>
            <pre><?php var_dump($_SESSION); ?></pre>
        </section>

        <?php if (!isset($_SESSION['username'])) { ?>
            <section>
                <h2>Login</h2>
                <form action="./index.php" method="post">
                    <p>Benutzername: <input type="text" name="username" /></p>
                    <p>Passwort: <input type="password" name="password" /></p>
                    <p><input type="submit" name="login" value="login" /></p>
                </form>
                <p><b>Hinweis:</b> Dieses Login-Formular ist ein "Fake". Oben bei den Session-Daten sehen Sie, was in der
                    Session gespeichert wird, wenn Sie das Login-Formular verwenden. Verwenden Sie für das Login einen
                    beliebigen Benutzernamen und ein beliebiges Passwort. Beobachten Sie was mit den Session-Daten
                    geschieht. Wenn Sie den Benutzernamen admin verwenden (mit beliebigem Passwort), dann erhalten Sie
                    zusätzliche Rechte.</p>
            </section>
        <?php } else { ?>
            <section>
                <h2>Geheime Daten</h2>
                <form action="./index.php" method="post">
                    <p>Geheimer Inhalt in Session: <input type="text" name="message" /></p>
                    <p><input type="submit" name="speichern" value="speichern" /></p>
                </form>
                <p><b>Hinweis:</b> Sie können hier geheime Inhalte in der Session speichern. Ihr Kollege / Ihre Kollegin
                    kann anschliessens schauen, ob er diese auch in seinem Browser angezeigt kriegt, wenn Sie Ihm / Ihr die
                    Session-ID bekannt geben.</p>
            </section>
            <section>
                <h2>Logout</h2>
                <form action="./index.php" method="post">
                    <p><input type="submit" name="logout" value="logout" /></p>
                </form>
            </section>
        <?php } ?>
    </main>

    <footer>
    </footer>
</body>

</html>