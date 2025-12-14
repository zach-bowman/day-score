import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntryList from "../../../app/components/EntryList";

describe("EntryList", () => {
  it("renders empty state message when no entries", () => {
    render(<EntryList entries={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/no entries yet\. create your first entry!/i)).toBeInTheDocument();
  });

  it("renders list of entries", () => {
    const entries = [
      { id: 1, date: "2024-01-15", score: 3, note: "Good day" },
      { id: 2, date: "2024-01-16", score: 5, note: null },
    ];
    render(<EntryList entries={entries} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("2024-01-16")).toBeInTheDocument();
    expect(screen.getByText("Score: 3/5")).toBeInTheDocument();
    expect(screen.getByText("Score: 5/5")).toBeInTheDocument();
    expect(screen.getByText("Good day")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const entry = { id: 1, date: "2024-01-15", score: 3, note: null };
    const onEdit = vi.fn();
    render(<EntryList entries={[entry]} onEdit={onEdit} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(entry);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const entry = { id: 1, date: "2024-01-15", score: 3, note: null };
    const onDelete = vi.fn();
    render(<EntryList entries={[entry]} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
