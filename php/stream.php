<?php

$payload_b64 = $_GET['data'] ?? '';
$provided_signature = $_GET['sig'] ?? '';
$secret = 'proxy_secret';

$isDev = file_exists(__DIR__ . '/.dev');

// --------
// - CORS -
// --------

if ($isDev) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Credentials: false");
} else {
    header("Access-Control-Allow-Origin: https://www.screwmycode.in");
    header("Access-Control-Allow-Credentials: true");
}

// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// -----------
// - REFERER -
// -----------
$allowed_referers = [
    'https://www.screwmycode.in',
    'https://screwmycode.in',
];

// if ($isDev) {
//     $allowed_referers[] = 'http://localhost:3000';
// }

$referer = $_SERVER['HTTP_REFERER'] ?? '';
$valid_referer = false;
foreach ($allowed_referers as $allowed) {
    if (strpos($referer, $allowed) === 0) {
        $valid_referer = true;
        break;
    }
}

// ------------
// - DECODING -
// ------------
if (!$payload_b64 || !$provided_signature) {
    http_response_code(400);
    die('Missing parameters');
}

// Verify signature first
$expected_signature = hash_hmac('sha256', $payload_b64, $secret);
if (!hash_equals($expected_signature, $provided_signature)) {
    http_response_code(401);
    die('Invalid signature');
}

// Decode URL-safe base64 payload
try {
    // Add padding back if needed
    $payload_b64_padded = $payload_b64 . str_repeat('=', (4 - strlen($payload_b64) % 4) % 4);

    // Convert URL-safe characters back to standard base64
    $payload_b64_standard = str_replace(['-', '_'], ['+', '/'], $payload_b64_padded);

    $payload_json = base64_decode($payload_b64_standard, true);
    if ($payload_json === false) {
        throw new Exception('Base64 decode failed');
    }

    $payload = json_decode($payload_json, true);
    if ($payload === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON decode failed: ' . json_last_error_msg());
    }

    if (!isset($payload['media_url']) || !isset($payload['expires']) || !isset($payload['media_type'])) {
        throw new Exception('Missing required payload fields');
    }

    // Check expiration
    if (time() > $payload['expires']) {
        http_response_code(401);
        die('Token expired');
    }

    $media_url = $payload['media_url'];
    $media_type = $payload['media_type'];
} catch (Exception $e) {
    http_response_code(400);
    die('Invalid token format');
}

// ---------------------
// - VALIDATION PASSED -
// ---------------------

// Disable buffering
@ini_set('output_buffering', 'Off');
while (ob_get_level()) {
    ob_end_clean();
}

// Stream it
if ($media_type == 'audio') {
    header('Content-Type: audio/mpeg');
} else {
    header('Content-Type: image/jpeg');
}

// header('Cache-Control: no-cache');

header('Cache-Control: public, max-age=43200'); // Cache for 12 hours
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 43200) . ' GMT');

$ch = curl_init($media_url);

curl_setopt(
    $ch,
    CURLOPT_WRITEFUNCTION,
    function ($ch, $data) {
        echo $data;
        flush();
        return strlen($data);
    }
);

curl_exec($ch);
