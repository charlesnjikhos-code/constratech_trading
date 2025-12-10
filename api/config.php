<?php
/**
 * Database Configuration
 * Constratech Trading CMS
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'constratech_cms');
define('DB_USER', 'root'); // Change this to your MySQL username
define('DB_PASS', ''); // Change this to your MySQL password
define('DB_CHARSET', 'utf8mb4');

// Session configuration
define('SESSION_LIFETIME', 28800); // 8 hours in seconds
define('SESSION_NAME', 'CONSTRATECH_CMS_SESSION');

// Security
define('HASH_ALGO', PASSWORD_BCRYPT);
define('HASH_COST', 10);

// Timezone
date_default_timezone_set('Africa/Blantyre');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

/**
 * Database Connection Class
 */
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]));
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Prevent cloning
    private function __clone() {}
    
    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * Get database connection
 */
function getDB() {
    return Database::getInstance()->getConnection();
}

/**
 * Send JSON response
 */
function sendResponse($success, $data = null, $message = '') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}

/**
 * Validate session
 */
function validateSession() {
    session_start();
    
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_token'])) {
        sendResponse(false, null, 'Unauthorized access');
    }
    
    // Check session expiration
    if (isset($_SESSION['last_activity'])) {
        $elapsed = time() - $_SESSION['last_activity'];
        if ($elapsed > SESSION_LIFETIME) {
            session_unset();
            session_destroy();
            sendResponse(false, null, 'Session expired');
        }
    }
    
    $_SESSION['last_activity'] = time();
    return $_SESSION['user_id'];
}

/**
 * Sanitize input
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

/**
 * Generate random token
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Log activity (optional)
 */
function logActivity($user_id, $action, $details = '') {
    try {
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO activity_log (user_id, action, details, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $user_id,
            $action,
            $details,
            $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ]);
    } catch (Exception $e) {
        // Silent fail for logging
    }
}
