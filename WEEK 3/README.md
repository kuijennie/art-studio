# Week 3: Dynamic User Input & PHP Fundamentals

## Objective
Implement client-side form validation, PHP syntax practice, database connectivity, and dynamic server-side user input handling.

---

## Evidence

### Fig 1: JavaScript Form Validation
![Form Validation 1](Screenshot%202026-05-24%20133425.png)
![Form Validation 2](Screenshot%202026-05-24%20133452.png)

**Code Snippet** (`fig1_form_validation.html`)
```js
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const phoneRegex = /^0[17]\d{8}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        phone.classList.add('error');
        document.getElementById('phoneError').textContent =
            'Enter a valid 10-digit phone number (e.g. 0712345678).';
        valid = false;
    }

    if (valid) {
        document.getElementById('successMsg').textContent = 'Form submitted successfully!';
        this.reset();
    }
});
```

---

### Fig 2: Password Strength Checker
![Password Strength](Screenshot%202026-05-24%20133627.png)
![PHP Syntax 1](Screenshot%202026-05-24%20133723.png)

**Code Snippet** (`fig2_password_strength.html`)
```js
const checks = {
    chkLength:  val.length >= 8,
    chkUpper:   /[A-Z]/.test(val),
    chkLower:   /[a-z]/.test(val),
    chkNumber:  /[0-9]/.test(val),
    chkSpecial: /[^A-Za-z0-9]/.test(val),
};

let score = Object.values(checks).filter(Boolean).length;
bar.style.width  = levels[score].width;
bar.style.background = levels[score].color;
label.textContent = 'Strength: ' + levels[score].label;
```

---

### Fig 3: PHP Syntax Practice
![User Input](Screenshot%202026-05-24%20134934.png)

**Code Snippet** (`fig3_php_syntax.php`)
```php
// Variables & types
$name = "Jane Murin"; $age = 20; $gpa = 3.75; $isEnrolled = true;

// Conditionals
if ($score >= 70) $grade = "A";
elseif ($score >= 60) $grade = "B";
else $grade = "F";

// Functions
function calculateAverage(array $marks) {
    return array_sum($marks) / count($marks);
}

// Associative array
$student = ["name" => "Jane", "reg_no" => "ADV/001/2024", "year" => 2];
foreach ($student as $key => $val) {
    echo "$key: $val  (" . gettype($val) . ")\n";
}
```

---

### Fig 4: Database Connection Script
![PHP Syntax 2](Screenshot%202026-05-24%20133954.png)

**Code Snippet** (`fig4_db_connection.php`)
```php
$conn = mysqli_connect("localhost", "root", "", "adv_db");

if (!$conn) {
    echo "<div class='status error'>Connection failed: " . mysqli_connect_error() . "</div>";
    exit;
}

$createTable = "CREATE TABLE IF NOT EXISTS students (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL,
    course     VARCHAR(100) DEFAULT 'Unassigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
mysqli_query($conn, $createTable);

mysqli_close($conn);
```

---

### Fig 5: Dynamic User Input Handling
![DB Connection](Screenshot%202026-05-24%20134053.png)


**Code Snippet** (`fig5_user_input.php`)
```php
// Sanitize & validate
$name  = trim($_POST['name']  ?? '');
$email = trim($_POST['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $errors[] = "Enter a valid email address.";

// Duplicate check
$check = mysqli_prepare($conn, "SELECT id FROM students WHERE email = ?");
mysqli_stmt_bind_param($check, "s", $email);
mysqli_stmt_execute($check);

// Parameterized insert
$stmt = mysqli_prepare($conn, "INSERT INTO students (name, email, course) VALUES (?, ?, ?)");
mysqli_stmt_bind_param($stmt, "sss", $name, $email, $course);
mysqli_stmt_execute($stmt);
```

---

## Summary
Client-side validation implemented with regex for phone/email, password strength checker with live feedback, PHP fundamentals covered (variables, loops, functions, arrays), database connection established with MySQLi, and full CRUD user input form built with duplicate-check and parameterized queries.
