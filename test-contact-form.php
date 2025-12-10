<?php
// Simple test of contact-v2.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Testing Contact API</h2>";

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';

$testData = [
    'firstName' => 'Test',
    'lastName' => 'User',
    'email' => 'test@example.com',
    'phone' => '1234567890',
    'subject' => 'Test Subject',
    'service' => 'General Contracting',
    'message' => 'This is a test message'
];

// Simulate JSON input
$GLOBALS['HTTP_RAW_POST_DATA'] = json_encode($testData);

echo "<pre>";
include 'api/contact-v2.php';
echo "</pre>";
?>
