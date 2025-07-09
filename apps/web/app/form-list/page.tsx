"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FormListPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await fetch(`${API_BASE}/api/forms`);
        if (!res.ok) {
          throw new Error("Failed to fetch forms");
        }
        const data = await res.json();
        setForms(data.forms || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchForms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📁 View All Forms</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-600">❌ {error}</div>
      ) : (
        <ul className="space-y-2">
          {forms.length > 0 ? (
            forms.map((form) => (
              <li key={form.id} className="p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold">{form.name}</h2>
                <p className="text-sm text-gray-600">Created by: {form.created_by}</p>
                <p className="text-sm text-gray-600">Fields: {form.fields?.join(", ")}</p>
              </li>
            ))
          ) : (
            <p>No forms found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
