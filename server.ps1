# PowerShell Simple HTTP Server
# Set the port for the server
$port = 8000

# Get the directory of this script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    # Start the listener
    $listener.Start()
    
    Write-Host "Starting server at http://localhost:$port/"
    Write-Host "Press Ctrl+C to stop the server"
    
    while ($listener.IsListening) {
        # Wait for a request
        $context = $listener.GetContext()
        
        # Get request and response objects
        $request = $context.Request
        $response = $context.Response
        
        # Get the requested URL
        $requestUrl = $request.Url.LocalPath
        $requestUrl = $requestUrl.TrimStart('/')
        
        # If no specific file is requested, serve index.html
        if ($requestUrl -eq "") {
            $requestUrl = "index.html"
        }
        
        # Build the file path
        $filePath = Join-Path -Path $scriptPath -ChildPath $requestUrl
        
        # Check if the file exists
        if (Test-Path $filePath -PathType Leaf) {
            # Determine content type based on file extension
            $contentType = "text/plain"
            switch ([System.IO.Path]::GetExtension($filePath)) {
                ".html" { $contentType = "text/html" }
                ".css"  { $contentType = "text/css" }
                ".js"   { $contentType = "application/javascript" }
                ".json" { $contentType = "application/json" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".gif"  { $contentType = "image/gif" }
                ".svg"  { $contentType = "image/svg+xml" }
            }
            
            # Read the file content
            $fileContent = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set response headers
            $response.ContentType = $contentType
            $response.ContentLength64 = $fileContent.Length
            $response.StatusCode = 200
            
            # Write the file content to the response output stream
            $output = $response.OutputStream
            $output.Write($fileContent, 0, $fileContent.Length)
            $output.Close()
        } else {
            # File not found - return 404
            $response.StatusCode = 404
            $response.Close()
        }
    }
} catch {
    Write-Host "Error: $_"
} finally {
    # Stop the listener
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "Server stopped."
}