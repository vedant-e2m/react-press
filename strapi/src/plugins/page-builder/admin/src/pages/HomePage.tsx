import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Loader,
  Main,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { EMPTY_BUILDER_DOCUMENT } from '@nextpress/builder';

const PAGE_UID = 'api::page.page';
const PAGE_COLLECTION_PATH = `/content-manager/collection-types/${PAGE_UID}`;

interface PageRow {
  documentId: string;
  title?: string;
  slug?: string;
  page_status?: string;
}

interface ListResponse {
  results?: PageRow[];
}

interface DocumentResponse {
  data: PageRow;
}

/**
 * Lists Strapi pages and links into the fullscreen Page Builder editor.
 */
export function HomePage() {
  const navigate = useNavigate();
  const { get, post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await get<ListResponse>(`${PAGE_COLLECTION_PATH}?pageSize=100`);
      setPages(data.results ?? []);
    } catch (err) {
      console.error('[page-builder] Failed to load pages', err);
      setError('Failed to load pages.');
      toggleNotification({
        type: 'danger',
        message: 'Failed to load pages.',
      });
    } finally {
      setLoading(false);
    }
  }, [get, toggleNotification]);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const createPage = async () => {
    setCreating(true);
    try {
      const { data } = await post<DocumentResponse>(PAGE_COLLECTION_PATH, {
        title: 'Untitled Page',
        slug: `untitled-${Date.now()}`,
        page_status: 'draft',
        builder_data: EMPTY_BUILDER_DOCUMENT,
      });

      const documentId = data.data.documentId;
      if (!documentId) {
        throw new Error('Created page is missing documentId');
      }

      navigate(`pages/${documentId}`);
    } catch (err) {
      console.error('[page-builder] Failed to create page', err);
      toggleNotification({
        type: 'danger',
        message: 'Failed to create page.',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Main>
      <Box padding={8}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom={6}>
          <Box>
            <Typography variant="alpha" as="h1">
              Page Builder
            </Typography>
            <Typography variant="epsilon" textColor="neutral600">
              Edit visual pages with the NextPress builder.
            </Typography>
          </Box>
          <Button onClick={() => void createPage()} loading={creating} disabled={creating}>
            Create page
          </Button>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" padding={8}>
            <Loader>Loading pages…</Loader>
          </Flex>
        ) : null}

        {!loading && error ? (
          <Typography textColor="danger600">{error}</Typography>
        ) : null}

        {!loading && !error && pages.length === 0 ? (
          <Typography textColor="neutral600">No pages yet. Create one to get started.</Typography>
        ) : null}

        {!loading && !error && pages.length > 0 ? (
          <Table colCount={4} rowCount={pages.length + 1}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Title</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Slug</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Status</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Actions</Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {pages.map((page) => (
                <Tr key={page.documentId}>
                  <Td>
                    <Typography>{page.title ?? 'Untitled'}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral600">{page.slug ?? '—'}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral600">{page.page_status ?? 'draft'}</Typography>
                  </Td>
                  <Td>
                    <Button
                      size="S"
                      variant="secondary"
                      onClick={() => navigate(`pages/${page.documentId}`)}
                    >
                      Edit with Page Builder
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : null}
      </Box>
    </Main>
  );
}

export default HomePage;
