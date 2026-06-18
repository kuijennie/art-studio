<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fig 4: Backend Folder Organization</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
    h2 { color: #333; } h3 { color: #007bff; margin-top: 26px; }
    .tree { background: #1e1e1e; color: #d4d4d4; font-family: monospace; font-size: 13px;
            padding: 18px; border-radius: 6px; line-height: 1.8; white-space: pre; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 10px 14px; text-align: left; vertical-align: top; }
    th { background: #007bff; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-size: 13px; }
    .code { background: #1e1e1e; color: #d4d4d4; font-family: monospace; font-size: 13px;
            padding: 14px; border-radius: 6px; white-space: pre; overflow-x: auto; margin-top: 8px; }
  </style>
</head>
<body>

<h2>Fig 4: Backend Folder Organization</h2>

<div class="tree">project/
&boxur;
&boxv;&boxh;&boxh; index.php           &num; Home page
&boxv;&boxh;&boxh; login.php           &num; Login page
&boxv;&boxh;&boxh; dashboard.php       &num; Protected dashboard (requires login)
&boxur;
&boxv;&boxh;&boxh; includes/
&boxv;   &boxv;&boxh;&boxh; db.php          &num; Database connection
&boxv;   &boxv;&boxh;&boxh; auth.php        &num; Login / logout functions
&boxv;   &boxur;&boxh;&boxh; header.php      &num; Shared page header (nav, title)
&boxur;
&boxv;&boxh;&boxh; css/
&boxv;   &boxur;&boxh;&boxh; style.css
&boxur;
&boxv;&boxh;&boxh; js/
&boxv;   &boxur;&boxh;&boxh; main.js
&boxur;
&boxv;&boxh;&boxh; images/
&boxv;   &boxur;&boxh;&boxh; logo.png
&boxur;
&boxur;&boxh;&boxh; database/
    &boxur;&boxh;&boxh; schema.sql      &num; SQL to create all tables</div>


</body>
</html>
