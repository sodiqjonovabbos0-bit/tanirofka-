$ErrorActionPreference = 'SilentlyContinue'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PortFile = Join-Path $Root '.server-port'
$Ports = @()
if (Test-Path $PortFile) {
  $value = Get-Content $PortFile -First 1
  if ($value -match '^\d+$') { $Ports += [int]$value }
}
$Ports += 3000
$Ports = $Ports | Select-Object -Unique
foreach ($Port in $Ports) {
  try {
    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop
    foreach ($connection in $connections) { Stop-Process -Id $connection.OwningProcess -Force }
  } catch {
    $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
    foreach ($line in $lines) {
      $parts = ($line.ToString().Trim() -split '\s+')
      if ($parts[-1] -match '^\d+$') { Stop-Process -Id ([int]$parts[-1]) -Force }
    }
  }
}
Remove-Item $PortFile -Force -ErrorAction SilentlyContinue
Write-Host "TANIROVKA server to'xtatildi."
