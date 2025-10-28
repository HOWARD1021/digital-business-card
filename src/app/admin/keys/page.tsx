"use client";

import { useEffect, useState } from 'react';

export default function KeysAdminPage() {
  const [paidKey, setPaidKey] = useState('');
  const [freeKey, setFreeKey] = useState('');
  const [status, setStatus] = useState<{ configured: boolean; updatedAt: number | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  async function loadStatus() {
    const res = await fetch('/api/admin/keys/status');
    const data = await res.json();
    setStatus(data);
  }

  useEffect(() => { loadStatus(); }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setOk(false);
    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidKey, freeKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失敗');
      setOk(true);
      setPaidKey(''); setFreeKey('');
      loadStatus();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }} className="mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">API Keys 管理</h1>
      <p className="text-sm text-gray-500 mb-4">金鑰僅在伺服端加密保存，且不會在此頁面顯示明文。</p>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Paid API Key</label>
          <input type="password" value={paidKey} onChange={e => setPaidKey(e.target.value)} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Free API Key (可選)</label>
          <input type="password" value={freeKey} onChange={e => setFreeKey(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
          {saving ? '儲存中…' : '儲存'}
        </button>
      </form>

      {ok && <p className="text-green-600 mt-3">保存成功</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}

      <div className="mt-6 text-sm text-gray-600">
        <p>目前狀態：{status?.configured ? '已設定' : '未設定'}</p>
        {status?.updatedAt && <p>最後更新：{new Date(status.updatedAt).toLocaleString()}</p>}
      </div>
    </div>
  );
}