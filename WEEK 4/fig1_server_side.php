<?php
$name = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(trim($_POST['username'] ?? ''));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fig 1: Server-Side Programming</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 480px; margin: 60px auto; padding: 0 20px; }
    h2 { color: #333; }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input { width: 100%; padding: 8px; margin-top: 6px; box-sizing: border-box;
            border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { margin-top: 14px; padding: 10px 24px; background: #007bff;
             color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
    button:hover { background: #0056b3; }
    .welcome { margin-top: 20px; padding: 14px 18px; background: #e8f5e9;
               border-left: 4px solid #2e7d32; color: #1b5e20; border-radius: 4px; font-size: 16px; }
  </style>
</head>
<body>

<h2>Fig 1: Server-Side Programming</h2>

<form method="POST" action="fig1_server_side.php">
  <label for="username">Enter your name:</label>
  <input type="text" id="username" name="username" placeholder="e.g. Jane" required>
  <button type="submit">Submit</button>
</form>

<?php if ($name): ?>
  <div class="welcome">
    Welcome <?= $name ?>
  </div>
<?php endif; ?>

</body>
</html>
