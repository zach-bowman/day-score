import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe("App", () => {
  it("renders the home page with main content", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
