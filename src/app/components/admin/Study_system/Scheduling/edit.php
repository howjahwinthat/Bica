<?php
// scheduling/edit.php - Edit an existing timeslot

require_once '../includes/config.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$errors = [];
$success = false;

// Get ID from URL
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: timeslot.php?error=invalid_id");
    exit;
}
$id = (int)$_GET['id'];

// Fetch existing timeslot data
$stmt = $pdo->prepare("SELECT * FROM scheduling WHERE id = ?");
$stmt->execute([$id]);
$timeslot = $stmt->fetch();

if (!$timeslot) {
    header("Location: timeslot.php?error=not_found");
    exit;
}

// Study types for dropdown
$study_types = [
    'Group Study', 'Individual Study', 'Tutoring', 'Exam Review',
    'Workshop', 'Seminar', 'Lab Session', 'Quiet Study', 'Other'
];

// Conflict check function (exclude current record)
function hasConflict($pdo, $room_id, $start, $end, $exclude_id) {
    $sql = "
        SELECT COUNT(*)
        FROM scheduling
        WHERE room_id = :room_id
          AND status = 'booked'
          AND id != :exclude_id
          AND (
              start_datetime < :end_datetime 
              AND end_datetime > :start_datetime
          )
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':room_id'       => $room_id,
        ':exclude_id'    => $exclude_id,
        ':start_datetime' => $start,
        ':end_datetime'   => $end
    ]);
    return $stmt->fetchColumn() > 0;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $room_id        = trim($_POST['room_id'] ?? $timeslot['room_id']);
    $title          = trim($_POST['title'] ?? $timeslot['title']);
    $study_type     = trim($_POST['study_type'] ?? $timeslot['study_type']);
    $description    = trim($_POST['description'] ?? $timeslot['description']);
    $start_datetime = $_POST['start_datetime'] ?? $timeslot['start_datetime'];
    $end_datetime   = $_POST['end_datetime'] ?? $timeslot['end_datetime'];
    $capacity       = (int)($_POST['capacity'] ?? $timeslot['capacity']);
    $status         = $_POST['status'] ?? $timeslot['status'];

    // Validation
    if (empty($room_id))               $errors[] = "Room is required.";
    if (empty($start_datetime))        $errors[] = "Start time is required.";
    if (empty($end_datetime))          $errors[] = "End time is required.";
    if ($start_datetime && $end_datetime && $start_datetime >= $end_datetime) {
        $errors[] = "End time must be after start time.";
    }
    if (empty($study_type))            $errors[] = "Study Type is required.";

    // Conflict check (exclude this record)
    if (empty($errors)) {
        if (hasConflict($pdo, $room_id, $start_datetime, $end_datetime, $id)) {
            $errors[] = "Conflict! Room already booked in this time (excluding current slot).";
        }
    }

    // Update if no errors
    if (empty($errors)) {
        try {
            $sql = "
                UPDATE scheduling SET
                    room_id = :room_id,
                    title = :title,
                    description = :description,
                    study_type = :study_type,
                    start_datetime = :start_datetime,
                    end_datetime = :end_datetime,
                    capacity = :capacity,
                    status = :status
                WHERE id = :id
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':room_id'        => $room_id,
                ':title'          => $title,
                ':description'    => $description,
                ':study_type'     => $study_type,
                ':start_datetime'  => $start_datetime,
                ':end_datetime'    => $end_datetime,
                ':capacity'       => $capacity,
                ':status'         => $status,
                ':id'             => $id
            ]);

            $success = true;
            header("Location: timeslot.php?updated=1");
            exit;
        } catch (PDOException $e) {
            $errors[] = "Update failed: " . htmlspecialchars($e->getMessage());
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Timeslot</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">

    <h1>Edit Timeslot (ID: <?= $id ?>)</h1>
    <a href="timeslot.php" class="btn btn-secondary mb-3">← Back to List</a>

    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul class="mb-0">
                <?php foreach ($errors as $err): ?>
                    <li><?= htmlspecialchars($err) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form method="POST" class="border p-4 rounded bg-light">
        <div class="mb-3">
            <label class="form-label">Room <span class="text-danger">*</span></label>
            <select name="room_id" class="form-select" required>
                <option value="">-- Select Room --</option>
                <?php
                $rooms = $pdo->query("SELECT id, name, capacity, location FROM rooms WHERE is_active = 1 ORDER BY name")->fetchAll();
                foreach ($rooms as $room) {
                    $selected = ($_POST['room_id'] ?? $timeslot['room_id']) == $room['id'] ? 'selected' : '';
                    echo "<option value='{$room['id']}' $selected>" 
                         . htmlspecialchars($room['name']) 
                         . " (Cap: {$room['capacity']}" 
                         . ($room['location'] ? ", {$room['location']}" : '') 
                         . ")</option>";
                }
                ?>
            </select>
            <small class="form-text text-muted">Select a room from the list</small>
        </div>

        <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" name="title" class="form-control" 
                   value="<?= htmlspecialchars($_POST['title'] ?? $timeslot['title']) ?>">
        </div>

        <div class="mb-3">
            <label class="form-label">Study Type <span class="text-danger">*</span></label>
            <select name="study_type" class="form-select" required>
                <option value="">-- Select Study Type --</option>
                <?php foreach ($study_types as $type): ?>
                    <option value="<?= htmlspecialchars($type) ?>"
                        <?= (($_POST['study_type'] ?? $timeslot['study_type']) === $type) ? 'selected' : '' ?>>
                        <?= htmlspecialchars($type) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="3"><?= htmlspecialchars($_POST['description'] ?? $timeslot['description']) ?></textarea>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Start Date & Time <span class="text-danger">*</span></label>
                <input type="datetime-local" name="start_datetime" class="form-control" required
                       value="<?= htmlspecialchars($_POST['start_datetime'] ?? date('Y-m-d\TH:i', strtotime($timeslot['start_datetime']))) ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">End Date & Time <span class="text-danger">*</span></label>
                <input type="datetime-local" name="end_datetime" class="form-control" required
                       value="<?= htmlspecialchars($_POST['end_datetime'] ?? date('Y-m-d\TH:i', strtotime($timeslot['end_datetime']))) ?>">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Capacity</label>
            <input type="number" name="capacity" class="form-control" min="1" 
                   value="<?= htmlspecialchars($_POST['capacity'] ?? $timeslot['capacity']) ?>">
        </div>

        <div class="mb-3">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
                <option value="available"   <?= ($_POST['status'] ?? $timeslot['status']) === 'available' ? 'selected' : '' ?>>Available</option>
                <option value="booked"      <?= ($_POST['status'] ?? $timeslot['status']) === 'booked' ? 'selected' : '' ?>>Booked</option>
                <option value="cancelled"   <?= ($_POST['status'] ?? $timeslot['status']) === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Update Timeslot</button>
    </form>

</body>
</html>