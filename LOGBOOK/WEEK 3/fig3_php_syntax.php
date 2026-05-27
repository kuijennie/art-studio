<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fig 3: PHP Syntax Practice</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
        h2 { color: #333; }
        h3 { color: #007bff; margin-top: 28px; }
        .block { border-radius: 6px; overflow: hidden; margin-top: 10px; }
        .code-header  { background: #333;    color: #aaa;    font-size: 12px; font-weight: bold; padding: 6px 14px; }
        .code-body    { background: #1e1e1e; color: #d4d4d4; font-family: monospace; font-size: 13px; white-space: pre; padding: 14px; overflow-x: auto; }
        .output-header{ background: #dce9ff; color: #007bff; font-size: 12px; font-weight: bold; padding: 6px 14px; border-top: 1px solid #b3d1ff; }
        .output-body  { background: #f0f0f0; font-family: monospace; font-size: 13px; white-space: pre; padding: 12px 14px; overflow-x: auto; }
    </style>
</head>
<body>
<h2>Fig 3: PHP Syntax Practice</h2>

<!-- 1. Variables -->
<h3>1. Variables &amp; Data Types</h3>
<div class="block">
    <div class="code-header">Code</div>
    <div class="code-body">$name       = "Jane Murin";   // string
$age        = 20;              // integer
$gpa        = 3.75;            // float
$isEnrolled = true;            // boolean

echo "Name: $name\n";
echo "Age: $age\n";
echo "GPA: $gpa\n";
echo "Enrolled: " . ($isEnrolled ? "true" : "false") . "\n";
echo "Types: " . gettype($name) . ", " . gettype($age) . ", " . gettype($gpa) . ", " . gettype($isEnrolled);</div>
    <div class="output-header">Output</div>
    <div class="output-body"><?php
$name       = "Jane Murin";
$age        = 20;
$gpa        = 3.75;
$isEnrolled = true;
echo "Name: $name\n";
echo "Age: $age\n";
echo "GPA: $gpa\n";
echo "Enrolled: " . ($isEnrolled ? "true" : "false") . "\n";
echo "Types: " . gettype($name) . ", " . gettype($age) . ", " . gettype($gpa) . ", " . gettype($isEnrolled);
?></div>
</div>

<!-- 2. Conditionals -->
<h3>2. Conditional Statements</h3>
<div class="block">
    <div class="code-header">Code</div>
    <div class="code-body">$score = 72;

if ($score >= 70) {
    $grade = "A";
} elseif ($score >= 60) {
    $grade = "B";
} elseif ($score >= 50) {
    $grade = "C";
} else {
    $grade = "F";
}

echo "Score: $score\n";
echo "Grade: $grade\n";
echo "Type of \$grade: " . gettype($grade);</div>
    <div class="output-header">Output</div>
    <div class="output-body"><?php
$score = 72;
if      ($score >= 70) $grade = "A";
elseif  ($score >= 60) $grade = "B";
elseif  ($score >= 50) $grade = "C";
else                   $grade = "F";
echo "Score: $score\n";
echo "Grade: $grade\n";
echo "Type of \$grade: " . gettype($grade);
?></div>
</div>

<!-- 3. Loops -->
<h3>3. Loops</h3>
<div class="block">
    <div class="code-header">Code</div>
    <div class="code-body">// for loop
for ($i = 1; $i <= 5; $i++) {
    echo "$i ";
}

// while loop
$n = 10;
while ($n >= 8) {
    echo "$n ";
    $n--;
}

echo "\nType of \$i: " . gettype($i);</div>
    <div class="output-header">Output</div>
    <div class="output-body"><?php
echo "for loop:   ";
for ($i = 1; $i <= 5; $i++) { echo "$i "; }
echo "\nwhile loop: ";
$n = 10;
while ($n >= 8) { echo "$n "; $n--; }
echo "\nType of \$i: " . gettype($i);
?></div>
</div>

<!-- 4. Arrays -->
<h3>4. Arrays</h3>
<div class="block">
    <div class="code-header">Code</div>
    <div class="code-body">// Indexed array
$courses = ["Web Dev", "Database", "OOP", "Networking"];
foreach ($courses as $i => $c) {
    echo "[$i] $c\n";
}

// Associative array
$student = ["name" => "Jane", "reg_no" => "ADV/001/2024", "year" => 2];
foreach ($student as $key => $val) {
    echo "$key: $val  (" . gettype($val) . ")\n";
}</div>
    <div class="output-header">Output</div>
    <div class="output-body"><?php
$courses = ["Web Dev", "Database", "OOP", "Networking"];
foreach ($courses as $i => $c) { echo "[$i] $c\n"; }
echo "\n";
$student = ["name" => "Jane", "reg_no" => "ADV/001/2024", "year" => 2];
foreach ($student as $key => $val) { echo "$key: $val  (" . gettype($val) . ")\n"; }
?></div>
</div>

<!-- 5. Functions -->
<h3>5. Functions</h3>
<div class="block">
    <div class="code-header">Code</div>
    <div class="code-body">function greet($name) {
    return "Hello, $name! Welcome to Advanced Web.";
}

function calculateAverage(array $marks) {
    return array_sum($marks) / count($marks);
}

$marks = [85, 90, 78, 92, 88];
echo greet("Jane") . "\n";
echo "Average: " . calculateAverage($marks) . "\n";
echo "Return type: " . gettype(calculateAverage($marks));</div>
    <div class="output-header">Output</div>
    <div class="output-body"><?php
function greet($name) { return "Hello, $name! Welcome to Advanced Web."; }
function calculateAverage(array $marks) { return array_sum($marks) / count($marks); }
$marks = [85, 90, 78, 92, 88];
echo greet("Jane") . "\n";
echo "Average: " . calculateAverage($marks) . "\n";
echo "Return type: " . gettype(calculateAverage($marks));
?></div>
</div>

<!-- 6. String Functions -->
<h3>6. String Functions</h3>
<div class="block">
    <div class="code-header">Code</div>
    <div class="code-body">$str = "  Advanced Web Development  ";

echo trim($str)             . "\n";   // string
echo strtoupper(trim($str)) . "\n";   // string
echo strlen(trim($str))     . "\n";   // integer
echo str_contains($str, "Web") ? "true" : "false";  // boolean</div>
    <div class="output-header">Output</div>
    <div class="output-body"><?php
$str = "  Advanced Web Development  ";
echo trim($str) . "  → " . gettype(trim($str)) . "\n";
echo strtoupper(trim($str)) . "  → " . gettype(strtoupper($str)) . "\n";
echo strlen(trim($str)) . "  → " . gettype(strlen($str)) . "\n";
echo (str_contains($str, "Web") ? "true" : "false") . "  → " . gettype(str_contains($str, "Web"));
?></div>
</div>

</body>
</html>
