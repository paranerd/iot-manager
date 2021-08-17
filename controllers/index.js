const express = require('express');
const cors = require('cors');
const router = express.Router();

if (!!process.env.PRODUCTION) {
    router.use(cors());
}

// Include all controllers
router.use('/api/devices', require('./devices').router);

module.exports = router;