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
            <div className="font-bold mb-1">주소창을 확인하세요!</div>
            <div className="text-sm leading-relaxed">
              모든 북마크 데이터가 <strong>URL 자체</strong>에 저장되었습니다.
              이 URL을 북마크하거나 공유하면 어디서든 대시보드를 그대로 복원할
              수 있어요 — 서버도, 계정도 필요 없습니다.
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
          이해했어요
        </button>
      </div>
    </div>
  );
}
