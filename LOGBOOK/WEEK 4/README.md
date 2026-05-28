# Week 4: Dynamic Backend Processing & User Interaction Systems

## Objective
Introduce server-side programming using PHP — form processing, session-based authentication, professional folder structure, and comparison with modern alternatives.

## Setup
1. Install [XAMPP](https://www.apachefriends.org/) (includes Apache + PHP + MySQL).
2. Copy the `WEEK 4` folder into `C:\xampp\htdocs\week4\` (or your htdocs path).
3. Start **Apache** in the XAMPP Control Panel.
4. Open each file in your browser:

| File | URL |
|---|---|
| `fig1_server_side.php` | `http://localhost/week4/fig1_server_side.php` |
| `fig2_forms.php` | `http://localhost/week4/fig2_forms.php` |
| `fig3_auth.php` | `http://localhost/week4/fig3_auth.php` |
| `fig4_structure.php` | `http://localhost/week4/fig4_structure.php` |
| `fig5_modern_alternatives.html` | Open directly in browser |

---

## Evidence

### Fig 1: Server-Side Programming
**File:** `fig1_server_side.php`

**Code Snippet**
```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = htmlspecialchars(trim($_POST['username'] ?? ''));
}
?>

<p>Welcome, <?= $username ?>!</p>
<p>Server time: <?= date('H:i:s') ?></p>
<p>Request method: <?= $_SERVER['REQUEST_METHOD'] ?></p>
```

---

### Fig 2: HTML Forms & PHP Integration
**File:** `fig2_forms.php`

**Code Snippet**
```php
// Registration — POST
$name     = htmlspecialchars(trim($_POST['name']  ?? ''));
$email    = htmlspecialchars(trim($_POST['email'] ?? ''));
$password = trim($_POST['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $msg = 'Enter a valid email address.';
} elseif (strlen($password) < 6) {
    $msg = 'Password must be at least 6 characters.';
} else {
    $msg = "Welcome, $name.";
}

// Contact — GET (data visible in URL)
$subject = htmlspecialchars(trim($_GET['subject'] ?? ''));
$message = htmlspecialchars(trim($_GET['message'] ?? ''));
```

---

### Fig 3: Simple Authentication System
**File:** `fig3_auth.php`

**Code Snippet**
```php
session_start();

// Login — create session
$_SESSION['user']     = $username;
$_SESSION['role']     = $users[$username]['role'];
$_SESSION['login_at'] = date('H:i:s');
header('Location: fig3_auth.php');
exit;

// Logout — destroy session
session_destroy();
header('Location: fig3_auth.php');
exit;
```

---

### Fig 4: Backend Folder Organization
**File:** `fig4_structure.php`

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

**Reusable DB connection:**
```php
// includes/db.php
$conn = new mysqli('localhost', 'root', '', 'project_db');

// In any page:
require_once 'includes/db.php';
$result = $conn->query('SELECT * FROM students');
```

---

### Fig 5: Modern Backend Alternatives
**File:** `fig5_modern_alternatives.html` — open directly in browser

| PHP Concept | Modern Alternative |
|---|---|
| PHP Backend | Node.js |
| XAMPP | Express.js |
| MySQL | MongoDB |
| PHP Sessions | JWT Authentication |
| Shared Hosting | Cloud Deployment (Vercel, Railway, AWS) |

**PHP vs Node.js — same task, different syntax:**
```php
// PHP
$name = $_POST['username'];
echo "Welcome " . $name;
```
```js
// Node.js + Express
app.post('/welcome', (req, res) => {
    res.send(`Welcome ${req.body.username}`);
});
```

---

## Summary
Backend processing built in PHP: dynamic welcome page demonstrating the request-response cycle using `$_POST`, GET/POST form handling with `filter_var` validation, session-based login and logout using `session_start()` and `$_SESSION`, professional PHP folder structure with reusable `includes/`, and a side-by-side PHP vs Node.js comparison covering language, database, auth, and hosting.
