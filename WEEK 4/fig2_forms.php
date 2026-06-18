<?php
$msg      = '';
$msg_type = '';

// Registration
if (isset($_POST['action']) && $_POST['action'] === 'register') {
    $name     = htmlspecialchars(trim($_POST['name']     ?? ''));
    $email    = htmlspecialchars(trim($_POST['email']    ?? ''));
    $password = trim($_POST['password'] ?? '');

    if (!$name || !$email || !$password) {
        $msg = 'Please fill in all fields.';
        $msg_type = 'error';
    } else {
        $msg = "Registration successful! Welcome, $name.";
        $msg_type = 'success';
    }
}

// Login
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === 'admin' && $password === 'admin123') {
        $msg = "Login successful! Welcome back, $username.";
        $msg_type = 'success';
    } else {
        $msg = 'Invalid username or password.';
        $msg_type = 'error';
    }
}

// Contact
if (isset($_POST['action']) && $_POST['action'] === 'contact') {
    $name    = htmlspecialchars(trim($_POST['contact_name'] ?? ''));
    $subject = htmlspecialchars(trim($_POST['subject']      ?? ''));
    $message = htmlspecialchars(trim($_POST['message']      ?? ''));

    if (!$name || !$subject || !$message) {
        $msg = 'Please fill in all fields.';
        $msg_type = 'error';
    } else {
        $msg = "Message sent! Thank you, $name.";
        $msg_type = 'success';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fig 2: HTML Forms & PHP</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
    h2 { color: #333; }
    h3 { color: #007bff; margin-top: 36px; border-bottom: 2px solid #007bff; padding-bottom: 6px; }
    label { display: block; margin-top: 10px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; margin-top: 5px; box-sizing: border-box;
                      border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    textarea { resize: vertical; }
    button { margin-top: 14px; padding: 10px 24px; color: white; border: none;
             border-radius: 4px; cursor: pointer; font-size: 14px; }
    .btn-blue  { background: #007bff; } .btn-blue:hover  { background: #0056b3; }
    .btn-green { background: #28a745; } .btn-green:hover { background: #1e7e34; }
    .btn-gray  { background: #6c757d; } .btn-gray:hover  { background: #545b62; }
    .msg { padding: 10px 14px; border-radius: 4px; margin: 16px 0; font-weight: bold; }
    .success { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #2e7d32; }
    .error   { background: #ffebee; color: #c62828; border-left: 4px solid #c62828; }
    .hint    { font-size: 12px; color: #888; margin-top: 4px; }
  </style>
</head>
<body>

<h2>Fig 2: HTML Forms &amp; PHP</h2>

<?php if ($msg): ?>
  <div class="msg <?= $msg_type ?>"><?= $msg ?></div>
<?php endif; ?>

<!-- Registration Form -->
<h3>Registration Form</h3>
<form method="POST" action="fig2_forms.php">
  <input type="hidden" name="action" value="register">
  <label>Full Name</label>
  <input type="text" name="name" placeholder="e.g. Jane Murin">
  <label>Email</label>
  <input type="email" name="email" placeholder="e.g. jane@example.com">
  <label>Password</label>
  <input type="password" name="password" placeholder="Enter password">
  <button type="submit" class="btn-blue">Register</button>
</form>

<!-- Login Form -->
<h3>Login Form</h3>
<p class="hint">Demo: username <strong>admin</strong> / password <strong>admin123</strong></p>
<form method="POST" action="fig2_forms.php">
  <input type="hidden" name="action" value="login">
  <label>Username</label>
  <input type="text" name="username" placeholder="Enter username">
  <label>Password</label>
  <input type="password" name="password" placeholder="Enter password">
  <button type="submit" class="btn-green">Login</button>
</form>

<!-- Contact Form -->
<h3>Contact Form</h3>
<form method="POST" action="fig2_forms.php">
  <input type="hidden" name="action" value="contact">
  <label>Your Name</label>
  <input type="text" name="contact_name" placeholder="e.g. Jane">
  <label>Subject</label>
  <input type="text" name="subject" placeholder="e.g. Enrollment inquiry">
  <label>Message</label>
  <textarea name="message" rows="4" placeholder="Write your message here..."></textarea>
  <button type="submit" class="btn-gray">Send Message</button>
</form>

</body>
</html>
