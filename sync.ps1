# sync.ps1 - Save this ONCE in D:\Projects\ShutterLockSolutions
# Run it any time after replacing files from a new zip:
#     .\sync.ps1
#
# It automatically re-adds the GitHub remote if a fresh zip wiped it out,
# merges safely (keeping your local files), and pushes.

$repoUrl = "https://github.com/balaji590/shutterlocksolutions.git"

$remoteExists = git remote -v | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "Remote origin missing, re-adding it..." -ForegroundColor Yellow
    git remote add origin $repoUrl
}

git fetch origin

git merge origin/main --allow-unrelated-histories -X ours -m "Sync: keep local site version" 2>$null

git add -A
$hasChanges = git status --porcelain
if ($hasChanges) {
    $msg = Read-Host "Commit message (press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Update site" }
    git commit -m "$msg"
} else {
    Write-Host "No local changes to commit." -ForegroundColor Cyan
}

git push -u origin main

Write-Host "Done. Check https://github.com/balaji590/shutterlocksolutions" -ForegroundColor Green