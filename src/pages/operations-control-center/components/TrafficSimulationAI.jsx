import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const defaultInputs = {
  horizon: '30', // minutes
  incidentType: 'signal_failure',
  sections: ['North'],
  congestion: 72, // percent
  trainsInSection: 12,
};

const INCIDENT_OPTIONS = [
  { value: 'signal_failure', label: 'Signal Failure' },
  { value: 'track_maintenance', label: 'Track Maintenance' },
  { value: 'weather', label: 'Weather Impact' },
  { value: 'equipment', label: 'Equipment Fault' },
  { value: 'congestion', label: 'Congestion' },
];

const SECTION_OPTIONS = ['North', 'South', 'East', 'West', 'Central'];

const TrafficSimulationAI = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [backendResult, setBackendResult] = useState(null);
  const [aiResult, setAIResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  useEffect(() => {
    try {
      const k = localStorage.getItem('gemini_api_key') || '';
      if (k) setGeminiKey(k);
    } catch {}
  }, []);

  const saveKey = () => {
    setSavingKey(true);
    try {
      localStorage.setItem('gemini_api_key', geminiKey || '');
    } catch {}
    setTimeout(() => setSavingKey(false), 400);
  };

  const handleRunBackend = async () => {
    setLoading(true);
    setError('');
    setBackendResult(null);
    try {
      const res = await fetch('/api/simulate-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          horizonMinutes: Number(inputs.horizon),
          incidentType: inputs.incidentType,
          sections: inputs.sections,
          congestion: inputs.congestion,
          trainsInSection: inputs.trainsInSection,
        }),
      });

      if (!res.ok) {
        // Fall back to a mock if backend isn't wired yet
        const mock = buildHeuristic(inputs);
        setBackendResult({ ...mock, _mocked: true });
      } else {
        const data = await res.json();
        setBackendResult(data);
      }
    } catch (e) {
      const mock = buildHeuristic(inputs);
      setBackendResult({ ...mock, _mocked: true });
    } finally {
      setLoading(false);
    }
  };

  const buildHeuristic = (inps) => {
    // Simple heuristic "backend" for first-time feasibility
    const baseDelay = inps.congestion / 12 + (inps.incidentType === 'signal_failure' ? 8 : 0);
    const recommendedSpeedCap = inps.incidentType === 'weather' ? 65 : 75;
    const holdAtJunctions = inps.congestion > 70 ? Math.ceil(inps.trainsInSection / 4) : 0;

    return {
      horizonMinutes: Number(inps.horizon),
      sections: inps.sections,
      expectedAvgDelay: Math.round(baseDelay),
      actions: {
        speedCapKmph: recommendedSpeedCap,
        temporaryHolds: holdAtJunctions,
        reroutes: inps.incidentType === 'track_maintenance' ? 2 : 1,
      },
      notes: 'Heuristic estimate based on congestion, incident type and train count.'
    };
  };

  const handleRunGemini = async () => {
    setLoading(true);
    setError('');
    setAIResult(null);

    if (!geminiKey) {
      setError('Please enter your Gemini API key to run AI estimation.');
      setLoading(false);
      return;
    }

    try {
      const prompt = buildPrompt(inputs);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${encodeURIComponent(geminiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ]
        })
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Gemini API error');
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      setAIResult(parseAiText(text));
    } catch (e) {
      setError('AI estimation failed. Check API key and network.');
    } finally {
      setLoading(false);
    }
  };

  const buildPrompt = (inps) => {
    return [
      'You are an operations assistant for Indian Railways. Given the inputs, estimate traffic management actions for the horizon.',
      `Horizon (min): ${inps.horizon}`,
      `Incident: ${inps.incidentType}`,
      `Sections: ${inps.sections.join(', ')}`,
      `Congestion(%): ${inps.congestion}`,
      `Trains In Section: ${inps.trainsInSection}`,
      'Return JSON with fields: expectedAvgDelay (min), actions { speedCapKmph, temporaryHolds, reroutes }, notes.',
    ].join('\n');
  };

  const parseAiText = (text) => {
    try {
      // Try to find JSON in the response; fallback to heuristic parser
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { raw: text };
    } catch {
      return { raw: text };
    }
  };

  const disabled = loading;

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Bot" size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">AI Traffic Simulation (Backend)</h3>
        </div>
        <div className="text-xs text-muted-foreground">Experimental</div>
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <div className="p-2 text-sm bg-error/10 text-error rounded border border-error/30">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Horizon (min)</label>
            <select
              className="w-full mt-1 border border-border rounded bg-background text-foreground text-sm p-2"
              value={inputs.horizon}
              onChange={(e) => setInputs({ ...inputs, horizon: e.target.value })}
              disabled={disabled}
            >
              {['15','30','45','60'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Incident Type</label>
            <select
              className="w-full mt-1 border border-border rounded bg-background text-foreground text-sm p-2"
              value={inputs.incidentType}
              onChange={(e) => setInputs({ ...inputs, incidentType: e.target.value })}
              disabled={disabled}
            >
              {INCIDENT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Congestion (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full mt-1 border border-border rounded bg-background text-foreground text-sm p-2"
              value={inputs.congestion}
              onChange={(e) => setInputs({ ...inputs, congestion: Math.max(0, Math.min(100, Number(e.target.value))) })}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Trains In Section</label>
            <input
              type="number"
              min={0}
              className="w-full mt-1 border border-border rounded bg-background text-foreground text-sm p-2"
              value={inputs.trainsInSection}
              onChange={(e) => setInputs({ ...inputs, trainsInSection: Math.max(0, Number(e.target.value)) })}
              disabled={disabled}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-muted-foreground">Sections</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {SECTION_OPTIONS.map(sec => {
                const active = inputs.sections.includes(sec);
                return (
                  <button
                    type="button"
                    key={sec}
                    onClick={() => {
                      setInputs(prev => ({
                        ...prev,
                        sections: active ? prev.sections.filter(s => s !== sec) : [...prev.sections, sec]
                      }));
                    }}
                    className={`px-2 py-1 text-xs rounded border ${active ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground border-border hover:text-foreground'}`}
                    disabled={disabled}
                  >
                    {sec}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">Gemini API</div>
          <div className="text-xs text-muted-foreground">Enter your Google Gemini API key (stored locally) for AI-based estimation.</div>
          <div className="flex items-center space-x-2">
            <input
              type="password"
              className="flex-1 border border-border rounded bg-background text-foreground text-sm p-2"
              placeholder="Enter Gemini API Key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              disabled={disabled}
            />
            <Button size="sm" onClick={saveKey} disabled={disabled || savingKey}>
              <Icon name="Save" size={14} />
              <span className="ml-1">Save</span>
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button onClick={handleRunBackend} disabled={disabled}>
            <Icon name="Server" size={14} />
            <span className="ml-1">Run Backend Simulation</span>
          </Button>
          <Button variant="secondary" onClick={handleRunGemini} disabled={disabled}>
            <Icon name="Sparkles" size={14} />
            <span className="ml-1">Run AI Estimate</span>
          </Button>
        </div>

        {/* Results */}
        {(backendResult || aiResult) && (
          <div className="space-y-3 pt-2">
            {backendResult && (
              <div className="p-3 rounded border border-border bg-muted/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Server" size={14} />
                  <div className="text-sm font-medium">Backend Result {backendResult?._mocked && '(mocked)'}</div>
                </div>
                <pre className="text-xs whitespace-pre-wrap text-foreground">{JSON.stringify(backendResult, null, 2)}</pre>
              </div>
            )}
            {aiResult && (
              <div className="p-3 rounded border border-border bg-muted/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Sparkles" size={14} />
                  <div className="text-sm font-medium">AI Estimate (Gemini)</div>
                </div>
                <pre className="text-xs whitespace-pre-wrap text-foreground">{JSON.stringify(aiResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Feasibility Note */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          <div className="font-medium text-foreground mb-1">Feasibility</div>
          - Backend endpoint expected at <code>/api/simulate-traffic</code>. If unreachable, a heuristic mock is used.<br />
          - Gemini integration uses REST API. Provide your API key in the field above. Keys are stored only in your browser (localStorage).<br />
          - Production setup requires a small server (or serverless function) to compute realistic traffic states and to proxy AI calls if needed.
        </div>
      </div>
    </div>
  );
};

export default TrafficSimulationAI;
