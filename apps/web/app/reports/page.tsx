"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Entry = {
  id: string;
  form_id: string;
  user_id: string;
  data: Record<string, any>;
  reported: boolean;
  report_note: string | null;
  created_at: string;
};

export default function ReportsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(`${API_BASE}/api/forms/entries`);
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(data.entries || []);
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  if (loading) return <div className="p-6">Loading reports...</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load reports.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Form Reports</h1>

      {entries.length === 0 ? (
        <p>No form entries found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Form ID</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Submitted At</th>
              <th className="p-2 border">Reported?</th>
              <th className="p-2 border">Report Note</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="text-sm">
                <td className="p-2 border">{entry.form_id}</td>
                <td className="p-2 border">{entry.user_id}</td>
                <td className="p-2 border">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
                <td className="p-2 border">{entry.reported ? "✅ Yes" : "❌ No"}</td>
                <td className="p-2 border text-xs">{entry.report_note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
