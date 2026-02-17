<?php
// scheduling/timeslot.php - List all timeslots with filters & icons

require_once '../includes/config.php';

// Optional: show PHP errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Study types for filter dropdown
$study_types = [
    'Group Study', 'Individual Study', 'Tutoring', 'Exam Review',
    'Workshop', 'Seminar', 'Lab Session', 'Quiet Study', 'Other'
];

// Status options
$status_options = ['available', 'booked', 'cancelled'];

// === FILTER PARAMETERS ===
$search       = trim($_GET['search'] ?? '');
$study_type   = trim($_GET['study_type'] ?? '');
$status       = trim($_GET['status'] ?? '');
$date_from    = trim($_GET['date_from'] ?? '');
$date_to      = trim($_GET['date_to'] ?? '');

// Build WHERE conditions and parameters
$where = [];
$params = [];

if ($search !== '') {
    $where[] = "(title LIKE :search OR description LIKE :search)";
    $params[':search'] = "%$search%";
}

if ($study_type !== '') {
    $where[] = "study_type = :study_type";
    $params[':study_type'] = $study_type;
}

if ($status !== '') {
    $where[] = "status = :status";
    $params[':status'] = $status;
}

if ($date_from !== '') {
    $where[] = "DATE(start_datetime) >= :date_from";
    $params[':date_from'] = $date_from;
}

if ($date_to !== '') {
    $where[] = "DATE(start_datetime) <= :date_to";
    $params[':date_to'] = $date_to;
}

// Build final WHERE clause
$where_clause = '';
if (!empty($where)) {
    $where_clause = "WHERE " . implode(" AND ", $where);
}

// Fetch filtered timeslots
$sql = "
    SELECT 
        id, room_id, title, study_type, start_datetime, end_datetime,
        capacity, status, created_at
    FROM scheduling
    $where_clause
    ORDER BY start_datetime ASC
";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Messages
$messages = '';
if (isset($_GET['created']) && $_GET['created'] == 1) {
    $messages .= '<div class="alert alert-success">Timeslot created successfully!</div>';
}
if (isset($_GET['updated']) && $_GET['updated'] == 1) {
    $messages .= '<div class="alert alert-success">Timeslot updated successfully!</div>';
}
if (isset($_GET['duplicated']) && $_GET['duplicated'] == 1) {
    $messages .= '<div class="alert alert-success">Timeslot duplicated successfully!</div>';
}
if (isset($_GET['deleted']) && $_GET['deleted'] == 1) {
    $messages .= '<div class="alert alert-success">Timeslot deleted successfully!</div>';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scheduling - All Timeslots</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body { padding: 20px; }
        .badge-available   { background-color: #198754; }
        .badge-booked      { background-color: #dc3545; }
        .badge-cancelled   { background-color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="mb-4">All Scheduled Timeslots</h1>

        <?= $messages ?>

        <!-- Filter Form -->
        <form method="GET" class="mb-4 border p-3 rounded bg-light">
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="search" class="form-label">Search (title/description)</label>
                    <input type="text" name="search" id="search" class="form-control" 
                           value="<?= htmlspecialchars($search) ?>" placeholder="e.g. Math">
                </div>

                <div class="col-md-3">
                    <label for="study_type" class="form-label">Study Type</label>
                    <select name="study_type" id="study_type" class="form-select">
                        <option value="">-- All Types --</option>
                        <?php foreach ($study_types as $type): ?>
                            <option value="<?= htmlspecialchars($type) ?>" <?= $study_type === $type ? 'selected' : '' ?>>
                                <?= htmlspecialchars($type) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="col-md-2">
                    <label for="status" class="form-label">Status</label>
                    <select name="status" id="status" class="form-select">
                        <option value="">-- All --</option>
                        <?php foreach ($status_options as $s): ?>
                            <option value="<?= $s ?>" <?= $status === $s ? 'selected' : '' ?>>
                                <?= ucfirst($s) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Date Range (start)</label>
                    <div class="input-group">
                        <input type="date" name="date_from" class="form-control" value="<?= htmlspecialchars($date_from) ?>">
                        <span class="input-group-text">to</span>
                        <input type="date" name="date_to" class="form-control" value="<?= htmlspecialchars($date_to) ?>">
                    </div>
                </div>
            </div>

            <div class="mt-3">
                <button type="submit" class="btn btn-primary"><i class="bi bi-funnel-fill"></i> Apply Filters</button>
                <a href="timeslot.php" class="btn btn-outline-secondary"><i class="bi bi-arrow-repeat"></i> Reset Filters</a>
            </div>
        </form>

        <p>
            <a href="create.php" class="btn btn-primary"><i class="bi bi-plus-circle-fill"></i> Create New Timeslot</a>
        </p>

        <?php if (empty($schedules)): ?>
            <div class="alert alert-info">
                No timeslots found matching your filters.
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Room ID</th>
                            <th>Title</th>
                            <th>Study Type</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($schedules as $row): ?>
                            <tr>
                                <td><?= htmlspecialchars($row['id']) ?></td>
                                <td><?= htmlspecialchars($row['room_id']) ?></td>
                                <td><?= htmlspecialchars($row['title'] ?? '—') ?></td>
                                <td><?= htmlspecialchars($row['study_type'] ?? '—') ?></td>
                                <td><?= date('M d, Y g:i A', strtotime($row['start_datetime'])) ?></td>
                                <td><?= date('M d, Y g:i A', strtotime($row['end_datetime'])) ?></td>
                                <td><?= htmlspecialchars($row['capacity'] ?? '—') ?></td>
                                <td>
                                    <span class="badge rounded-pill 
                                        <?= $row['status'] === 'available' ? 'badge-available' :
                                            ($row['status'] === 'booked' ? 'badge-booked' : 'badge-cancelled') ?>">
                                        <?= ucfirst($row['status']) ?>
                                    </span>
                                </td>
                                <td><?= date('M d, Y H:i', strtotime($row['created_at'])) ?></td>
                                <td>
                                    <a href="edit.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-warning">
                                        <i class="bi bi-pencil-fill"></i> Edit
                                    </a>
                                    <a href="duplicate.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-info">
                                        <i class="bi bi-copy"></i> Duplicate
                                    </a>
                                    <a href="delete.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-danger">
                                        <i class="bi bi-trash-fill"></i> Delete
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>