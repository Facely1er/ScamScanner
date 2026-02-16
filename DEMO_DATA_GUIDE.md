# Demo Data Guide

This guide explains how to use the demo data files to showcase real reports and scan sessions in the Cyberstition app.

## Demo Data File

**Location**: `public/demo-data.json`

This file contains realistic demo data including:
- **5 Reports** - Various risk levels (high, medium, low)
- **3 Scan Sessions** - Complete analysis workflows
- **3 Documents** - Sample uploaded files
- **Preferences** - Default user settings

## How to Import Demo Data

### Method 1: Via Dashboard (Recommended)

1. Start the app: `npm run dev:app`
2. Navigate to the Dashboard (`/dashboard`)
3. Click the **"Import"** button
4. Select the file: `public/demo-data.json`
5. Confirm the import when prompted
6. The demo data will now appear in your dashboard

### Method 2: Via Browser Console

1. Open the app in your browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run this command:

```javascript
// Import Demo Data for Cyberstition
(async function() {
    try {
        // Fetch demo data
        const response = await fetch('/demo-data.json');
        const data = await response.json();
        
        // Import reports
        if (data.reports) {
            localStorage.setItem('cyberstition_reports', JSON.stringify(data.reports));
            console.log('✅ Imported ' + data.reports.length + ' reports');
        }
        
        // Import documents
        if (data.documents) {
            localStorage.setItem('cyberstition_documents', JSON.stringify(data.documents));
            console.log('✅ Imported ' + data.documents.length + ' documents');
        }
        
        // Import preferences
        if (data.preferences) {
            localStorage.setItem('cyberstition_preferences', JSON.stringify(data.preferences));
            console.log('✅ Imported preferences');
        }
        
        // Import sessions
        if (data.sessions) {
            localStorage.setItem('cyberstition_scan_sessions', JSON.stringify(data.sessions));
            console.log('✅ Imported ' + data.sessions.length + ' sessions');
        }
        
        alert('Demo data imported successfully! Refresh the page to see it.');
    } catch (error) {
        console.error('Import failed:', error);
        alert('Import failed: ' + error.message);
    }
})();
```

### Method 3: Using Import Helper Page

1. Start the app: `npm run dev:app`
2. Navigate to: `http://localhost:5173/import-demo-data.html`
3. Click "Load Demo Data"
4. Copy the generated code
5. Paste it into your app's console (F12 → Console tab)
6. Press Enter to execute
7. Refresh the page to see the data

## Demo Data Contents

### Reports (5 total)

1. **High Risk - Phishing Email**
   - Title: "Suspicious Email from 'Amazon Support'"
   - Risk: High (80/100)
   - Issues: SPF/DKIM/DMARC failures, suspicious Reply-To
   - Tool: Email analysis

2. **High Risk - Romance Scam**
   - Title: "Romance Scam Message Pattern Detected"
   - Risk: High (70/100)
   - Issues: Urgency, reward offers, requests bank details
   - Tool: Message analysis

3. **Medium Risk - Profile Photo**
   - Title: "Image Metadata Analysis - Suspicious Profile Photo"
   - Risk: Medium (25/100)
   - Issues: Missing EXIF data, generic filename
   - Tool: Image analysis

4. **Medium Risk - Social Profile**
   - Title: "Social Profile Verification - Inconsistent Information"
   - Risk: Medium (30/100)
   - Issues: New account, low activity, generic bio
   - Tool: Profile analysis

5. **Low Risk - Legitimate Email**
   - Title: "Legitimate Email from Bank - Low Risk"
   - Risk: Low (5/100)
   - Issues: None - all checks passed
   - Tool: Email analysis

### Scan Sessions (3 total)

1. **High Risk - Phishing Attempt**
   - Risk Score: 85/100
   - Threat Category: Phishing
   - Evidence: Email headers + message content
   - Patterns: Phishing email with urgency, brand impersonation
   - Status: Completed

2. **High Risk - Romance Scam**
   - Risk Score: 75/100
   - Threat Category: Romance Scam
   - Evidence: Message + social profile
   - Patterns: Romance scam pattern (overseas work, urgent money request)
   - Status: Completed

3. **Low Risk - Legitimate Email**
   - Risk Score: 5/100
   - Threat Category: Unknown (legitimate)
   - Evidence: Email headers only
   - Patterns: None
   - Status: Completed

### Documents (3 total)

1. Suspicious Amazon Email
2. Romance Scam Message
3. Profile Photo Analysis

## Use Cases

### For Demonstrations

1. **Show High-Risk Detection**
   - Open the phishing email report
   - Show how multiple signals combine for high risk score
   - Display pattern matches and recommendations

2. **Show Multi-Evidence Analysis**
   - Open the romance scam session
   - Show how message + profile analysis work together
   - Display cross-references and pattern matching

3. **Show Low-Risk Legitimate Content**
   - Open the legitimate bank email report
   - Show how all checks pass
   - Demonstrate the app doesn't flag everything as suspicious

### For Testing

1. **Test Dashboard Features**
   - Search functionality
   - Filter by risk level
   - Delete reports
   - Export/import data

2. **Test Report Display**
   - View different report types
   - Check signal descriptions
   - Verify risk level calculations

3. **Test Session Workflow**
   - View complete scan sessions
   - Check evidence items
   - Verify pattern matches
   - Review recommendations

## Customizing Demo Data

To create your own demo data:

1. Copy `public/demo-data.json` to a new file
2. Modify the data structure following the examples
3. Ensure all required fields are present:
   - Reports: `id`, `title`, `tool_type`, `risk_level`, `created_at`, `content`
   - Sessions: `id`, `createdAt`, `updatedAt`, `status`, `context`, `evidence`, `signals`, `patternMatches`, `overallRiskScore`, `overallRiskLevel`, etc.
   - Documents: `id`, `title`, `description`, `file_type`, `created_at`

4. Import using Method 1 or 2 above

## Data Structure Reference

### Report Structure
```typescript
{
  id: string;
  title: string;
  tool_type: 'messages' | 'profiles' | 'images' | 'email';
  risk_level: 'low' | 'medium' | 'high';
  created_at: string; // ISO 8601 format
  content: {
    evidence: EvidenceItem; // See src/types/scan.ts
  };
}
```

### Session Structure
```typescript
{
  id: string;
  createdAt: number; // Unix timestamp
  updatedAt: number;
  status: 'in_progress' | 'completed' | 'paused';
  context: ScanContext;
  evidence: EvidenceItem[];
  signals: Signal[];
  patternMatches: PatternMatch[];
  crossReferences: CrossReference[];
  overallRiskScore: number; // 0-100
  overallRiskLevel: 'low' | 'medium' | 'high';
  threatCategory: ThreatCategory;
  confidence: number; // 0-1
  nextSteps: string[];
  completionPercentage: number; // 0-100
}
```

## Notes

- All timestamps are in ISO 8601 format or Unix timestamps
- Risk scores range from 0-100
- Confidence values range from 0-1
- All IDs should be unique
- Dates should be recent (within last 30 days) for realistic demo

## Troubleshooting

**Import fails:**
- Check JSON syntax is valid
- Ensure all required fields are present
- Check browser console for errors

**Data doesn't appear:**
- Refresh the page after import
- Check localStorage in DevTools
- Verify the data structure matches expected format

**Reports show but sessions don't:**
- Sessions are stored in Zustand store, not localStorage
- You may need to manually add sessions to the store
- Or use the session import feature if available

