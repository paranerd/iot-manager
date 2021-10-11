const axios = require('axios');
const semver = require('semver');
const path = require('path');
const ConfigHelper = require('../util/config');

const SECRETS_PATH = path.resolve(__dirname, '../config/secrets.json');
const secrets = new ConfigHelper(SECRETS_PATH);

class Shelly {
    static type = 'shelly';

    async callApi(ip, endpoint, params = {}, timeout = 0) {
        try {
            // Build URL
            const url = new URL(`http://${ip}/${endpoint}`);
            url.search = new URLSearchParams(params).toString();

            // Add authentication
            const auth = {
                username: secrets.get(['shelly', 'username']),
                password: secrets.get(['shelly', 'password']),
            };

            return await axios.get(url.toString(), { timeout, auth });
        }
        catch (err) {
            throw (err);
        }
    }

    async scan(ip) {
        try {
            const res = await this.callApi(ip, 'settings', {}, 500);

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
            const res = await this.callApi(ip, 'status');

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
            const res = await this.callApi(ip, 'ota', { update: true });
            return true;
        }
        catch (err) {
            console.error(err);
        }
    }
}



module.exports = Shelly;
