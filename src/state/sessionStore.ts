import { create } from 'zustand';
import { ScanSession, EvidenceItem, ScanContext, WorkflowStep } from '../types/scan';
import { detectPatterns, findCrossReferences, calculateOverallRisk, determineThreatCategory } from '../services/patternMatcher';

interface SessionStore {
  currentSession: ScanSession | null;
  sessions: ScanSession[];

  createSession: (context: ScanContext) => string;
  updateContext: (context: Partial<ScanContext>) => void;
  addEvidence: (evidence: EvidenceItem) => void;
  completeSession: () => void;
  pauseSession: () => void;
  resumeSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  loadSession: (sessionId: string) => void;
  clearCurrentSession: () => void;

  getWorkflowSteps: () => WorkflowStep[];
  getNextRecommendedStep: () => WorkflowStep | null;
}

function recalculateSession(session: ScanSession): ScanSession {
  const patterns = detectPatterns(session.evidence);
  const crossRefs = findCrossReferences(session.evidence);
  const allSignals = session.evidence.flatMap(e => e.signals);
  const riskCalc = calculateOverallRisk(session.evidence, patterns, crossRefs);
  const threatCategory = determineThreatCategory(patterns);

  const analyzedTypes = new Set(session.evidence.map(e => e.type));
  const totalSteps = 5; // Updated to include video
  const completionPercentage = (analyzedTypes.size / totalSteps) * 100;

  const nextSteps = generateNextSteps(session, patterns, riskCalc);

  return {
    ...session,
    signals: allSignals,
    patternMatches: patterns,
    crossReferences: crossRefs,
    overallRiskScore: riskCalc.score,
    overallRiskLevel: riskCalc.level,
    threatCategory,
    confidence: riskCalc.confidence,
    completionPercentage,
    nextSteps,
    updatedAt: Date.now()
  };
}

function generateNextSteps(
  session: ScanSession,
  patterns: any[],
  riskCalc: { level: string; confidence: number }
): string[] {
  const steps: string[] = [];
  const analyzedTypes = new Set(session.evidence.map(e => e.type));

  if (riskCalc.level === 'high' && riskCalc.confidence > 0.7) {
    steps.push('Do not proceed with any requested actions (payments, sharing credentials, etc.)');
    steps.push('Block or report the sender through the appropriate platform');
  }

  if (!analyzedTypes.has('profile') && (analyzedTypes.has('message') || analyzedTypes.has('email'))) {
    steps.push('Verify sender profile to assess authenticity');
  }

  if (!analyzedTypes.has('email') && session.context.origin === 'email') {
    steps.push('Analyze email headers to check for spoofing');
  }

  if (!analyzedTypes.has('message') && patterns.some(p => p.category === 'phishing')) {
    steps.push('Analyze message content for additional phishing indicators');
  }

  if (riskCalc.level === 'medium') {
    steps.push('Verify sender identity through an independent channel (official website, known contact)');
    steps.push('Do not click links or download attachments until verified');
  }

  if (riskCalc.level === 'low' && riskCalc.confidence < 0.5) {
    steps.push('Consider analyzing additional evidence to increase confidence');
  }

  if (steps.length === 0) {
    steps.push('Review all findings carefully before taking any action');
  }

  return steps;
}

