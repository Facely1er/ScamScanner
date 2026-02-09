# Cyberstition User Guide

## Introduction

Cyberstition helps you determine whether online content is trustworthy by analyzing multiple signals together and detecting patterns common to scams and fraud. This guide explains how to use the guided scan workflow for comprehensive, context-aware analysis.

## When to Use Cyberstition

Use Cyberstition when you're unsure about:
- Messages asking for money, credentials, or personal information
- Social media profiles offering deals or relationships
- Emails claiming to be from businesses or services
- Images that seem manipulated or suspicious
- Any online interaction that feels "off"

## The Guided Scan Workflow

### Step 1: Start a New Scan

From the home page, click "Start Guided Scan". This launches a complete analysis session that tracks all your evidence in one place.

### Step 2: Provide Context

The system asks for context about your situation:

**Where did you receive this?**
- Email - for messages in your inbox
- Social Media - for posts, profiles, or DMs
- Direct Message - for messaging app content
- SMS/Text - for text messages
- Not sure - if uncertain

**Additional Context (Optional but Helpful)**
- Sender name
- Your relationship to the sender
- What action they're requesting
- Any other relevant details

This context helps the system:
- Prioritize which checks to run first
- Interpret findings more accurately
- Provide relevant recommendations

### Step 3: Add Evidence

The system shows you a workflow with recommended analysis steps. Each step corresponds to a type of evidence:

#### Message Content Analysis
Analyzes text for:
- Urgency tactics ("act now", "last chance")
- Reward promises ("you've won", "free money")
- Credential requests ("verify your account")
- Impersonation indicators ("support team", "security alert")
- Generic phrasing common in mass scams

**When to use**: Any time you have message text to analyze

#### Sender Profile Analysis
Examines profile for:
- Generic or auto-generated usernames
- Empty or suspicious bio
- Unusual follower/following ratios
- New account age
- Scam-related keywords ("crypto", "investment", "giveaway")
- No posts or activity

**When to use**: When you have profile information from social media or messaging platforms

#### Email Header Analysis
Checks email metadata for:
- SPF/DKIM/DMARC authentication failures
- Mismatched sender addresses
- Suspicious routing paths
- Reply-To inconsistencies

**When to use**: For emails, especially those requesting action or containing links

#### Image Analysis
Inspects image metadata for:
- Unusual file properties
- Generic filenames suggesting reuse
- Large file sizes
- Format inconsistencies

**When to use**: When images are attached or shared, especially profile pictures or "proof" documents

### Step 4: Review Findings

As you add evidence, the system continuously updates:

#### Confidence Meter
Shows how confident the analysis is based on:
- Number of evidence types analyzed
- Pattern matches found
- Cross-references detected

Higher confidence means more reliable assessment.

#### Risk Assessment
- **Risk Level**: Low, Medium, or High
- **Risk Score**: 0-100 numeric rating
- **Threat Category**: Type of scam detected (if any)

#### Pattern Matches
Shows detected threat patterns like:
- Classic Phishing Attack
- Romance Scam (Early/Advanced Stage)
- Investment Fraud
- Brand Impersonation
- Suspicious Attachment

Each pattern shows:
- Description of the tactic
- Confidence percentage
- Why it was detected

#### Cross-Reference Findings
Relationships between evidence pieces:
- **Inconsistencies**: Conflicting signals (red flag)
- **Correlations**: Signals reinforcing each other
- **Confirmations**: Independent verification

Example: "High-risk profile combined with high-risk message strongly indicates scam attempt"

#### Recommended Actions
Context-aware guidance based on your findings:
- High risk: "Do not proceed with requested actions"
- Medium risk: "Verify sender through independent channel"
- Low risk: "Consider additional analysis to increase confidence"

### Step 5: Complete and Save

When you're satisfied with the analysis:
1. Click "Complete and Save"
2. Session is saved to your dashboard
3. Review anytime from dashboard

## Understanding Risk Levels

### Low Risk (Score 0-34)
- Few or no concerning signals detected
- May still warrant caution depending on context
- Consider additional verification if high-stakes

### Medium Risk (Score 35-59)
- Multiple concerning signals present
- Significant caution warranted
- Verify through independent channels before proceeding
- Do not share sensitive information yet

### High Risk (Score 60-100)
- Strong indicators of fraud or scam
- Do not proceed with requested actions
- Block and report the sender
- Multiple patterns or cross-references detected

## Interpreting Confidence Scores

Confidence indicates how reliable the risk assessment is:

### Low Confidence (<50%)
- Limited evidence analyzed
- Consider adding more evidence types
- Assessment may change significantly with more data

