<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

<<<<<<< HEAD
header('Content-Type: text/html; charset=utf-8');

require "vendor/autoload.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $from = filter_var($_POST["from"], FILTER_SANITIZE_EMAIL);
    $to = filter_var($_POST["to"], FILTER_SANITIZE_EMAIL);
    $subject = filter_var($_POST["subject"], FILTER_SANITIZE_SPECIAL_CHARS);
    $message = filter_var($_POST["message"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
=======
require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $to = filter_var($_POST['to'], FILTER_SANITIZE_EMAIL);
    $subject = filter_var($_POST['subject'], FILTER_SANITIZE_SPECIAL_CHARS);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_SPECIAL_CHARS);
    $from = filter_var($_POST['from'], FILTER_SANITIZE_EMAIL);
>>>>>>> 8f8eb5f6ac6121709afd2214ee0e936bbc56f355

    $mail = new PHPMailer(true);

    try {
<<<<<<< HEAD
        
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
        $mail -> Subject = $subject;
        $mail -> Body    = nl2br($message);
        $mail -> send();

        echo json_encode(["status" => "success", "message" => "E-Mail wurde erfolgreich gesendet."]);

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Fehler beim Senden der E-Mail. Mailer Error: {$mail -> ErrorInfo}"]);
=======

        // Server settings
        $mail -> isSMTP();
        $mail -> Host = 'smtp.office365.com';
        $mail -> SMTPAuth = true;
        $mail -> Username = 'sibby.hug@outlook.com';
        $mail -> Password = 'neqVaz-3tazdu-hudfob';
        $mail -> SMTPSecure = 'tls';
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
>>>>>>> 8f8eb5f6ac6121709afd2214ee0e936bbc56f355
        error_log("Mailer Error: {$mail -> ErrorInfo}");
    }

} else {
<<<<<<< HEAD
    echo json_encode(["status" => "error", "message" => "Ungültige Anfrage."]);
    error_log("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
}
=======
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Anfrage.']);
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
}

>>>>>>> 8f8eb5f6ac6121709afd2214ee0e936bbc56f355
?>
