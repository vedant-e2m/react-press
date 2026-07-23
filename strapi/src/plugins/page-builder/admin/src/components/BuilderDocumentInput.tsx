import React, { forwardRef } from 'react';
import { Box, Button, Flex, Typography } from '@strapi/design-system';
import { unstable_useContentManagerContext, useNotification } from '@strapi/strapi/admin';
import type { BuilderDocument } from '@nextpress/builder';

interface BuilderDocumentInputProps {
  name: string;
  value?: BuilderDocument | null;
  onChange: (event: {
    target: { name: string; value: BuilderDocument; type: string };
  }) => void;
  attribute?: Record<string, unknown>;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  intlLabel?: { id: string; defaultMessage: string };
  labelAction?: React.ReactNode;
}

/**
 * Returns true when Content Manager is on the unsaved "create" route.
 */
function isCreateDocumentId(documentId: string | undefined, isCreatingEntry: boolean): boolean {
  return isCreatingEntry || !documentId || documentId === 'create';
}

/**
 * Content Manager custom field for builder documents.
 * Shows a compact summary and links out to the fullscreen Page Builder.
 * Does not write into form state on mount (avoids dirtying / clobbering).
 */
const BuilderDocumentInput = forwardRef<HTMLDivElement, BuilderDocumentInputProps>(
  function BuilderDocumentInput({ value, disabled, error }, ref) {
    const { toggleNotification } = useNotification();
    const { id: documentId, isCreatingEntry } = unstable_useContentManagerContext();

    const elementCount = Array.isArray(value?.content) ? value.content.length : 0;
    const statusMessage =
      value == null
        ? 'No builder document yet — save the page, then open the Page Builder.'
        : elementCount === 0
          ? 'Empty canvas — open the Page Builder to add widgets.'
          : `${elementCount} top-level element${elementCount === 1 ? '' : 's'} in builder_data.`;

    const openBuilder = () => {
      if (isCreateDocumentId(documentId, isCreatingEntry)) {
        toggleNotification({
          type: 'warning',
          message: 'Save the page first, then open the Page Builder.',
        });
        return;
      }

      // Full navigation remounts Content Manager on return so stale form
      // builder_data cannot overwrite out-of-band Page Builder saves.
      window.location.assign(`/admin/plugins/page-builder/pages/${documentId}`);
    };

    return (
      <Box ref={ref}>
        <Flex direction="column" alignItems="stretch" gap={3}>
          <Typography variant="pi" textColor="neutral600">
            {statusMessage}
          </Typography>
          {error ? (
            <Typography variant="pi" textColor="danger600">
              {error}
            </Typography>
          ) : null}
          <Flex gap={2}>
            <Button onClick={openBuilder} disabled={disabled} size="S">
              Open Page Builder
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  }
);

export default BuilderDocumentInput;
