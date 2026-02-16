# PowerShell script to update app config after publishing to Play Store
# Usage: .\update-after-publish.ps1 -PlayStoreUrl "https://play.google.com/store/apps/details?id=com.ermits.cyberstition" -PrivacyPolicyUrl "https://your-domain.com/privacy"

param(
    [Parameter(Mandatory=$true)]
    [string]$PlayStoreUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$PrivacyPolicyUrl
)

Write-Host "Updating app configuration after publishing..." -ForegroundColor Green

# Update Play Store URL in home.tsx
$homeFile = "src\app\routes\home.tsx"
if (Test-Path $homeFile) {
    $content = Get-Content $homeFile -Raw
    $content = $content -replace "window\.open\('https://play\.google\.com/store/apps', '_blank'\);", "window.open('$PlayStoreUrl', '_blank');"
    Set-Content $homeFile -Value $content -NoNewline
    Write-Host "✅ Updated Play Store URL in home.tsx" -ForegroundColor Green
}

# Update privacy policy URL if provided
if ($PrivacyPolicyUrl) {
    $appConfigFile = "src\config\app.ts"
    if (Test-Path $appConfigFile) {
        $content = Get-Content $appConfigFile -Raw
        $content = $content -replace "privacyPolicyUrl: '',", "privacyPolicyUrl: '$PrivacyPolicyUrl',"
        Set-Content $appConfigFile -Value $content -NoNewline
        Write-Host "✅ Updated privacy policy URL in app.ts" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Configuration updated! Don't forget to:" -ForegroundColor Yellow
Write-Host "1. Rebuild the app: npm run build:app"
Write-Host "2. Sync Android: npm run android:sync"
Write-Host "3. Build new release AAB"
Write-Host "4. Upload update to Play Console"

