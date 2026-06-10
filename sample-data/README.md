# Sample data

`my-history-backup.json` is a backup of 9 logged training sessions (25 May – 8 Jun 2026),
in the format the app's **Settings → Backup & Restore** importer expects.

## How to import

1. Open the app (`index.html`) on the device where you want the history.
2. Go to **Settings → Backup & Restore**.
3. Paste the contents of `my-history-backup.json` into the box.
4. Tap **Import from box**.

The import **merges** and de-duplicates by date + session, so running it more than
once is safe — you'll always end up with the same 9 sessions.

## Notes

- Sessions are keyed by exercise id (e.g. `la2_L` / `la2_R` for the left/right sides of a
  unilateral lift). These ids are stable in `index.html`, so the imported logs feed the
  progressive-overload hints automatically.
- Bodyweight sets are stored with no weight (or `"w": "0"`); a few sets carry per-set
  notes (e.g. "Lower back ache").
