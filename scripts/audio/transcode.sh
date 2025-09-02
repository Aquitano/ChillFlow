#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  bash scripts/audio/transcode.sh main ./input/lofi.wav lofi-001
#  bash scripts/audio/transcode.sh loop ./input/rain.wav rain-01

MODE=${1:-}
INPUT=${2:-}
BASENAME=${3:-}

if [[ -z "${MODE}" || -z "${INPUT}" || -z "${BASENAME}" ]]; then
  echo "Usage: $0 <main|loop> <input.wav> <basename>" >&2
  exit 1
fi

OUT_DIR="scripts/audio/out"
mkdir -p "${OUT_DIR}"

# Transcode settings
if [[ "${MODE}" == "main" ]]; then
  OPUS_KBPS=96
  AAC_KBPS=128
elif [[ "${MODE}" == "loop" ]]; then
  OPUS_KBPS=48
  AAC_KBPS=96
else
  echo "Unknown mode: ${MODE} (expected main|loop)" >&2
  exit 1
fi

WEBM_OUT="${OUT_DIR}/${BASENAME}-${OPUS_KBPS}.webm"
M4A_OUT="${OUT_DIR}/${BASENAME}-${AAC_KBPS}.m4a"

# Encode Opus/WebM
ffmpeg -y -hide_banner -loglevel error -i "${INPUT}" \
  -c:a libopus -b:a "${OPUS_KBPS}k" -vbr on -application audio \
  "${WEBM_OUT}"

# Encode AAC/M4A
ffmpeg -y -hide_banner -loglevel error -i "${INPUT}" \
  -c:a aac -b:a "${AAC_KBPS}k" -movflags +faststart \
  "${M4A_OUT}"

echo "Wrote: ${WEBM_OUT}"
show_webm_hash=$(shasum -a 1 "${WEBM_OUT}" | awk '{print $1}' | cut -c1-8)
echo "hash(webm): ${show_webm_hash}"

echo "Wrote: ${M4A_OUT}"
show_m4a_hash=$(shasum -a 1 "${M4A_OUT}" | awk '{print $1}' | cut -c1-8)
echo "hash(m4a): ${show_m4a_hash}"

cat <<EOF

Next steps:
  export R2_BUCKET=your-bucket
  bash scripts/audio/upload-r2.sh lofi ${BASENAME}    # or ambient for loops
EOF
