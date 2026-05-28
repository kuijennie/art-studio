# Week 4: Dynamic Backend Processing & User Interaction Systems

## Objective
Introduce server-side programming using PHP, form processing, session-based authentication, and professional folder structure.



## Fig 1 – Server-Side Programming

**File:** `fig1_server_side.php`

A simple PHP page that takes a name from a form and displays a dynamic welcome message. Demonstrates the request-response cycle , the browser sends a POST request and PHP processes it on the server.

**Code Snippet**
```php
<?php
$name = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(trim($_POST['username'] ?? ''));
}
?>

<form method="POST" action="fig1_server_side.php">
  <input type="text" name="username" placeholder="e.g. Jane" required>
  <button type="submit">Submit</button>
</form>

<?php if ($name): ?>
  <div class="welcome">Welcome <?= $name ?></div>
<?php endif; ?>
```

**Evidence**

![Fig 1 – Welcome message displayed after form submission](Screenshot%202026-05-28%20080721.png)

---

## Fig 2 – HTML Forms & PHP Integration

**File:** `fig2_forms.php`

Three forms in one page, registration, login, and contact, each processed by PHP using the POST method. Input is validated and a success or error message is shown.

**Code Snippet**
```php
// Registration
if (isset($_POST['action']) && $_POST['action'] === 'register') {
    $name  = htmlspecialchars(trim($_POST['name']  ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));

    if (!$name || !$email || !$_POST['password']) {
        $msg = 'Please fill in all fields.';
    } else {
        $msg = "Registration successful! Welcome, $name.";
    }
}

// Login
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === 'admin' && $password === 'admin123') {
        $msg = "Login successful! Welcome back, $username.";
    } else {
        $msg = 'Invalid username or password.';
    }
}

// Contact
if (isset($_POST['action']) && $_POST['action'] === 'contact') {
    $name    = htmlspecialchars(trim($_POST['contact_name'] ?? ''));
    $subject = htmlspecialchars(trim($_POST['subject']      ?? ''));
    $message = htmlspecialchars(trim($_POST['message']      ?? ''));

    if (!$name || !$subject || !$message) {
        $msg = 'Please fill in all fields.';
    } else {
        $msg = "Message sent! Thank you, $name.";
    }
}
```

**Evidence**

![Fig 2 – Registration form with success message](Screenshot%202026-05-28%20094103.png)

![Fig 2 – Login form with success message](Screenshot%202026-05-28%20094432.png)

![Fig 2 – Contact form with success message](Screenshot%202026-05-28%20094627.png)

---

## Fig 3 – Simple Authentication System

**File:** `fig3_auth.php`

A login page with username/password validation and PHP session management. After a successful login, a session is created and the user is shown a welcome page. Logging out destroys the session.

**Code Snippet**
```php
<?php
session_start();

$users = [
    'admin' => 'admin123',
    'jane'  => 'jane2024',
    'john'  => 'john2024',
];

// Login — create session
if ($_POST['action'] === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($users[$username] === $password) {
        $_SESSION['username'] = $username;
        header('Location: fig3_auth.php');
        exit;
    } else {
        $error = 'Incorrect password.';
    }
}

// Logout — destroy session
if ($_POST['action'] === 'logout') {
    session_destroy();
    header('Location: fig3_auth.php');
    exit;
}
?>

<?php if (isset($_SESSION['username'])): ?>
  <p>Welcome, <?= $_SESSION['username'] ?>! You are logged in.</p>
<?php else: ?>
  <!-- show login form -->
<?php endif; ?>
```

**Evidence**

![Fig 3 – Login page with validation error](Screenshot%202026-05-28%20094740.png)

---

## Fig 4 - Backend Folder Organization

**File:** `fig4_structure.php`

Demonstrates a professional PHP project folder structure separating pages, includes, assets, and database files.

```
project/
│
├── index.php           # Home page
├── login.php           # Login page
├── dashboard.php       # Protected dashboard
│
├── includes/
│   ├── db.php          # Database connection
│   ├── auth.php        # Login / logout functions
│   └── header.php      # Shared page header
│
├── css/
├── js/
├── images/
└── database/
    └── schema.sql
```

**Evidence**

![Fig 4 – Folder structure displayed in the browser](Screenshot%202026-05-28%20081018.png)

---

## Fig 5 - Introduction to Modern Backend Alternatives

**File:** `fig5_modern_alternatives.html`

A comparison between PHP (used in this week's tasks) and modern backend alternatives such as Node.js, MongoDB, JWT, and cloud hosting.

| Concept | PHP | Modern Alternative |
|---|---|---|
| Backend Language | PHP | Node.js |
| Local Dev Server | XAMPP | Express.js |
| Database | MySQL | MongoDB |
| User Sessions | `session_start()` | JWT |
| Hosting | Shared Hosting / cPanel | Vercel, Railway, AWS |

---