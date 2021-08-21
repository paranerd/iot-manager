'use strict'

const path = require('path');
const ConfigHelper = require('./config');

class CacheHelper extends ConfigHelper {
    constructor() {
        const location = path.join(__dirname, "../", "config", "cache.json");

        super(location);
    }
}

module.exports = CacheHelper;
