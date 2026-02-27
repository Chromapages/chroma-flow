import { useState, useEffect, useCallback } from 'react';

interface AgentStatus {
  status: 'idle' | 'thinking' | 'working' | 'typing' | 'waiting';
  message: string;
  timestamp: number;
}

interface AgentStates {
  [agentId: string]: AgentStatus;
}

// Demo agents for when API is unavailable
const DEMO_AGENTS: AgentStates = {
  'Chroma': {
    status: 'thinking',
    message: 'Orchestrating team workflows',
    timestamp: Date.now()
  },
  'Bender': {
    status: 'working',
    message: 'Building ChromaBase features',
    timestamp: Date.now() - 120000
  },
  'Pixel': {
    status: 'waiting',
    message: 'Monitoring ad campaigns',
    timestamp: Date.now() - 60000
  },
  'Prism': {
    status: 'idle',
    message: 'Ready for research tasks',
    timestamp: Date.now() - 300000
  },
  'Momentum': {
    status: 'thinking',
    message: 'Analyzing market trends',
    timestamp: Date.now() - 30000
  }
};

export function useAgentStatus(pollInterval = 5000) {
  const [agents, setAgents] = useState<AgentStates>({});
  const [useDemo, setUseDemo] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      // Try Pixel Office API first
      const response = await fetch('http://localhost:3456/api/agents/status', {
        signal: AbortSignal.timeout(2000)
      });
      if (response.ok) {
        const data = await response.json();
        setAgents(data.states || {});
        setUseDemo(false);
        return;
      }
    } catch {
      // Continue to fallback
    }

    try {
      // Try OpenClaw API
      const statusResponse = await fetch('/api/agents/status', {
        signal: AbortSignal.timeout(2000)
      });
      if (statusResponse.ok) {
        const data = await statusResponse.json();
        setAgents(data.states || {});
        setUseDemo(false);
        return;
      }
    } catch {
      // Continue to demo mode
    }

    // Fall back to demo mode with animated agents
    setUseDemo(true);
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, pollInterval);
    return () => clearInterval(interval);
  }, [fetchStatus, pollInterval]);

  // Animate demo agents periodically
  useEffect(() => {
    if (!useDemo) return;

    const demoMessages = [
      { status: 'thinking' as const, message: 'Processing requests...' },
      { status: 'working' as const, message: 'Executing tasks' },
      { status: 'typing' as const, message: 'Generating response' },
      { status: 'waiting' as const, message: 'Monitoring system' },
      { status: 'idle' as const, message: 'Ready' }
    ];

    const interval = setInterval(() => {
      setAgents(prev => {
        const agentIds = Object.keys(DEMO_AGENTS);
        const randomId = agentIds[Math.floor(Math.random() * agentIds.length)];
        const randomMsg = demoMessages[Math.floor(Math.random() * demoMessages.length)];
        
        return {
          ...prev,
          [randomId]: {
            status: randomMsg.status,
            message: randomMsg.message,
            timestamp: Date.now()
          }
        };
      });
    }, 3000);

    // Initialize with demo agents
    setAgents(DEMO_AGENTS);

    return () => clearInterval(interval);
  }, [useDemo]);

  return { agents, loading: false, error: null, isDemo: useDemo };
}

export function useModelSpend() {
  const [dailySpend, setDailySpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    async function fetchSpend() {
      try {
        const response = await fetch('/api/usage/today', {
          signal: AbortSignal.timeout(2000)
        });
        if (response.ok) {
          const data = await response.json();
          setDailySpend(data.total || 0);
          setUseDemo(false);
        } else {
          // Use demo data
          setDailySpend(4.87);
          setUseDemo(true);
        }
      } catch {
        // Use demo data
        setDailySpend(4.87);
        setUseDemo(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSpend();
    const interval = setInterval(fetchSpend, 60000);
    return () => clearInterval(interval);
  }, []);

  return { dailySpend, loading, isDemo: useDemo };
}

export type { AgentStatus, AgentStates };