### Medium Confidence (50-75%)
- Reasonable evidence coverage
- Patterns detected or multiple evidence types analyzed
- Assessment is moderately reliable

### High Confidence (>75%)
- Comprehensive analysis completed
- Multiple evidence types analyzed
- Clear patterns detected
- Cross-references found
- Assessment is highly reliable

## Common Threat Patterns

### Classic Phishing
Characteristics:
- Urgency + credential request
- Brand impersonation
- Email authentication failures
- Links to fake websites

### Romance Scam (Early Stage)
Characteristics:
- New profile with minimal information
- Generic username/bio
- Low activity or fake-looking metrics
- Quick to express interest

### Romance Scam (Advanced)
Characteristics:
- Request to move off-platform
- Urgency about communication
- Stories involving crisis or opportunity
- Eventually requests money

### Investment Fraud
Characteristics:
- Promises of high returns
- Urgency to invest now
- Minimal verifiable details
- Cryptocurrency or forex mentions

### Brand Impersonation
Characteristics:
- Claims to be from known company
- Requests urgent action
- Email doesn't match official domain
- Generic greeting ("Dear customer")

## Tips for Effective Analysis

### 1. Start with Context
The more context you provide, the better the system can guide you. Include details about:
- How the interaction started
- What seems suspicious
- What they're asking for

### 2. Analyze Multiple Evidence Types
- Don't rely on just one check
- Profile + Message gives much stronger signal
- Email headers crucial for email-based threats

### 3. Look for Cross-References
Pay attention to inconsistencies like:
- Professional message from suspicious profile
- Personal story from brand-new account
- Urgent request from unverified sender

### 4. Trust Your Instincts
If something feels wrong, it probably is, even if analysis shows lower risk. The tools provide indicators, not certainty.

### 5. Verify Independently
For important decisions:
- Contact the person/company through official channels
- Look up phone numbers/emails independently
- Ask questions only the real person would know

## Dashboard and History

### Viewing Past Scans

1. Go to Dashboard
2. Click "Scan Sessions" tab
3. See all your completed analyses

Each session shows:
- Sender and origin
- Risk level and score
- Confidence percentage
- Number of evidence pieces
- Patterns detected
- Last updated date

### Reviewing Session Details

Click "View Details" on any session to see:
- Complete risk assessment
- All pattern matches
- Cross-reference findings
- Evidence analyzed
- Recommended actions

Use this to:
- Reference past analyses
- Track similar senders
- Learn from previous scams

## Using Individual Tools

You can still use the original single-purpose tools:

- **Messages** - Quick message text analysis
- **Profiles** - Standalone profile check
- **Images** - Image metadata inspection
- **Email** - Email header verification

These provide fast, focused analysis when you don't need a complete scan session.

## Limitations and Disclaimers

### What Cyberstition Can Do
- Detect common scam patterns
- Identify suspicious signals
- Provide risk indicators
- Guide your analysis process

### What Cyberstition Cannot Do
- Guarantee 100% accuracy
- Prove something is definitely a scam
- Replace human judgment
- Access external verification systems

### Important Reminders
- Tools provide indicators, not proof
- False positives can occur
- Legitimate content may show some signals
- Always verify before taking important actions
- When in doubt, seek professional help

## Privacy and Data

### Your Data Never Leaves Your Device
- All analysis runs in your browser
- Sessions saved in browser local storage only
- No uploads to servers
- No tracking or monitoring

### What Gets Stored Locally
- Scan session context and findings
- Evidence you analyzed
- Pattern matches and scores
- Analysis history

### Clearing Data
- Use browser settings to clear site data
- Or use Export/Import in Dashboard to backup then clear

## Getting Help

### If You're Unsure
- Analyze more evidence to increase confidence
- Look for educational content in the app
- Consult with trusted friends or family
- Report to authorities if you suspect crime

### Reporting Scams
If you've been targeted:
- **FBI IC3**: ic3.gov (US)
- **FTC**: reportfraud.ftc.gov (US)
- **Action Fraud**: actionfraud.police.uk (UK)
- Local police or consumer protection agency

## Best Practices

1. **Analyze before acting** - Never rush important decisions
2. **Trust your instincts** - If it feels wrong, investigate more
3. **Verify independently** - Don't use contact info they provide
4. **Keep records** - Save scan sessions for reference
5. **Stay informed** - Learn about common scam tactics
6. **Share knowledge** - Help others recognize scams

Remember: Scammers are sophisticated and constantly evolving. Stay vigilant, verify independently, and when in doubt, don't proceed.
