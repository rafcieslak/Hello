const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const VISITS_FILE = path.join(__dirname, 'visits.json');

function getVisitCount() {
    try {
        const data = fs.readFileSync(VISITS_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return parsed.visitCount || 0;
    } catch (err) {
        return 0;
    }
}

function saveVisitCount(count) {
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ visitCount: count }));
}

let visitCount = getVisitCount();

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/api/visit') {
        visitCount++;
        saveVisitCount(visitCount);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ visitCount }));
    } else if (req.method === 'GET' && req.url === '/api/visit') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ visitCount }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
