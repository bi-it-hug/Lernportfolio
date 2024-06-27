<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: text/html; charset=utf-8');
require "vendor/autoload.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (isset($_POST['mail_data'])) {
        $mail_data = json_decode($_POST['mail_data'], true);

        $from = filter_var($mail_data["from"], FILTER_SANITIZE_EMAIL);
        $to = filter_var($mail_data["to"], FILTER_SANITIZE_EMAIL);
        $subject = filter_var($mail_data["subject"], FILTER_SANITIZE_SPECIAL_CHARS);
        $message = nl2br(htmlspecialchars($mail_data["message"], ENT_QUOTES, 'UTF-8'));

        $mail = new PHPMailer(true);

        try {

            $mail -> isSMTP();
            $mail -> Host = "smtp.office365.com";
            $mail -> SMTPAuth = true;
            $mail -> Username = $from;
            $mail -> Password = 'HuLo981';
            $mail -> SMTPSecure = "tls";
            $mail -> Port = 587;

            $mail -> setFrom($from, "Lorenzo Hug");
            $mail -> addAddress($to);

            if (isset($_FILES["attachment"]) && $_FILES["attachment"]["error"] == UPLOAD_ERR_OK) {
                $mail -> addAttachment($_FILES["attachment"]["tmp_name"], $_FILES["attachment"]["name"]);
            }

            $mail -> isHTML(true);
            $mail -> CharSet = 'UTF-8';
            $mail -> Subject = $subject;
            $mail -> Body = $message;

            $mail -> send();
            echo json_encode(["status" => "success", "message" => "E-Mail wurde erfolgreich gesendet."]);

        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Fehler beim Senden der E-Mail. Mailer Error: {$mail -> ErrorInfo}"]);
            error_log("Mailer Error: {$mail -> ErrorInfo}");
        }

    } else {
        echo json_encode(["status" => "error", "message" => "Ungültige Anfrage. Fehlende E-Mail-Daten."]);
        error_log("Invalid request: Missing email data.");
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfrage."]);
    error_log("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
}

?>
