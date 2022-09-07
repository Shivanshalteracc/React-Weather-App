const router = require('express').Router();
const {gettingWeather} = require('../controllers/gettingWeather');
router.route("/").post(gettingWeather);

module.exports = router;