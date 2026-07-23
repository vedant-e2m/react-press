import React, { useCallback, useEffect, useState } from 'react';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import {
  BuilderEditor,
  type BuilderTemplate,
} from '@nextpress/builder/editor';
import {
  EMPTY_BUILDER_DOCUMENT,
  type BuilderDocument,
} from '@nextpress/builder';
import '@nextpress/builder/styles.css';

const PAGE_UID = 'api::page.page';
const BLOCK_PATTERN_UID = 'api::block-pattern.block-pattern';
const PAGE_COLLECTION_PATH = `/content-manager/collection-types/${PAGE_UID}`;
const PATTERN_COLLECTION_PATH = `/content-manager/collection-types/${BLOCK_PATTERN_UID}`;

export interface PageBuilderHostPage {
  documentId: string;
  title: string;
  page_status: string;
  builder_data?: BuilderDocument | null;
}

interface PageBuilderHostProps {
  page: PageBuilderHostPage;
  /** Called after a successful save so the parent can refresh local state. */
  onPageUpdated?: (page: PageBuilderHostPage) => void;
}

interface BlockPatternRow {
  documentId: string;
  name: string;
  kind?: 'section' | 'page';
  builder_data?: BuilderDocument | null;
}

interface ListResponse<T> {
  results?: T[];
}

interface DocumentResponse<T> {
  data: T;
}

/**
 * Returns a valid builder document, falling back to an empty canvas.
 */
function resolveBuilderDocument(value: BuilderDocument | null | undefined): BuilderDocument {
  if (value && value.editor === 'nextpress' && Array.isArray(value.content)) {
    return value;
  }
  return EMPTY_BUILDER_DOCUMENT;
}

/**
 * Maps a block-pattern row to a BuilderEditor template entry.
 */
function toBuilderTemplate(row: BlockPatternRow): BuilderTemplate | null {
  if (!row.documentId || !row.name) {
    return null;
  }

  return {
    id: row.documentId,
    name: row.name,
    kind: row.kind === 'page' ? 'page' : 'section',
    document: resolveBuilderDocument(row.builder_data),
  };
}

/**
 * Fullscreen host that embeds BuilderEditor inside Strapi admin.
 */
export function PageBuilderHost({ page, onPageUpdated }: PageBuilderHostProps) {
  const { get, put, post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [templates, setTemplates] = useState<BuilderTemplate[]>([]);
  const [document, setDocument] = useState<BuilderDocument>(() =>
    resolveBuilderDocument(page.builder_data)
  );
  const [status, setStatus] = useState(page.page_status);

  useEffect(() => {
    setDocument(resolveBuilderDocument(page.builder_data));
    setStatus(page.page_status);
  }, [page.builder_data, page.documentId, page.page_status]);

  useEffect(() => {
    let cancelled = false;

    const loadTemplates = async () => {
      try {
        const { data } = await get<ListResponse<BlockPatternRow>>(
          `${PATTERN_COLLECTION_PATH}?pageSize=100`
        );
        if (cancelled) {
          return;
        }
        const next = (data.results ?? [])
          .map(toBuilderTemplate)
          .filter((template): template is BuilderTemplate => template !== null);
        setTemplates(next);
      } catch (error) {
        console.error('[page-builder] Failed to load block patterns', error);
        if (!cancelled) {
          toggleNotification({
            type: 'warning',
            message: 'Could not load builder templates.',
          });
        }
      }
    };

    void loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [get, toggleNotification]);

  const persistPage = useCallback(
    async (nextDocument: BuilderDocument, nextStatus?: string) => {
      const body: Record<string, unknown> = {
        builder_data: nextDocument,
      };
      if (nextStatus) {
        body.page_status = nextStatus;
      }

      const { data } = await put<DocumentResponse<PageBuilderHostPage>>(
        `${PAGE_COLLECTION_PATH}/${page.documentId}`,
        body
      );

      const updated: PageBuilderHostPage = {
        documentId: data.data.documentId ?? page.documentId,
        title: data.data.title ?? page.title,
        page_status: data.data.page_status ?? nextStatus ?? status,
        builder_data: resolveBuilderDocument(data.data.builder_data ?? nextDocument),
      };

      setDocument(updated.builder_data ?? nextDocument);
      setStatus(updated.page_status);
      onPageUpdated?.(updated);
      return updated;
    },
    [onPageUpdated, page.documentId, page.title, put, status]
  );

  const handleSave = useCallback(
    async (nextDocument: BuilderDocument) => {
      try {
        await persistPage(nextDocument);
        toggleNotification({
          type: 'success',
          message: 'Page saved.',
        });
      } catch (error) {
        console.error('[page-builder] Failed to save page', error);
        toggleNotification({
          type: 'danger',
          message: 'Failed to save page.',
        });
        throw error;
      }
    },
    [persistPage, toggleNotification]
  );

  const handlePublish = useCallback(
    async (nextDocument: BuilderDocument) => {
      try {
        await persistPage(nextDocument, 'published');
        toggleNotification({
          type: 'success',
          message: 'Page published.',
        });
      } catch (error) {
        console.error('[page-builder] Failed to publish page', error);
        toggleNotification({
          type: 'danger',
          message: 'Failed to publish page.',
        });
        throw error;
      }
    },
    [persistPage, toggleNotification]
  );

  const handleSaveTemplate = useCallback(
    async (name: string, templateDocument: BuilderDocument) => {
      try {
        const { data } = await post<DocumentResponse<BlockPatternRow>>(PATTERN_COLLECTION_PATH, {
          name,
          kind: 'section',
          category: 'general',
          builder_data: templateDocument,
        });

        const template = toBuilderTemplate(data.data);
        if (template) {
          setTemplates((current) => [template, ...current]);
        }

        toggleNotification({
          type: 'success',
          message: 'Template saved.',
        });
      } catch (error) {
        console.error('[page-builder] Failed to save template', error);
        toggleNotification({
          type: 'danger',
          message: 'Failed to save template.',
        });
        throw error;
      }
    },
    [post, toggleNotification]
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#0f172a',
      }}
    >
      <BuilderEditor
        document={document}
        title={page.title}
        status={status}
        onSave={handleSave}
        onPublish={handlePublish}
        templates={templates}
        onSaveTemplate={handleSaveTemplate}
        backHref="/admin/plugins/page-builder"
      />
    </div>
  );
}

export default PageBuilderHost;
