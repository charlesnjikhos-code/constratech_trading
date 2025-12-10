<?php
/**
 * Image Upload API
 * Handles file uploads for the CMS
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
define('UPLOAD_DIR', '../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Create uploads directory if it doesn't exist
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, null, 'Invalid request method');
    }

    if (!isset($_FILES['image'])) {
        sendResponse(false, null, 'No file uploaded');
    }

    $file = $_FILES['image'];

    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendResponse(false, null, 'Upload error: ' . getUploadErrorMessage($file['error']));
    }

    // Validate file size
    if ($file['size'] > MAX_FILE_SIZE) {
        sendResponse(false, null, 'File too large. Maximum size is 5MB');
    }

    // Validate file type
    $fileType = mime_content_type($file['tmp_name']);
    if (!in_array($fileType, ALLOWED_TYPES)) {
        sendResponse(false, null, 'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP)');
    }

    // Get file extension
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        sendResponse(false, null, 'Invalid file extension');
    }

    // Generate unique filename
    $filename = generateUniqueFilename($extension);
    $filepath = UPLOAD_DIR . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        sendResponse(false, null, 'Failed to save file');
    }

    // Return the relative path for use in the website
    $relativePath = 'uploads/' . $filename;
    
    sendResponse(true, [
        'filename' => $filename,
        'path' => $relativePath,
        'url' => $relativePath,
        'size' => $file['size'],
        'type' => $fileType
    ], 'File uploaded successfully');

} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage());
}

/**
 * Generate a unique filename
 */
function generateUniqueFilename($extension) {
    return uniqid('img_', true) . '_' . time() . '.' . $extension;
}

/**
 * Get upload error message
 */
function getUploadErrorMessage($error) {
    $messages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
    ];
    return $messages[$error] ?? 'Unknown error';
}

/**
 * Send JSON response
 */
function sendResponse($success, $data, $message) {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}
