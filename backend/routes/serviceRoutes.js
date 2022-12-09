const express = require('express');
const { createService ,createCategory, getCategories, getAllServices, getServiceDetails} = require('../controllers/serviceController');
const isAuthenticatedUser = require('../middlewares/auth');
const router = express.Router();

router.route('/new').post(isAuthenticatedUser, createService);
router.route('/category').post(isAuthenticatedUser, createCategory).get(isAuthenticatedUser, getCategories);
router.route('/:name').get(isAuthenticatedUser, getAllServices);
router.route('/details/:id').get(getServiceDetails);

module.exports = router;