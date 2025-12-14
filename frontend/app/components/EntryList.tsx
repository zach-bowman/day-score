"use client";

import { Entry } from "../types/entry";

interface EntryListProps {
  readonly entries: Entry[];
  readonly onEdit: (entry: Entry) => void;
  readonly onDelete: (id: number) => void;
}

export default function EntryList({ entries, onEdit, onDelete }: Readonly<EntryListProps>) {
  if (entries.length === 0) {
    return <p className="text-gray-400">No entries yet. Create your first entry!</p>;
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-center justify-between rounded border border-gray-600 p-4"
        >
          <div>
            <div className="font-medium">{entry.date}</div>
            <div className="text-lg">Score: {entry.score}/5</div>
            {entry.note && <div className="text-gray-400">{entry.note}</div>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(entry)}
              className="cursor-pointer rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="cursor-pointer rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
