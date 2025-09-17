@echo off
echo Starting Twitter Scraping Backend Server...
echo ==========================================

REM Force navigate to the correct directory
cd /d "F:\ischatgptfree\automated-version\backend"

REM Show current directory for confirmation
echo Current directory: %cd%

REM Check if required files exist
if not exist "package.json" (
    echo ERROR: package.json not found in current directory
    echo Make sure you're in: F:\ischatgptfree\automated-version\backend
    pause
    exit /b 1
)

if not exist "server.js" (
    echo ERROR: server.js not found in current directory
    echo Make sure you're in: F:\ischatgptfree\automated-version\backend
    pause
    exit /b 1
)

REM Check if Firecrawl API key is set
findstr /C:"FIRECRAWL_API_KEY=fc-" .env >nul
if errorlevel 1 (
    echo WARNING: FIRECRAWL_API_KEY not found in .env file
    echo Please add your Firecrawl API key to the .env file
    echo Example: FIRECRAWL_API_KEY=your_api_key_here
    echo.
)

echo Starting server...
echo Server will be available at: http://localhost:3001
echo API endpoints will be at: http://localhost:3001/api/
echo.
echo Twitter Scraping Endpoints:
echo - POST /api/scrape/twitter/auto     (Recommended for automation)
echo - POST /api/scrape/twitter/search   (Search specific terms)
echo - GET  /api/scrape/twitter/stats    (View statistics)
echo.
echo Press Ctrl+C to stop the server
echo ==========================================

npm start