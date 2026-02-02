<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$db_username = "root"; // MAMP default
$db_password = "root"; // MAMP default
$dbname = "user_auth";

// Connect to MySQL
$conn = new mysqli($servername, $db_username, $db_password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Validate inputs
    if (empty($user) || empty($email) || empty($password)) {
        $message = "Please fill in all fields.";
    } else {
        // Check if username or email exists
        $check = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
        if (!$check) {
            die("Prepare failed: " . $conn->error);
        }

        $check->bind_param("ss", $user, $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $message = "Username or email already taken!";
        } else {
            // Hash password
            $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

            // Insert new user
            $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            if (!$stmt) {
                die("Prepare failed: " . $conn->error);
            }

            $stmt->bind_param("sss", $user, $email, $hashed_pass);

            if ($stmt->execute()) {
                $message = "Signup successful! You can now <a href='login.php'>login</a>.";
            } else {
                $message = "Error: " . $stmt->error;
            }

            $stmt->close();
        }

        $check->close();
    }
}

$conn->close();
?>
