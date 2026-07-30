$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root
$ExpectedVersion = "2026.07-full-pro-6"

# WinRAR vaqtinchalik papkasidan ishga tushirilsa Desktop'ga avtomatik ko'chiradi.
if ($Root -like '*\AppData\Local\Temp\Rar$*' -or $Root -like '*\AppData\Local\Temp\Rar*') {
  $Desktop = [Environment]::GetFolderPath('Desktop')
  $Destination = Join-Path $Desktop 'TANIROVKA-SAYT'
  Write-Host "WinRAR temp papkasi aniqlandi." -ForegroundColor Yellow
  Write-Host "Loyiha Desktop\TANIROVKA-SAYT papkasiga ko'chirilmoqda..." -ForegroundColor Yellow
  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  Get-ChildItem -LiteralPath $Root -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $Destination -Recurse -Force
  }
  Start-Process -FilePath "powershell.exe" -ArgumentList @(
    '-NoProfile','-ExecutionPolicy','Bypass','-File',(Join-Path $Destination 'START.ps1')
  )
  exit 0
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js topilmadi. Node.js 18 yoki yangiroq versiyasini o'rnating." -ForegroundColor Red
  exit 1
}

function Get-Health([int]$Port) {
  try {
    return Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 1
  } catch { return $null }
}

function Get-PortPids([int]$Port) {
  try {
    return @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop | Select-Object -ExpandProperty OwningProcess -Unique)
  } catch {
    $result = @()
    $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
    foreach ($line in $lines) {
      $parts = ($line.ToString().Trim() -split '\s+')
      if ($parts[-1] -match '^\d+$') { $result += [int]$parts[-1] }
    }
    return @($result | Select-Object -Unique)
  }
}

function Test-PortFree([int]$Port) {
  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
    $listener.Start()
    return $true
  } catch { return $false }
  finally { if ($listener) { try { $listener.Stop() } catch {} } }
}

function Stop-Port([int]$Port) {
  foreach ($processId in (Get-PortPids $Port)) {
    try { Stop-Process -Id $processId -Force -ErrorAction Stop } catch {}
  }
  Start-Sleep -Milliseconds 500
}

$Port = 3000
$health = Get-Health $Port

if ($health -and $health.service -eq 'tanirovka-api') {
  if ($health.version -ne $ExpectedVersion) {
    Write-Host "Eski TANIROVKA server yangilanmoqda..." -ForegroundColor Yellow
    Stop-Port $Port
    $health = $null
  }
} elseif (-not (Test-PortFree $Port)) {
  Write-Host "3000-port boshqa dastur tomonidan band." -ForegroundColor Yellow
  $Port = 3001
  while ($Port -le 3020 -and -not (Test-PortFree $Port)) { $Port++ }
  if ($Port -gt 3020) {
    Write-Host "3000-3020 oralig'ida bo'sh port topilmadi." -ForegroundColor Red
    exit 1
  }
  Write-Host "Bo'sh port tanlandi: $Port" -ForegroundColor Cyan
  $health = $null
}

if (-not ($health -and $health.ok -eq $true -and $health.version -eq $ExpectedVersion)) {
  Write-Host "TANIROVKA backend server ishga tushmoqda..." -ForegroundColor Yellow
  $LogFile = Join-Path $Root 'server.log'
  if (Test-Path $LogFile) { Remove-Item $LogFile -Force -ErrorAction SilentlyContinue }
  $command = "set PORT=$Port&& cd /d `"$Root`"&& node server.js 1>`"$LogFile`" 2>&1"
  Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $command -WindowStyle Hidden | Out-Null

  $deadline = (Get-Date).AddSeconds(20)
  do {
    Start-Sleep -Milliseconds 400
    $health = Get-Health $Port
  } while ((Get-Date) -lt $deadline -and -not ($health -and $health.version -eq $ExpectedVersion))
}

if (-not ($health -and $health.ok -eq $true -and $health.service -eq 'tanirovka-api' -and $health.version -eq $ExpectedVersion)) {
  Write-Host "Server ishga tushmadi." -ForegroundColor Red
  $LogFile = Join-Path $Root 'server.log'
  if (Test-Path $LogFile) {
    Write-Host "Server log:" -ForegroundColor Yellow
    Get-Content $LogFile -Tail 20
  }
  exit 1
}

Set-Content -LiteralPath (Join-Path $Root '.server-port') -Value $Port -Encoding ascii
$Url = "http://localhost:$Port"
Write-Host "Server tayyor: $Url" -ForegroundColor Green
Write-Host "Google Maps havolasi saytning Manzil bo'limida ishlaydi." -ForegroundColor Green
Start-Process $Url
