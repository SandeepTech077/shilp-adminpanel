<?php
// 🚀 GitHub Webhook Handler for cPanel Auto-Deployment
// Save as: /public_html/webhook.php

// Webhook secret for security (GitHub repository settings)
$webhook_secret = 'your-webhook-secret-here';

// Verify GitHub webhook signature
function verify_signature($payload, $signature, $secret) {
    $expected_signature = hash_hmac('sha256', $payload, $secret, false);
    return hash_equals('sha256=' . $expected_signature, $signature);
}

// Get the payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Verify signature
if (!verify_signature($payload, $signature, $webhook_secret)) {
    http_response_code(401);
    echo 'Unauthorized';
    exit;
}

// Parse payload
$data = json_decode($payload, true);

// Check if it's a push to main branch
if ($data['ref'] === 'refs/heads/main') {
    
    // Log the deployment
    $log_file = '/home/username/deployment.log';
    $log_message = date('Y-m-d H:i:s') . " - Deployment started\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
    
    // Run deployment script
    $deploy_script = '/home/username/deploy.sh';
    $output = shell_exec("bash $deploy_script 2>&1");
    
    // Log output
    file_put_contents($log_file, $output . "\n", FILE_APPEND);
    
    echo 'Deployment triggered successfully';
} else {
    echo 'Not a main branch push, ignoring';
}
?>