<?php
// scheduling/duplicate.php
// Automatically duplicates a timeslot (no form, instant action)

require_once '../includes/config.php';

// Make sure we have a valid ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: timeslot.php?error=invalid_id");
    exit;
}

$original_id = (int)$_GET['id'];

// Fetch the original timeslot
$stmt = $pdo->prepare("SELECT * FROM scheduling WHERE id = ?");
$stmt->execute([$original_id]);
$original = $stmt->fetch();

if (!$original) {
    header("Location: timeslot.php?error=not_found");
    exit;
}

// Create new dates — same time, but +1 day (you can change this)
$new_start = date('Y-m-d H:i:s', strtotime($original['start_datetime'] . ' +1 day'));
$new_end   = date('Y-m-d H:i:s', strtotime($original['end_datetime'] . ' +1 day'));

// Check if the new time conflicts with anything in the same room
$sql = "
    SELECT COUNT(*)
    FROM scheduling
    WHERE room_id = :room_id
      AND status = 'booked'
      AND (
          start_datetime < :new_end
          AND end_datetime > :new_start
      )
";
$check = $pdo->prepare($sql);
$check->execute([
    ':room_id'   => $original['room_id'],
    ':new_start' => $new_start,
    ':new_end'   => $new_end
]);

if ($check->fetchColumn() > 0) {
    // Conflict exists → go back with warning
    header("Location: timeslot.php?error=duplicate_conflict");
    exit;
}

// No conflict → create the duplicate
try {
    $sql = "
        INSERT INTO scheduling
        (room_id, title, description, study_type, start_datetime, end_datetime, capacity, status)
        VALUES
        (:room_id, :title, :description, :study_type, :start_datetime, :end_datetime, :capacity, :status)
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':room_id'        => $original['room_id'],
        ':title'          => $original['title'],
        ':description'    => $original['description'],
        ':study_type'     => $original['study_type'],
        ':start_datetime'  => $new_start,
        ':end_datetime'    => $new_end,
        ':capacity'       => $original['capacity'],
        ':status'         => $original['status']   // or force 'available' if you prefer
    ]);

    // Success → back to list with success message
    header("Location: timeslot.php?duplicated=1");
    exit;

} catch (PDOException $e) {
    // Database error → back with error message
    header("Location: timeslot.php?error=duplicate_failed");
    exit;
}
?>