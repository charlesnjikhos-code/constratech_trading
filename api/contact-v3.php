<?php
/**
 * Contact Form Email Handler - Clean Version
 */

// Load PHPMailer first (before try-catch)
require_once __DIR__ . '/../PHPMailer/src/Exception.php';
require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

require_once 'config.php';

// Catch all output and errors
ob_start();
error_reporting(0);
ini_set('display_errors', 0);

try {
    
    // Clear any output buffer
    ob_clean();
    
    // Set headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Email configuration
    define('SMTP_HOST', 'smtp.gmail.com');
    define('SMTP_PORT', 587);
    define('SMTP_USERNAME', 'chirwahope00@gmail.com');
    define('SMTP_PASSWORD', 'yclo ldqx ulsk atwv');
    define('RECIPIENT_EMAIL', 'chirwahope00@gmail.com');
    define('COMPANY_NAME', 'Constratech Trading');
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'data' => null,
            'message' => 'Invalid request method'
        ]);
        exit;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON data received');
    }
    
    // Validate and sanitize
    $firstName = htmlspecialchars(strip_tags(trim($input['firstName'] ?? '')));
    $lastName = htmlspecialchars(strip_tags(trim($input['lastName'] ?? '')));
    $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(strip_tags(trim($input['phone'] ?? '')));
    $subject = htmlspecialchars(strip_tags(trim($input['subject'] ?? '')));
    $service = htmlspecialchars(strip_tags(trim($input['service'] ?? '')));
    $message = htmlspecialchars(strip_tags(trim($input['message'] ?? '')));
    
    if (empty($firstName) || empty($lastName) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode([
            'success' => false,
            'data' => null,
            'message' => 'Please fill in all required fields'
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'data' => null,
            'message' => 'Invalid email address'
        ]);
        exit;
    }
    
    // Try to save to database (optional)
    try {
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO contact_submissions 
            (first_name, last_name, email, phone, subject, service, message, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $firstName, 
            $lastName, 
            $email, 
            $phone, 
            $subject, 
            $service, 
            $message, 
            $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ]);
    } catch (Exception $e) {
        // Continue even if database fails
    }
    
    // Send email
    $emailSent = false;
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        
        // Recipients
        $mail->setFrom(SMTP_USERNAME, COMPANY_NAME);
        $mail->addAddress(RECIPIENT_EMAIL);
        $mail->addReplyTo($email, "$firstName $lastName");
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact: $subject";
        $mail->Body = getEmailTemplate($firstName, $lastName, $email, $phone, $subject, $service, $message);
        
        $mail->send();
        $emailSent = true;
    } catch (Exception $e) {
        // Email failed but we'll still return success
    }
    
    echo json_encode([
        'success' => true,
        'data' => ['name' => "$firstName $lastName", 'email' => $email],
        'message' => 'Thank you for contacting us! We will get back to you within 24 hours.'
    ]);
    
} catch (Exception $e) {
    ob_clean();
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => null,
        'message' => 'An error occurred. Please try again.'
    ]);
}

function getEmailTemplate($firstName, $lastName, $email, $phone, $subject, $service, $message) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #1a5490; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 5px 5px; }
            .field { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 3px; }
            .field-label { font-weight: bold; color: #1a5490; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; }
            .field-value { color: #333; font-size: 14px; }
            .message-box { background: #e8f4fd; padding: 20px; border-left: 4px solid #1a5490; margin-top: 15px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1 style='margin:0; font-size: 24px;'>New Contact Form Submission</h1>
                <p style='margin: 5px 0 0 0; opacity: 0.9;'>Constratech Trading Website</p>
            </div>
            
            <div class='content'>
                <div class='field'>
                    <span class='field-label'>Name</span>
                    <span class='field-value'>$firstName $lastName</span>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Email</span>
                    <span class='field-value'><a href='mailto:$email'>$email</a></span>
                </div>
                
                " . ($phone ? "
                <div class='field'>
                    <span class='field-label'>Phone</span>
                    <span class='field-value'><a href='tel:$phone'>$phone</a></span>
                </div>
                " : "") . "
                
                <div class='field'>
                    <span class='field-label'>Subject</span>
                    <span class='field-value'>$subject</span>
                </div>
                
                " . ($service ? "
                <div class='field'>
                    <span class='field-label'>Service Interested In</span>
                    <span class='field-value'>$service</span>
                </div>
                " : "") . "
                
                <div class='message-box'>
                    <span class='field-label'>Message</span>
                    <p class='field-value' style='margin: 10px 0 0 0; white-space: pre-wrap;'>$message</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
}
?>
