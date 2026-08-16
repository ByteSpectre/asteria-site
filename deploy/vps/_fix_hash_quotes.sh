#!/usr/bin/env bash
set -euo pipefail
cd /home/ksusha/projects/asteria

# Fix hash quoting: dotenv expands $vars inside double quotes and breaks bcrypt.
python3 - <<'PY'
from pathlib import Path
path = Path(".env")
text = path.read_text(encoding="utf-8")
lines = []
for line in text.splitlines():
    if line.startswith("ADMIN_PASSWORD_HASH="):
        raw = line.split("=", 1)[1].strip()
        if (raw.startswith('"') and raw.endswith('"')) or (raw.startswith("'") and raw.endswith("'")):
            raw = raw[1:-1]
        # single quotes prevent dotenv $ expansion
        lines.append(f"ADMIN_PASSWORD_HASH='{raw}'")
    else:
        lines.append(line)
path.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("updated ADMIN_PASSWORD_HASH quoting")
PY

# show hash length only
python3 - <<'PY'
from pathlib import Path
for line in Path(".env").read_text().splitlines():
    if line.startswith("ADMIN_PASSWORD_HASH="):
        v=line.split("=",1)[1].strip().strip("'").strip('"')
        print("hash len", len(v), "starts", v[:7], "dollars", v.count("$"))
PY

pm2 reload deploy/vps/ecosystem.config.cjs --update-env
sleep 2

ANSWER=$(curl -sS -D - -c /tmp/cj2.txt -o /dev/null "http://127.0.0.1:3000/api/captcha?v=fix" | awk 'tolower($1)=="x-debug-captcha:"{print $2}' | tr -d '\r')
echo "ANSWER=$ANSWER"
curl -sS -c /tmp/cj2.txt -b /tmp/cj2.txt -H 'Content-Type: application/json' \
  -d "{\"login\":\"admin@asteria.com\",\"password\":\"admin123\",\"captcha\":\"$ANSWER\"}" \
  "http://127.0.0.1:3000/api/dev/login-probe"
echo
