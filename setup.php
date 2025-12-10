<?php
/**
 * Database Setup Script
 * Run this file once to set up the database
 */

// Database configuration
$host = 'localhost';
$user = 'root'; // Change this
$pass = ''; // Change this
$dbname = 'constratech_cms';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Setup - Constratech CMS</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a5490, #00a8cc);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #1a5490;
            margin-bottom: 1rem;
        }
        .status {
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
        .success {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            color: #065f46;
        }
        .error {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            color: #991b1b;
        }
        .info {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            color: #1e40af;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #1e293b;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
        }
        button {
            background: linear-gradient(135deg, #1a5490, #00a8cc);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
        }
        button:hover {
            opacity: 0.9;
        }
        pre {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.9rem;
        }
        .step {
            margin: 2rem 0;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 8px;
        }
        .step h3 {
            color: #1a5490;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Constratech CMS Database Setup</h1>
        
        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $host = $_POST['host'];
            $user = $_POST['user'];
            $pass = $_POST['pass'];
            $dbname = $_POST['dbname'];
            
            try {
                // Connect to MySQL
                $conn = new mysqli($host, $user, $pass);
                
                if ($conn->connect_error) {
                    throw new Exception("Connection failed: " . $conn->connect_error);
                }
                
                echo '<div class="status success">✓ Connected to MySQL successfully</div>';
                
                // Create database
                $sql = "CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
                if ($conn->query($sql)) {
                    echo '<div class="status success">✓ Database created: ' . $dbname . '</div>';
                }
                
                // Select database
                $conn->select_db($dbname);
                
                // Read and execute SQL file
                $sqlFile = __DIR__ . '/../database/schema.sql';
                if (!file_exists($sqlFile)) {
                    throw new Exception("SQL file not found: $sqlFile");
                }
                
                $sql = file_get_contents($sqlFile);
                
                // Remove USE database statement
                $sql = preg_replace('/USE\s+\w+;/i', '', $sql);
                
                // Split by semicolon and execute each statement
                $statements = array_filter(array_map('trim', explode(';', $sql)));
                
                $successCount = 0;
                foreach ($statements as $statement) {
                    if (!empty($statement) && !preg_match('/^(--|SELECT)/i', $statement)) {
                        if ($conn->query($statement)) {
                            $successCount++;
                        }
                    }
                }
                
                echo '<div class="status success">✓ Executed ' . $successCount . ' SQL statements</div>';
                
                // Update config.php
                $configFile = __DIR__ . '/../api/config.php';
                $configContent = file_get_contents($configFile);
                $configContent = preg_replace("/define\('DB_HOST',\s*'[^']*'\);/", "define('DB_HOST', '$host');", $configContent);
                $configContent = preg_replace("/define\('DB_NAME',\s*'[^']*'\);/", "define('DB_NAME', '$dbname');", $configContent);
                $configContent = preg_replace("/define\('DB_USER',\s*'[^']*'\);/", "define('DB_USER', '$user');", $configContent);
                $configContent = preg_replace("/define\('DB_PASS',\s*'[^']*'\);/", "define('DB_PASS', '$pass');", $configContent);
                file_put_contents($configFile, $configContent);
                
                echo '<div class="status success">✓ Updated config.php with database credentials</div>';
                
                $conn->close();
                
                echo '<div class="status success" style="margin-top: 2rem; font-size: 1.1rem;">
                    <strong>🎉 Setup Complete!</strong><br><br>
                    <strong>Next Steps:</strong><br>
                    1. Delete this setup.php file for security<br>
                    2. Access CMS at: <a href="../cms-login.html">cms-login.html</a><br>
                    3. Default login: admin / constratech2025<br>
                    4. Change password after first login
                </div>';
                
            } catch (Exception $e) {
                echo '<div class="status error">✗ Error: ' . $e->getMessage() . '</div>';
            }
            
        } else {
        ?>
        
        <div class="status info">
            <strong>Before you start:</strong><br>
            • Make sure MySQL server is running<br>
            • Have your MySQL credentials ready<br>
            • The database will be created automatically
        </div>
        
        <form method="POST">
            <div class="form-group">
                <label>MySQL Host:</label>
                <input type="text" name="host" value="localhost" required>
            </div>
            
            <div class="form-group">
                <label>MySQL Username:</label>
                <input type="text" name="user" value="root" required>
            </div>
            
            <div class="form-group">
                <label>MySQL Password:</label>
                <input type="password" name="pass" placeholder="Leave empty if no password">
            </div>
            
            <div class="form-group">
                <label>Database Name:</label>
                <input type="text" name="dbname" value="constratech_cms" required>
            </div>
            
            <button type="submit">🚀 Install Database</button>
        </form>
        
        <div class="step">
            <h3>What will be created:</h3>
            <ul>
                <li>✓ Database: constratech_cms</li>
                <li>✓ 11 tables for CMS content</li>
                <li>✓ Default admin user (admin / constratech2025)</li>
                <li>✓ Sample content for all sections</li>
                <li>✓ Indexes for better performance</li>
            </ul>
        </div>
        
        <?php } ?>
    </div>
</body>
</html>
