"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FormBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formName, setFormName] = useState("");
  const [fieldList, setFieldList] = useState<string[]>([]);
  const [newField, setNewField] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/api/auth/signin");
    } else if (session.user.role !== "ADMIN") {
      router.replace("/unauthorized");
    }
  }, [session, status]);

  const handleSubmit = async () => {
    if (!formName || fieldList.length === 0) {
      alert("Form name and at least one field are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/forms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session?.user?.id ?? "",
        },
        body: JSON.stringify({ name: formName, fields: fieldList }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Form created successfully!");
        setFormName("");
        setFieldList([]);
      } else {
        setMessage(`❌ Error: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      setMessage("❌ Failed to submit form.");
    }
  };

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create a New Form</h1>

      {message && (
        <div className="mb-4 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded">
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Form Name</label>
        <input
          type="text"
          placeholder="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a field"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded"
        />
        <button
          onClick={() => {
            if (newField.trim()) {
              setFieldList([...fieldList, newField.trim()]);
              setNewField("");
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="mb-4 list-disc pl-5 text-gray-800">
        {fieldList.map((field, idx) => (
          <li key={idx}>{field}</li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Create Form
      </button>
    </div>
  );
}
