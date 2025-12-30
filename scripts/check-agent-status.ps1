<#
.SYNOPSIS
    Check status of spawned Gemini agents

.DESCRIPTION
    Polls the .agent-logs directory for agent status files and displays their state.

.PARAMETER Watch
    If specified, continuously poll and display status updates

.PARAMETER WaitForCompletion
    If specified, block until all agents complete

.EXAMPLE
    .\check-agent-status.ps1
    .\check-agent-status.ps1 -Watch
    .\check-agent-status.ps1 -WaitForCompletion
#>

param(
    [switch]$Watch,
    [switch]$WaitForCompletion,
    [int]$PollInterval = 3
)

$logsDir = Join-Path (Get-Location).Path ".agent-logs"

function Get-AgentStatuses {
    if (-not (Test-Path $logsDir)) {
        return @()
    }
    
    $statusFiles = Get-ChildItem -Path $logsDir -Filter "*-status.json" -ErrorAction SilentlyContinue
    
    $statuses = @()
    foreach ($file in $statusFiles) {
        try {
            $status = Get-Content $file.FullName -Raw | ConvertFrom-Json
            $status | Add-Member -NotePropertyName "file" -NotePropertyValue $file.Name -Force
            $statuses += $status
        }
        catch {
            $statuses += @{ agent = $file.BaseName; status = "error"; error = $_.Exception.Message }
        }
    }
    
    return $statuses
}

function Show-AgentStatuses {
    param($Statuses)
    
    Clear-Host
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host " GEMINI AGENT STATUS MONITOR" -ForegroundColor Cyan
    Write-Host " $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($Statuses.Count -eq 0) {
        Write-Host "No agents found. Spawn agents first with spawn-gemini-agent.ps1" -ForegroundColor Yellow
        return
    }
    
    foreach ($status in $Statuses) {
        $color = switch ($status.status) {
            "running" { "Yellow" }
            "complete" { "Green" }
            "error" { "Red" }
            default { "Gray" }
        }
        
        $icon = switch ($status.status) {
            "running" { "[...]" }
            "complete" { "[OK]" }
            "error" { "[ERR]" }
            default { "[?]" }
        }
        
        Write-Host "  $icon $($status.agent) - $($status.status)" -ForegroundColor $color
        
        if ($status.started) {
            Write-Host "       Started: $($status.started)" -ForegroundColor Gray
        }
        if ($status.completed) {
            Write-Host "       Completed: $($status.completed)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    
    $running = @($Statuses | Where-Object { $_.status -eq "running" }).Count
    $complete = @($Statuses | Where-Object { $_.status -eq "complete" }).Count
    $total = $Statuses.Count
    
    Write-Host "Summary: $complete/$total complete, $running running" -ForegroundColor Cyan
}

function Wait-AllAgentsComplete {
    while ($true) {
        $statuses = Get-AgentStatuses
        $running = @($statuses | Where-Object { $_.status -eq "running" }).Count
        
        Show-AgentStatuses -Statuses $statuses
        
        if ($running -eq 0 -and $statuses.Count -gt 0) {
            Write-Host ""
            Write-Host "All agents complete!" -ForegroundColor Green
            return $statuses
        }
        
        Write-Host ""
        Write-Host "Polling in $PollInterval seconds... (Ctrl+C to stop)" -ForegroundColor Gray
        Start-Sleep -Seconds $PollInterval
    }
}

# Main execution
if ($Watch) {
    while ($true) {
        $statuses = Get-AgentStatuses
        Show-AgentStatuses -Statuses $statuses
        Write-Host ""
        Write-Host "Refreshing in $PollInterval seconds... (Ctrl+C to stop)" -ForegroundColor Gray
        Start-Sleep -Seconds $PollInterval
    }
}
elseif ($WaitForCompletion) {
    Wait-AllAgentsComplete
}
else {
    $statuses = Get-AgentStatuses
    Show-AgentStatuses -Statuses $statuses
}
