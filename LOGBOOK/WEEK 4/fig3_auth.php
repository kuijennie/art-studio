<?php
session_start();

$error = '';

// Demo users
$users = [
    'admin' => 'admin123',
    'jane'  => 'jane2024',
    'john'  => 'john2024',
];

// Login
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$username || !$password) {
        $error = 'Please enter your username and password.';
    } elseif (!isset($users[$username])) {
        $error = 'Username not found.';
    } elseif ($users[$username] !== $password) {
        $error = 'Incorrect password.';
    } else {
        $_SESSION['username'] = $username;
        header('Location: fig3_auth.php');
        exit;
    }
}

// Logout
if (isset($_POST['action']) && $_POST['action'] === 'logout') {
    session_destroy();
    header('Location: fig3_auth.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fig 3: Authentication</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 420px; margin: 80px auto; padding: 0 20px; }
    h2 { color: #333; }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input { width: 100%; padding: 8px; margin-top: 5px; box-sizing: border-box;
            border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { margin-top: 16px; padding: 10px 24px; color: white; border: none;
             border-radius: 4px; cursor: pointer; font-size: 14px; }
    .btn-blue { background: #007bff; } .btn-blue:hover { background: #0056b3; }
    .btn-red  { background: #dc3545; } .btn-red:hover  { background: #a71d2a; }
    .error   { padding: 10px 14px; background: #ffebee; color: #c62828;
               border-left: 4px solid #c62828; border-radius: 4px; margin-top: 14px; font-weight: bold; }
    .welcome { padding: 20px; background: #e8f5e9; border-left: 4px solid #2e7d32;
               border-radius: 4px; color: #1b5e20; }
    .hint    { font-size: 12px; color: #888; margin-top: 8px; }
  </style>
</head>
<body>

<h2>Fig 3: Authentication</h2>

<?php if (isset($_SESSION['username'])): ?>

  <!-- Welcome Page (shown after login) -->
  <div class="welcome">
    <h3>Welcome, <?= htmlspecialchars($_SESSION['username']) ?>!</h3>
    <p>You are logged in. Your session is active.</p>
  </div>

  <form method="POST" action="fig3_auth.php" style="margin-top: 20px;">
    <input type="hidden" name="action" value="logout">
    <button type="submit" class="btn-red">Logout</button>
  </form>

<?php else: ?>

  <!-- Login Page -->
  <p class="hint">Demo accounts: admin / admin123 &nbsp;|&nbsp; jane / jane2024 &nbsp;|&nbsp; john / john2024</p>

  <?php if ($error): ?>
    <div class="error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>

  <form method="POST" action="fig3_auth.php">
    <input type="hidden" name="action" value="login">
    <label>Username</label>
    <input type="text" name="username" placeholder="Enter username" autofocus>
    <label>Password</label>
    <input type="password" name="password" placeholder="Enter password">
    <button type="submit" class="btn-blue">Login</button>
  </form>

<?php endif; ?>

</body>
</html>
