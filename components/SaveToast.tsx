import React, { useState } from "react";

interface SaveToastProps {
  visible: boolean;
  onClose: () => void;
}

export function SaveToast({ visible, onClose }: SaveToastProps) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (e.g. insecure context) — silently ignore
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-800 text-white px-4 py-3 rounded-full shadow-lg"
    >
      <span className="text-sm whitespace-nowrap">
        💾 Saved to URL
      </span>
      <button
        onClick={handleCopy}
        className="text-xs bg-white text-gray-800 hover:bg-gray-100 px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap"
      >
        {copied ? "Copied ✓" : "Copy URL"}
      </button>
      <button
        onClick={onClose}
        aria-label="Close"
        className="text-gray-400 hover:text-white text-xl leading-none ml-1"
      >
        ×
      </button>
    </div>
  );
}
