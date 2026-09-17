# Family Travel OS — Gmail Auto Sync

This folder contains the Google Apps Script bridge that turns travel-confirmation emails into updates to `trip-data.json`.

## Architecture

Gmail → Google Apps Script → parser/matcher → GitHub Contents API → `trip-data.json` → GitHub Pages

The public website never receives your Gmail credentials, GitHub token, reservation confirmation number, or raw email body. Confirmation codes are hashed before a public-safe source key is written.

## What it currently recognizes

Strong rules are included for:

- Marriott Bonvoy / `res-marriott.com`
  - `Reservation Confirmation #… for …`
  - `Reservation Cancellation #… for …`
- IHG / `tx.ihg.com`
  - reservation-confirmed messages
- American Airlines
  - including `no-reply@info.email.aa.com`
  - `Your trip confirmation (PHL - LAX)` style messages
- United Airlines
  - including `Receipts@united.com`
  - `eTicket Itinerary and Receipt for Confirmation …`
- Delta, Southwest, JetBlue, Alaska Airlines
- Hertz, Enterprise, National, Avis, Budget

Unknown or incompletely parsed travel emails are not blindly written into the trip. They are placed into the script's review log instead.

## Safety rules

The sync engine only writes a booking when it can associate it with the active trip window in `trip-data.json` (with a small date buffer). This prevents unrelated hotel stays, restaurant reservations, old trips, and payment-confirmation emails from entering the dashboard.

The GitHub token must be stored in **Google Apps Script → Project Settings → Script Properties**. Never paste it into `Code.gs`, `trip-data.json`, or any other repository file.

## 1. Create a fine-grained GitHub token

In GitHub, create a fine-grained personal access token with access to only:

- Repository: `stayrealxxx/family-travel-os`
- Repository permissions → **Contents: Read and write**

No broader account or organization permissions are needed.

## 2. Create the Apps Script project

1. Open `https://script.google.com/` while signed into the Gmail account that receives your travel confirmations.
2. Create a new standalone project named `Family Travel OS Sync`.
3. Replace the default `Code.gs` with the contents of this folder's `Code.gs`.
4. In **Project Settings**, enable the option to show the `appsscript.json` manifest file in the editor.
5. Replace the manifest with this folder's `appsscript.json`.

## 3. Add Script Properties

In **Project Settings → Script Properties**, add:

| Property | Value |
|---|---|
| `GITHUB_TOKEN` | your fine-grained token |
| `GITHUB_REPO` | `stayrealxxx/family-travel-os` |
| `GITHUB_BRANCH` | `main` |
| `TRIP_FILE` | `trip-data.json` |
| `GMAIL_LOOKBACK_DAYS` | `21` |
| `MAX_THREADS` | `60` |

Only `GITHUB_TOKEN` is secret.

## 4. Authorize and test

Run these functions manually in this order:

1. `testGitHubConnection`
   - Confirms the token can read the current `trip-data.json`.
2. `previewTravelEmails`
   - Reads candidate Gmail travel messages and prints parser results without changing GitHub.
3. `syncTravelOs`
   - Performs the first real sync.

Google will ask you to authorize Gmail read access, external HTTPS requests to GitHub, and trigger management.

## 5. Enable automatic sync

Run:

`install15MinuteTrigger`

This creates a time-based trigger that calls `syncTravelOs` every 15 minutes.

To disable automation later, run:

`removeTravelOsTriggers`

## Website behavior after activation

After the first successful sync, `trip-data.json` will report:

- `sync.source = "Gmail → Google Apps Script → GitHub"`
- `sync.mode = "auto"`
- last sync activity/result

The existing Family Travel OS dashboard will then render newly recognized reservations as `BOOKED` and reduce the `STILL NEEDED` count automatically.

## Important privacy boundary

`trip-data.json` is public because the site is hosted with GitHub Pages. The sync intentionally does **not** publish:

- confirmation / record-locator numbers
- ticket numbers
- Gmail message IDs
- raw email body
- passenger names
- loyalty account numbers
- payment card details
- GitHub token

If true-cost data is added later, sensitive charge/payment details should go into a private data layer rather than the public GitHub Pages JSON.
