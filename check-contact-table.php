<?php
require_once 'api/config.php';

try {
    $db = getDB();
    
    echo "<h2>Checking Database Tables</h2>";
    
    // Check if contact_submissions table exists
    $stmt = $db->query("SHOW TABLES LIKE 'contact_submissions'");
    $exists = $stmt->fetch();
    
    if ($exists) {
        echo "✅ contact_submissions table EXISTS<br><br>";
        
        // Show table structure
        echo "<h3>Table Structure:</h3>";
        $stmt = $db->query("DESCRIBE contact_submissions");
        echo "<table border='1' cellpadding='5'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td>{$row['Field']}</td>";
            echo "<td>{$row['Type']}</td>";
            echo "<td>{$row['Null']}</td>";
            echo "<td>{$row['Key']}</td>";
            echo "<td>{$row['Default']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Count records
        $stmt = $db->query("SELECT COUNT(*) as count FROM contact_submissions");
        $count = $stmt->fetch();
        echo "<br><p>Total submissions: {$count['count']}</p>";
        
    } else {
        echo "❌ contact_submissions table DOES NOT EXIST<br><br>";
        echo "<p>Creating table now...</p>";
        
        // Create the table
        $sql = "CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            subject VARCHAR(255) NOT NULL,
            service VARCHAR(100),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45),
            user_agent TEXT
        )";
        
        $db->exec($sql);
        echo "<p>✅ Table created successfully!</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
