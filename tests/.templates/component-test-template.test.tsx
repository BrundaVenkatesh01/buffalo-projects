import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Component Test Template
 *
 * Copy this template when creating new component tests.
 * Remove sections you don't need.
 */

import { YourComponent } from "@/components/YourComponent";

describe("YourComponent", () => {
  it("renders with required props", () => {
    render(<YourComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles user interactions", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<YourComponent onClick={handleClick} />);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("applies correct variant styles", () => {
    const { container } = render(<YourComponent variant="primary" />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("handles conditional rendering", () => {
    const { rerender } = render(<YourComponent showExtra={false} />);
    expect(screen.queryByText("Extra content")).not.toBeInTheDocument();

    rerender(<YourComponent showExtra={true} />);
    expect(screen.getByText("Extra content")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    render(<YourComponent loading={true} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("displays error state", () => {
    render(<YourComponent error="Something went wrong" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });
});
