import { useState } from 'react';
import { api } from '../api/client';

export default function Tools() {
  const [repoUrl, setRepoUrl] = useState('');
  const [prefPort, setPrefPort] = useState<number>(3000);
  const [hostPort, setHostPort] = useState<number | undefined>(undefined);
  const [preflight, setPreflight] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [ttlHours, setTtlHours] = useState<number>(6);
  const [projectId, setProjectId] = useState('');
  const [security, setSecurity] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState('');

  const runPreflight = async () => {
    setLoading('preflight'); setError(''); setPreflight(null);
    try {
      const res = await api.buildPreflight({ repoUrl, preferredPort: prefPort, projectId: projectId || undefined, hostPort });
      setPreflight(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Preflight failed');
    } finally { setLoading(''); }
  };

  const createPreview = async () => {
    setLoading('preview'); setError(''); setPreview(null);
    try {
      const res = await api.previewCreate({ repoUrl, ttlHours, env: { NODE_ENV: 'production' } });
      setPreview(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Preview failed');
    } finally { setLoading(''); }
  };

  const destroyPreview = async () => {
    if (!preview?.previewId) return;
    setLoading('destroy'); setError('');
    try { await api.previewDestroy(preview.previewId); setPreview(null); } catch (e: any) { setError(e?.response?.data?.error || 'Destroy failed'); } finally { setLoading(''); }
  };

  const fetchSecurity = async () => {
    setLoading('security'); setError(''); setSecurity(null);
    try { const res = await api.getSecurity(projectId); setSecurity(res.data); } catch (e: any) { setError(e?.response?.data?.error || 'Security fetch failed'); } finally { setLoading(''); }
  };

  const inferHealth = async () => {
    setLoading('health'); setError(''); setHealth(null);
    try { const res = await api.healthSpec(repoUrl); setHealth(res.data); } catch (e: any) { setError(e?.response?.data?.error || 'Health spec failed'); } finally { setLoading(''); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Tools</h1>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Preflight Build</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input className="input" placeholder="Repo URL" value={repoUrl} onChange={e=>setRepoUrl(e.target.value)} />
          <input className="input" type="number" placeholder="Preferred Port" value={prefPort} onChange={e=>setPrefPort(parseInt(e.target.value,10)||3000)} />
          <input className="input" type="number" placeholder="Host Port (optional)" value={hostPort ?? ''} onChange={e=>{
            const v = e.target.value.trim();
            setHostPort(v === '' ? undefined : (parseInt(v,10)||undefined));
          }} />
          <input className="input" placeholder="Project ID (optional)" value={projectId} onChange={e=>setProjectId(e.target.value)} />
          <button className="btn-primary" onClick={runPreflight} disabled={loading==='preflight'}>
            {loading==='preflight' ? 'Running…' : 'Run Preflight'}
          </button>
        </div>
        {preflight && (
          <div className="space-y-2">
            <div>Strategy: <b>{preflight.build?.strategy}</b></div>
            <div>Image: <code>{preflight.build?.image}</code></div>
            <div>Smoke: {preflight.smoke?.ok ? 'OK' : 'FAILED'} on {preflight.smoke?.path} (status {preflight.smoke?.status})</div>
            <pre className="bg-black/40 p-3 rounded border border-gray-700 text-xs whitespace-pre-wrap">{preflight.build?.logs}</pre>
          </div>
        )}
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input className="input" placeholder="Repo URL" value={repoUrl} onChange={e=>setRepoUrl(e.target.value)} />
          <input className="input" type="number" placeholder="TTL hours" value={ttlHours} onChange={e=>setTtlHours(parseInt(e.target.value,10)||6)} />
          <button className="btn-primary" onClick={createPreview} disabled={loading==='preview'}>
            {loading==='preview' ? 'Creating…' : 'Create Preview'}
          </button>
          {preview?.previewId && (
            <button className="btn-secondary" onClick={destroyPreview} disabled={loading==='destroy'}>Destroy Preview</button>
          )}
        </div>
        {preview && (
          <div className="space-y-1">
            <div>ID: <code>{preview.previewId}</code></div>
            <div>URL: <a href={preview.url} target="_blank" className="text-electricCyan underline">{preview.url}</a></div>
            {preview.dbUrl && <div>DB: <code>{preview.dbUrl}</code></div>}
            <div>Expires: {preview.expires_at}</div>
          </div>
        )}
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Security</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input className="input" placeholder="Project ID" value={projectId} onChange={e=>setProjectId(e.target.value)} />
          <button className="btn-primary" onClick={fetchSecurity} disabled={loading==='security'}>
            {loading==='security' ? 'Loading…' : 'Get Security Summary'}
          </button>
        </div>
        {security && (
          <div>
            High: <b className="text-yellow-400">{security.high}</b> · Critical: <b className="text-red-400">{security.critical}</b>
            <ul className="list-disc ml-6 mt-2 text-sm text-gray-300">
              {(security.suggestions || []).map((s:string, i:number)=>(<li key={i}>{s}</li>))}
            </ul>
          </div>
        )}
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Health Spec</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input className="input" placeholder="Repo URL" value={repoUrl} onChange={e=>setRepoUrl(e.target.value)} />
          <button className="btn-primary" onClick={inferHealth} disabled={loading==='health'}>
            {loading==='health' ? 'Inferring…' : 'Infer Health'}
          </button>
        </div>
        {health && (
          <pre className="bg-black/40 p-3 rounded border border-gray-700 text-xs whitespace-pre-wrap">{JSON.stringify(health, null, 2)}</pre>
        )}
      </div>

      {error && (
        <div className="card bg-red-900/20 border-red-800 text-red-300">{error}</div>
      )}
    </div>
  );
}
