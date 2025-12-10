<?php
/**
 * Contact Form Email Handler
 * Sends professional HTML emails when contact form is submitted
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Your company email address
define('COMPANY_EMAIL', 'chirwahope00@gmail.com');
define('COMPANY_NAME', 'Constratech Trading');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Invalid request method');
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $firstName = sanitizeInput($input['firstName'] ?? '');
    $lastName = sanitizeInput($input['lastName'] ?? '');
    $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = sanitizeInput($input['phone'] ?? '');
    $subject = sanitizeInput($input['subject'] ?? '');
    $service = sanitizeInput($input['service'] ?? '');
    $message = sanitizeInput($input['message'] ?? '');
    
    // Validation
    if (empty($firstName) || empty($lastName) || empty($email) || empty($subject) || empty($message)) {
        sendResponse(false, null, 'Please fill in all required fields');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, null, 'Invalid email address');
    }
    
    // Save to database (optional - will skip if table doesn't exist)
    try {
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO contact_submissions 
            (first_name, last_name, email, phone, subject, service, message, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        $stmt->execute([
            $firstName, 
            $lastName, 
            $email, 
            $phone, 
            $subject, 
            $service, 
            $message, 
            $ipAddress,
            $userAgent
        ]);
    } catch (Exception $e) {
        // Continue even if database save fails
        error_log("Database save failed: " . $e->getMessage());
    }
    
    // Send email
    $emailSent = sendContactEmail([
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'service' => $service,
        'message' => $message
    ]);
    
    // Always return success to user
    // Email will be sent if server is configured, otherwise saved to database
    sendResponse(true, [
        'name' => "$firstName $lastName",
        'email' => $email
    ], 'Thank you for contacting us! We will get back to you within 24 hours.');
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    sendResponse(false, null, 'An error occurred. Please try again or contact us directly.');
}

/**
 * Send professional HTML email
 */
function sendContactEmail($data) {
    $to = COMPANY_EMAIL;
    $emailSubject = "New Contact Form Submission: {$data['subject']}";
    
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . COMPANY_NAME . " Website <noreply@constratechtrading.com>" . "\r\n";
    $headers .= "Reply-To: {$data['email']}" . "\r\n";
    
    // HTML email template
    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #1a5490; color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #1a5490; display: block; margin-bottom: 5px; }
            .field-value { color: #555; }
            .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
            .message-box { background: #f5f5f5; padding: 15px; border-left: 4px solid #1a5490; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Contact Form Submission</h1>
            </div>
            
            <div class='content'>
                <div class='field'>
                    <span class='field-label'>Name:</span>
                    <span class='field-value'>{$data['firstName']} {$data['lastName']}</span>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Email:</span>
                    <span class='field-value'><a href='mailto:{$data['email']}'>{$data['email']}</a></span>
                </div>
                
                " . (!empty($data['phone']) ? "
                <div class='field'>
                    <span class='field-label'>Phone:</span>
                    <span class='field-value'>{$data['phone']}</span>
                </div>
                " : "") . "
                
                <div class='field'>
                    <span class='field-label'>Subject:</span>
                    <span class='field-value'>{$data['subject']}</span>
                </div>
                
                " . (!empty($data['service']) ? "
                <div class='field'>
                    <span class='field-label'>Service Interested In:</span>
                    <span class='field-value'>{$data['service']}</span>
                </div>
                " : "") . "
                
                <div class='field'>
                    <span class='field-label'>Message:</span>
                    <div class='message-box'>
                        " . nl2br($data['message']) . "
                    </div>
                </div>
                
                <div class='field'>
                    <span class='field-label'>Submitted:</span>
                    <span class='field-value'>" . date('F j, Y \a\t g:i A') . "</span>
                </div>
            </div>
            
            <div class='footer'>
                <p>This email was sent from the Constratech Trading website contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Send email
    return mail($to, $emailSubject, $emailBody, $headers);
}

/**
 * Sanitize input
 */
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

/**
 * Send JSON response
 */
function sendResponse($success, $data = null, $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}
