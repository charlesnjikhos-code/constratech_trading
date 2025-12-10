<?php
/**
 * Authentication API
 * Handles login, logout, and session management
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $db = getDB();
    
    switch ($action) {
        case 'login':
            handleLogin($db);
            break;
            
        case 'register':
            handleRegister($db);
            break;
            
        case 'logout':
            handleLogout($db);
            break;
            
        case 'check':
            checkSession();
            break;
            
        case 'change-password':
            handleChangePassword($db);
            break;
            
        case 'get-users':
            getUsers($db);
            break;
            
        default:
            sendResponse(false, null, 'Invalid action');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage());
}

/**
 * Handle login
 */
function handleLogin($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, null, 'Invalid request method');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $username = sanitizeInput($input['username'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        sendResponse(false, null, 'Username and password are required');
    }
    
    // Get user from database
    $stmt = $db->prepare("
        SELECT id, username, password_hash, email, full_name, is_active 
        FROM admin_users 
        WHERE username = ? AND is_active = 1
    ");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, null, 'Invalid credentials');
    }
    
    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        sendResponse(false, null, 'Invalid credentials');
    }
    
    // Create session
    session_start();
    $sessionToken = generateToken();
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['session_token'] = $sessionToken;
    $_SESSION['last_activity'] = time();
    
    // Store session in database
    $expiresAt = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);
    $stmt = $db->prepare("
        INSERT INTO admin_sessions (user_id, session_token, ip_address, user_agent, expires_at) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $user['id'],
        $sessionToken,
        $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        $expiresAt
    ]);
    
    // Update last login
    $stmt = $db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    sendResponse(true, [
        'user_id' => $user['id'],
        'username' => $user['username'],
        'full_name' => $user['full_name'],
        'session_token' => $sessionToken
    ], 'Login successful');
}

/**
 * Handle logout
 */
function handleLogout($db) {
    session_start();
    
    if (isset($_SESSION['session_token'])) {
        // Delete session from database
        $stmt = $db->prepare("DELETE FROM admin_sessions WHERE session_token = ?");
        $stmt->execute([$_SESSION['session_token']]);
    }
    
    // Destroy session
    session_unset();
    session_destroy();
    
    sendResponse(true, null, 'Logged out successfully');
}

/**
 * Handle registration
 */
function handleRegister($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, null, 'Invalid request method');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $fullName = sanitizeInput($input['fullName'] ?? '');
    $email = sanitizeInput($input['email'] ?? '');
    $username = sanitizeInput($input['username'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validation
    if (empty($fullName) || empty($email) || empty($username) || empty($password)) {
        sendResponse(false, null, 'All fields are required');
    }
    
    if (strlen($password) < 8) {
        sendResponse(false, null, 'Password must be at least 8 characters');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, null, 'Invalid email address');
    }
    
    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        sendResponse(false, null, 'Username must be 3-20 characters (letters, numbers, underscore only)');
    }
    
    // Check if username exists
    $stmt = $db->prepare("SELECT id FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        sendResponse(false, null, 'Username already exists');
    }
    
    // Check if email exists
    $stmt = $db->prepare("SELECT id FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(false, null, 'Email already registered');
    }
    
    // Create user
    $passwordHash = password_hash($password, HASH_ALGO, ['cost' => HASH_COST]);
    
    $stmt = $db->prepare("
        INSERT INTO admin_users (username, password_hash, email, full_name, is_active) 
        VALUES (?, ?, ?, ?, 1)
    ");
    
    try {
        $stmt->execute([$username, $passwordHash, $email, $fullName]);
        sendResponse(true, ['user_id' => $db->lastInsertId()], 'Registration successful');
    } catch (Exception $e) {
        sendResponse(false, null, 'Registration failed: ' . $e->getMessage());
    }
}

/**
 * Check session validity
 */
function checkSession() {
    session_start();
    
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_token'])) {
        sendResponse(false, null, 'Not authenticated');
    }
    
    // Check expiration
    if (isset($_SESSION['last_activity'])) {
        $elapsed = time() - $_SESSION['last_activity'];
        if ($elapsed > SESSION_LIFETIME) {
            session_unset();
            session_destroy();
            sendResponse(false, null, 'Session expired');
        }
    }
    
    $_SESSION['last_activity'] = time();
    
    sendResponse(true, [
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username']
    ], 'Session valid');
}

/**
 * Change password
 */
function handleChangePassword($db) {
    $userId = validateSession();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $currentPassword = $input['current_password'] ?? '';
    $newPassword = $input['new_password'] ?? '';
    
    if (empty($currentPassword) || empty($newPassword)) {
        sendResponse(false, null, 'All fields are required');
    }
    
    if (strlen($newPassword) < 8) {
        sendResponse(false, null, 'New password must be at least 8 characters');
    }
    
    // Verify current password
    $stmt = $db->prepare("SELECT password_hash FROM admin_users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!password_verify($currentPassword, $user['password_hash'])) {
        sendResponse(false, null, 'Current password is incorrect');
    }
    
    // Update password
    $newHash = password_hash($newPassword, HASH_ALGO, ['cost' => HASH_COST]);
    $stmt = $db->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$newHash, $userId]);
    
    sendResponse(true, null, 'Password changed successfully');
}

/**
 * Get all users (admin only)
 */
function getUsers($db) {
    session_start();
    
    // Check if user is logged in
    if (!isset($_SESSION['admin_id'])) {
        sendResponse(false, null, 'Not authorized');
    }
    
    try {
        $stmt = $db->prepare("
            SELECT id, username, email, full_name, is_active, created_at, 
                   (SELECT MAX(created_at) FROM admin_sessions WHERE user_id = admin_users.id) as last_login
            FROM admin_users 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Convert is_active to boolean
        foreach ($users as &$user) {
            $user['is_active'] = (bool)$user['is_active'];
        }
        
        sendResponse(true, $users, 'Users retrieved successfully');
        
    } catch (Exception $e) {
        sendResponse(false, null, 'Error retrieving users: ' . $e->getMessage());
    }
}
