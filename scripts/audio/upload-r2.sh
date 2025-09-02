#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  export R2_BUCKET=chillflow-audio
#  bash scripts/audio/upload-r2.sh lofi lofi-001
#  bash scripts/audio/upload-r2.sh ambient rain-01

CATEGORY=${1:-}
BASENAME=${2:-}

if [[ -z "${R2_BUCKET:-}" ]]; then
  echo "R2_BUCKET env var required" >&2
  exit 1
fi

if [[ -z "${CATEGORY}" || -z "${BASENAME}" ]]; then
  echo "Usage: $0 <lofi|ambient> <basename>" >&2
  exit 1
fi

OUT_DIR="scripts/audio/out"
WEBM_FILE=$(ls "${OUT_DIR}/${BASENAME}-"*.webm 2>/dev/null | head -n1 || true)
M4A_FILE=$(ls "${OUT_DIR}/${BASENAME}-"*.m4a 2>/dev/null | head -n1 || true)

if [[ -z "${WEBM_FILE}" && -z "${M4A_FILE}" ]]; then
  echo "No files found for basename ${BASENAME} in ${OUT_DIR}" >&2
  exit 1
fi

# Helper to extract bitrate from filename suffix -<kbps>.<ext>
get_kbps() {
  local f="$1"
  local name=$(basename "$f")
  echo "$name" | sed -E 's/.*-([0-9]+)\.[^.]+/\1/'
}

# Put a single file: $1=path $2=codec (webm|m4a)
put_one() {
  local f="$1"; local codec="$2"
  local kbps=$(get_kbps "$f")
  local hash=$(shasum -a 1 "$f" | awk '{print $1}' | cut -c1-8)
  local key="audio/${CATEGORY}/${codec}/${kbps}/${BASENAME}-${hash}.${codec}"
  local ctype="audio/webm"
  if [[ "$codec" == "m4a" ]]; then ctype="audio/mp4"; fi
  echo "Uploading $f -> r2://${R2_BUCKET}/${key}"
  bunx wrangler r2 object put "${R2_BUCKET}/${key}" --file="$f" --content-type "$ctype"
}

if [[ -n "${WEBM_FILE}" ]]; then
  put_one "${WEBM_FILE}" webm
fi
if [[ -n "${M4A_FILE}" ]]; then
  put_one "${M4A_FILE}" m4a
fi

echo "Done. Configure your CDN to serve long cache headers for /audio/* paths."
