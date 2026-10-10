<#
.SYNOPSIS
ShivTrix Core — Standalone Windows PowerShell Diagnostic Daemon
Runs natively on Windows without Python, Node.js, or external dependencies.
Listens on http://127.0.0.1:9871/ and serves diagnostic APIs for Advanced Power Toys.
#>

$port = 9871
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  ShivTrix Core — PowerShell Diagnostic Bridge Online" -ForegroundColor Green
    Write-Host "  Listening on: http://127.0.0.1:$port/" -ForegroundColor White
    Write-Host "  Advanced Power Toys & Telemetry Connected" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C to Stop Daemon" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to bind to port $port. Is another instance already running?" -ForegroundColor Red
    exit 1
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # Enable CORS for browser access
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

    if ($request.HttpMethod -eq "OPTIONS") {
        $response.StatusCode = 200
        $response.Close()
        continue
    }

    $rawUrl = $request.Url.AbsolutePath
    $query = $request.Url.Query

    try {
        if ($rawUrl -eq "/api/health") {
            $json = '{"status":"ok","mode":"powershell_bridge","port":9871,"platform":"windows"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        elseif ($rawUrl -eq "/api/telemetry") {
            $cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
            $os = Get-CimInstance Win32_OperatingSystem
            $totalRam = [math]::Round($os.TotalVisibleMemorySize / 1024, 0)
            $freeRam = [math]::Round($os.FreePhysicalMemory / 1024, 0)
            $usedRam = $totalRam - $freeRam
            $ramPct = [math]::Round(($usedRam / $totalRam) * 100, 1)

            $json = @"
{
  "cpu_overall": $($cpu ? $cpu : 15),
  "ram_percent": $($ramPct ? $ramPct : 45),
  "ram_used_gb": $([math]::Round($usedRam / 1024, 2)),
  "ram_total_gb": $([math]::Round($totalRam / 1024, 2)),
  "platform": "windows"
}
"@
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        elseif ($rawUrl -eq "/api/power-toys/adapters") {
            $adapters = @()
            Get-NetAdapter -ErrorAction SilentlyContinue | ForEach-Object {
                $adapters += [PSCustomObject]@{
                    name = $_.Name
                    description = $_.InterfaceDescription
                    status = $_.Status
                    speed = $_.LinkSpeed
                    mac = $_.MacAddress
                }
            }
            $json = ConvertTo-Json @{ status = "ok"; adapters = $adapters }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $json = '{"status":"ok","message":"ShivTrix PowerShell Bridge Active"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
    } catch {
        $response.StatusCode = 500
    } finally {
        $response.Close()
    }
}
