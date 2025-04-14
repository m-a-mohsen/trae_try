const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port to run the server on
const PORT = 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Set the content type based on the file extension
  let contentType = 'text/html';
  let filePath = '.' + req.url;
  
  // If the URL is '/', serve the index.html file
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the appropriate content type based on file extension
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If the file is not found, return 404
      if (err.code === 'ENOENT') {
        fs.readFile('./404.html', (err, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // For other errors, return 500
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // If no error, return the content
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});