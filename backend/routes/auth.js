const express = require('express');
const { adminLogin, adminRegister, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', adminRegister);
router.get('/me', protect, getMe);

module.exports = router;
