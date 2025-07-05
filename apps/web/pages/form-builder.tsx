import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FormBuilderPage() {
  const { data: session } = useSession();

  const [formName, setFormName] = useState("");
  const [fieldList, setFieldList] = useState<string[]>([]);
  const [newField, setNewField] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/forms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session?.user?.id ?? "admin-id", // for now using admin-id
      },
      body: JSON.stringify({
        name: formName,
        fields: fieldList,
      }),
    });

    const data = await res.json();
    alert(data.message || "Submitted!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Form</h1>

      <input
        type="text"
        placeholder="Form Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a field"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={() => {
            if (newField.trim()) {
              setFieldList([...fieldList, newField]);
              setNewField("");
            }
          }}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="mb-4 list-disc pl-5">
        {fieldList.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Create Form
      </button>
    </div>
  );
}
