import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { essays, getEssayTarget } from "./data/essays";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  window.localStorage.clear();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("application flow", () => {
  it("selects an essay, completes it, and returns home", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "EssayKeys" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "选择一篇文章" }),
    ).toBeVisible();
    expect(screen.getByText("从第一个字符开始计时。")).toBeVisible();
    expect(
      screen.queryByText("雅思文章打字练习"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /开始练习/ })).toHaveLength(4);
    expect(
      screen.getByRole("heading", {
        name: "Should University Education Be Free for Everyone?",
      }),
    ).toBeVisible();

    await user.click(screen.getAllByRole("button", { name: /开始练习/ })[0]);
    expect(
      screen.getByRole("heading", { name: essays[0].title }),
    ).toBeVisible();
    expect(
      screen.queryByRole("progressbar", { name: "练习进度" }),
    ).not.toBeInTheDocument();

    const input = screen.getByLabelText("作文输入区");
    fireEvent.change(input, { target: { value: getEssayTarget(essays[0]) } });

    expect(
      await screen.findByRole("heading", { name: "练习完成" }),
    ).toBeVisible();
    expect(screen.getByText("总用时")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "确认并返回" }));
    expect(screen.getByRole("heading", { name: "EssayKeys" })).toBeVisible();
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

  it("opens the sound picker and persists the selected pack", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /音效.*黄油重键/ }),
    );

    expect(
      screen.getByRole("heading", { name: "按键音" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("progressbar", { name: "试打进度" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /黄油重键/ }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: /玻璃泡泡/ }));
    expect(
      screen.getByRole("button", { name: /玻璃泡泡/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("音效试打输入区")).toHaveFocus();
    expect(
      screen.queryByRole("button", { name: "点击这里开始试打" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "返回首页" }));
    expect(
      screen.getByRole("button", { name: /玻璃泡泡/ }),
    ).toBeVisible();
  });

  it("automatically restarts the sound trial after one complete sentence", () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/#/sounds");
    render(<App />);

    const input = screen.getByLabelText("音效试打输入区");
    fireEvent.change(input, {
      target: { value: "Welcome to EssayKeys!" },
    });

    expect(
      screen.queryByText("完成一次，正在重新开始…"),
    ).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.queryByText(/已完成/)).not.toBeInTheDocument();
    expect(input).toHaveValue("");
  });
});
