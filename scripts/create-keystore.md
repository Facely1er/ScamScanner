# Creating Release Keystore for Android

## Why You Need This

A keystore is required to sign your Android app for release. You'll use the same keystore for all future updates, so **keep it safe and backed up**.

## Prerequisites

- Java JDK installed (comes with Android Studio)
- `keytool` command available (included with JDK)

## Create Keystore

### Step 1: Open Terminal/Command Prompt

Navigate to a secure location (NOT in your project folder):

```bash
# Windows
cd C:\Users\YourName\Documents\AndroidKeystores

# Mac/Linux
cd ~/Documents/AndroidKeystores
```

### Step 2: Run Keytool Command

```bash
keytool -genkey -v -keystore cyberstition-release.keystore -alias cyberstition -keyalg RSA -keysize 2048 -validity 10000
```

### Step 3: Answer Prompts

You'll be asked:
- **Keystore password**: Choose a strong password (save it!)
- **Re-enter password**: Confirm
- **First and last name**: Your name or company name
- **Organizational unit**: (optional, press Enter)
- **Organization**: Your company name (e.g., "Ermits")
- **City**: Your city
- **State/Province**: Your state
- **Country code**: Two-letter code (e.g., "US", "GB")

### Step 4: Confirm

- Type "yes" to confirm
- Enter key password (can be same as keystore password)

## Verify Keystore

```bash
keytool -list -v -keystore cyberstition-release.keystore
```

Enter password when prompted. You should see your keystore details.

## Store Securely

1. **Backup keystore** to multiple secure locations:
   - Encrypted cloud storage
   - External hard drive
   - Password manager (for passwords)

2. **Never commit to git**:
   - Add to `.gitignore`
   - Never share publicly

3. **Document passwords**:
   - Store in password manager
   - Keep with secure backup

## Using Keystore

### Option 1: Reference in build.gradle

```gradle
signingConfigs {
    release {
        storeFile file('path/to/cyberstition-release.keystore')
        storePassword 'your-password'
        keyAlias 'cyberstition'
        keyPassword 'your-password'
    }
}
```

### Option 2: Use keystore.properties (Recommended)

1. Create `android/keystore.properties`:
```properties
storePassword=your-keystore-password
keyPassword=your-key-password
keyAlias=cyberstition
storeFile=../path/to/cyberstition-release.keystore
```

2. Add to `.gitignore`:
```
android/keystore.properties
```

3. Reference in `build.gradle` (see `build-release.md`)

## Important Notes

⚠️ **CRITICAL**: 
- **Lose the keystore = Cannot update your app**
- **Forget password = Cannot update your app**
- **Backup is essential**

✅ **Best Practices**:
- Store keystore in secure, backed-up location
- Use password manager for passwords
- Document keystore location
- Test keystore before first release

## Quick Reference

**Keystore file**: `cyberstition-release.keystore`
**Alias**: `cyberstition`
**Validity**: 10000 days (~27 years)
**Algorithm**: RSA 2048-bit

## Troubleshooting

### "keytool not found"
- Add JDK bin to PATH
- Or use full path: `C:\Program Files\Java\jdk-XX\bin\keytool.exe`

### "Invalid keystore format"
- Ensure you're using the correct keystore file
- Check file wasn't corrupted

### "Alias does not exist"
- List keystore to see available aliases
- Use correct alias name

