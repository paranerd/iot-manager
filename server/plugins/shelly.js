const axios = require('axios');
const semver = require('semver');

class Shelly {
    static type = 'shelly';

    async scan(ip) {
        try {
            const res = await axios.get(`http://${ip}/settings`, { timeout: 500 });

            if (!res.data || !('device' in res.data)) {
                return null;
            }

            const firmware = await this.getFirmwareInfo(ip);

            return {
                'ip': ip,
                'hostname': res.data.device.hostname,
                'firmware': firmware,
                'type': Shelly.type,
            };
        }
        catch (err) {
            return null;
        }
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
        }
    }

    async update(ip) {
        try {
            const res = await axios.get(`http://${ip}/ota?update=true`);
            return true;
        }
        catch (err) {
            console.error(err);
        }
    }
}



module.exports = Shelly;
