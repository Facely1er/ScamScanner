/**
 * Cyberstition Demo Data Importer
 * 
 * Usage:
 * 1. Copy this entire file
 * 2. Open your app in browser
 * 3. Open Developer Tools (F12)
 * 4. Go to Console tab
 * 5. Paste this code and press Enter
 * 6. Refresh the page
 */

(async function importDemoData() {
    try {
        console.log('🚀 Starting demo data import...');
        
        // Fetch demo data
        const response = await fetch('/demo-data.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch demo data: ${response.statusText}`);
        }
        const data = await response.json();
        
        let importedCount = 0;
        
        // Import reports
        if (data.reports && Array.isArray(data.reports)) {
            localStorage.setItem('cyberstition_reports', JSON.stringify(data.reports));
            console.log(`✅ Imported ${data.reports.length} reports`);
            importedCount += data.reports.length;
        }
        
        // Import documents
        if (data.documents && Array.isArray(data.documents)) {
            localStorage.setItem('cyberstition_documents', JSON.stringify(data.documents));
            console.log(`✅ Imported ${data.documents.length} documents`);
            importedCount += data.documents.length;
        }
        
        // Import preferences
        if (data.preferences) {
            localStorage.setItem('cyberstition_preferences', JSON.stringify(data.preferences));
            console.log('✅ Imported preferences');
        }
        
        // Import sessions
        if (data.sessions && Array.isArray(data.sessions)) {
            localStorage.setItem('cyberstition_scan_sessions', JSON.stringify(data.sessions));
            console.log(`✅ Imported ${data.sessions.length} sessions`);
            importedCount += data.sessions.length;
        }
        
        console.log(`\n🎉 Successfully imported ${importedCount} items!`);
        console.log('📝 Refresh the page to see the demo data in your dashboard.');
        
        alert(`Demo data imported successfully!\n\nImported:\n- ${data.reports?.length || 0} reports\n- ${data.sessions?.length || 0} sessions\n- ${data.documents?.length || 0} documents\n\nRefresh the page to see them.`);
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        alert('Import failed: ' + error.message + '\n\nMake sure you are running the app and the demo-data.json file is accessible.');
    }
})();

