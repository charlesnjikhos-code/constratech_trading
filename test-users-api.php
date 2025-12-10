<?php
/**
 * Test file to check if users API is working
 */

// Start session
session_start();

// Simulate logged in user
$_SESSION['admin_id'] = 1;

// Include the auth API
$_GET['action'] = 'get-users';
include 'api/auth.php';
