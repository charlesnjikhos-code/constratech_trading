<?php
// Direct test of contact-v3.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Testing contact-v3.php API</h2>";

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';

// Create test data
$testData = json_encode([
    'firstName' => 'John',
    'lastName' => 'Doe',
    'email' => 'john@example.com',
    'phone' => '1234567890',
    'subject' => 'Test Message',
    'service' => 'General Contracting',
    'message' => 'This is a test message from the contact form.'
]);

// Mock the input
$_SERVER['CONTENT_LENGTH'] = strlen($testData);
file_put_contents('php://input', $testData);

echo "<h3>Request Data:</h3>";
echo "<pre>" . htmlspecialchars($testData) . "</pre>";

echo "<h3>API Response:</h3>";
echo "<pre>";

// Include and execute the API
ob_start();
include 'api/contact-v3.php';
$response = ob_get_clean();

echo htmlspecialchars($response);
echo "</pre>";

echo "<h3>Is Valid JSON?</h3>";
$json = json_decode($response);
if ($json === null) {
    echo "❌ NOT VALID JSON<br>";
    echo "JSON Error: " . json_last_error_msg();
} else {
    echo "✅ Valid JSON<br>";
    echo "<pre>" . print_r($json, true) . "</pre>";
}
?>
