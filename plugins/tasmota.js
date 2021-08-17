const axios = require('axios');
const semver = require('semver');

class Tasmota {
    async discover(ipPrefix) {
        const devices = [];
        const currentFirmware = await this.getCurrentFirmwareVersion();

        for (let i = 52; i <= 52; i++) {
            //for (let i = 1; i <= 254; i++) {
            console.log(`Scanning ${ipPrefix}${i}...`);

            try {
                const res = await axios.get(`http://${ipPrefix}${i}/cm?cmnd=status+0`, { timeout: 500 });

                if (!res.data || !('Status' in res.data)) {
                    continue;
                }

                const installedFirmware = this.cleanFirmwareVersion(res.data.StatusFWR.Version);

                devices.push({
                    'ip': '192.168.178.' + i,
                    'hostname': res.data.StatusNET.Hostname,
                    'firmware': {
                        'installed': installedFirmware,
                        'latest': currentFirmware,
                        'hasUpdate': semver.lt(installedFirmware, currentFirmware),
                    },
                    'type': 'tasmota',
                });

                console.log('Found device!');
            }
            catch (err) {
                continue;
            }
        }

        return devices;
    }

    cleanFirmwareVersion(version) {
        return version.substring(0, version.lastIndexOf('('));
    }

    async getCurrentFirmwareVersion() {
        try {
            const res = await axios.get('https://api.github.com/repos/arendst/Tasmota/releases/latest');

            return semver.clean(res.data.tag_name);
        }
        catch (err) {
            console.error(err);
        }
    }
}

module.exports = Tasmota;
