# Quick Start Script for MedLedger

Write-Host "🏥 MedLedger - Quick Start Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env file" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 IMPORTANT: Edit .env file and add your Firebase credentials!" -ForegroundColor Red
        Write-Host "   1. Go to https://console.firebase.google.com/" -ForegroundColor Yellow
        Write-Host "   2. Create or select your project" -ForegroundColor Yellow
        Write-Host "   3. Go to Project Settings > General" -ForegroundColor Yellow
        Write-Host "   4. Copy your Firebase config to .env file" -ForegroundColor Yellow
        Write-Host ""
        
        $response = Read-Host "Have you configured .env with your Firebase credentials? (y/n)"
        if ($response -ne "y") {
            Write-Host "❌ Please configure .env file first, then run this script again." -ForegroundColor Red
            exit
        }
    }
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "🔍 Step 2: Checking Firebase CLI..." -ForegroundColor Cyan
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-Not $firebaseInstalled) {
    Write-Host "⚠️  Firebase CLI not found" -ForegroundColor Yellow
    $installFirebase = Read-Host "Do you want to install Firebase CLI? (y/n)"
    if ($installFirebase -eq "y") {
        npm install -g firebase-tools
        Write-Host "✅ Firebase CLI installed" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Firebase CLI found" -ForegroundColor Green
}
Write-Host ""

Write-Host "🔐 Step 3: Firebase Authentication..." -ForegroundColor Cyan
Write-Host "Please make sure:" -ForegroundColor Yellow
Write-Host "  - You have a Firebase project created" -ForegroundColor Yellow
Write-Host "  - Email/Password authentication is enabled" -ForegroundColor Yellow
Write-Host "  - Firestore Database is created" -ForegroundColor Yellow
Write-Host ""

$deployRules = Read-Host "Do you want to deploy Firestore security rules now? (y/n)"
if ($deployRules -eq "y") {
    Write-Host "🚀 Deploying Firestore rules..." -ForegroundColor Cyan
    firebase deploy --only firestore:rules
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firestore rules deployed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to deploy rules. You may need to run 'firebase login' first" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Make sure .env file has correct Firebase credentials" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed setup instructions, see SETUP.md" -ForegroundColor Cyan
Write-Host "📝 For summary of fixes, see FIXES_SUMMARY.md" -ForegroundColor Cyan
Write-Host ""

$startNow = Read-Host "Do you want to start the development server now? (y/n)"
if ($startNow -eq "y") {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
    Write-Host "📱 App will be available at http://localhost:8080" -ForegroundColor Green
    Write-Host ""
    npm run dev
}
