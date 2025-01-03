// routes/index.js

const express = require('express');

const router = express.Router();

router.get('/in', (req, res) => {
    res.send('Hello, World !');
});

module.exports = router;