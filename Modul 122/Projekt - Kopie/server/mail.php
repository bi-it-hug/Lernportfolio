<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $to = filter_var($_POST['to'], FILTER_SANITIZE_EMAIL);
    $subject = filter_var($_POST['subject'], FILTER_SANITIZE_SPECIAL_CHARS);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_SPECIAL_CHARS);
    $from = filter_var($_POST['from'], FILTER_SANITIZE_EMAIL);

    $mail = new PHPMailer(true);

    try {

        // Server settings
        $mail -> SMTPDebug = SMTP::DEBUG_SERVER;
        $mail -> isSMTP();
        $mail -> Host = 'smtp.gmail.com';
        $mail -> SMTPAuth = true;
        $mail -> Username = 'lorenzo.noa.hug@gmail.com';
        $mail -> Password = 'PizzaGottHD12';
        $mail -> SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail -> Port = 587;

        // Recipients
        $mail -> setFrom($from, 'Lorenzo Hug');
        $mail -> addAddress($to);


        // Attachments
        if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] == UPLOAD_ERR_OK) {
            $mail -> addAttachment($_FILES['attachment']['tmp_name'], $_FILES['attachment']['name']);

        } else {
            echo json_encode(['status' => 'error', 'message' => 'Fehler beim Hochladen der Datei.']);
            exit;
        }

        // Content
        $mail -> isHTML(true);
        $mail -> Subject = $subject;
        $mail -> Body    = $message;

        $mail -> send();
        echo json_encode(['status' => 'success', 'message' => 'E-Mail wurde erfolgreich gesendet.']);

    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Fehler beim Senden der E-Mail. Mailer Error: {$mail -> ErrorInfo}"]);
        error_log("Mailer Error: {$mail -> ErrorInfo}");
    }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Anfrage.']);
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
}

?>
