<?php
// Test email sending
error_reporting(E_ALL);
ini_set('display_errors', 1);

$to = "chirwahope00@gmail.com";
$subject = "Test Email from Constratech";
$message = "This is a test email.";
$headers = "From: noreply@constratechtrading.com";

echo "Attempting to send email...<br>";
echo "To: $to<br>";
echo "Subject: $subject<br><br>";

if (mail($to, $subject, $message, $headers)) {
    echo "✅ Email sent successfully!";
} else {
    echo "❌ Email failed to send.<br>";
    echo "Error: " . error_get_last()['message'] ?? 'Unknown error';
}

echo "<br><br>";
echo "PHP mail configuration:<br>";
echo "sendmail_path: " . ini_get('sendmail_path') . "<br>";
echo "SMTP: " . ini_get('SMTP') . "<br>";
echo "smtp_port: " . ini_get('smtp_port') . "<br>";
?>
