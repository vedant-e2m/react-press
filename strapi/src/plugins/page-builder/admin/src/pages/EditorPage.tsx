import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Loader, Main, Typography } from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import {
  PageBuilderHost,
  type PageBuilderHostPage,
} from '../components/PageBuilderHost';

const PAGE_UID = 'api::page.page';
const PAGE_COLLECTION_PATH = `/content-manager/collection-types/${PAGE_UID}`;

interface DocumentResponse {
  data: PageBuilderHostPage;
}

/**
 * Loads a single page and mounts the fullscreen Page Builder host.
 */
export function EditorPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const { get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [page, setPage] = useState<PageBuilderHostPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    if (!documentId) {
      setError('Missing page document id.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await get<DocumentResponse>(`${PAGE_COLLECTION_PATH}/${documentId}`);
      if (!data.data?.documentId) {
        throw new Error('Page not found');
      }
      setPage({
        documentId: data.data.documentId,
        title: data.data.title ?? 'Untitled Page',
        page_status: data.data.page_status ?? 'draft',
        builder_data: data.data.builder_data,
      });
    } catch (err) {
      console.error('[page-builder] Failed to load page', err);
      setError('Failed to load page.');
      toggleNotification({
        type: 'danger',
        message: 'Failed to load page.',
      });
    } finally {
      setLoading(false);
    }
  }, [documentId, get, toggleNotification]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  if (loading) {
    return (
      <Main>
        <Flex justifyContent="center" padding={10}>
          <Loader>Loading page builder…</Loader>
        </Flex>
      </Main>
    );
  }

  if (error || !page) {
    return (
      <Main>
        <Box padding={8}>
          <Typography textColor="danger600">{error ?? 'Page not found.'}</Typography>
        </Box>
      </Main>
    );
  }

  return <PageBuilderHost page={page} onPageUpdated={setPage} />;
}

export default EditorPage;
