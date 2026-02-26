import { useState, useEffect } from 'react';

interface AgentStatus {
  status: 'idle' | 'thinking' | 'working' | 'typing' | 'waiting';
  message: string;
  timestamp: number;
}

interface AgentStates {
  [agentId: string]: AgentStatus;
}

export function useAgentStatus(pollInterval = 3000) {
  const [agents, setAgents] = useState<AgentStates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        // Try Pixel Office API first
        const response = await fetch('http://localhost:3456/api/agents/status');
        if (response.ok) {
          const data = await response.json();
          setAgents(data.states || {});
          setError(null);
        } else {
          // Fallback: use OpenClaw CLI
          const statusResponse = await fetch('/api/agents/status');
          if (statusResponse.ok) {
            const data = await statusResponse.json();
            setAgents(data.states || {});
          }
        }
      } catch (err) {
        // API not available - this is expected if Pixel Office isn't running
        setError('Agent API unavailable');
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  return { agents, loading, error };
}

export function useModelSpend() {
  const [dailySpend, setDailySpend] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpend() {
      try {
        // This would connect to OpenClaw's usage API
        // For now, return mock data structure
        const response = await fetch('/api/usage/today');
        if (response.ok) {
          const data = await response.json();
          setDailySpend(data.total || 0);
        }
      } catch {
        // Mock data for now
        setDailySpend(0);
      } finally {
        setLoading(false);
      }
    }

    fetchSpend();
    const interval = setInterval(fetchSpend, 60000);
    return () => clearInterval(interval);
  }, []);

  return { dailySpend, loading };
}

export type { AgentStatus, AgentStates };
