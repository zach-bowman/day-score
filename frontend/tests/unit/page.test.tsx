import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../app/page";

vi.mock("../../app/services/api", () => ({
  fetchEntries: vi.fn(),
  createEntry: vi.fn(),
  updateEntry: vi.fn(),
  deleteEntry: vi.fn(),
}));

import * as api from "../../app/services/api";

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the heading", async () => {
    vi.mocked(api.fetchEntries).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("DayScore");
    });
  });

  it("renders loading state initially", () => {
    vi.mocked(api.fetchEntries).mockImplementation(() => new Promise(() => {}));

    render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders new entry button when not editing", async () => {
    vi.mocked(api.fetchEntries).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
    });
  });

  it("shows form when new entry button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add entry/i }));

    expect(screen.getByRole("heading", { name: /new entry/i })).toBeInTheDocument();
  });

  it("displays entries from API", async () => {
    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "Test entry" },
    ]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
      expect(screen.getByText("Score: 4/5")).toBeInTheDocument();
      expect(screen.getByText("Test entry")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    vi.mocked(api.fetchEntries).mockRejectedValue(new Error("Network error"));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load entries")).toBeInTheDocument();
    });
  });
});
