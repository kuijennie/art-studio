<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fig 5: Dynamic User Input Handling</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 680px; margin: 40px auto; padding: 0 20px; }
        h2 { color: #333; }
        label { display: block; margin-top: 12px; font-weight: bold; }
        input, select { width: 100%; padding: 8px; margin-top: 4px; box-sizing: border-box;
                        border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
        button { margin-top: 14px; padding: 10px 24px; background: #28a745; color: white;
                 border: none; border-radius: 4px; cursor: pointer; font-size: 15px; }
        button:hover { background: #1e7e34; }
        .msg { padding: 10px 14px; border-radius: 4px; margin: 14px 0; font-weight: bold; }
        .success { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #2e7d32; }
        .error   { background: #ffebee; color: #c62828; border-left: 4px solid #c62828; }
        table { border-collapse: collapse; width: 100%; margin-top: 16px; }
        th, td { border: 1px solid #ccc; padding: 9px 13px; text-align: left; }
        th { background: #28a745; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .empty { color: #888; font-style: italic; }
        .delete-btn { background: #dc3545; color: white; border: none; padding: 4px 10px;
                      border-radius: 3px; cursor: pointer; font-size: 12px; }
        .delete-btn:hover { background: #a71d2a; }
        .char-count { font-size: 12px; color: #777; text-align: right; margin-top: 2px; }
    </style>
</head>
<body>
    <h2>Fig 5: Dynamic User Input Handling</h2>

    <?php

    $host = "localhost"; $user = "root"; $pass = ""; $db = "adv_db";
    $conn = mysqli_connect($host, $user, $pass, $db);

    if (!$conn) {
        echo "<div class='msg error'>Database connection failed.</div>";
        exit;
    }

    // Ensure table has the course column
    mysqli_query($conn, "ALTER TABLE students ADD COLUMN IF NOT EXISTS course VARCHAR(100) DEFAULT 'Unassigned'");

    $message = "";

    // ── Handle DELETE ────────────────────────────────────────────
    if (isset($_GET['delete'])) {
        $id = (int) $_GET['delete'];
        $stmt = mysqli_prepare($conn, "DELETE FROM students WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        header("Location: fig5_user_input.php?deleted=1");
        exit;
    }

    if (isset($_GET['deleted'])) {
        $message = "<div class='msg success'>Student deleted successfully.</div>";
    }

    // ── Handle INSERT ────────────────────────────────────────────
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $name   = trim($_POST['name']   ?? '');
        $email  = trim($_POST['email']  ?? '');
        $course = trim($_POST['course'] ?? '');

        $errors = [];

        if ($name === '')                           $errors[] = "Name is required.";
        if (strlen($name) < 3)                      $errors[] = "Name must be at least 3 characters.";
        if ($email === '')                           $errors[] = "Email is required.";
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Enter a valid email address.";
        if ($course === '')                          $errors[] = "Please select a course.";

        if (empty($errors)) {
            // Check duplicate email
            $check = mysqli_prepare($conn, "SELECT id FROM students WHERE email = ?");
            mysqli_stmt_bind_param($check, "s", $email);
            mysqli_stmt_execute($check);
            mysqli_stmt_store_result($check);

            if (mysqli_stmt_num_rows($check) > 0) {
                $message = "<div class='msg error'>A student with that email already exists.</div>";
            } else {
                $stmt = mysqli_prepare($conn, "INSERT INTO students (name, email, course) VALUES (?, ?, ?)");
                mysqli_stmt_bind_param($stmt, "sss", $name, $email, $course);

                if (mysqli_stmt_execute($stmt)) {
                    $message = "<div class='msg success'>Student <strong>" . htmlspecialchars($name) . "</strong> added successfully!</div>";
                } else {
                    $message = "<div class='msg error'>Insert failed: " . mysqli_error($conn) . "</div>";
                }
                mysqli_stmt_close($stmt);
            }
            mysqli_stmt_close($check);
        } else {
            $errorList = implode("<br>", array_map('htmlspecialchars', $errors));
            $message = "<div class='msg error'>$errorList</div>";
        }
    }

    echo $message;
    ?>

    <!-- ── Input Form ───────────────────────────────────────────── -->
    <form method="POST" action="fig5_user_input.php" id="studentForm">
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" placeholder="e.g. Jane Murin" maxlength="100"
               value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
        <div class="char-count" id="nameCount">0 / 100</div>

        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="e.g. jane@example.com"
               value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">

        <label for="course">Course</label>
        <select id="course" name="course">
            <option value="">-- Select a course --</option>
            <?php
            $courses = ["Web Development", "Database Systems", "OOP Programming",
                        "Networking", "Cyber Security", "Mobile Development"];
            $selected = $_POST['course'] ?? '';
            foreach ($courses as $c) {
                $sel = ($c === $selected) ? "selected" : "";
                echo "<option value='$c' $sel>$c</option>";
            }
            ?>
        </select>

        <button type="submit">Add Student</button>
    </form>

    <!-- ── Live preview while typing ───────────────────────────── -->
    <div id="preview" style="margin-top:16px; padding:10px; background:#f0f8ff;
         border-radius:4px; border:1px solid #bee5eb; display:none;">
        <strong>Preview:</strong>
        <span id="previewText"></span>
    </div>

    <!-- ── Students Table ──────────────────────────────────────── -->
    <h3 style="margin-top:30px;">Registered Students</h3>
    <?php

    $result = mysqli_query($conn, "SELECT * FROM students ORDER BY created_at DESC");
    $count  = mysqli_num_rows($result);

    echo "<p>Total students: <strong>$count</strong></p>";

    if ($count === 0) {
        echo "<p class='empty'>No students yet. Add one above.</p>";
    } else {
        echo "<table>
                <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Course</th><th>Registered</th><th>Action</th>
                </tr>";
        $i = 1;
        while ($row = mysqli_fetch_assoc($result)) {
            $delUrl = "fig5_user_input.php?delete=" . (int)$row['id'];
            echo "<tr>
                    <td>{$i}</td>
                    <td>" . htmlspecialchars($row['name'])   . "</td>
                    <td>" . htmlspecialchars($row['email'])  . "</td>
                    <td>" . htmlspecialchars($row['course']) . "</td>
                    <td>{$row['created_at']}</td>
                    <td>
                        <a href='$delUrl' onclick=\"return confirm('Delete this student?')\">
                            <button class='delete-btn' type='button'>Delete</button>
                        </a>
                    </td>
                  </tr>";
            $i++;
        }
        echo "</table>";
    }

    mysqli_close($conn);
    ?>

    <p style="margin-top:20px;">
        <a href="fig4_db_connection.php">&larr; Back to Fig 4</a>
    </p>

    <script>
        // Character counter for name
        const nameInput = document.getElementById('name');
        const nameCount = document.getElementById('nameCount');
        nameInput.addEventListener('input', () => {
            nameCount.textContent = nameInput.value.length + ' / 100';
        });

        // Live preview
        const emailInput  = document.getElementById('email');
        const courseInput = document.getElementById('course');
        const preview     = document.getElementById('preview');
        const previewText = document.getElementById('previewText');

        function updatePreview() {
            const n = nameInput.value.trim();
            const e = emailInput.value.trim();
            const c = courseInput.value;
            if (n || e || c) {
                preview.style.display = 'block';
                previewText.textContent = `${n || '(name)'} | ${e || '(email)'} | ${c || '(course)'}`;
            } else {
                preview.style.display = 'none';
            }
        }

        [nameInput, emailInput, courseInput].forEach(el => el.addEventListener('input', updatePreview));
    </script>
</body>
</html>
