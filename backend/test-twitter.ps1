# Quick Twitter Scraping Test Script
# This script tests all the Twitter API endpoints after starting the server

param(
    [switch]$SkipScraping,
    [string]$ServerUrl = "http://localhost:3001"
)

Write-Host "🧪 Twitter API Test Suite" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Function to make HTTP requests
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [string]$Description
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Cyan
    Write-Host "  $Method $Url" -ForegroundColor Gray
    
    try {
        $headers = @{ "Content-Type" = "application/json" }
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -TimeoutSec 30
        } else {
            $jsonBody = $Body | ConvertTo-Json -Depth 3
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $jsonBody -Headers $headers -TimeoutSec 30
        }
        
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        if ($response.data) {
            Write-Host "  📊 Data: $($response.data | ConvertTo-Json -Depth 1 -Compress)" -ForegroundColor Yellow
        }
        return $true
    } catch {
        Write-Host "  ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test if server is running
Write-Host "🏥 Checking if server is running..." -ForegroundColor Yellow
$healthTest = Test-Endpoint -Method "GET" -Url "$ServerUrl/api/scrape/health" -Description "Health Check"

if (-not $healthTest) {
    Write-Host ""
    Write-Host "❌ Server is not running!" -ForegroundColor Red
    Write-Host "Please start the server first using one of these methods:" -ForegroundColor Yellow
    Write-Host "  1. Double-click: start-server.bat" -ForegroundColor White
    Write-Host "  2. Run in PowerShell: ./start-server.ps1" -ForegroundColor White
    Write-Host "  3. Manual: cd F:\ischatgptfree\automated-version\backend; npm start" -ForegroundColor White
    exit 1
}

Write-Host ""

# Test stats endpoint
$statsTest = Test-Endpoint -Method "GET" -Url "$ServerUrl/api/scrape/twitter/stats" -Description "Twitter Statistics"

Write-Host ""

if (-not $SkipScraping) {
    Write-Host "⚠️  The following tests will use your Firecrawl API credits" -ForegroundColor Yellow
    Write-Host "   Press Ctrl+C to cancel, or wait 5 seconds to continue..." -ForegroundColor Yellow
    
    for ($i = 5; $i -gt 0; $i--) {
        Write-Host "   Starting in $i seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds 1
    }
    
    Write-Host ""
    
    # Test Twitter search
    $searchBody = @{
        query = "ChatGPT prompts"
        options = @{ waitFor = 2000 }
    }
    $searchTest = Test-Endpoint -Method "POST" -Url "$ServerUrl/api/scrape/twitter/search" -Body $searchBody -Description "Twitter Search"
    
    Write-Host ""
    
    # Test Twitter hashtags
    $hashtagBody = @{
        hashtags = @("ChatGPT", "PromptEngineering")
        options = @{ waitFor = 2000 }
    }
    $hashtagTest = Test-Endpoint -Method "POST" -Url "$ServerUrl/api/scrape/twitter/hashtags" -Body $hashtagBody -Description "Twitter Hashtags"
    
    Write-Host ""
} else {
    Write-Host "⏭️  Skipping scraping tests (use without -SkipScraping to include them)" -ForegroundColor Yellow
    $searchTest = $true
    $hashtagTest = $true
}

# Summary
Write-Host "🏁 Test Results Summary:" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "Health Check: $(if ($healthTest) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($healthTest) { 'Green' } else { 'Red' })
Write-Host "Stats Endpoint: $(if ($statsTest) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($statsTest) { 'Green' } else { 'Red' })

if (-not $SkipScraping) {
    Write-Host "Twitter Search: $(if ($searchTest) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($searchTest) { 'Green' } else { 'Red' })
    Write-Host "Twitter Hashtags: $(if ($hashtagTest) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($hashtagTest) { 'Green' } else { 'Red' })
}

$passedTests = @($healthTest, $statsTest, $searchTest, $hashtagTest) | Where-Object { $_ -eq $true }
$totalTests = if ($SkipScraping) { 2 } else { 4 }

Write-Host ""
Write-Host "📊 Overall: $($passedTests.Count)/$totalTests tests passed" -ForegroundColor $(if ($passedTests.Count -eq $totalTests) { 'Green' } else { 'Yellow' })

if ($passedTests.Count -eq $totalTests) {
    Write-Host ""
    Write-Host "🎉 All tests passed! Your Twitter scraping API is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Ready to use endpoints:" -ForegroundColor Cyan
    Write-Host "  POST $ServerUrl/api/scrape/twitter/auto     (Auto scrape popular content)" -ForegroundColor White
    Write-Host "  POST $ServerUrl/api/scrape/twitter/search   (Search specific terms)" -ForegroundColor White
    Write-Host "  POST $ServerUrl/api/scrape/twitter/hashtags (Scrape hashtags)" -ForegroundColor White
    Write-Host "  GET  $ServerUrl/api/scrape/twitter/stats    (View statistics)" -ForegroundColor White
}