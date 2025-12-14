import { Entry, CreateEntryRequest, UpdateEntryRequest } from "../types/entry";

const API_BASE_URL = "http://localhost:8080/api";

export async function fetchEntries(): Promise<Entry[]> {
  const response = await fetch(`${API_BASE_URL}/entries`);
  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }
  return response.json();
}

export async function fetchEntry(id: number): Promise<Entry> {
  const response = await fetch(`${API_BASE_URL}/entries/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch entry");
  }
  return response.json();
}

export async function createEntry(data: CreateEntryRequest): Promise<Entry> {
  const response = await fetch(`${API_BASE_URL}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create entry");
  }
  return response.json();
}

export async function updateEntry(id: number, data: UpdateEntryRequest): Promise<Entry> {
  const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update entry");
  }
  return response.json();
}

export async function deleteEntry(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete entry");
  }
}
