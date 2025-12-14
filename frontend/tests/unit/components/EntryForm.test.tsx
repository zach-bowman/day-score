import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntryForm from "../../../app/components/EntryForm";

describe("EntryForm", () => {
  it("renders form fields in create mode", () => {
    render(<EntryForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/score/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("hides date field in edit mode", () => {
    const entry = { id: 1, date: "2024-01-15", score: 3, note: "Test" };
    render(<EntryForm entry={entry} onSubmit={vi.fn()} />);

    expect(screen.queryByLabelText(/date/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("populates fields with entry data in edit mode", () => {
    const entry = { id: 1, date: "2024-01-15", score: 4, note: "Great day" };
    render(<EntryForm entry={entry} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/score/i)).toHaveValue(4);
    expect(screen.getByLabelText(/note/i)).toHaveValue("Great day");
  });

  it("calls onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<EntryForm onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText(/score/i));
    await user.type(screen.getByLabelText(/score/i), "5");
    await user.type(screen.getByLabelText(/note/i), "Test note");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 5,
        note: "Test note",
      })
    );
  });

  it("shows error message on submit failure", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Test error"));
    render(<EntryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/score/i), "3");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(await screen.findByText("Test error")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<EntryForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("does not show cancel button when onCancel is not provided", () => {
    render(<EntryForm onSubmit={vi.fn()} />);

    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
  });

  it("calls onSubmit with update data in edit mode", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const entry = { id: 1, date: "2024-01-15", score: 3, note: "Original" };
    render(<EntryForm entry={entry} onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText(/score/i));
    await user.type(screen.getByLabelText(/score/i), "5");
    await user.clear(screen.getByLabelText(/note/i));
    await user.type(screen.getByLabelText(/note/i), "Updated note");
    await user.click(screen.getByRole("button", { name: /update/i }));

    expect(onSubmit).toHaveBeenCalledWith({ score: 5, note: "Updated note" });
  });

  it("submits null for empty note", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<EntryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/score/i), "4");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        note: null,
      })
    );
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<EntryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/score/i), "4");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("handles non-Error exceptions", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue("String error");
    render(<EntryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/score/i), "3");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(await screen.findByText("An error occurred")).toBeInTheDocument();
  });
});
