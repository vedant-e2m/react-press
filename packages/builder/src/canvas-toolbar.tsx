"use client";

import type { BuilderWidget } from "./types";

function IconGrip() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="2.5" cy="2" r="0.9" />
        <circle cx="7.5" cy="2" r="0.9" />
        <circle cx="2.5" cy="5" r="0.9" />
        <circle cx="7.5" cy="5" r="0.9" />
        <circle cx="2.5" cy="8" r="0.9" />
        <circle cx="7.5" cy="8" r="0.9" />
      </g>
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 1.2 8.8 5 12.6 5.8 8.8 6.6 8 10.4 7.2 6.6 3.4 5.8 7.2 5zM3 10.5l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6zM13 9l.4 1.4 1.4.4-1.4.4L13 12.6l-.4-1.4-1.4-.4 1.4-.4z" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 3.2 12.8 8H10v4.8H6V8H3.2z" />
    </svg>
  );
}

function IconMove() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 1.5 9.6 5H12l-2.8 2.1 1 3.4L8 8.8 5.8 10.5l1-3.4L4 5h2.4zM3.2 8.8 5 10.6V8H3.2zm9.6 0V10.6L14.8 8.8H13zm-4.8 4.8 1.6 2.8H6.4L8 13.6zm0-9.6L6.4 1.2h3.2L8 4.8z" />
    </svg>
  );
}

function IconDuplicate() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M5.5 2.5h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zm-2 3H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-.5h-6.5a1.5 1.5 0 0 1-1.5-1.5v-6.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M6 2h4l.5 1H13v1H3V3h2.5zM4.2 5.5h7.6l-.5 8.2a1 1 0 0 1-1 .9H5.7a1 1 0 0 1-1-.9z" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="8" cy="3.5" r="1.2" />
        <circle cx="8" cy="8" r="1.2" />
        <circle cx="8" cy="12.5" r="1.2" />
      </g>
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M11.9 1.2a1.7 1.7 0 0 1 2.4 0l.5.5a1.7 1.7 0 0 1 0 2.4L6.6 12.3l-3.5 1 1-3.5zM10.9 3.6l1.5 1.5 1.2-1.2-1.5-1.5z" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M7.25 3.25h1.5v4.5H13v1.5H8.75V13h-1.5V9.25H3V7.75h4.25z" />
    </svg>
  );
}

interface ElementCanvasToolbarProps {
  widget: BuilderWidget;
  canMoveUp: boolean;
  onMoveUp(): void;
  onDuplicate(): void;
  onDelete(): void;
  onMore(event: React.MouseEvent<HTMLButtonElement>): void;
  onDragStart(event: React.DragEvent<HTMLButtonElement>): void;
}

/**
 * Top-right floating toolbar shown on the selected canvas element.
 */
export function ElementCanvasToolbar({
  widget,
  canMoveUp,
  onMoveUp,
  onDuplicate,
  onDelete,
  onMore,
  onDragStart,
}: ElementCanvasToolbarProps) {
  return (
    <div
      className="npb-canvas-toolbar"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="npb-canvas-toolbar-label">
        <span className="npb-canvas-toolbar-grip" aria-hidden="true">
          <IconGrip />
        </span>
        <span className="npb-canvas-toolbar-icon" aria-hidden="true">{widget.icon}</span>
        <span className="npb-canvas-toolbar-name">{widget.label}</span>
      </div>

      <div className="npb-canvas-toolbar-actions" role="toolbar" aria-label={`${widget.label} actions`}>
        <button
          type="button"
          className="npb-canvas-toolbar-btn"
          title="AI assist (coming soon)"
          aria-label="AI assist"
          disabled
        >
          <IconSparkles />
        </button>
        <button
          type="button"
          className="npb-canvas-toolbar-btn"
          title="Move up"
          aria-label="Move up"
          disabled={!canMoveUp}
          onClick={onMoveUp}
        >
          <IconArrowUp />
        </button>
        <button
          type="button"
          className="npb-canvas-toolbar-btn npb-canvas-toolbar-drag"
          title="Drag to move"
          aria-label="Drag to move"
          draggable
          onDragStart={onDragStart}
        >
          <IconMove />
        </button>
        <button
          type="button"
          className="npb-canvas-toolbar-btn"
          title="Duplicate"
          aria-label="Duplicate"
          onClick={onDuplicate}
        >
          <IconDuplicate />
        </button>
        <button
          type="button"
          className="npb-canvas-toolbar-btn npb-canvas-toolbar-btn-danger"
          title="Delete"
          aria-label="Delete"
          onClick={onDelete}
        >
          <IconTrash />
        </button>
        <button
          type="button"
          className="npb-canvas-toolbar-btn"
          title="More options"
          aria-label="More options"
          onClick={onMore}
        >
          <IconMore />
        </button>
      </div>
    </div>
  );
}

interface ElementCanvasActionsProps {
  widgetLabel: string;
  onEdit(): void;
  onAddAfter(): void;
}

/**
 * Bottom corner quick actions for the selected canvas element.
 */
export function ElementCanvasActions({
  widgetLabel,
  onEdit,
  onAddAfter,
}: ElementCanvasActionsProps) {
  return (
    <div
      className="npb-canvas-actions"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="npb-canvas-action npb-canvas-action-edit"
        title={`Edit ${widgetLabel}`}
        aria-label={`Edit ${widgetLabel}`}
        onClick={onEdit}
      >
        <IconPencil />
      </button>
      <button
        type="button"
        className="npb-canvas-action npb-canvas-action-add"
        title={`Add after ${widgetLabel}`}
        aria-label={`Add after ${widgetLabel}`}
        onClick={onAddAfter}
      >
        <IconPlus />
      </button>
    </div>
  );
}
