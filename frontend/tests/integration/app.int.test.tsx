import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../app/page";

vi.mock("../../app/services/api", () => ({
  fetchEntries: vi.fn(),
  createEntry: vi.fn(),
  updateEntry: vi.fn(),
  deleteEntry: vi.fn(),
}));

import * as api from "../../app/services/api";

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the home page with main content", async () => {
    vi.mocked(api.fetchEntries).mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
