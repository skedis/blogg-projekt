const express = require('express');
const { check } = require('express-validator')

const authController = require('../controllers/authController');

const router = express.Router();

// GET routes
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/logout', authController.getLogout);

// POST routes
router.post('/login', authController.postLogin);
router.post('/register', [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  check('password').not().isEmpty().withMessage('Password is required'),
  check('password_confirm', 'Passwords must match').custom((value, { req, loc, path }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    } else { 
      return value; 
    }
  })

], authController.postRegister);

module.exports = router;
