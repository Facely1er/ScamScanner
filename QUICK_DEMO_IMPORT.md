# Quick Demo Import Guide

## 🚀 Fastest Way to Import Demo Data

### Option 1: Copy-Paste Script (Fastest)

1. **Open your app** in browser (`npm run dev:app`)
2. **Open Console** (F12 → Console tab)
3. **Copy and paste** this code:

```javascript
fetch('/demo-data.json').then(r=>r.json()).then(d=>{
  if(d.reports) localStorage.setItem('cyberstition_reports', JSON.stringify(d.reports));
  if(d.documents) localStorage.setItem('cyberstition_documents', JSON.stringify(d.documents));
  if(d.preferences) localStorage.setItem('cyberstition_preferences', JSON.stringify(d.preferences));
  if(d.sessions) localStorage.setItem('cyberstition_scan_sessions', JSON.stringify(d.sessions));
  alert('✅ Imported! Refresh the page.');
});
```

4. **Press Enter**
5. **Refresh the page** (F5)

### Option 2: Use Import Script File

1. **Open your app** in browser
2. **Open Console** (F12 → Console tab)
3. **Load the script**:
   ```javascript
   const script = document.createElement('script');
   script.src = '/import-demo.js';
   document.head.appendChild(script);
   ```
4. **Refresh the page**

### Option 3: Dashboard Import Button

1. Go to **Dashboard** (`/dashboard`)
2. Click **"Import"** button
3. Select `public/demo-data.json`
4. Confirm import
5. Refresh page

## 📊 What You'll Get

- **5 Reports** (high, medium, low risk examples)
- **3 Scan Sessions** (complete analysis workflows)
- **3 Documents** (sample files)
- **Preferences** (default settings)

## 🧹 Clear All Data

```javascript
localStorage.removeItem('cyberstition_reports');
localStorage.removeItem('cyberstition_documents');
localStorage.removeItem('cyberstition_preferences');
localStorage.removeItem('cyberstition_scan_sessions');
alert('All data cleared! Refresh the page.');
```

## 📁 Files Created

- `public/demo-data.json` - Complete demo data
- `public/import-demo.js` - Import script
- `public/import-demo-data.html` - Helper page
- `DEMO_DATA_GUIDE.md` - Full documentation

## ✅ Verify Import

After importing, check:
- Dashboard → Reports tab (should show 5 reports)
- Dashboard → Sessions tab (should show 3 sessions)
- Dashboard → Documents tab (should show 3 documents)

