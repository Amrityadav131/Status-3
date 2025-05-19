
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const services = [
  { name: 'My Website', url: 'https://yourwebsite.com' },
  { name: 'Minecraft Server', url: 'http://minecraft-server-ip:port' },
];

let statusCache = [];

// Function to check status
async function checkServices() {
  const results = await Promise.all(services.map(async (service) => {
    try {
      await axios.get(service.url, { timeout: 3000 });
      return { name: service.name, status: 'Online', lastChecked: new Date().toISOString() };
    } catch {
      return { name: service.name, status: 'Offline', lastChecked: new Date().toISOString() };
    }
  }));
  statusCache = results;
}

// Initial check and then every 10 seconds
checkServices();
setInterval(checkServices, 10000);

app.use(express.static('public')); // serve frontend files

// API endpoint to get status
app.get('/api/status', (req, res) => {
  res.json(statusCache);
});

app.listen(port, () => {
  console.log(`Status page running at http://localhost:${port}`);
});
