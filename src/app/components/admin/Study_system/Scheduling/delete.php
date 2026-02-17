<?php
// scheduling/delete.php - Automatically delete a timeslot

require_once '../includes/config.php';

// Require ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: timeslot.php?error=invalid_id");
    exit;
}

$id = (int)$_GET['id'];

try {
    $stmt = $pdo->prepare("DELETE FROM scheduling WHERE id = ?");
    $stmt->execute([$id]);

    // Always redirect with success (even if no row was deleted)
    header("Location: timeslot.php?deleted=1");
    exit;

} catch (PDOException $e) {
    // In case of error, still redirect but show error
    header("Location: timeslot.php?error=delete_failed");
    exit;
}
?>