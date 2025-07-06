<?php
require_once 'config.php';

echo "<h2>Database Connection Test</h2>";

try {
    // Test database connection
    echo "<p>✅ Database connection successful</p>";
    
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p>✅ Users table exists</p>";
    } else {
        echo "<p>❌ Users table does not exist</p>";
    }
    
    // Check admin user
    $stmt = $pdo->prepare("SELECT id, email, firstname, lastname, role FROM users WHERE email = 'admin@example.com'");
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "<p>✅ Admin user exists:</p>";
        echo "<ul>";
        echo "<li>ID: " . $admin['id'] . "</li>";
        echo "<li>Email: " . $admin['email'] . "</li>";
        echo "<li>Name: " . $admin['firstname'] . " " . $admin['lastname'] . "</li>";
        echo "<li>Role: " . $admin['role'] . "</li>";
        echo "</ul>";
    } else {
        echo "<p>❌ Admin user does not exist</p>";
    }
    
    // List all users
    $stmt = $pdo->query("SELECT id, email, firstname, lastname, role, status FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>All Users:</h3>";
    if (count($users) > 0) {
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Email</th><th>Name</th><th>Role</th><th>Status</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>" . $user['id'] . "</td>";
            echo "<td>" . $user['email'] . "</td>";
            echo "<td>" . $user['firstname'] . " " . $user['lastname'] . "</td>";
            echo "<td>" . $user['role'] . "</td>";
            echo "<td>" . $user['status'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No users found</p>";
    }
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
}
?> 