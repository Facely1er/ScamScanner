# Privacy & Data Handling - ScamScanner

## Our Privacy Commitment

ScamScanner is built with **privacy-first principles**. We believe users deserve transparency about how their data is processed.

## Two-Tier Privacy Model

### **FREE Tier - 100% Local Processing**

All basic analysis features run **entirely on your device**:

✅ **Message Analysis**
- Text pattern matching
- Phishing detection
- Manipulation technique identification
- Zero uploads

✅ **Profile Analysis**
- Username patterns
- Bio heuristics
- Account age indicators
- Zero uploads

✅ **Email Analysis**
- Header inspection
- Sender verification
- Link analysis
- Zero uploads

✅ **Image Metadata**
- Format inspection
- Dimension analysis
- File size checks
- Uses browser APIs only

✅ **Video Metadata**
- Duration extraction
- Format validation
- Resolution detection
- Uses browser APIs only

**Privacy Guarantee**: These features never upload any data. Everything stays on your device.

---

### **PREMIUM Tier - Cloud AI Processing**

Advanced AI features require uploading to our secure partners:

⚠️ **Deepfake Detection**
- Video uploaded for AI analysis
- Requires explicit user consent
- Opt-in only via checkbox

**How It Works:**
1. User uploads video for basic metadata analysis (local)
2. User sees "Enable Deepfake Detection" checkbox
3. First time: Consent dialog appears with full disclosure
4. User accepts → Video uploaded for AI analysis
5. Results returned and video deleted within 24 hours

---

## Privacy Protections for Cloud Features

When you opt into deepfake detection:

### 🔒 **Encryption**
- Videos transmitted via TLS 1.3
- Industry-standard encryption
- Secure API endpoints only

### 🗑️ **Automatic Deletion**
- Videos deleted within 24 hours
- No long-term storage
- Immediate processing queue

### 🚫 **No Training Data**
- Your videos never used to train AI
- Not shared with third parties
- Not used for research

### 📊 **Limited Data**
- Only video file uploaded
- No device information
- No personal identifiers
- No tracking cookies

### 🎯 **Explicit Consent**
- Clear consent dialog
- Can opt-out anytime
- Per-session choice
- Consent stored locally only

---

## What Data We Collect

### **Local Analysis (All Features)**
- **Data Processed**: Messages, profiles, emails, images, videos
- **Where**: Your device only
- **Storage**: Browser memory (temporary)
- **Sent to Server**: Nothing
- **Tracking**: None

### **Deepfake Detection (Optional)**
- **Data Processed**: Video file only
- **Where**: Secure AI partner servers
- **Storage**: Temporary (< 24 hours)
- **Sent to Server**: Video file (encrypted)
- **Tracking**: None

### **Analytics (Optional - Not Implemented)**
- Currently: No analytics
- Future: Optional, anonymized usage stats
- Will require separate consent

---

## User Controls

### How to Enable Deepfake Detection
1. Navigate to video analyzer
2. Upload video (metadata analyzed locally)
3. Check "Enable Deepfake Detection" box
4. Review and accept consent dialog
5. Video uploaded for AI analysis

### How to Disable Deepfake Detection
1. Uncheck "Enable Deepfake Detection" box
2. Video will only be analyzed locally
3. No upload occurs

### How to Revoke Consent
1. Uncheck the deepfake checkbox
2. Close and reopen app (clears consent)
3. Or clear browser local storage

---

## Consent Management

Consent is stored in browser `localStorage`:
- Key: `deepfake_consent_given`
- Value: `'true'` or not set
- Scope: Current device only
- Persistence: Until cleared by user

**To Clear Consent:**
- Browser: Clear site data
- App: Clear app cache/data

---

## Third-Party Services

### Current Integrations

