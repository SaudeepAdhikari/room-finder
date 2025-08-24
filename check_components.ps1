# Check and report on component quality and issues
# This script analyzes components for potential problems

# Display header
Write-Host "Room Finder - Component Quality Check" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
Write-Host ""

# Track results
$componentsWithIssues = @{}
$totalIssues = 0

# Function to check a JavaScript file for issues
function Check-ComponentFile {
    param (
        [string]$filePath
    )
    
    $issues = @()
    $content = Get-Content $filePath -Raw
    
    # Check for large components (heuristic: over 300 lines)
    $lineCount = ($content -split "`n").Length
    if ($lineCount -gt 300) {
        $issues += "Large component ($lineCount lines) - consider splitting"
        $totalIssues++
    }
    
    # Check for commented code (heuristic: commented lines over 20% of file)
    $commentedLines = (Select-String -Path $filePath -Pattern '^\s*(//|/\*|\*)' -AllMatches).Matches.Count
    $commentPercentage = [math]::Round(($commentedLines / $lineCount) * 100)
    if ($commentPercentage -gt 20) {
        $issues += "High comment percentage ($commentPercentage%) - may contain commented code to remove"
        $totalIssues++
    }
    
    # Check for console.log statements
    $consoleLogCount = (Select-String -Path $filePath -Pattern 'console\.log\(' -AllMatches).Matches.Count
    if ($consoleLogCount -gt 0) {
        $issues += "Contains $consoleLogCount console.log statements"
        $totalIssues++
    }
    
    # Check for TODO comments
    $todoCount = (Select-String -Path $filePath -Pattern '(TODO|FIXME|XXX):?' -AllMatches).Matches.Count
    if ($todoCount -gt 0) {
        $issues += "Contains $todoCount TODO/FIXME comments"
        $totalIssues++
    }
    
    # Check for unused imports (simple heuristic)
    $importMatches = Select-String -Path $filePath -Pattern 'import\s+(\{[^}]+\}|\w+)\s+from' -AllMatches
    if ($importMatches) {
        foreach ($match in $importMatches.Matches) {
            $importText = $match.Groups[1].Value
            
            # Extract imported items
            if ($importText.StartsWith('{')) {
                $imports = $importText.Trim('{}').Split(',') | ForEach-Object { $_.Trim() }
                foreach ($import in $imports) {
                    if (-not ($import -eq 'React' -or $import -eq 'Component') -and 
                        ($content -notmatch "\b$import\b(?!\s*:)")) {
                        $issues += "Potentially unused import: $import"
                        $totalIssues++
                    }
                }
            } else {
                $import = $importText
                # Crude check if the import is used in the file
                if ($import -ne 'React' -and $import -ne 'Component' -and $import -ne 'useState' -and 
                    ($content -notmatch "\b$import\b(?!\s*from)")) {
                    $issues += "Potentially unused import: $import"
                    $totalIssues++
                }
            }
        }
    }
    
    return $issues
}

# Get all JS/JSX files in the components and pages directories
$componentFiles = Get-ChildItem -Path "src\components", "src\pages", "src\admin" -Recurse -Include *.js, *.jsx -ErrorAction SilentlyContinue

Write-Host "Checking $($componentFiles.Count) component files..." -ForegroundColor Green

foreach ($file in $componentFiles) {
    $relativePath = $file.FullName.Replace((Get-Location), "").TrimStart("\")
    $issues = Check-ComponentFile -filePath $file.FullName
    
    if ($issues.Length -gt 0) {
        $componentsWithIssues[$relativePath] = $issues
        Write-Host "`n$relativePath" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor Gray
        }
    }
}

# Generate report file
$reportContent = @"
# Component Quality Report

Generated: $(Get-Date)

## Summary
- Components analyzed: $($componentFiles.Count)
- Components with issues: $($componentsWithIssues.Count)
- Total issues found: $totalIssues

## Components with Issues

"@

foreach ($component in $componentsWithIssues.GetEnumerator()) {
    $reportContent += @"
### $($component.Key)

"@
    foreach ($issue in $component.Value) {
        $reportContent += "- $issue`n"
    }
    $reportContent += "`n"
}

$reportContent | Out-File -FilePath "component_quality_report.md" -Encoding utf8

# Summary
Write-Host "`nComponent Quality Check Summary" -ForegroundColor Cyan
Write-Host "--------------------------" -ForegroundColor Cyan
Write-Host "Components analyzed: $($componentFiles.Count)" -ForegroundColor White
Write-Host "Components with issues: $($componentsWithIssues.Count)" -ForegroundColor White
Write-Host "Total issues found: $totalIssues" -ForegroundColor White
Write-Host "`nDetailed report saved to component_quality_report.md" -ForegroundColor Green
