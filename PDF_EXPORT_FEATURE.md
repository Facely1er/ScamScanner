# PDF Export Feature

## Overview

The Cyberstition app now includes user-friendly PDF export functionality, making it easy to share and archive security analysis reports. PDF exports are more accessible than JSON files for end users.

## Features

### 1. Export Individual Reports to PDF
- **Location**: Dashboard → Reports tab
- **Action**: Click the PDF icon (📄) next to any report
- **Output**: Single PDF file with complete report details

### 2. Export All Reports to PDF
- **Location**: Dashboard header
- **Action**: Click "Export PDF" button
- **Output**: Single PDF file with all reports (cover page + summary)

### 3. Export Scan Sessions to PDF
- **Location**: 
  - Dashboard → Sessions tab (PDF icon next to each session)
  - Scan Results page (after completing analysis)
- **Action**: Click "Export PDF" button
- **Output**: Complete session report with all evidence, patterns, and recommendations

## PDF Contents

### Report PDF Includes:
- Report title and metadata
- Risk level (color-coded)
- Risk score (0-100)
- All detected signals with descriptions
- Analysis details (issues found)
- Recommendations
- Footer with page numbers and generation date

### Session PDF Includes:
- Session overview (risk score, confidence, threat category)
- Context information (sender, origin, requested action)
- All evidence items analyzed
- Pattern matches detected
- Cross-references
- Recommended actions
- Footer with page numbers and generation date

### All Reports PDF Includes:
- Cover page with summary statistics
- Risk level breakdown (high/medium/low counts)
- Individual report summaries
- Key signals from each report

## Usage Examples

### Export a Single Report
1. Go to Dashboard
2. Click on "Reports" tab
3. Find the report you want to export
4. Click the PDF icon (📄) next to the report
5. PDF downloads automatically

### Export All Reports
1. Go to Dashboard
2. Click "Export PDF" button in the header
3. PDF downloads with all reports included

### Export a Scan Session
**From Dashboard:**
1. Go to Dashboard → Sessions tab
2. Click the PDF icon next to the session
3. PDF downloads automatically

**From Scan Results:**
1. Complete a scan analysis
2. On the results page, click "Export PDF" button
3. PDF downloads automatically

## File Naming

PDFs are automatically named with descriptive filenames:
- Reports: `cyberstition-report-{title}-{date}.pdf`
- Sessions: `cyberstition-session-{sender-name}-{date}.pdf`
- All Reports: `cyberstition-all-reports-{date}.pdf`

## Technical Details

### Library Used
- **jsPDF**: Client-side PDF generation library
- No server-side processing required
- Works entirely in the browser

### File Size
- Typical report PDF: 50-200 KB
- Session PDF: 100-500 KB (depending on evidence)
- All reports PDF: 200 KB - 2 MB (depending on number of reports)

### Browser Compatibility
- Works in all modern browsers
- No additional plugins required
- Mobile-friendly (downloads on mobile devices)

## Benefits Over JSON Export

1. **User-Friendly**: Easy to read and share
2. **Professional**: Formatted with proper styling
3. **Printable**: Can be printed directly
4. **Accessible**: Works on any device with a PDF reader
5. **Shareable**: Easy to email or share with others
6. **Archivable**: Standard format for long-term storage

## JSON Export Still Available

The JSON export option remains available for:
- Data backup and restore
- Technical analysis
- Integration with other tools
- Complete data preservation

## Code Structure

### Main Export Functions
- `exportReportToPDF(report)` - Export single report
- `exportSessionToPDF(session)` - Export scan session
- `exportAllReportsToPDF(reports)` - Export all reports

### Location
- Export utility: `src/utils/pdfExporter.ts`
- Dashboard integration: `src/app/routes/dashboard.tsx`
- Scan results integration: `src/app/components/scan/ScanResults.tsx`

## Future Enhancements

Potential improvements:
- Custom PDF templates
- Branded headers/footers
- Password protection
- Batch export with selection
- Email PDF directly
- Cloud storage integration

## Troubleshooting

**PDF doesn't download:**
- Check browser popup blocker settings
- Ensure JavaScript is enabled
- Try a different browser

**PDF is empty:**
- Ensure the report/session has data
- Check browser console for errors
- Refresh the page and try again

**PDF formatting issues:**
- This is normal for very long content (auto-pagination)
- Content is split across multiple pages automatically

## Notes

- PDFs are generated client-side (no server upload)
- All data stays on your device
- PDFs can be deleted like any other file
- No internet connection needed after generation

