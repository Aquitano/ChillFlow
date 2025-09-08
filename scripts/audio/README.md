# Audio tooling

This folder contains helper scripts to transcode audio with FFmpeg and upload assets to Cloudflare R2.

## Prerequisites
- FFmpeg installed and on PATH
- Wrangler configured (`bunx wrangler login`) and an R2 bucket created

Environment variables:
- `R2_BUCKET` (e.g. `chillflow-audio`)
- Optional `R2_PUBLIC_BASE` (CDN base, e.g. `https://cdn.example.com`)

## Transcoding

Two helpers are provided:
- Main lo-fi track (Opus WebM 96 kbps, AAC M4A 128 kbps)
- Ambient loop (Opus WebM 48 kbps, AAC M4A 96 kbps)

Examples:

```bash
# Main track
bash scripts/audio/transcode.sh main ./input/lofi.wav lofi-001

# Ambient loop
bash scripts/audio/transcode.sh loop ./input/rain.wav rain-01
```

Outputs are written to `scripts/audio/out/`.

## Upload to R2

After transcoding, upload with:

```bash
export R2_BUCKET=chillflow-audio
bash scripts/audio/upload-r2.sh lofi lofi-001
bash scripts/audio/upload-r2.sh ambient rain-01
```

This will place files under:
- `audio/{category}/webm/{kbps}/{basename}-{hash}.webm`
- `audio/{category}/m4a/{kbps}/{basename}-{hash}.m4a`

Note: Filenames include a short content hash for immutable caching. Configure your CDN to serve long-lived cache headers.
