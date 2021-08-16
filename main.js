'use strict';

const fs = require('fs');
const { getIPPrefix } = require('./util/network');
const Tasmota = require('./plugins/tasmota');
const Shelly = require('./plugins/shelly');

const plugins = [
    Tasmota,
    Shelly,
]

async function discover(ipPrefix) {
    let devices = [];

    for (const plugin of plugins) {
        const p = new plugin();

        const newDevices = await p.discover(ipPrefix);

        devices = [...devices, ...newDevices];
    };

    console.log(`Found ${devices.length} device(s).`);

    saveDevices(devices);
}

function saveDevices(devices) {
    const devicesDir = 'devices';

    if (!fs.existsSync(devicesDir)) {
        fs.mkdirSync(devicesDir);
    }

    fs.writeFileSync('devices/devices.json', JSON.stringify(devices, null, 2));
}

const ipPrefix = getIPPrefix();

discover(ipPrefix);