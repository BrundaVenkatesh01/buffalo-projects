# Public Directory Backfill Purge (One-off)

This script removes any private fields that may exist in `public_projects` from earlier iterations. It only keeps the safe subset used for the public directory.

## Prerequisites

- Service account with Firestore Admin access
- `firebase-admin` installed in the repository (`npm i -D firebase-admin`)
- `GOOGLE_APPLICATION_CREDENTIALS` set to your service account JSON file path

## Dry Run (recommended)

```
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json \
node scripts/purge-public-projects.mjs --project <your-project-id> --dry-run
```

## Apply Changes

```
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json \
node scripts/purge-public-projects.mjs --project <your-project-id> --write
```

The script logs each document and the fields that will be removed. In `--dry-run` mode, it does not write changes.

## Safety Notes

- The script only deletes keys not in the allowlist.
- It does not modify values of allowed keys.
- Run during a maintenance window if your public site queries this collection frequently.
