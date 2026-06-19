# design-sync notes

- **Shape: off-script, not the converter.** `design-system/` is 7 hand-authored, self-contained
  `@dsCard` HTML preview files — not a bundlable React/Storybook component repo. There is no
  `dist/` to bundle and no render-check/storybook fidelity loop. Sync = direct upload of the cards.
- **Target project:** `Block Ward` (`projectId` in config.json). Created fresh 2026-06-19.
- **Upload layout:** cards go at the **project root** with their bare filenames, because
  `prototype.html` embeds the other six via bare relative `<iframe src="foundations.html">` etc.
  Keeping them flat preserves that wiring. Exclude `design-system/README.md` (docs, not a card).
- **No `_ds_sync.json` anchor:** off-script shape has no converter recipe to hash against, so each
  sync just re-pushes all 7 files. That's intended — re-uploading is idempotent and cheap.
- **Re-sync:** re-`finalize_plan` over the same 8 paths (7 html + `_ds_needs_recompile`), write,
  re-arm the sentinel. If cards are added/removed, update the writes/deletes lists accordingly.
- Source plan: `docs/design-sync-plan-2026-06-19.md`. Card index/groups come verbatim from each
  file's first-line `<!-- @dsCard group="…" name="…" subtitle="…" -->` marker.
