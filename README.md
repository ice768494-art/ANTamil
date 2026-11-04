# Anime Network Tamil — Vercel starter

A Next.js starter with a Netflix-inspired catalogue, MongoDB-backed anime records, an admin login, Google Drive preview fallback, and HLS playback support.

## Requirements
- Node.js 20.9+ and npm
- MongoDB Atlas database
- Vercel account
- Google Drive files that you own or are authorized to distribute

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Fill in `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD`, and `SESSION_SECRET`.
3. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and visit `/admin`.

## Admin JSON format

```json
{
  "title": "Sample Anime",
  "poster": "https://your-authorized-poster-image.jpg",
  "description": "Description",
  "year": "2026",
  "genre": "Action, Adventure",
  "published": true,
  "seasons": [
    {
      "name": "Season 1",
      "episodes": [
        {
          "title": "Episode 1",
          "driveUrl": "https://drive.google.com/file/d/DRIVE_FILE_ID/view",
          "hlsUrl": "",
          "audioVersions": []
        }
      ]
    }
  ]
}
```

### Multi-audio note
For selectable audio tracks in one player, set `hlsUrl` to an HLS master playlist (`.m3u8`) that contains alternate audio renditions and ensure the HLS origin permits browser CORS requests. A Google Drive preview link is only a fallback player; it does not expose a dependable HTML5 audio-track selector. The HLS player in this starter displays a language selector when the HLS master playlist advertises multiple audio renditions.

`audioVersions` is an optional list of separate language versions, for example:
```json
"audioVersions": [
  {"language":"Tamil","driveUrl":"https://drive.google.com/file/d/FILE_ID/view"},
  {"language":"Japanese","driveUrl":"https://drive.google.com/file/d/OTHER_ID/view"}
]
```
These are separate files, not alternate audio tracks in one file.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and deploy as a Next.js project.
3. In Vercel Project → Settings → Environment Variables, add:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
4. Redeploy after adding variables.
5. Open `https://YOUR-PROJECT.vercel.app/admin`.

## Security and production notes
- Never commit `.env.local` or put secrets in `NEXT_PUBLIC_` variables.
- Use a long, unique admin password and a random session secret (32+ characters).
- This is a starter admin panel, not a full multi-user CMS. Add rate limiting, CSRF protections, audit logs, and stricter schema validation before public production use.
- Publicly listed catalogue entries and media must be content you own or have permission to distribute.
- Google Drive is not a video CDN. Public sharing links may have quota, CORS, range-request, seeking, or playback limitations. For dependable streaming, store the HLS playlist and segments on an HLS-capable object-storage/CDN origin. Vercel should host the app, not large video files.
