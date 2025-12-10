<?php
/**
 * Check database users
 */
require_once 'api/config.php';

try {
    $db = getDB();
    
    $stmt = $db->query("SELECT id, username, email, full_name, is_active, created_at FROM admin_users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>Users in Database:</h2>";
    echo "<pre>";
    print_r($users);
    echo "</pre>";
    
    echo "<h3>Total users: " . count($users) . "</h3>";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
