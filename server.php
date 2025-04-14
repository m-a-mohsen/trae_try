<?php
// Set the port for the server
$port = 8000;

// Get the directory of this script
$dir = __DIR__;

// Command to start the PHP built-in server
$command = sprintf('php -S localhost:%d -t %s', $port, $dir);

echo "Starting server at http://localhost:$port/\n";
echo "Press Ctrl+C to stop the server\n";

// Start the server
system($command);
?>