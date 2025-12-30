<#
.SYNOPSIS
    Convert VibeCode YAML agents to Gemini CLI prompts

.DESCRIPTION
    Extracts customInstructions from Kilo Code YAML agent definitions
    and converts them to standalone prompt files for Gemini CLI.

.PARAMETER YamlPath
    Path to YAML agent file or directory

.PARAMETER OutputDir
    Output directory for generated prompts

.EXAMPLE
    .\adapt-agent-prompt.ps1 -YamlPath "docs/VibeCode-Agents/vibe-builder.yaml"
    .\adapt-agent-prompt.ps1 -YamlPath "docs/VibeCode-Agents" -OutputDir "scripts/prompts"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$YamlPath,
    
    [string]$OutputDir = "scripts/prompts"
)

$ErrorActionPreference = "Stop"

function Write-Status {
    param([string]$Status, [string]$Color = "Yellow")
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Status" -ForegroundColor $Color
}

function Convert-YamlAgent {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw
    
    # Extract key fields using regex (simple YAML parsing)
    $slug = if ($content -match "slug:\s*(\S+)") { $matches[1] } else { "unknown" }
    $name = if ($content -match "name:\s*`"([^`"]+)`"") { $matches[1] } else { $slug }
    $role = if ($content -match "roleDefinition:\s*>-\s*\n\s+(.+?)(?=\n\s+\w+:)") { $matches[1].Trim() } else { "" }
    
    # Extract customInstructions (multiline)
    $instructions = ""
    if ($content -match "customInstructions:\s*\|\s*\n([\s\S]+?)(?=\n\s+source:|\n\s{4}[a-z]+:|\z)") {
        $instructions = $matches[1]
        # Remove leading indent
        $lines = $instructions -split "`n" | ForEach-Object { 
            if ($_ -match "^\s{6}(.*)$") { $matches[1] } else { $_ }
        }
        $instructions = $lines -join "`n"
    }
    
    # Build Gemini CLI prompt
    $prompt = @"
# $name

$role

---

$instructions

---

## GEMINI CLI ADAPTATION

You are running as a Gemini CLI agent in YOLO mode.
- You have FULL control over files and terminal
- Changes are auto-approved
- Work efficiently and autonomously
- Commit your changes when done

START NOW.
"@

    return @{
        Slug = $slug
        Name = $name
        Prompt = $prompt
    }
}

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Process single file or directory
$files = @()
if (Test-Path $YamlPath -PathType Container) {
    $files = Get-ChildItem -Path $YamlPath -Filter "*.yaml"
} else {
    $files = @(Get-Item $YamlPath)
}

Write-Status "Converting $($files.Count) agent file(s)..." "Cyan"

foreach ($file in $files) {
    Write-Status "Processing: $($file.Name)" "Gray"
    
    try {
        $result = Convert-YamlAgent -FilePath $file.FullName
        
        $outputPath = Join-Path $OutputDir "$($result.Slug).txt"
        $result.Prompt | Out-File $outputPath -Encoding utf8
        
        Write-Status "  -> $outputPath" "Green"
    }
    catch {
        Write-Status "  Error: $_" "Red"
    }
}

Write-Status "Done! Prompts saved to: $OutputDir" "Green"
