# Adobe XD → NextPress import

This folder documents the import pipeline. **NextPress now supports raw `.xd` files** (not only React plugin exports).

| File | What it represents |
|------|--------------------|
| `01-xd-design-spec.json` | Conceptual XD layer structure |
| `02-xd-react-export.tsx` | Alternative path: XD React plugin output |
| `03-design-ir.json` | Intermediate representation |
| `04-puck-output.json` | Target Puck JSON shape |

## Live import (implemented)

```
Ramni.xd.zip  →  @nextpress/xd-import  →  Puck page + assets
```

- Package: `packages/xd-import`
- Admin UI: `/admin/import/xd`
- API: `POST /api/xd-import`
- CLI: `pnpm --filter @nextpress/xd-import import:ramni [path-to.zip] [slug]`
- Demo page: `/ramni` (seeded via Strapi demo pages / XD import)
- Assets: `apps/web/public/imported/xd/ramni/`

## User flow

1. Upload `.xd` or `.zip` containing `.xd` in admin
2. Parser extracts artboards, text, images, colors
3. Assets copied to `public/imported/xd/{slug}/`
4. Screens mapped to `XdImportedScreen` Puck blocks
5. Draft page created — editable in Puck editor
