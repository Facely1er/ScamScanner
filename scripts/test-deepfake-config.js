#!/usr/bin/env node
/**
 * Deepfake Configuration Test Script
 * Run with: node scripts/test-deepfake-config.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('='.repeat(60));
console.log('Deepfake Configuration Test');
console.log('='.repeat(60));
console.log();

// Check Node.js environment
console.log('📋 Environment Check:');
console.log('  Node Version:', process.version);
console.log('  Platform:', process.platform);
console.log();

// Check .env file
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('📁 File Check:');
console.log('  .env exists:', fs.existsSync(envPath) ? '✅' : '❌');
console.log('  .env.example exists:', fs.existsSync(envExamplePath) ? '✅' : '❌');
console.log();

// Load and parse .env
if (fs.existsSync(envPath)) {
  console.log('⚙️  Environment Variables (.env):');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  let hasDeepfakeConfig = false;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      console.log('  ', trimmed);
      
      if (trimmed.includes('DEEPFAKE')) {
        hasDeepfakeConfig = true;
      }
    }
  });
  
  console.log();
  
  // Parse specific variables
  const envVars = {};
  lines.forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  });
  
  console.log('🔍 Deepfake Configuration Analysis:');
  console.log('  VITE_BUILD_TARGET:', envVars.VITE_BUILD_TARGET || '(not set)');
  console.log('  VITE_ENABLE_DEEPFAKE:', envVars.VITE_ENABLE_DEEPFAKE || '(not set)');
  console.log('  VITE_DEEPFAKE_PROVIDER:', envVars.VITE_DEEPFAKE_PROVIDER || '(not set)');
  console.log('  VITE_DEEPFAKE_API_KEY:', envVars.VITE_DEEPFAKE_API_KEY ? 
    `${envVars.VITE_DEEPFAKE_API_KEY.substring(0, 8)}...` : 
    '(not set)');
  console.log();
  
  // Validation
  console.log('✓ Validation Results:');
  
  const buildTarget = envVars.VITE_BUILD_TARGET;
  if (buildTarget === 'app') {
    console.log('  ✅ Build target is "app" (required for deepfake)');
  } else if (buildTarget === 'web') {
    console.log('  ⚠️  Build target is "web" (deepfake requires "app")');
  } else {
    console.log('  ❌ Build target not set (should be "app" for deepfake)');
  }
  
  const enableDeepfake = envVars.VITE_ENABLE_DEEPFAKE;
  if (enableDeepfake === 'true') {
    console.log('  ✅ Deepfake is enabled');
    
    const apiKey = envVars.VITE_DEEPFAKE_API_KEY;
    if (apiKey && apiKey.length > 10) {
      console.log('  ✅ API key is set');
      
      // Check API key format
      if (apiKey.startsWith('sk_test_')) {
        console.log('  ⚠️  Using TEST API key (good for development)');
      } else if (apiKey.startsWith('sk_live_')) {
        console.log('  ✅ Using LIVE API key (production ready)');
      } else {
        console.log('  ⚠️  API key format not recognized (expected sk_test_* or sk_live_*)');
      }
    } else {
      console.log('  ❌ API key is missing or too short');
    }
    
    const provider = envVars.VITE_DEEPFAKE_PROVIDER;
    if (provider === 'truthscan') {
      console.log('  ✅ Provider is "truthscan" (implemented)');
    } else if (provider === 'hive' || provider === 'sensity') {
      console.log(`  ⚠️  Provider is "${provider}" (not yet implemented)`);
    } else {
      console.log('  ❌ Provider not set or invalid');
    }
  } else if (enableDeepfake === 'false') {
    console.log('  ℹ️  Deepfake is disabled (basic video analysis only)');
  } else {
    console.log('  ℹ️  Deepfake not configured (defaults to disabled)');
  }
  
  console.log();
  
  // Recommendations
  console.log('💡 Recommendations:');
  
  if (enableDeepfake === 'true' && buildTarget === 'app' && envVars.VITE_DEEPFAKE_API_KEY) {
    console.log('  ✨ Configuration looks good! Ready to test deepfake detection.');
    console.log('  Run: npm run dev:app');
  } else if (enableDeepfake === 'true' && !envVars.VITE_DEEPFAKE_API_KEY) {
    console.log('  ⚠️  Deepfake is enabled but API key is missing.');
    console.log('  Add VITE_DEEPFAKE_API_KEY to your .env file.');
    console.log('  See DEEPFAKE_API_SETUP.md for instructions.');
  } else if (buildTarget === 'web') {
    console.log('  ℹ️  Web build mode - deepfake not available.');
    console.log('  Set VITE_BUILD_TARGET=app to enable deepfake.');
  } else {
    console.log('  ℹ️  Basic configuration for video metadata analysis.');
    console.log('  To enable deepfake detection:');
    console.log('    1. Set VITE_BUILD_TARGET=app');
    console.log('    2. Set VITE_ENABLE_DEEPFAKE=true');
    console.log('    3. Add VITE_DEEPFAKE_API_KEY=your_key');
    console.log('  See DEEPFAKE_API_SETUP.md for details.');
  }
} else {
  console.log('❌ .env file not found!');
  console.log('   Create one by copying .env.example:');
  console.log('   cp .env.example .env');
}

console.log();
console.log('='.repeat(60));
console.log('For more information, see DEEPFAKE_API_SETUP.md');
console.log('='.repeat(60));
