const { networkInterfaces } = require('os');

function getCurrentIP() {
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
}

function getIPPrefix() {
    const ip = getCurrentIP();
    return ip.substring(0, ip.lastIndexOf('.') + 1);
}

module.exports = {
    getIPPrefix
}