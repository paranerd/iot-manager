const axios = require('axios');
const semver = require('semver');
const CacheHelper = require('../util/cache');
const cache = new CacheHelper();

class Tasmota {
    static type = 'tasmota';

    async scan(ip) {
        const latestFirmware = await this.getLatestFirmwareVersion();

        try {
            const res = await axios.get(`http://${ip}/cm?cmnd=status+0`, { timeout: 500 });

            if (!res.data || !('Status' in res.data)) {
                return null;
            }

            const installedFirmware = this.cleanFirmwareVersion(res.data.StatusFWR.Version);

            return {
                'ip': ip,
                'hostname': res.data.StatusNET.Hostname,
                'firmware': {
                    'installed': installedFirmware,
                    'latest': latestFirmware,
                    'hasUpdate': semver.lt(installedFirmware, latestFirmware),
                },
                'type': Tasmota.type,
            };
        }
        catch (err) {
            return null;
        }
    }

    async getFirmwareInfo(ip) {
        const res = await axios.get(`http://${ip}/cm?cmnd=status+2`, { timeout: 500 });

        const installedFirmware = this.cleanFirmwareVersion(res.data.StatusFWR.Version);
        const latestFirmware = await this.getLatestFirmwareVersion();

        return {
            'installed': installedFirmware,
            'latest': latestFirmware,
            'hasUpdate': semver.lt(installedFirmware, latestFirmware),
        }

    }

    cleanFirmwareVersion(version) {
        return version.substring(0, version.lastIndexOf('('));
    }

    async getLatestFirmwareVersion() {
        const cachedVersion = cache.get('tasmotaLatestVersion');

        if (cachedVersion && cachedVersion.updated > Date.now() - 24 * 60 * 60 * 1000) {
            return cachedVersion.version;
        }

        try {
            const res = await axios.get('https://api.github.com/repos/arendst/Tasmota/releases/latest');
            const version = semver.clean(res.data.tag_name);

            cache.set('tasmotaLatestVersion', {
                version: version,
                updated: Date.now(),
            });

            return version;
        }
        catch (err) {
            console.error(err);
        }
    }

    async upgrade(ip) {
        try {
            const res = await axios.get(`http://${ip}/cm?cmnd=upgrade+1`);

            return true;
        }
        catch (err) {
            console.error(err);
        }
    }
}

module.exports = Tasmota;