**Deepfake Detection API** (When Enabled)
- Provider: TruthScan (or configured provider)
- Purpose: AI video analysis
- Data Shared: Video file only
- Data Retention: < 24 hours
- Privacy Policy: [Provider's policy]

### Future Integrations

We may add:
- Image manipulation detection
- Real-time threat intelligence
- URL reputation checking

**All future cloud features will:**
- Require explicit consent
- Have clear privacy disclosures
- Be opt-in only
- Follow same privacy standards

---

## Regulatory Compliance

### GDPR (Europe)
- ✅ Consent required for data processing
- ✅ Right to erasure (data deleted < 24h)
- ✅ Data minimization (only necessary data)
- ✅ Transparency (clear disclosures)
- ✅ Security measures (encryption)

### CCPA (California)
- ✅ Notice at collection (consent dialog)
- ✅ Right to deletion (automatic)
- ✅ Right to opt-out (checkbox)
- ✅ No sale of personal information

### PIPEDA (Canada)
- ✅ Meaningful consent
- ✅ Limited collection
- ✅ Safeguards in place

---

## Data Flow Diagrams

### Free Tier (Local Processing)
```
User Device
├── Input: Message/Profile/Email/Image/Video
├── Process: Local analysis (browser)
├── Output: Risk assessment
└── Storage: None (temporary memory only)

External Servers: NONE
```

### Premium Tier (Deepfake Detection)
```
User Device
├── Input: Video file
├── Local: Metadata analysis
├── User: Enables deepfake checkbox
├── Consent: Dialog appears → User accepts
├── Upload: Video → API (encrypted)
└── Receive: Results

API Server
├── Receive: Encrypted video
├── Process: AI deepfake analysis
├── Return: Results (probFake score)
└── Delete: Video (< 24 hours)
```

---

## Security Measures

### Client-Side
- ✅ No data persistence (except consent flag)
- ✅ Browser sandboxing
- ✅ No external scripts (besides APIs)
- ✅ Content Security Policy

### Server-Side (Deepfake API)
- ✅ TLS 1.3 encryption
- ✅ API key authentication
- ✅ Rate limiting
- ✅ Automatic data deletion

### Infrastructure
- ✅ Secure API endpoints
- ✅ No third-party trackers
- ✅ No advertising networks
- ✅ No cross-site cookies

---

## Privacy by Design Principles

1. **Default Privacy**: Everything local by default
2. **Explicit Consent**: Cloud features require clear opt-in
3. **Data Minimization**: Only necessary data collected
4. **Transparency**: Clear disclosure before upload
5. **User Control**: Easy enable/disable toggles
6. **Security**: Encryption and automatic deletion
7. **No Surprises**: Visible privacy badges

---

## FAQ

**Q: Is my data truly private with free features?**
> Yes. All free tier analysis runs 100% locally. Nothing is uploaded.

**Q: What happens to my video with deepfake detection?**
> It's encrypted, uploaded for AI analysis, processed, and deleted within 24 hours.

**Q: Can I use the app offline?**
> Yes! All free features work offline. Deepfake detection requires internet.

**Q: Do you track my usage?**
> No. We don't use analytics or tracking (yet). If we add it, it will be optional.

**Q: Can I trust the cloud AI feature?**
> We use industry-standard security. Video is temporary and never used for training.

**Q: How do I know what's local vs cloud?**
> Look for privacy badges: "100% Local" (green) or "Cloud AI" (yellow).

**Q: What if I don't consent to deepfake?**
> You still get full video metadata analysis locally. Deepfake is optional.

**Q: Can you see my personal information?**
> No. We only receive video files for deepfake analysis. No personal info.

---

## Contact & Data Requests

If you have privacy questions or data requests:
- Email: privacy@cyberstition.app (placeholder)
- Subject: Data Privacy Request
- Include: Description of your concern

---

## Changes to This Policy

Last Updated: 2026-02-16

We'll notify users of material privacy policy changes through:
- In-app notification
- Updated version date
- Changelog in app

---

## Summary

**ScamScanner respects your privacy:**

✅ Free features = 100% local processing
⚠️ Premium AI = Requires upload with consent
🔒 Strong encryption and security
🗑️ Automatic data deletion
🚫 No tracking or third-party sharing
✨ Clear badges and disclosures

**You're in control.**

