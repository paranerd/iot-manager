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
 * Scan for devices
 */
router.get('/scan', async (req, res) => {
    try {
        const devices = [];

        const ipAddresses = generateFullIpRange();

        for (const ip of ipAddresses) {
            console.log(`Scanning ${ip}...`);
            for (const Plugin of plugins) {
                const p = new Plugin();

                const device = await p.scan(ip);

                if (device) {
                    console.log('Found device!');
                    devices.push(device);
                    break;
                }
            }
        }

        console.log(`Found ${devices.length} device(s).`);

        saveDevices(devices);

        res.json();
    } catch (err) {
        console.error(err);
    }
});

function generateFullIpRange() {
    const ipPrefix = getIPPrefix();
    const ipAddresses = [];

    for (let i = 1; i < 255; i++) {
        ipAddresses.push(ipPrefix + i);
    }

    return ipAddresses;
}

router.patch('/refresh', async (req, res) => {
    const devices = loadDevices();

    for (const i in devices) {
        if (req.query.ip && devices[i].ip !== req.query.ip) {
            continue;
        }

        const Plugin = getPlugin(devices[i].type);
        const p = new Plugin();
        devices[i] = await p.scan(devices[i].ip);
    }

    saveDevices(devices);

    res.json();
});

router.patch('/update', async (req, res) => {
    const devices = loadDevices();

    for (const i in devices) {
        if (req.query.ip && devices[i].ip !== req.query.ip) {
            continue;
        }

        const Plugin = getPlugin(devices[i].type);
        const p = new Plugin();
        await p.update(devices[i].ip);

        devices[i] = await p.scan(devices[i].ip);
    }

    saveDevices(devices);

    res.json();
});

function getPlugin(type) {
    for (const plugin of plugins) {
        if (plugin.type === type) {
            return plugin;
        }
    }
}

function loadDevices(ip = null) {
    try {
        const devicesRaw = fs.readFileSync(DEVICES_PATH);
        const devices = JSON.parse(devicesRaw);

        if (ip) {
            return [devices.find(device => device.ip === ip)];
        }

        return devices;
    }
    catch {
        return {}
    }
}

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
