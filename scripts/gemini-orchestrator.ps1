<#
.SYNOPSIS
    Gemini CLI Meta-Orchestrator - Spawns parallel Gemini agents in YOLO mode

.DESCRIPTION
    This script orchestrates multiple Gemini CLI instances running in parallel,
    each in its own git worktree. Designed for the VibeCode autonomous development system.

.PARAMETER TaskDir
    Directory containing TASK-*.md files to execute

.PARAMETER ProjectDir
    Root project directory (for worktree creation)

.PARAMETER MaxParallel
    Maximum concurrent agents (default: auto-detect based on CPU)

.PARAMETER ApprovalMode
    Approval mode: "yolo" (full auto) or "auto_edit" (auto file edits only)

.EXAMPLE
    .\gemini-orchestrator.ps1 -TaskDir "docs/tasks/worktrees" -ProjectDir "."
#>

param(
    [string]$TaskDir = "docs/tasks/worktrees",
    [string]$ProjectDir = (Get-Location).Path,
    [int]$MaxParallel = 0,  # 0 = auto-detect
    [ValidateSet("yolo", "auto_edit")]
    [string]$ApprovalMode = "yolo"
)

# ============================================================================
# CONFIGURATION
# ============================================================================

# Use Continue to avoid stopping on git's stderr output (which is informational)
$ErrorActionPreference = "Continue"
$Script:AgentJobs = @{}
$Script:CompletedTasks = @()
$Script:FailedTasks = @()

