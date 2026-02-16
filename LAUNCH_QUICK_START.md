# Launch Quick Start Guide

## 🚀 Fastest Path to Launch

Follow these steps in order to get your app to the Play Store quickly.

---

## Step 1: Privacy Policy (30 minutes)

### Option A: Use Generator
1. Open `scripts/create-privacy-policy.html` in browser
2. Fill in details
3. Generate policy
4. Copy or download

### Option B: Use Template
1. Open `PRIVACY_POLICY.md`
2. Customize as needed
3. Copy content

### Publish Policy
1. Host on your website (HTTPS required)
2. Or use free hosting:
   - GitHub Pages
   - Netlify
   - Vercel
   - Google Sites

### Update App Config
```typescript
// src/config/app.ts
privacyPolicyUrl: 'https://your-domain.com/privacy-policy',
```

---

## Step 2: Create Keystore (15 minutes)

1. Open terminal
2. Navigate to secure location
3. Run:
```bash
keytool -genkey -v -keystore cyberstition-release.keystore -alias cyberstition -keyalg RSA -keysize 2048 -validity 10000
```
4. Answer prompts
5. **BACKUP keystore** to secure location
6. **SAVE passwords** in password manager

See `scripts/create-keystore.md` for details.

---

## Step 3: Build Release AAB (30 minutes)

1. Open Android Studio:
```bash
npm run android:open
```

2. Configure signing (see `scripts/build-release.md`)

3. Build → Generate Signed Bundle / APK
   - Select Android App Bundle
   - Use your keystore
   - Build release

4. AAB location: `android/app/release/app-release.aab`

---

## Step 4: Play Console Setup (2-4 hours)

### Create App
1. Go to [Play Console](https://play.google.com/console)
2. Create app
3. Fill basic info:
   - App name: "Cyberstition - Scam Scanner"
   - Default language: English
   - App or game: App
   - Free or paid: Free

### Upload AAB
1. Release → Production
2. Create new release
3. Upload `app-release.aab`
4. Add release notes

### Complete Store Listing
1. **App details**:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Category: Tools

2. **Graphics**:
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (2-8 images)

3. **Content rating**:
   - Complete questionnaire
   - Expected: Everyone (E)

4. **Data safety**:
   - Declare: No data collected
   - No data shared
   - No data sold

5. **Privacy policy**:
   - Link your published URL

---

## Step 5: Submit for Review (5 minutes)

1. Review all sections
2. Ensure all required fields complete
3. Click "Submit for review"
4. Wait 1-3 business days

---

## Quick Checklist

- [ ] Privacy policy created and published
- [ ] Privacy policy URL added to `src/config/app.ts`
- [ ] Keystore created and backed up
- [ ] Release AAB built
- [ ] Play Console app created
- [ ] AAB uploaded
- [ ] Store listing completed
- [ ] Graphics uploaded
- [ ] Content rating done
- [ ] Data safety form completed
- [ ] Privacy policy linked
- [ ] Submitted for review

---

## Time Estimate

- Privacy policy: 30 min
- Keystore: 15 min
- Build AAB: 30 min
- Play Console setup: 2-4 hours
- **Total**: 3-5 hours (focused work)

---

## Resources

- Privacy Policy: `PRIVACY_POLICY.md`
- Privacy Generator: `scripts/create-privacy-policy.html`
- Keystore Guide: `scripts/create-keystore.md`
- Build Guide: `scripts/build-release.md`
- Full Checklist: `LAUNCH_REMAINING_TASKS.md`

---

## Need Help?

- **Privacy Policy**: Use the generator or template
- **Keystore Issues**: See `scripts/create-keystore.md`
- **Build Issues**: See `scripts/build-release.md`
- **Play Console**: See `PLAY_STORE_QUICK_CHECKLIST.md`

---

## Post-Launch

After app is published:
1. Update Play Store URL in `src/app/routes/home.tsx`
2. Monitor reviews
3. Set up support email monitoring
4. Plan v2 features

---

**You're almost there!** 🎉

