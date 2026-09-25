param(
  [ValidateSet("codex","claude-code","cursor")]
  [string]$Agent = "codex"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found on PATH."
  }
}

Assert-Command "git"
Assert-Command "node"
Assert-Command "npm"
Assert-Command "npx"

$repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if (-not $repoRoot) {
  throw "Run this script from inside the project repository."
}
Set-Location $repoRoot

Write-Host "Installing free, project-scoped design skills for agent: $Agent"
Write-Host "Repository: $repoRoot"

$skills = @(
  @{
    Name = "Hallmark"
    Args = @("-y","skills","add","https://github.com/nutlope/hallmark","--skill","hallmark","--agent",$Agent)
  },
  @{
    Name = "UI/UX Pro Max"
    Args = @("-y","skills","add","https://github.com/nextlevelbuilder/ui-ux-pro-max-skill","--skill","ui-ux-pro-max","--agent",$Agent)
  },
  @{
    Name = "Taste Skill"
    Args = @("-y","skills","add","https://github.com/Leonxlnx/taste-skill","--skill","design-taste-frontend","--agent",$Agent)
  },
  @{
    Name = "GSAP Skills"
    Args = @("-y","skills","add","https://github.com/greensock/gsap-skills","--agent",$Agent)
  },
  @{
    Name = "Claude Design Skill"
    Args = @("-y","skills","add","https://github.com/jiji262/claude-design-skill","--agent",$Agent)
  },
  @{
    Name = "Landing Page Generator"
    Args = @("-y","skills","add","https://github.com/alirezarezvani/claude-skills","--skill","landing-page-generator","--agent",$Agent)
  },
  @{
    Name = "Cinematic UI"
    Args = @("-y","skills","add","https://github.com/Pythoughts-labs/cinematic-ui","--skill","cinematic-ui","--agent",$Agent)
  }
)

foreach ($skill in $skills) {
  Write-Host ""
  Write-Host "==> $($skill.Name)"
  & npx @($skill.Args)
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to install $($skill.Name). Exit code: $LASTEXITCODE"
  }
}

Write-Host ""
Write-Host "Design skills setup completed."
Write-Host "These are development-time agent skills only; they are not runtime dependencies of the desktop application."
Write-Host "Optional tools intentionally not installed: OpenDesign, PencilPlaybook, design-md-chrome."
