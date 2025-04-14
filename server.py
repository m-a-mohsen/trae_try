import http.server
import socketserver
import os

# Set the port for the server
PORT = 8000

# Change to the directory containing the HTML file
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create a simple HTTP server
Handler = http.server.SimpleHTTPRequestHandler

print(f"Starting server at http://localhost:{PORT}/")
print("Press Ctrl+C to stop the server")

# Start the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")