const loadSessionsFromStorage = (): ScanSession[] => {
  try {
    const stored = localStorage.getItem('cyberstition_scan_sessions');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSessionsToStorage = (sessions: ScanSession[]) => {
  try {
    localStorage.setItem('cyberstition_scan_sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  sessions: loadSessionsFromStorage(),

  createSession: (context: ScanContext) => {
    const id = crypto.randomUUID();
    const newSession: ScanSession = {
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'in_progress',
      context,
      evidence: [],
      signals: [],
      patternMatches: [],
      crossReferences: [],
      overallRiskScore: 0,
      overallRiskLevel: 'low',
      threatCategory: 'unknown',
      confidence: 0,
      nextSteps: ['Begin by adding evidence to analyze'],
      completionPercentage: 0
    };

    set(state => {
      const sessions = [newSession, ...state.sessions];
      saveSessionsToStorage(sessions);
      return { currentSession: newSession, sessions };
    });

    return id;
  },

  updateContext: (contextUpdate: Partial<ScanContext>) => {
    set(state => {
      if (!state.currentSession) return state;

      const updatedSession = {
        ...state.currentSession,
        context: { ...state.currentSession.context, ...contextUpdate },
        updatedAt: Date.now()
      };

      const sessions = state.sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );
      saveSessionsToStorage(sessions);

      return { currentSession: updatedSession, sessions };
    });
  },

  addEvidence: (evidence: EvidenceItem) => {
    set(state => {
      if (!state.currentSession) return state;

      const updatedSession = recalculateSession({
        ...state.currentSession,
        evidence: [...state.currentSession.evidence, evidence]
      });

      const sessions = state.sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );
      saveSessionsToStorage(sessions);

      return { currentSession: updatedSession, sessions };
    });
  },

  completeSession: () => {
    set(state => {
      if (!state.currentSession) return state;

      const updatedSession = {
        ...state.currentSession,
        status: 'completed' as const,
        updatedAt: Date.now()
      };

      const sessions = state.sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );
      saveSessionsToStorage(sessions);

      return { currentSession: updatedSession, sessions };
    });
  },

  pauseSession: () => {
    set(state => {
      if (!state.currentSession) return state;

      const updatedSession = {
        ...state.currentSession,
        status: 'paused' as const,
        updatedAt: Date.now()
      };

      const sessions = state.sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );
      saveSessionsToStorage(sessions);

      return { sessions };
    });
  },

  resumeSession: (sessionId: string) => {
    set(state => {
      const session = state.sessions.find(s => s.id === sessionId);
      if (!session) return state;

      const updatedSession = {
        ...session,
        status: 'in_progress' as const,
        updatedAt: Date.now()
      };

      const sessions = state.sessions.map(s =>
        s.id === sessionId ? updatedSession : s
      );
      saveSessionsToStorage(sessions);

      return { currentSession: updatedSession, sessions };
    });
  },

  deleteSession: (sessionId: string) => {
    set(state => {
      const sessions = state.sessions.filter(s => s.id !== sessionId);
      saveSessionsToStorage(sessions);

      const currentSession = state.currentSession?.id === sessionId
        ? null
        : state.currentSession;

      return { sessions, currentSession };
    });
  },

  loadSession: (sessionId: string) => {
    set(state => {
      const session = state.sessions.find(s => s.id === sessionId);
      return session ? { currentSession: session } : state;
    });
  },

  clearCurrentSession: () => {
    set({ currentSession: null });
  },

  getWorkflowSteps: () => {
    const state = get();
    if (!state.currentSession) return [];

    const analyzedTypes = new Set(state.currentSession.evidence.map(e => e.type));

    const steps: WorkflowStep[] = [
      {
        id: 'message',
        type: 'message',
        label: 'Message Content',
        description: 'Analyze message text for scam patterns',
        priority: state.currentSession.context.origin === 'direct_message' ? 1 : 2,
        completed: analyzedTypes.has('message'),
        required: true
      },
      {
        id: 'profile',
        type: 'profile',
        label: 'Sender Profile',
        description: 'Verify profile authenticity and history',
        priority: state.currentSession.context.origin === 'social_media' ? 1 : 2,
        completed: analyzedTypes.has('profile'),
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Headers',
        description: 'Check email authentication and routing',
        priority: state.currentSession.context.origin === 'email' ? 1 : 3,
        completed: analyzedTypes.has('email'),
        required: state.currentSession.context.origin === 'email'
      },
      {
        id: 'image',
        type: 'image',
        label: 'Image Analysis',
        description: 'Inspect image metadata and properties',
        priority: 4,
        completed: analyzedTypes.has('image'),
        required: false
      },
      {
        id: 'video',
        type: 'video',
        label: 'Video Analysis',
        description: 'Inspect video metadata and properties',
        priority: 5,
        completed: analyzedTypes.has('video'),
        required: false
      }
    ];

    return steps.sort((a, b) => a.priority - b.priority);
  },

  getNextRecommendedStep: () => {
    const steps = get().getWorkflowSteps();
    const incomplete = steps.filter(s => !s.completed);
    return incomplete.length > 0 ? incomplete[0] : null;
  }
}));
