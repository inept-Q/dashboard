// Update clock every second
function updateTime() {
    const el = document.getElementById('server-time');
    if (el) el.textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

function setDot(id, status) {
    const dot = document.getElementById(id);
    if (dot) dot.className = 'status-dot ' + status;
}

// Load stats and service status from stats.json (written by server-side script)
async function loadStats() {
    try {
        const res = await fetch('data/stats.json?t=' + Date.now());
        const data = await res.json();
        document.getElementById('stat-cpu').textContent = data.cpu ?? '—';
        document.getElementById('stat-ram').textContent = data.ram ?? '—';
        document.getElementById('stat-disk').textContent = data.disk ?? '—';
        document.getElementById('stat-uptime').textContent = data.uptime ?? '—';

        if (data.services) {
            setDot('status-nextcloud', data.services.nextcloud ?? 'down');
            setDot('status-bitwarden', data.services.bitwarden ?? 'down');
            setDot('status-uptime', data.services['uptime-kuma'] ?? 'down');
        }
    } catch {
        // stats not available — leave as dashes
    }
}

loadStats();
setInterval(loadStats, 10000);
