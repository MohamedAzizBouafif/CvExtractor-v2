# Project Cleanup Script

Write-Host "Starting cleanup of CvExtractor-v2 project..." -ForegroundColor Green

# 1. Remove node_modules (this is the largest part of the project)
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules folder (this may take a while)..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "node_modules folder removed." -ForegroundColor Green
}

# 2. Clean any cache folders
$cacheFolders = @(
    ".cache",
    "dist",
    "build",
    ".next",
    "coverage",
    ".nyc_output"
)

foreach ($folder in $cacheFolders) {
    if (Test-Path $folder) {
        Write-Host "Removing $folder directory..." -ForegroundColor Yellow
        Remove-Item -Path $folder -Recurse -Force
        Write-Host "$folder removed." -ForegroundColor Green
    }
}

# 3. Remove development files that aren't needed for production
$devFiles = @(
    "*.log",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*"
)

foreach ($pattern in $devFiles) {
    Get-ChildItem -Recurse -Filter $pattern | ForEach-Object {
        Write-Host "Removing $($_.FullName)..." -ForegroundColor Yellow
        Remove-Item $_.FullName -Force
    }
}

Write-Host "Cleanup completed! The project size has been reduced." -ForegroundColor Green
Write-Host ""
Write-Host "To reinstall dependencies when needed, run: npm install" -ForegroundColor Cyan
Write-Host "To install only production dependencies, run: npm install --production" -ForegroundColor Cyan
