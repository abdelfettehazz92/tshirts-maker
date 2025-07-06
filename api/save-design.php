<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Check if user is authenticated
session_start();
if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    $required_fields = ['image', 'product', 'color', 'view'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }
    
    // Get user ID
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$_SESSION['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        throw new Exception('User not found');
    }
    
    $image_data = $input['image'];
    $product = $input['product'];
    $color = $input['color'];
    $view = $input['view'];
    
    // Remove data URL prefix if present
    if (strpos($image_data, 'data:image/') === 0) {
        $image_data = str_replace('data:image/png;base64,', '', $image_data);
        $image_data = str_replace('data:image/jpeg;base64,', '', $image_data);
        $image_data = str_replace('data:image/jpg;base64,', '', $image_data);
    }
    
    $image_data = base64_decode($image_data);
    
    if ($image_data === false) {
        throw new Exception('Invalid image data');
    }
    
    // Generate unique filename
    $filename = uniqid() . '_' . time() . '.png';
    $upload_dir = '../saved_designs/';
    
    // Create directory if it doesn't exist
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    // Check if directory is writable
    if (!is_writable($upload_dir)) {
        throw new Exception('Directory not writable');
    }
    
    // Save the image file
    $file_path = $upload_dir . $filename;
    if (!file_put_contents($file_path, $image_data)) {
        throw new Exception('Failed to save image file');
    }
    
    // Map view angle to design column
    $view_column = match ($view) {
        'front' => 'front_design',
        'back' => 'back_design',
        'left' => 'left_design',
        'right' => 'right_design',
        default => 'front_design'
    };
    
    // Insert into orders table
    $stmt = $pdo->prepare("
        INSERT INTO orders (
            user_id, $view_column, product_type, color, view_angle, 
            base_price, design_price, total_price, status, quantity, created_at
        ) VALUES (?, ?, ?, ?, ?, 5.99, 9.99, 15.98, 'pending', 1, NOW())
    ");
    
    $file_path_for_db = 'saved_designs/' . $filename;
    $stmt->execute([$user['id'], $file_path_for_db, $product, $color, $view]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Design saved successfully',
        'order_id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    // Clean up file if database insert fails
    if (isset($file_path) && file_exists($file_path)) {
        unlink($file_path);
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error saving design: ' . $e->getMessage()
    ]);
}
?> 