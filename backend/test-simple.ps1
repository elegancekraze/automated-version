# Simple Twitter API Test Script
Write-Host "🧪 Testing Twitter API Endpoints" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$ServerUrl = "http://localhost:3001"

# Test Health Check
Write-Host "Testing Health Check..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$ServerUrl/api/scrape/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Health Check: SUCCESS" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Server may not be running. Please start it first:" -ForegroundColor Yellow
    Write-Host "   ./start-server.ps1" -ForegroundColor White
    exit 1
}

Write-Host ""

# Test Twitter Stats
Write-Host "Testing Twitter Stats..." -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "$ServerUrl/api/scrape/twitter/stats" -Method GET -TimeoutSec 10
    Write-Host "✅ Twitter Stats: SUCCESS" -ForegroundColor Green
    Write-Host "   Total Twitter Prompts: $($stats.data.summary.total_twitter_prompts)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Twitter Stats: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Ask user if they want to test scraping (uses API credits)
Write-Host "⚠️  The next tests will use your Firecrawl API credits" -ForegroundColor Yellow
$continue = Read-Host "Do you want to test Twitter scraping? (y/N)"

if ($continue -eq "y" -or $continue -eq "Y") {
    Write-Host ""
    
    # Test Twitter Search
    Write-Host "Testing Twitter Search..." -ForegroundColor Cyan
    try {
        $searchBody = @{
            query = "ChatGPT prompts"
            options = @{ waitFor = 2000 }
        } | ConvertTo-Json
        
        $search = Invoke-RestMethod -Uri "$ServerUrl/api/scrape/twitter/search" -Method POST -Body $searchBody -ContentType "application/json" -TimeoutSec 30
        Write-Host "✅ Twitter Search: SUCCESS" -ForegroundColor Green
        Write-Host "   Query: $($search.data.query)" -ForegroundColor Yellow
        Write-Host "   Tweets Found: $($search.data.tweets_found)" -ForegroundColor Yellow
        Write-Host "   Tweets Saved: $($search.data.tweets_saved)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Twitter Search: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
    
    # Test Auto Scraping
    Write-Host "Testing Auto Twitter Scraping (this may take a minute)..." -ForegroundColor Cyan
    try {
        $auto = Invoke-RestMethod -Uri "$ServerUrl/api/scrape/twitter/auto" -Method POST -ContentType "application/json" -TimeoutSec 60
        Write-Host "✅ Auto Twitter Scraping: SUCCESS" -ForegroundColor Green
        Write-Host "   Total Tweets Found: $($auto.data.total_tweets_found)" -ForegroundColor Yellow
        Write-Host "   Unique Tweets: $($auto.data.unique_tweets)" -ForegroundColor Yellow
        Write-Host "   Tweets Saved: $($auto.data.tweets_saved)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Auto Twitter Scraping: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Skipping scraping tests" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Twitter API Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available endpoints:" -ForegroundColor Cyan
Write-Host "- GET  $ServerUrl/api/scrape/health" -ForegroundColor White
Write-Host "- GET  $ServerUrl/api/scrape/twitter/stats" -ForegroundColor White  
Write-Host "- POST $ServerUrl/api/scrape/twitter/search" -ForegroundColor White
Write-Host "- POST $ServerUrl/api/scrape/twitter/auto" -ForegroundColor White