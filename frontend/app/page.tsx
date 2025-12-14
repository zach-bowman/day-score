"use client";

import { useState, useEffect } from "react";
import { Entry, CreateEntryRequest, UpdateEntryRequest } from "./types/entry";
import { fetchEntries, createEntry, updateEntry, deleteEntry } from "./services/api";
import EntryForm from "./components/EntryForm";
import EntryList from "./components/EntryList";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch {
      setError("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateEntryRequest | UpdateEntryRequest) => {
    await createEntry(data as CreateEntryRequest);
    await loadEntries();
    setShowForm(false);
  };

  const handleUpdate = async (data: CreateEntryRequest | UpdateEntryRequest) => {
    if (!editingEntry) return;
    await updateEntry(editingEntry.id, data as UpdateEntryRequest);
    await loadEntries();
    setEditingEntry(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      await deleteEntry(id);
      await loadEntries();
    }
  };

  const renderFormSection = () => {
    if (editingEntry) {
      return (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Edit Entry</h2>
          <EntryForm
            entry={editingEntry}
            onSubmit={handleUpdate}
            onCancel={() => setEditingEntry(null)}
          />
        </div>
      );
    }
    if (showForm) {
      return (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">New Entry</h2>
          <EntryForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      );
    }
    return (
      <button
        onClick={() => setShowForm(true)}
        className="mb-8 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add Entry
      </button>
    );
  };

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-4xl font-bold">DayScore</h1>

      {error && <p className="mb-4 text-red-400">{error}</p>}

      {renderFormSection()}

      <h2 className="mb-4 text-xl font-semibold">Entries</h2>
      <EntryList entries={entries} onEdit={setEditingEntry} onDelete={handleDelete} />
    </main>
  );
}
