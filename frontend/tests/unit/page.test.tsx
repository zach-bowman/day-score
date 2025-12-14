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

  it("creates entry and refreshes list", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([]);
    vi.mocked(api.createEntry).mockResolvedValue({
      id: 1,
      date: "2024-01-15",
      score: 4,
      note: "New entry",
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add entry/i }));
    await user.type(screen.getByLabelText(/score/i), "4");
    await user.type(screen.getByLabelText(/note/i), "New entry");

    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "New entry" },
    ]);

    await user.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(api.createEntry).toHaveBeenCalled();
      expect(screen.queryByRole("heading", { name: /new entry/i })).not.toBeInTheDocument();
    });
  });

  it("hides form when cancel is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add entry/i }));
    expect(screen.getByRole("heading", { name: /new entry/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("heading", { name: /new entry/i })).not.toBeInTheDocument();
  });

  it("shows edit form when edit button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "Test" },
    ]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByRole("heading", { name: /edit entry/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/score/i)).toHaveValue(4);
  });

  it("updates entry and refreshes list", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "Test" },
    ]);
    vi.mocked(api.updateEntry).mockResolvedValue({
      id: 1,
      date: "2024-01-15",
      score: 5,
      note: "Updated",
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.clear(screen.getByLabelText(/score/i));
    await user.type(screen.getByLabelText(/score/i), "5");
    await user.clear(screen.getByLabelText(/note/i));
    await user.type(screen.getByLabelText(/note/i), "Updated");

    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 5, note: "Updated" },
    ]);

    await user.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(api.updateEntry).toHaveBeenCalledWith(1, { score: 5, note: "Updated" });
      expect(screen.queryByRole("heading", { name: /edit entry/i })).not.toBeInTheDocument();
    });
  });

  it("cancels edit and returns to list view", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "Test" },
    ]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("heading", { name: /edit entry/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("heading", { name: /edit entry/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
  });

  it("deletes entry after confirmation", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "Test" },
    ]);
    vi.mocked(api.deleteEntry).mockResolvedValue(undefined);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    vi.mocked(api.fetchEntries).mockResolvedValue([]);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(api.deleteEntry).toHaveBeenCalledWith(1);
    });
  });

  it("does not delete entry when confirmation is cancelled", async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchEntries).mockResolvedValue([
      { id: 1, date: "2024-01-15", score: 4, note: "Test" },
    ]);
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(api.deleteEntry).not.toHaveBeenCalled();
  });
});
