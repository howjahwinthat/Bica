<?php
// includes/config.php
// Database connection settings - PDO (recommended, safer than mysqli)

$host     = 'localhost';
$dbname   = 'bica';          // Your actual database name (note the + sign)
$username = 'root';           // Default XAMPP username
$password = '';               // Default XAMPP password (empty)

try {
    // Connect using PDO with proper charset
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    // Set error mode to throw exceptions (good for development)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch results as associative arrays by default
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Optional: Helps with timezone consistency
    date_default_timezone_set('America/New_York');   // Newport News, Virginia time zone

} catch (PDOException $e) {
    // If connection fails, show a clear error (remove or hide in production)
    die("Database connection failed: " . htmlspecialchars($e->getMessage()));
}

// Optional: Uncomment during development to show all PHP errors
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/
?>