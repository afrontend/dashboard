import React from "react";

interface SaveHintProps {
  visible: boolean;
  onDismiss: () => void;
}

export function SaveHint({ visible, onDismiss }: SaveHintProps) {
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Save hint"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
    >
      <div className="flex justify-center mb-1">
        <span className="text-4xl animate-bounce" aria-hidden="true">
          ☝️
        </span>
      </div>
      <div className="bg-yellow-100 border-2 border-yellow-400 text-gray-800 rounded-lg shadow-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-bold mb-1">Check the address bar!</div>
            <div className="text-sm leading-relaxed">
              All bookmark data is saved <strong>in the URL itself</strong>.
              Bookmark or share this URL to restore your full dashboard anywhere
              — no server, no account needed.
            </div>
          </div>
          <button
            onClick={onDismiss}
            aria-label="Dismiss hint"
            className="text-gray-500 hover:text-gray-800 text-xl leading-none flex-shrink-0"
          >
            ×
          </button>
        </div>
        <button
          onClick={onDismiss}
          className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm py-2 rounded transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
