const express = require('express');
const fs = require('fs');
const { getIPPrefix } = require('../util/network');
const Tasmota = require('../plugins/tasmota');
const Shelly = require('../plugins/shelly');

const router = express.Router();
const DEVICES_PATH = 'devices/devices.json';

const plugins = [
    Tasmota,
    Shelly,
];

/**
 * Get all devices
 */
router.get('/', async (req, res) => {
    let devices = {};

    if (fs.existsSync(DEVICES_PATH)) {
        devices = JSON.parse(fs.readFileSync(DEVICES_PATH));
    }

    res.json(devices);
});

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

    fs.writeFileSync(DEVICES_PATH, JSON.stringify(devices, null, 2));
}

module.exports = {
    router
};
