<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing contact-v3.php loading...<br><br>";

try {
    // Test 1: Load PHPMailer
    echo "1. Loading PHPMailer...<br>";
    require_once __DIR__ . '/PHPMailer/src/Exception.php';
    require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/PHPMailer/src/SMTP.php';
    echo "✅ PHPMailer loaded<br><br>";
    
    // Test 2: Use namespace
    echo "2. Testing namespace...<br>";
    use PHPMailer\PHPMailer\PHPMailer;
    $mail = new PHPMailer(true);
    echo "✅ PHPMailer instantiated<br><br>";
    
    // Test 3: Load config
    echo "3. Loading config...<br>";
    require_once 'api/config.php';
    echo "✅ Config loaded<br><br>";
    
    // Test 4: Test database
    echo "4. Testing database...<br>";
    $db = getDB();
    echo "✅ Database connected<br><br>";
    
    echo "<h2>All tests passed! ✅</h2>";
    
} catch (Exception $e) {
    echo "<p style='color:red;'>❌ Error: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
