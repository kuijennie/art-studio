<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fig 4: Database Connection Script</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
        h2 { color: #333; }
        .status { padding: 10px 14px; border-radius: 4px; margin: 10px 0; font-weight: bold; }
        .success { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #2e7d32; }
        .error   { background: #ffebee; color: #c62828; border-left: 4px solid #c62828; }
        table { border-collapse: collapse; width: 100%; margin-top: 16px; }
        th, td { border: 1px solid #ccc; padding: 10px 14px; text-align: left; }
        th { background: #007bff; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .empty { color: #888; font-style: italic; margin-top: 10px; }
        pre { background: #f4f4f4; padding: 12px; border-radius: 4px; font-size: 13px; }
    </style>
</head>
<body>
    <h2>Fig 4: Database Connection Script</h2>

    <?php

    // ── Connection Parameters ──────────────────────────────────
    $host     = "localhost";
    $username = "root";
    $password = "";
    $database = "adv_db";

    // ── Step 1: Connect ──────────────────────────────────────────
    $conn = mysqli_connect($host, $username, $password, $database);

    if (!$conn) {
        echo "<div class='status error'>Connection failed: " . mysqli_connect_error() . "</div>";
        exit;
    }

    echo "<div class='status success'>Step 1: Connected to database <strong>$database</strong> successfully.</div>";

    // ── Step 2: Show connection info ─────────────────────────────
    echo "<pre>";
    echo "Host    : $host\n";
    echo "User    : $username\n";
    echo "Database: $database\n";
    echo "Server  : " . mysqli_get_server_info($conn) . "\n";
    echo "</pre>";

    // ── Step 3: Ensure students table exists ─────────────────────
    $createTable = "CREATE TABLE IF NOT EXISTS students (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(100) NOT NULL,
        course     VARCHAR(100) DEFAULT 'Unassigned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if (mysqli_query($conn, $createTable)) {
        echo "<div class='status success'>Step 2: <strong>students</strong> table is ready.</div>";
    } else {
        echo "<div class='status error'>Table error: " . mysqli_error($conn) . "</div>";
    }

    // ── Step 4: Fetch and display students ───────────────────────
    $result = mysqli_query($conn, "SELECT * FROM students ORDER BY created_at DESC");

    echo "<h3>Students Table</h3>";

    if (mysqli_num_rows($result) === 0) {
        echo "<p class='empty'>No students found. Use Fig 5 to add students.</p>";
    } else {
        echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Registered</th>
                </tr>";

        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>
                    <td>{$row['id']}</td>
                    <td>" . htmlspecialchars($row['name'])   . "</td>
                    <td>" . htmlspecialchars($row['email'])  . "</td>
                    <td>" . htmlspecialchars($row['course']) . "</td>
                    <td>{$row['created_at']}</td>
                  </tr>";
        }
        echo "</table>";
    }

    // ── Step 5: Close connection ─────────────────────────────────
    mysqli_close($conn);
    echo "<div class='status success'>Step 3: Connection closed.</div>";

    ?>

    <p style="margin-top:20px;">
        <a href="fig5_user_input.php">Go to Fig 5 &rarr; Add a student</a>
    </p>
</body>
</html>
