import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { essays, getEssayTarget } from "./data/essays";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

describe("application flow", () => {
  it("selects an essay, completes it, and returns home", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "雅思计时打字" })).toBeVisible();
    expect(screen.getAllByRole("button", { name: /开始练习/ })).toHaveLength(4);
    expect(
      screen.getByRole("heading", { name: "Welcome to EssayKeys!" }),
    ).toBeVisible();

    await user.click(screen.getAllByRole("button", { name: /开始练习/ })[0]);
    expect(
      screen.getByRole("heading", { name: essays[0].title }),
    ).toBeVisible();

    const input = screen.getByLabelText("作文输入区");
    fireEvent.change(input, { target: { value: getEssayTarget(essays[0]) } });

    expect(
      await screen.findByRole("heading", { name: "练习完成" }),
    ).toBeVisible();
    expect(screen.getByText("总用时")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "确认并返回" }));
    expect(screen.getByRole("heading", { name: "雅思计时打字" })).toBeVisible();
  });

  it("warns before discarding a partially typed essay", async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /开始练习/ })[0]);
    const input = screen.getByLabelText("作文输入区");
    fireEvent.change(input, { target: { value: "T" } });

    await user.click(screen.getByRole("button", { name: "返回文章" }));
    expect(confirm).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("heading", { name: essays[0].title }),
    ).toBeVisible();
  });

  it("falls back safely for an unknown hash", () => {
    window.history.replaceState(null, "", "/#/unknown-route");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "没有找到这篇文章" }),
    ).toBeVisible();
  });
});
