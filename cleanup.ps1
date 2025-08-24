# Clean up unnecessary files
# This script removes test files, backup files, and other artifacts

# Display header
Write-Host "Room Finder - Cleanup Script" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan
Write-Host ""

# Define files to be removed
$filesToRemove = @(
    # Backup files
    "src\components\AdvancedSearchFilter.js.new",
    
    # Test files
    "backend\test-admin-api.js",
    "backend\test-admin-auth.js",
    "backend\test-cloudinary.js",
    "backend\test-connection.js",
    "test-api-server.js",
    "src\EnvTest.js",
    
    # Debug batch files (can be consolidated to package.json scripts)
    "fix_search_dropdowns.bat",
    "fix_search_layout_complete.bat",
    "fix_search_ui.bat",
    "restart_admin.bat",
    "restart_debug.bat",
    "restart_debug_server.bat"
)

# Define directories to remove or archive
$dirsToProcess = @(
    "_backup"
)

# Function to safely remove a file
function Remove-FileIfExists {
    param (
        [string]$filePath
    )
    
    $fullPath = Join-Path $PSScriptRoot $filePath
    
    if (Test-Path $fullPath) {
        Write-Host "Removing $filePath" -ForegroundColor Yellow
        Remove-Item $fullPath -Force
        return $true
    } else {
        Write-Host "File not found: $filePath" -ForegroundColor Gray
        return $false
    }
}

# Remove files
Write-Host "Removing unnecessary files..." -ForegroundColor Green
$removedCount = 0

foreach ($file in $filesToRemove) {
    if (Remove-FileIfExists -filePath $file) {
        $removedCount++
    }
}

# Process directories
Write-Host "`nProcessing directories..." -ForegroundColor Green

foreach ($dir in $dirsToProcess) {
    $fullPath = Join-Path $PSScriptRoot $dir
    
    if (Test-Path $fullPath) {
        # Create an archive folder if it doesn't exist
        $archiveDir = Join-Path $PSScriptRoot "archived"
        if (-not (Test-Path $archiveDir)) {
            New-Item -Path $archiveDir -ItemType Directory | Out-Null
        }
        
        # Move to archive instead of deleting
        $archivePath = Join-Path $archiveDir $dir
        Write-Host "Archiving $dir to archived/$dir" -ForegroundColor Yellow
        
        # Create destination if it doesn't exist
        if (-not (Test-Path $archivePath)) {
            New-Item -Path $archivePath -ItemType Directory | Out-Null
        }
        
        # Move content
        Get-ChildItem -Path $fullPath -Recurse | Move-Item -Destination $archivePath -Force
        
        # Remove the original directory
        Remove-Item -Path $fullPath -Recurse -Force
    } else {
        Write-Host "Directory not found: $dir" -ForegroundColor Gray
    }
}

# Summary
Write-Host "`nCleanup Summary" -ForegroundColor Cyan
Write-Host "-------------" -ForegroundColor Cyan
Write-Host "Files removed: $removedCount" -ForegroundColor White
Write-Host "Directories archived: $($dirsToProcess.Count)" -ForegroundColor White
Write-Host "`nCleanup completed successfully!" -ForegroundColor Green
