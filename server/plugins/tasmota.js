const axios = require('axios');
const semver = require('semver');
const path = require('path');
const CacheHelper = require('../util/cache');
const ConfigHelper = require('../util/config');

const SECRETS_PATH = path.resolve(__dirname, '../config/secrets.json');
const cache = new CacheHelper();
const secrets = new ConfigHelper(SECRETS_PATH);

class Tasmota {
    static type = 'tasmota';

    async callApi(ip, endpoint, params = {}, timeout = 0) {
        try {
            // Add authentication
            const auth = {
                user: secrets.get(['tasmota', 'username']),
                password: secrets.get(['tasmota', 'password']),
            };

            params = Object.assign(params, auth);

            // Build URL
            const url = new URL(`http://${ip}/${endpoint}`);
            url.search = new URLSearchParams(params).toString();

            return await axios.get(url.toString(), { timeout });
        }
        catch (err) {
            throw (err);
        }
    }

    async scan(ip) {
        const latestFirmware = await this.getLatestFirmwareVersion();

        try {
            const res = await this.callApi(ip, 'cm', { cmnd: 'status+0' }, 500);

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
        const res = await this.callApi(ip, 'cm', { cmnd: 'status+2' });

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

    async update(ip) {
        try {
            const res = await this.callApi(ip, 'cm', { cmnd: 'upgrade+1' });

            return true;
        }
        catch (err) {
            console.error(err);
        }
    }
}

module.exports = Tasmota;