# Auto-detect parallelism based on CPU cores (max 4 for safety)
if ($MaxParallel -eq 0) {
    $MaxParallel = [Math]::Min(4, (Get-CimInstance Win32_Processor).NumberOfLogicalProcessors)
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Banner {
    param([string]$Text)
    $line = "=" * 60
    Write-Host "`n$line" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "$line`n" -ForegroundColor Cyan
}

function Write-Status {
    param([string]$Status, [string]$Color = "Yellow")
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Status" -ForegroundColor $Color
}

function Get-TaskFiles {
    param([string]$Dir)
    
    $fullPath = Join-Path $ProjectDir $Dir
    if (-not (Test-Path $fullPath)) {
        Write-Status "Task directory not found: $fullPath" "Red"
        return @()
    }
    
    return Get-ChildItem -Path $fullPath -Filter "TASK-*.md" | Sort-Object Name
}

function Get-FeatureName {
    param([string]$TaskFile)
    # Extract feature name from TASK-feature-name.md
    $name = [System.IO.Path]::GetFileNameWithoutExtension($TaskFile)
    return $name -replace "^TASK-", ""
}

function New-Worktree {
    param([string]$FeatureName)
    
    $branchName = "feat-$FeatureName"
    $worktreePath = Join-Path (Split-Path $ProjectDir -Parent) "$((Split-Path $ProjectDir -Leaf))-$branchName"
    
    # Check if worktree already exists
    if (Test-Path $worktreePath) {
        Write-Status "Worktree already exists: $worktreePath" "Yellow"
        return $worktreePath
    }
    
    # Create branch if it doesn't exist
    $existingBranch = git -C $ProjectDir branch --list $branchName 2>$null
    if (-not $existingBranch) {
        Write-Status "Creating branch: $branchName" "Green"
        git -C $ProjectDir branch $branchName 2>$null
    }
    
    # Create worktree
    Write-Status "Creating worktree: $worktreePath" "Green"
    git -C $ProjectDir worktree add $worktreePath $branchName 2>$null
    
    # Copy .env if exists
    $envFile = Join-Path $ProjectDir ".env"
    if (Test-Path $envFile) {
        Copy-Item $envFile (Join-Path $worktreePath ".env")
    }
    
    return $worktreePath
}

function Remove-Worktree {
    param([string]$WorktreePath, [string]$FeatureName)
    
    $branchName = "feat-$FeatureName"
    
    if (Test-Path $WorktreePath) {
        Write-Status "Removing worktree: $WorktreePath" "Yellow"
        git -C $ProjectDir worktree remove $WorktreePath --force 2>$null
    }
}

function Start-GeminiAgent {
    param(
        [string]$TaskFile,
        [string]$WorktreePath,
        [string]$FeatureName
    )
    
    $taskRelativePath = Join-Path $TaskDir "TASK-$FeatureName.md"
    $prompt = @"
You are a VibeCode Builder agent. Your task is to implement the feature described in: $taskRelativePath

CRITICAL INSTRUCTIONS:
1. Read the entire task file first
2. Follow the implementation plan exactly
3. Create all files specified
4. Test your changes compile/build
5. Commit your changes when done with message: "feat($FeatureName): implement feature per task prompt"
6. DO NOT modify files outside the scope defined in the task

START NOW.
"@
    
    # Spawn in new Windows Terminal tab
    $geminiCmd = "gemini --approval-mode $ApprovalMode --include-directories `"$ProjectDir`" `"$prompt`""
    
    # Use wt (Windows Terminal) to open new tab
    $wtCmd = "wt -w 0 new-tab --title `"Agent: $FeatureName`" -d `"$WorktreePath`" powershell -NoExit -Command `"$geminiCmd`""
    
    Write-Status "Spawning agent for: $FeatureName" "Green"
    Start-Process -FilePath "wt" -ArgumentList "-w", "0", "new-tab", "--title", "Agent: $FeatureName", "-d", $WorktreePath, "powershell", "-NoExit", "-Command", $geminiCmd
    
    return @{
        FeatureName = $FeatureName
        WorktreePath = $WorktreePath
        StartTime = Get-Date
    }
}

function Merge-Feature {
    param([string]$FeatureName)
    
    $branchName = "feat-$FeatureName"
    
    Write-Status "Merging $branchName to main..." "Cyan"
    
    try {
        git -C $ProjectDir merge $branchName --no-edit 2>$null
        Write-Status "Merged $branchName successfully" "Green"
        return $true
    }
    catch {
        Write-Status "Merge conflict in $branchName - manual resolution required" "Red"
        return $false
    }
}

# ============================================================================
# MAIN ORCHESTRATION
# ============================================================================

function Start-Orchestration {
    Write-Banner "GEMINI CLI META-ORCHESTRATOR"
    Write-Host "Mode: $ApprovalMode | Max Parallel: $MaxParallel"
    Write-Host "Project: $ProjectDir"
    Write-Host "Task Dir: $TaskDir`n"
    
    # Get all task files
    $tasks = Get-TaskFiles -Dir $TaskDir
    
    if ($tasks.Count -eq 0) {
        Write-Status "No tasks found in $TaskDir" "Red"
        return
    }
    
    Write-Status "Found $($tasks.Count) tasks to execute" "Green"
    $tasks | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    
    # Spawn agents for each task
    $activeAgents = @()
    
    foreach ($task in $tasks) {
        $featureName = Get-FeatureName -TaskFile $task.Name
        
        # Create worktree
        $worktreePath = New-Worktree -FeatureName $featureName
        
        # Spawn agent
        $agent = Start-GeminiAgent -TaskFile $task.FullName -WorktreePath $worktreePath -FeatureName $featureName
        $activeAgents += $agent
        
        # Respect parallel limit
        if ($activeAgents.Count -ge $MaxParallel) {
            Write-Status "Parallel limit reached. Waiting before spawning more..." "Yellow"
            Start-Sleep -Seconds 5
        }
    }
    
    Write-Banner "ALL AGENTS SPAWNED"
    Write-Host "Active agents: $($activeAgents.Count)"
    Write-Host ""
    Write-Host "Each agent is running in its own Windows Terminal tab."
    Write-Host "Monitor their progress visually."
    Write-Host ""
    Write-Host "When all agents complete, run:" -ForegroundColor Yellow
    Write-Host "  .\gemini-orchestrator.ps1 -Merge" -ForegroundColor Cyan
    Write-Host ""
    
    # Output summary
    $summary = @{
        StartTime = Get-Date
        Agents = $activeAgents
        TaskCount = $tasks.Count
    }
    
    $summary | ConvertTo-Json -Depth 3 | Out-File (Join-Path $ProjectDir "orchestrator-session.json")
    Write-Status "Session saved to orchestrator-session.json" "Green"
}

# ============================================================================
# ENTRY POINT
# ============================================================================

Start-Orchestration
