const axios = require('axios');
const semver = require('semver');

class Shelly {
    async discover(ipPrefix) {
        const devices = [];

        for (let i = 1; i <= 254; i++) {
            const currentIP = `${ipPrefix}${i}`;
            console.log(`Scanning ${currentIP}...`);

            try {
                const res = await axios.get(`http://${currentIP}/settings`, { timeout: 500 });

                if (!res.data || !('device' in res.data)) {
                    continue;
                }

                const firmware = await this.getFirmwareInfo(currentIP);

                devices.push({
                    'ip': '192.168.178.' + i,
                    'hostname': res.data.device.hostname,
                    'firmware': firmware,
                    'type': 'shelly',
                });

                console.log('Found device!');
            }
            catch (err) {
                console.error(err);
                continue;
            }
        }

        return devices;
    }

    cleanFirmwareVersion(version) {
        return version.match(/\d+(\.\d+)+/)[0];
    }

    async getFirmwareInfo(ip) {
        try {
            const res = await axios.get(`http://${ip}/status`);

            const installedVersion = this.cleanFirmwareVersion(res.data.update.old_version);
            const currentVersion = this.cleanFirmwareVersion(res.data.update.new_version);

            return {
                'installed': semver.clean(installedVersion),
                'latest': semver.clean(currentVersion),
                'hasUpdate': semver.lt(installedVersion, currentVersion),
            };
        }
        catch (err) {
            console.error(err);
        }
    }
}

module.exports = Shelly;