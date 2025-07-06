<?php
// Database configuration
$host = "localhost";
$dbname = "tshirt_designer";
$username = "root";
$password = "";

try {
    // First connect without database to create it if needed
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    
    // Now connect to the specific database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table if it doesn't exist
    $pdo->exec("CREATE TABLE if not exists users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    profile_picture VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    reset_token VARCHAR(100),
    reset_token_expiry DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ");
    
    // Create orders table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id int(11) NOT NULL,
        status enum('pending','approved','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        quantity int(11) DEFAULT 1,
        design_data longtext COLLATE utf8mb4_bin DEFAULT NULL,
        final_price decimal(10,2) DEFAULT NULL,
        left_design varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        right_design varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        source_designs text COLLATE utf8mb4_general_ci DEFAULT NULL,
        front_design varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        back_design varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        base_price decimal(10,2) DEFAULT 0.00,
        design_price decimal(10,2) DEFAULT 0.00,
        total_price decimal(10,2) DEFAULT 0.00,
        updated_at timestamp NULL DEFAULT NULL,
        product_type varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
        color varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
        view_angle varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
        is_hidden tinyint(1) DEFAULT 0,
        is_cart_order tinyint(1) DEFAULT 0,
        approval_timestamp timestamp NULL DEFAULT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    
    // Create admin user if not exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = 'admin@example.com'");
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (email, password, firstname, role) VALUES (?, ?, 'Admin', 'admin')");
        $stmt->execute(['admin@example.com', $admin_password]);
    }
    
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?> 