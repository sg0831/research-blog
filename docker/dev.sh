#!/bin/sh
set -eu

# This cache belongs only to this container, never to a host-side Astro process.
rm -f /app/.astro/dev.json
logs_pid=
cleanup() {
  trap - EXIT INT TERM
  pnpm astro dev stop || true
  if [ -n "$logs_pid" ]; then
    kill "$logs_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 0' INT TERM

pnpm astro dev --background --host 0.0.0.0 --port 4321
pnpm astro dev status
server_pid=$(node --input-type=module -e 'import fs from "node:fs"; console.log(JSON.parse(fs.readFileSync(".astro/dev.json", "utf8")).pid)')
pnpm astro dev logs --follow &
logs_pid=$!

# Keep the container alive, but fail if the detached server exits.
while kill -0 "$server_pid" 2>/dev/null; do
  sleep 2 &
  wait $!
done
echo "Astro development server stopped unexpectedly." >&2
exit 1
