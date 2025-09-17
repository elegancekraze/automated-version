# Twitter Scraping Backend Server Startup Script
# This script ensures we're always in the correct directory before starting

Write-Host "Starting Twitter Scraping Backend Server..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Force navigate to the correct directory
Set-Location "F:\ischatgptfree\automated-version\backend"

# Show current directory for confirmation
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

# Check if required files exist
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found in current directory" -ForegroundColor Red
    Write-Host "Make sure you're in: F:\ischatgptfree\automated-version\backend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "server.js")) {
    Write-Host "ERROR: server.js not found in current directory" -ForegroundColor Red
    Write-Host "Make sure you're in: F:\ischatgptfree\automated-version\backend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Firecrawl API key is set
$envContent = Get-Content ".env" -ErrorAction SilentlyContinue
if ($envContent -and ($envContent | Select-String "FIRECRAWL_API_KEY=fc-")) {
    Write-Host "✅ Firecrawl API key found in .env file" -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: FIRECRAWL_API_KEY not found in .env file" -ForegroundColor Yellow
    Write-Host "Please add your Firecrawl API key to the .env file" -ForegroundColor Yellow
    Write-Host "Example: FIRECRAWL_API_KEY=your_api_key_here" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Starting server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "API endpoints will be at: http://localhost:3001/api/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Twitter Scraping Endpoints:" -ForegroundColor Magenta
Write-Host "- POST /api/scrape/twitter/auto     (Recommended for automation)" -ForegroundColor White
Write-Host "- POST /api/scrape/twitter/search   (Search specific terms)" -ForegroundColor White
Write-Host "- GET  /api/scrape/twitter/stats    (View statistics)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Green

# Start the server
npm start