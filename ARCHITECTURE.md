# Cyberstition Architecture

## Overview

Cyberstition has been reorganized into a context-aware scam scanner that provides intelligent, guided analysis through a unified workflow. The system analyzes multiple signals together, detects cross-signal patterns, and provides confidence-rated risk assessments with clear reasoning.

## Key Features

### 1. Context-Aware Analysis
- Collects context about how content was received
- Tracks sender information, relationship, and requested actions
- Uses context to prioritize analysis steps and interpret findings

### 2. Unified Scan Sessions
- Single workflow replacing separate tool-by-tool analysis
- Tracks complete investigation from start to finish
- Persists sessions in localStorage for later review

### 3. Pattern Detection
- Pre-loaded threat pattern library identifying common scam tactics
- Detects phishing, romance scams, investment fraud, impersonation
- Pattern matching across multiple evidence types

### 4. Cross-Signal Correlation
- Identifies inconsistencies between different evidence pieces
- Detects correlations that increase confidence
- Provides transparent reasoning for findings

### 5. Confidence Scoring
- Calculates confidence based on evidence coverage
- Weights pattern matches and cross-references
- Shows clear breakdown of risk assessment

### 6. Smart Workflow Guidance
- Recommends next analysis steps based on current findings
- Adapts to evidence already collected
- Prioritizes required checks for the context

## Architecture Components

### Data Layer

#### Types (`src/types/scan.ts`)
- `ScanSession`: Complete scan workflow with evidence and findings
- `EvidenceItem`: Individual analyzed artifact with signals
- `Signal`: Specific risk indicator from analysis
- `PatternMatch`: Detected threat pattern with confidence
- `CrossReference`: Relationship between evidence pieces
- `WorkflowStep`: Analysis step in guided workflow

#### Pattern Library (`src/data/patternLibrary.ts`)
- Pre-defined threat patterns with detection rules
- Correlation rules for cross-signal analysis
- Confidence weighting for pattern matching
- Extensible pattern system for new threat types

### Service Layer

#### Unified Analyzer (`src/services/unifiedAnalyzer.ts`)
- Orchestrates existing analysis tools
- Converts tool output to structured signals
- Produces standardized evidence items
- Maintains backward compatibility with existing analyzers

#### Pattern Matcher (`src/services/patternMatcher.ts`)
- Detects patterns across evidence collection
- Finds cross-references and correlations
- Calculates overall risk and confidence
- Determines threat category from patterns

### State Management

#### Session Store (`src/state/sessionStore.ts`)
- Zustand store managing scan sessions
- Automatic localStorage persistence
- Session lifecycle management
- Workflow step tracking and recommendations

### UI Components

#### Scan Workspace (`src/app/routes/scan.tsx`)
- Context collection form
- Unified analysis interface
- Real-time confidence meter
- Progress tracking and workflow guidance
- Evidence analyzers for each type
- Results panel with patterns and cross-references

#### Dashboard (`src/app/routes/dashboard.tsx`)
- Lists scan sessions with risk summaries
- Shows pattern matches and evidence count
- Access to both new sessions and legacy reports
- Session detail view with complete findings

## Data Flow

1. **Session Creation**
   - User provides context (origin, sender, relationship)
   - System creates new scan session
   - Initializes workflow steps based on context

2. **Evidence Collection**
   - User adds evidence (message, email, profile, image)
   - System analyzes and extracts signals
   - Evidence added to session

3. **Pattern Detection**
   - System matches signals against pattern library
   - Evaluates correlation rules
   - Identifies cross-references between evidence

4. **Risk Calculation**
   - Aggregates evidence scores
   - Weights pattern matches
   - Applies cross-reference bonuses
   - Calculates confidence based on coverage

5. **Guidance Generation**
   - Identifies incomplete workflow steps
   - Generates recommendations based on findings
   - Suggests next actions for user

6. **Session Completion**
   - User marks session as complete
   - Full session saved to localStorage
   - Available in dashboard for future review

## Local-First Architecture

All processing happens entirely in the browser:

- **No Server Required**: All analysis runs client-side
- **localStorage**: Session persistence without backend
- **Pattern Library**: Pre-loaded threat definitions
- **Privacy Preserving**: Data never leaves device
- **Offline Capable**: Works without internet connection

## Pattern System

### Threat Patterns

Each pattern defines:
- Signal types to match
- Required number of signals
- Correlation rules to evaluate
- Confidence weighting

Example: Classic Phishing Pattern
```typescript
{
  id: 'phishing_classic',
  signalTypes: ['urgency', 'credentials', 'impersonation', 'link'],
  requiredSignals: 3,
  correlationRules: [urgencyPressureRule, emailSpoofingRule],
  confidenceWeight: 0.9
}
```

### Correlation Rules

Rules detect relationships across evidence:
- **Inconsistency**: Conflicting signals reducing trust
- **Correlation**: Signals reinforcing each other
- **Confirmation**: Independent verification

Example: Urgency + Action Request
```typescript
{
  checkType: 'correlation',
  evaluate: (evidence) => {
    // Check for time pressure + credential request
    // Return match status and confidence
  }
}
```

## Extending the System

### Adding New Patterns

1. Define pattern in `src/data/patternLibrary.ts`
2. Specify signal types to match
3. Create correlation rules
4. Set confidence weight

### Adding New Signal Types

1. Update analyzers in `src/services/unifiedAnalyzer.ts`
2. Map new signals from tool output
3. Reference in pattern definitions

### Adding New Evidence Types

1. Create analyzer function in `src/services/unifiedAnalyzer.ts`
2. Add to `EvidenceType` union in `src/types/scan.ts`
3. Create analyzer UI in scan workspace
4. Update workflow steps

## Backward Compatibility

The system maintains compatibility with existing features:
- Original tool pages still accessible
- Legacy reports visible in dashboard
- Existing analyzers unchanged
- Gradual migration path for users

## Future Enhancements

Potential improvements:
- Machine learning pattern detection
- User feedback loop for false positives
- Pattern library updates via app updates
- Export/import of pattern definitions
- Community pattern sharing
- Advanced visualization of evidence relationships
