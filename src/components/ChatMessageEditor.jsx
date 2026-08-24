"use client";

import React, { useRef, useEffect } from "react";
import { FaBold, FaItalic, FaListUl } from "react-icons/fa";

// Minimal WhatsApp-style formatting toolbar (bold / italic / bullet list)
// over a contentEditable div. Mount fresh (via a `resetKey` prop from the
// caller) whenever the starting content should change — e.g. a cleared
// compose box after sending — rather than syncing content through props
// on every keystroke, which fights the browser's own cursor position.
export default function ChatMessageEditor({
  initialHtml = "",
  onChange,
  onSubmit,
  placeholder = "Type a message...",
  disabled = false,
  autoFocus = false,
  resetKey,
  size = "md", // "sm" | "md"
}) {
  const editableRef = useRef(null);

  useEffect(() => {
    if (editableRef.current) editableRef.current.innerHTML = initialHtml || "";
    // Only re-run when the caller forces a remount via resetKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (autoFocus) editableRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = () => onChange?.(editableRef.current?.innerHTML || "");

  const exec = (command) => {
    editableRef.current?.focus();
    document.execCommand(command, false, undefined);
    emitChange();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Inside a bullet list, let the browser continue/exit the list as
      // usual instead of hijacking Enter to send the message.
      const sel = window.getSelection();
      const node = sel?.anchorNode;
      const el = node && (node.nodeType === Node.TEXT_NODE ? node.parentElement : node);
      if (el?.closest?.("li")) return;

      e.preventDefault();
      onSubmit?.();
    }
  };

  const toolbarBtnCls =
    "flex items-center justify-center rounded-md text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-colors";
  const sizes =
    size === "sm"
      ? { toolbar: "w-6 h-6 text-[10px]", input: "px-3 py-2 text-xs min-h-[34px]" }
      : { toolbar: "w-7 h-7 text-xs", input: "px-4 py-3 text-sm min-h-[44px]" };

  return (
    <div
      className={`flex-1 rounded-xl border border-orange-100 bg-orange-50/20 focus-within:ring-2 focus-within:ring-orange-300 focus-within:bg-white transition-all ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-0.5 px-1.5 pt-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
          title="Bold"
          className={`${toolbarBtnCls} ${sizes.toolbar}`}
        >
          <FaBold />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
          title="Italic"
          className={`${toolbarBtnCls} ${sizes.toolbar}`}
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("insertUnorderedList")}
          title="Bullet list"
          className={`${toolbarBtnCls} ${sizes.toolbar}`}
        >
          <FaListUl />
        </button>
      </div>
      <div
        ref={editableRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={emitChange}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={`chat-editable text-slate-800 focus:outline-none ${sizes.input}`}
      />
    </div>
  );
}
