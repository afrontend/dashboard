import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { getJsonData, isJSON } from "../js/utils";
import { TBookmark } from "../types";

interface BookmarksInURLProps {
  // eslint-disable-next-line no-unused-vars
  onBookmarksChange: (data: TBookmark[]) => void;
}

export interface BookmarksInURLHandle {
  triggerImport: () => void;
  triggerExport: () => void;
  triggerSave: () => void;
}

export const BookmarksInURL = forwardRef<
  BookmarksInURLHandle,
  BookmarksInURLProps
>(function BookmarksInURL({ onBookmarksChange }, ref) {
  const jsonAry = getJsonData();
  const [bookmarkAry, setBookmarkAry] = useState<TBookmark[]>(jsonAry);
  const [bookmarkText, setBookmarkText] = useState<string>(
    JSON.stringify(jsonAry, null, 2),
  );
  const [msg, setMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [saveMsg, setSaveMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onBookmarksChange(jsonAry);
  }, []);

  function handleChange(text: string) {
    setBookmarkText(text);
    if (text && isJSON(text)) {
      setMsg("Valid JSON");
      setErrorMsg("");
      const parsed: TBookmark[] = JSON.parse(text);
      setBookmarkAry(parsed);
      onBookmarksChange(parsed);
      return;
    }
    setMsg("");
    setErrorMsg("Invalid JSON");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && isJSON(text)) {
        const parsed = JSON.parse(text);
        const urls = parsed.urls || parsed;
        const formatted = JSON.stringify(urls, null, 2);
        setBookmarkText(formatted);
        setBookmarkAry(urls);
        onBookmarksChange(urls);
        setMsg("File imported");
        setErrorMsg("");
      } else {
        setErrorMsg("Invalid JSON file");
        setMsg("");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleExport() {
    const data = JSON.stringify(bookmarkAry, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSave() {
    const param = bookmarkAry
      ? "?data=" + encodeURIComponent(JSON.stringify(bookmarkAry))
      : "?data=";
    const { origin, pathname } = window.location;
    const url = origin + pathname + param;
    window.history.pushState({}, "", url);
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const shortcut = isMac ? "⌘D" : "Ctrl+D";
    setSaveMsg(`URL updated! Press ${shortcut} to bookmark this page`);
  }

  useImperativeHandle(ref, () => ({
    triggerImport: () => fileInputRef.current?.click(),
    triggerExport: handleExport,
    triggerSave: handleSave,
  }));

  useEffect(() => {
    if (saveMsg) {
      const timer = setTimeout(() => {
        setSaveMsg("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [saveMsg]);

  return (
    <div>
      <div
        className={`rounded-sm border-2 border-solid overflow-hidden ${
          errorMsg ? "border-red-600" : "border-purple-500/75"
        }`}
      >
        <CodeMirror
          value={bookmarkText}
          maxHeight="calc(100vh - 200px)"
          extensions={[json()]}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            bracketMatching: true,
          }}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <div className="mt-1 flex items-center gap-2 text-sm">
        {msg && <span style={{ color: "#8c7ae6" }}>{msg}</span>}
        {errorMsg && <span style={{ color: "#e84118" }}>{errorMsg}</span>}
        {saveMsg && <span style={{ color: "#10ac84" }}>{saveMsg}</span>}
      </div>
    </div>
  );
});
