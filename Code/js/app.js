// Update clock every second
function updateTime() {
    const el = document.getElementById('server-time');
    if (el) el.textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Check if a URL is reachable
async function checkService(url, dotId) {
    const dot = document.getElementById(dotId);
    if (!dot) return;
    try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-cache' });
        dot.className = 'status-dot up';
    } catch {
        dot.className = 'status-dot down';
    }
}

function checkAllServices() {
    checkService('http://100.101.233.78:8080', 'status-nextcloud');
    checkService('http://100.101.233.78:8081', 'status-bitwarden');
    checkService('http://100.101.233.78:3001', 'status-uptime');
}

checkAllServices();
setInterval(checkAllServices, 30000);

// Load stats from stats.json (written by server-side script)
async function loadStats() {
    try {
        const res = await fetch('data/stats.json?t=' + Date.now());
        const data = await res.json();
        document.getElementById('stat-cpu').textContent = data.cpu ?? '—';
        document.getElementById('stat-ram').textContent = data.ram ?? '—';
        document.getElementById('stat-disk').textContent = data.disk ?? '—';
        document.getElementById('stat-uptime').textContent = data.uptime ?? '—';
    } catch {
        // stats not available — leave as dashes
    }
}

loadStats();
setInterval(loadStats, 10000);
