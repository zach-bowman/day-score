"use client";

import { useState } from "react";
import { Entry, CreateEntryRequest, UpdateEntryRequest } from "../types/entry";

interface EntryFormProps {
  entry?: Entry;
  onSubmit: (data: CreateEntryRequest | UpdateEntryRequest) => Promise<void>;
  onCancel?: () => void;
}

export default function EntryForm({ entry, onSubmit, onCancel }: EntryFormProps) {
  const [date, setDate] = useState(entry?.date ?? new Date().toISOString().split("T")[0]);
  const [score, setScore] = useState<number | "">(entry?.score ?? "");
  const [note, setNote] = useState(entry?.note ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!entry;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditMode) {
        await onSubmit({ score: score as number, note: note || null });
      } else {
        await onSubmit({ date, score: score as number, note: note || null });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditMode && (
        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-600 bg-transparent px-3 py-2"
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="score" className="block text-sm font-medium">
          Score (1-5) <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          id="score"
          min={1}
          max={5}
          value={score}
          onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
          className="mt-1 block w-full rounded border border-gray-600 bg-transparent px-3 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium">
          Note
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded border border-gray-600 bg-transparent px-3 py-2"
        />
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
