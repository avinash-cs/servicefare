const router = require('express').Router();
const isAuthenticatedUser = require('../middlewares/auth');
const isAuthorizedRole = require('../middlewares/authPro');
const { placeNewOrder, updateOrderStatus, getMyOrders, getOrderDetails, acceptOrder, deleteOrder } = require('../controllers/orderController');


router.route('/new').post(isAuthenticatedUser, placeNewOrder);
router.route('/myorders').get(isAuthenticatedUser, getMyOrders);
router.route('/details/:id').get(isAuthenticatedUser, getOrderDetails);
router.route('/status/:id').put(isAuthenticatedUser, isAuthorizedRole("professional", "admin"), updateOrderStatus).delete(isAuthenticatedUser, isAuthorizedRole("professional", "admin"), deleteOrder);
router.route('/accept/:id').put(isAuthenticatedUser, isAuthorizedRole("professional", "admin"), acceptOrder);

module.exports = router;