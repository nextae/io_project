import "@testing-library/jest-dom";
import { vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormDialog } from "../FormDialog";

describe("FormDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the form", () => {
    render(
      <FormDialog
        title="Title"
        actionName="Action"
        open={true}
        action={() => Promise.resolve(undefined)}
      >
        <input type="text" />
        <input type="number" />
      </FormDialog>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("calls action on submit with form data", async () => {
    const action = vi.fn((form: FormData) => Promise.resolve(undefined));
    render(
      <FormDialog title="Title" actionName="Action" open={true} action={action}>
        <input type="text" name="text" />
        <input type="number" name="number" />
      </FormDialog>
    );
    await userEvent.type(screen.getByRole("textbox"), "text");
    await userEvent.type(screen.getByRole("spinbutton"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(action).toHaveBeenCalled();
    expect(action.mock.lastCall![0].get("text")).toEqual("text");
    expect(action.mock.lastCall![0].get("number")).toEqual("123");
  });

  it("closes on cancel", async () => {
    render(
      <FormDialog
        title="Title"
        actionName="Action"
        open={true}
        action={() => Promise.resolve(undefined)}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on submit", async () => {
    render(
      <FormDialog
        title="Title"
        actionName="Action"
        open={true}
        action={() => Promise.resolve(undefined)}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on open change", async () => {
    const { rerender } = render(
      <FormDialog
        title="Title"
        actionName="Action"
        open={false}
        action={() => Promise.resolve(undefined)}
      />
    );
    rerender(
      <FormDialog
        title="Title"
        actionName="Action"
        open={true}
        action={() => Promise.resolve(undefined)}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens when trigger is clicked", async () => {
    render(
      <FormDialog
        title="Title"
        actionName="Action"
        trigger={<button>Trigger</button>}
        action={() => Promise.resolve(undefined)}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays error message", async () => {
    const action = vi.fn(() => Promise.resolve("Error"));
    render(
      <FormDialog
        title="Title"
        actionName="Action"
        open={true}
        action={action}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("clears input after closing", async () => {
    render(
      <FormDialog
        title="Title"
        actionName="Action"
        trigger={<button>Trigger</button>}
        action={() => Promise.resolve(undefined)}
      >
        <input type="text" />
      </FormDialog>
    );
    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
    await userEvent.type(screen.getByRole("textbox"), "Value");

    expect(screen.getByRole("textbox")).toHaveValue("Value");

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});
