# PowerShell helper: Initialize, commit, and push this repository to GitHub
# Usage: open VS Code integrated terminal in the project root and run:
#    ./scripts/push-to-github.ps1

param(
    [string]$RepoName = "JobPortal",
    [string]$GitHubUser = "natphiri",
    [switch]$Public = $true
)

function Write-Color($text, $color="White"){
    Write-Host $text -ForegroundColor $color
}

# Ensure we're in repository root
$root = Get-Location
Write-Color "Working directory: $root" Cyan

# Initialize git if needed
if (-not (Test-Path -Path .git)) {
    Write-Color "No .git found — initializing repository..." Yellow
    git init
} else {
    Write-Color ".git found — using existing repository" Green
}

# Stage all changes
Write-Color "Staging files..." Cyan
git add .

# Commit
$defaultMessage = "Update README with run steps and demo credentials"
$commitMessage = Read-Host "Commit message (enter for default):"
if ([string]::IsNullOrWhiteSpace($commitMessage)) { $commitMessage = $defaultMessage }

git commit -m "$commitMessage" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Color "No changes to commit or commit failed. Continuing..." Yellow
}

# Try to use gh to create remote and push
$hasGh = (Get-Command gh -ErrorAction SilentlyContinue) -ne $null
if ($hasGh) {
    Write-Color "GitHub CLI detected — attempting to create repo and push..." Cyan
    $visibility = if ($Public) { "--public" } else { "--private" }
    gh repo create $GitHubUser/$RepoName $visibility --source=. --remote=origin --push --confirm
    if ($LASTEXITCODE -eq 0) {
        Write-Color "Repo created and pushed via gh." Green
        exit 0
    } else {
        Write-Color "gh create failed or repo already exists. Will attempt to push to existing remote." Yellow
    }
}

# If gh not available, ask for remote URL
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($remote)) {
    $remoteUrl = Read-Host "Enter remote repository HTTPS URL (e.g. https://github.com/USERNAME/REPO.git)"
    if (-not [string]::IsNullOrWhiteSpace($remoteUrl)) {
        git remote add origin $remoteUrl
    } else {
        Write-Color "No remote provided. Exiting." Red
        exit 1
    }
} else {
    $remoteUrl = $remote
    Write-Color "Using existing remote: $remoteUrl" Green
}

# Ensure main branch name
git branch -M main

# Push
Write-Color "Pushing to $remoteUrl ..." Cyan
git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Color "Push successful." Green
} else {
    Write-Color "Push failed. If authentication failed, try signing in to GitHub in VS Code or use 'gh auth login'." Red
}
