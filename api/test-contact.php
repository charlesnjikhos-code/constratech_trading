<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing contact-v2.php setup...<br><br>";

// Test 1: Check PHPMailer files
echo "1. Checking PHPMailer files...<br>";
$files = [
    '../PHPMailer/src/Exception.php',
    '../PHPMailer/src/PHPMailer.php',
    '../PHPMailer/src/SMTP.php'
];

foreach ($files as $file) {
    if (file_exists($file)) {
        echo "✅ Found: $file<br>";
    } else {
        echo "❌ Missing: $file<br>";
    }
}

echo "<br>2. Testing PHPMailer load...<br>";
try {
    require_once '../PHPMailer/src/Exception.php';
    require_once '../PHPMailer/src/PHPMailer.php';
    require_once '../PHPMailer/src/SMTP.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    
    $mail = new PHPMailer(true);
    echo "✅ PHPMailer loaded successfully<br>";
    
} catch (Exception $e) {
    echo "❌ Error loading PHPMailer: " . $e->getMessage() . "<br>";
}

echo "<br>3. Testing config...<br>";
if (file_exists('config.php')) {
    require_once 'config.php';
    echo "✅ Config loaded<br>";
} else {
    echo "❌ Config not found<br>";
}

echo "<br>Done!";
?>
