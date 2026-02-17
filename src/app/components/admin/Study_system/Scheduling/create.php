<?php
// scheduling/create.php - Form to add a new timeslot

require_once '../includes/config.php';

// Show errors during development (remove or comment out later in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Define study types for dropdown
$study_types = [
    'Group Study',
    'Individual Study',
    'Tutoring',
    'Exam Review',
    'Workshop',
    'Seminar',
    'Lab Session',
    'Quiet Study',
    'Other'
];

$errors = [];
$success = false;

// Helper function: check for time overlap in the same room
function hasConflict($pdo, $room_id, $start, $end, $exclude_id = null) {
    $sql = "
        SELECT COUNT(*)
        FROM scheduling
        WHERE room_id = :room_id
          AND status = 'booked'
          AND (
              start_datetime < :end_datetime
              AND end_datetime > :start_datetime
          )
    ";
    if ($exclude_id !== null) {
        $sql .= " AND id != :exclude_id";
    }
    $stmt = $pdo->prepare($sql);
    $params = [
        ':room_id' => $room_id,
        ':start_datetime' => $start,
        ':end_datetime' => $end
    ];
    if ($exclude_id !== null) {
        $params[':exclude_id'] = $exclude_id;
    }
    $stmt->execute($params);
    return $stmt->fetchColumn() > 0;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $room_id        = trim($_POST['room_id'] ?? '');
    $title          = trim($_POST['title'] ?? '');
    $study_type     = trim($_POST['study_type'] ?? '');
    $description    = trim($_POST['description'] ?? '');
    $start_datetime = $_POST['start_datetime'] ?? '';
    $end_datetime   = $_POST['end_datetime'] ?? '';
    $capacity       = (int)($_POST['capacity'] ?? 20);
    $status         = $_POST['status'] ?? 'available';

    // Basic validation
    if (empty($room_id))               $errors[] = "Room is required.";
    if (empty($start_datetime))        $errors[] = "Start time is required.";
    if (empty($end_datetime))          $errors[] = "End time is required.";
    if ($start_datetime && $end_datetime && $start_datetime >= $end_datetime) {
        $errors[] = "End time must be after start time.";
    }
    if (empty($study_type))            $errors[] = "Study Type is required.";

    // Block past or current start time
    if (!empty($start_datetime)) {
        $current_datetime = date('Y-m-d H:i:s');
        $start_timestamp  = date('Y-m-d H:i:s', strtotime($start_datetime));
        if ($start_timestamp <= $current_datetime) {
            $errors[] = "Start time must be in the future. You cannot create a session that has already started or passed.";
        }
    }

    // Conflict check only if basic validation passes
    if (empty($errors)) {
        if (hasConflict($pdo, $room_id, $start_datetime, $end_datetime)) {
            $errors[] = "Conflict detected! This room is already booked during the selected time.";
        }
    }

    // Insert if no errors
    if (empty($errors)) {
        try {
            $sql = "
                INSERT INTO scheduling
                (room_id, title, description, study_type, start_datetime, end_datetime, capacity, status)
                VALUES
                (:room_id, :title, :description, :study_type, :start_datetime, :end_datetime, :capacity, :status)
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
                ':status'         => $status
            ]);
            $success = true;
            header("Location: timeslot.php?created=1");
            exit;
        } catch (PDOException $e) {
            $errors[] = "Database error: " . htmlspecialchars($e->getMessage());
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Timeslot</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">

    <h1>Create New Timeslot</h1>
    <a href="timeslot.php" class="btn btn-secondary mb-3">← Back to Timeslots List</a>

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
                    $selected = ($_POST['room_id'] ?? '') == $room['id'] ? 'selected' : '';
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
            <input type="text" name="title" class="form-control" value="<?= htmlspecialchars($_POST['title'] ?? '') ?>">
        </div>

        <div class="mb-3">
            <label class="form-label">Study Type <span class="text-danger">*</span></label>
            <select name="study_type" class="form-select" required>
                <option value="">-- Select Study Type --</option>
                <?php foreach ($study_types as $type): ?>
                    <option value="<?= htmlspecialchars($type) ?>"
                        <?= ($_POST['study_type'] ?? '') === $type ? 'selected' : '' ?>>
                        <?= htmlspecialchars($type) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="3"><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Start Date & Time <span class="text-danger">*</span></label>
                <input type="datetime-local" name="start_datetime" id="start_datetime" class="form-control" required
                       min="<?= date('Y-m-d\TH:i') ?>"
                       value="<?= htmlspecialchars($_POST['start_datetime'] ?? '') ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">End Date & Time <span class="text-danger">*</span></label>
                <input type="datetime-local" name="end_datetime" id="end_datetime" class="form-control" required
                       min="<?= date('Y-m-d\TH:i') ?>"
                       value="<?= htmlspecialchars($_POST['end_datetime'] ?? '') ?>">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Capacity</label>
            <input type="number" name="capacity" class="form-control" min="1" value="<?= htmlspecialchars($_POST['capacity'] ?? 20) ?>">
        </div>

        <div class="mb-3">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
                <option value="available" <?= ($_POST['status'] ?? '') === 'available' ? 'selected' : '' ?>>Available</option>
                <option value="booked"    <?= ($_POST['status'] ?? '') === 'booked' ? 'selected' : '' ?>>Booked</option>
                <option value="cancelled" <?= ($_POST['status'] ?? '') === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Create Timeslot</button>
    </form>

    <!-- JavaScript to sync end date min with start date -->
    <script>
    document.getElementById('start_datetime').addEventListener('change', function() {
        const startInput = document.getElementById('start_datetime');
        const endInput   = document.getElementById('end_datetime');

        if (startInput.value) {
            endInput.min = startInput.value;
            if (endInput.value && endInput.value < startInput.value) {
                endInput.value = startInput.value;
            }
        }
    });
    </script>

</body>
</html>