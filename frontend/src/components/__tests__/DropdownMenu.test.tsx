import "@testing-library/jest-dom";
import { vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu, DropdownMenuItem } from "../DropdownMenu";

vi.stubGlobal(
  "ResizeObserver",
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
);

describe("DropdownMenu", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the menu", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu trigger={<button>Trigger</button>}>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
        <DropdownMenuItem>Item 3</DropdownMenuItem>
      </DropdownMenu>
    );
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Item 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Item 2" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Item 3" })
    ).toBeInTheDocument();
  });

  it("closes after choosing an item", async () => {
    const user = userEvent.setup();
    render(
        <DropdownMenu trigger={<button>Trigger</button>}>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Item 1" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
