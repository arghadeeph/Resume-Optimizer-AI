#!/usr/bin/env sh
set -e

OLLAMA_HOST=${OLLAMA_HOST:-http://ollama:11434}
MODEL=${MODEL:-llama3}

echo "Waiting for Ollama at ${OLLAMA_HOST}..."
until wget -qO- "${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; do
  sleep 2
done

echo "Pulling model ${MODEL}"
ollama pull "${MODEL}"
