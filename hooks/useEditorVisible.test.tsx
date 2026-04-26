// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useEditorVisible } from "./useEditorVisible";

(
  globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  }
).IS_REACT_ACT_ENVIRONMENT = true;

function EditorVisibleHarness() {
  const { visible, toggle } = useEditorVisible();

  return (
    <button type="button" data-visible={String(visible)} onClick={toggle}>
      toggle
    </button>
  );
}

describe("useEditorVisible", () => {
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

  it("defaults to visible and persists toggles", () => {
    act(() => {
      root.render(<EditorVisibleHarness />);
    });

    const button = container.querySelector("button");
    expect(button?.dataset.visible).toBe("true");

    act(() => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(button?.dataset.visible).toBe("false");
    expect(localStorage.getItem("editorVisible")).toBe("false");
  });

  it("respects persisted hidden state", () => {
    localStorage.setItem("editorVisible", "false");

    act(() => {
      root.render(<EditorVisibleHarness />);
    });

    const button = container.querySelector("button");
    expect(button?.dataset.visible).toBe("false");
  });
});
