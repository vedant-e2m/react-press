"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_SRC = "/gutenberg-editor/index.html";

type HostMessage =
  | { source: "nextpress-gutenberg"; type: "booted" }
  | { source: "nextpress-gutenberg"; type: "ready" }
  | { source: "nextpress-gutenberg"; type: "change"; html: string }
  | {
      source: "nextpress-gutenberg";
      type: "content";
      html: string;
      requestId?: string;
    };

export type GutenbergFrameProps = {
  /** Initial serialized WordPress block HTML. */
  initialHtml: string;
  /** Fired when editor content changes (debounced by the iframe). */
  onChange?: (html: string) => void;
  /** Fired once the Isolated Block Editor is ready. */
  onReady?: () => void;
  className?: string;
};

/**
 * Embeds Automattic Isolated Block Editor (browser build) in an iframe.
 * Uses React 18 inside the iframe so it stays compatible with Gutenberg.
 */
export function GutenbergFrame({
  initialHtml,
  onChange,
  onReady,
  className,
}: GutenbergFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [booted, setBooted] = useState(false);
  const initialRef = useRef(initialHtml);
  const pendingRequests = useRef(
    new Map<string, (html: string) => void>(),
  );

  const postToFrame = useCallback((payload: Record<string, unknown>) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ source: "nextpress-gutenberg-host", ...payload }, "*");
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as HostMessage | undefined;
      if (!data || data.source !== "nextpress-gutenberg") return;

      if (data.type === "booted") {
        setBooted(true);
        postToFrame({ type: "init", html: initialRef.current });
      }
      if (data.type === "ready") {
        onReady?.();
      }
      if (data.type === "change") {
        onChange?.(data.html);
      }
      if (data.type === "content" && data.requestId) {
        const resolve = pendingRequests.current.get(data.requestId);
        if (resolve) {
          pendingRequests.current.delete(data.requestId);
          resolve(data.html);
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onChange, onReady, postToFrame]);

  useEffect(() => {
    if (!booted) return;
    // Re-init only when parent explicitly remounts with new page — keep stable initial.
  }, [booted]);

  /**
   * Request current HTML from the iframe editor.
   */
  const getContent = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      pendingRequests.current.set(requestId, resolve);
      postToFrame({ type: "getContent", requestId });
      setTimeout(() => {
        if (pendingRequests.current.has(requestId)) {
          pendingRequests.current.delete(requestId);
          resolve(initialRef.current);
        }
      }, 2000);
    });
  }, [postToFrame]);

  // Expose getContent via dataset for imperative callers through ref callback pattern
  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    (el as HTMLIFrameElement & { __getContent?: () => Promise<string> }).__getContent =
      getContent;
  }, [getContent]);

  return (
    <iframe
      ref={iframeRef}
      title="WordPress block editor"
      src={FRAME_SRC}
      className={className ?? "h-full w-full border-0"}
      allow="clipboard-read; clipboard-write"
    />
  );
}

export type GutenbergFrameHandle = {
  getContent: () => Promise<string>;
};
