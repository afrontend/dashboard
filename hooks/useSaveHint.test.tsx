// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSaveHint } from "./useSaveHint";

(
  globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  }
).IS_REACT_ACT_ENVIRONMENT = true;

function SaveHintHarness() {
  const { visible, show, dismiss } = useSaveHint();

  return (
    <div>
      <span data-visible={String(visible)} />
      <button type="button" id="show" onClick={show}>
        show
      </button>
      <button type="button" id="dismiss" onClick={dismiss}>
        dismiss
      </button>
    </div>
  );
}

describe("useSaveHint", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    localStorage.clear();
  });

  it("shows once until dismissed", () => {
    act(() => {
      root.render(<SaveHintHarness />);
    });

    const visible = container.querySelector("span");
    const showButton = container.querySelector("#show");
    const dismissButton = container.querySelector("#dismiss");

    expect(visible?.dataset.visible).toBe("false");

    act(() => {
      showButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(visible?.dataset.visible).toBe("true");

    act(() => {
      dismissButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(visible?.dataset.visible).toBe("false");
    expect(localStorage.getItem("hasSeenSaveHint")).toBe("true");

    act(() => {
      showButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(visible?.dataset.visible).toBe("false");
  });
});
