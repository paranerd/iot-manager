const express = require('express');
const fs = require('fs');
const { getIPPrefix } = require('../util/network');
const Tasmota = require('../plugins/tasmota');
const Shelly = require('../plugins/shelly');

const router = express.Router();

const plugins = [
    Tasmota,
    Shelly,
];

/**
 * Discover devices
 */
router.get('/discover', async (req, res) => {
    try {
        const ipPrefix = getIPPrefix();
        let devices = [];

        for (const plugin of plugins) {
            const p = new plugin();

            const newDevices = await p.discover(ipPrefix);

            devices = [...devices, ...newDevices];
        };

        console.log(`Found ${devices.length} device(s).`);

        saveDevices(devices);

        res.json({
            result: 'ok',
        });
    } catch (err) {
        console.error(err);
    }
});

function saveDevices(devices) {
    const devicesDir = 'devices';

    if (!fs.existsSync(devicesDir)) {
        fs.mkdirSync(devicesDir);
    }

    fs.writeFileSync('devices/devices.json', JSON.stringify(devices, null, 2));
}

module.exports = {
    router
};
