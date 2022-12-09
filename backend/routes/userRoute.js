const express = require('express');
const { registerUser, logInUser, logOutUser, forgotPassword, resetPassword, getUserDetails,getProfessionalById, updatePassword, updateProfile, setupProfile, getAllProfessionals, getAllProfessionalsByCategory, addReview } = require('../controllers/userController');
const isAuthenticatedUser = require('../middlewares/auth');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(logInUser);
router.route('/logout').get(isAuthenticatedUser, logOutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/profile/update').put(isAuthenticatedUser, updateProfile);
router.route('/me/profile/setup').put(isAuthenticatedUser, setupProfile);
router.route('/professional/getAll').get(isAuthenticatedUser, getAllProfessionals);
router.route('/professional/:category').get(isAuthenticatedUser, getAllProfessionalsByCategory);
router.route('/professional/single/:id').get(isAuthenticatedUser, getProfessionalById);
router.route('/review/new/:id').put(isAuthenticatedUser, addReview);

module.exports = router;