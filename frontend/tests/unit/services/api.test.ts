import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchEntries,
  fetchEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../../../app/services/api";

describe("api", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("fetchEntries", () => {
    it("returns entries on success", async () => {
      const entries = [{ id: 1, date: "2024-01-15", score: 4, note: "Test" }];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(entries),
      });

      const result = await fetchEntries();

      expect(result).toEqual(entries);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/entries");
    });

    it("throws error on failure", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(fetchEntries()).rejects.toThrow("Failed to fetch entries");
    });
  });

  describe("fetchEntry", () => {
    it("returns entry on success", async () => {
      const entry = { id: 1, date: "2024-01-15", score: 4, note: "Test" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(entry),
      });

      const result = await fetchEntry(1);

      expect(result).toEqual(entry);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/entries/1");
    });

    it("throws error on failure", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(fetchEntry(1)).rejects.toThrow("Failed to fetch entry");
    });
  });

  describe("createEntry", () => {
    it("returns created entry on success", async () => {
      const entry = { id: 1, date: "2024-01-15", score: 4, note: "Test" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(entry),
      });

      const result = await createEntry({ date: "2024-01-15", score: 4, note: "Test" });

      expect(result).toEqual(entry);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2024-01-15", score: 4, note: "Test" }),
      });
    });

    it("throws error with message from response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "Date already exists" }),
      });

      await expect(createEntry({ date: "2024-01-15", score: 4, note: null })).rejects.toThrow(
        "Date already exists"
      );
    });

    it("throws default error when no message in response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(createEntry({ date: "2024-01-15", score: 4, note: null })).rejects.toThrow(
        "Failed to create entry"
      );
    });
  });

  describe("updateEntry", () => {
    it("returns updated entry on success", async () => {
      const entry = { id: 1, date: "2024-01-15", score: 5, note: "Updated" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(entry),
      });

      const result = await updateEntry(1, { score: 5, note: "Updated" });

      expect(result).toEqual(entry);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/entries/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: 5, note: "Updated" }),
      });
    });

    it("throws error with message from response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid score" }),
      });

      await expect(updateEntry(1, { score: 10, note: null })).rejects.toThrow("Invalid score");
    });

    it("throws default error when no message in response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(updateEntry(1, { score: 5, note: null })).rejects.toThrow(
        "Failed to update entry"
      );
    });
  });

  describe("deleteEntry", () => {
    it("completes successfully", async () => {
      mockFetch.mockResolvedValue({ ok: true });

      await expect(deleteEntry(1)).resolves.toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/entries/1", {
        method: "DELETE",
      });
    });

    it("throws error on failure", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(deleteEntry(1)).rejects.toThrow("Failed to delete entry");
    });
  });
});
