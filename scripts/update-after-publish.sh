#!/bin/bash
# Script to update app config after publishing to Play Store
# Usage: ./update-after-publish.sh "https://play.google.com/store/apps/details?id=com.ermits.cyberstition"

PLAY_STORE_URL="$1"
PRIVACY_POLICY_URL="$2"

if [ -z "$PLAY_STORE_URL" ]; then
    echo "Usage: ./update-after-publish.sh <play-store-url> [privacy-policy-url]"
    exit 1
fi

echo "Updating app configuration after publishing..."

# Update Play Store URL in home.tsx
if [ -f "src/app/routes/home.tsx" ]; then
    sed -i.bak "s|window.open('https://play.google.com/store/apps', '_blank');|window.open('$PLAY_STORE_URL', '_blank');|g" src/app/routes/home.tsx
    echo "✅ Updated Play Store URL in home.tsx"
    rm -f src/app/routes/home.tsx.bak
fi

# Update privacy policy URL if provided
if [ -n "$PRIVACY_POLICY_URL" ]; then
    if [ -f "src/config/app.ts" ]; then
        sed -i.bak "s|privacyPolicyUrl: '',|privacyPolicyUrl: '$PRIVACY_POLICY_URL',|g" src/config/app.ts
        echo "✅ Updated privacy policy URL in app.ts"
        rm -f src/config/app.ts.bak
    fi
fi

echo ""
echo "Configuration updated! Don't forget to:"
echo "1. Rebuild the app: npm run build:app"
echo "2. Sync Android: npm run android:sync"
echo "3. Build new release AAB"
echo "4. Upload update to Play Console"

