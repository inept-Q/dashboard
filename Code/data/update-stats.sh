#!/bin/bash
# Writes current server stats to stats.json so the dashboard can read them
# Run via cron: * * * * * bash /home/bumble_q/Apps/dashboard/Code/data/update-stats.sh

OUT="/home/bumble_q/Apps/dashboard/Code/data/stats.json"

CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2)}')%
RAM=$(free -m | awk '/Mem:/ {printf "%dMB / %dMB", $3, $2}')
DISK=$(df -h / | awk 'NR==2 {printf "%s / %s (%s)", $3, $2, $5}')
UPTIME=$(uptime -p | sed 's/up //')

port_status() {
    curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://localhost:$1" 2>/dev/null
}

NEXTCLOUD=$([ "$(port_status 8080)" != "000" ] && echo "up" || echo "down")
BITWARDEN=$([ "$(port_status 8081)" != "000" ] && echo "up" || echo "down")
UPTIME_KUMA=$([ "$(port_status 3001)" != "000" ] && echo "up" || echo "down")

cat > "$OUT" << EOF
{
  "cpu": "$CPU",
  "ram": "$RAM",
  "disk": "$DISK",
  "uptime": "$UPTIME",
  "services": {
    "nextcloud": "$NEXTCLOUD",
    "bitwarden": "$BITWARDEN",
    "uptime-kuma": "$UPTIME_KUMA"
  }
}
EOF
