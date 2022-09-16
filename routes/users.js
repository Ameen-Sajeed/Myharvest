var express = require('express');
// const { getlogout } = require('../controllers/adminContollers');
const { getLogin, getLoginRegister, postSignup, postLogin, getproductsDetails, homepage, nodata, getcart, getcheckout, getOtp, confirmOtp, postOtp, getSignUp, postconfirmOtp, addtocart, logout, getProfile, changeproductquantity, vegetables, postcheckout, deleteCart, orderplaced, verifyPayment, orderProducts, addressPage, postAddressAdd, getEditAddress, postEditAddress, addressdelete, PostCheckoutAddress, getCheckoutAddress, orderCancel, PostapplyCoupon, PostremoveCoupon, getWishList, getAddtoWishList, postRemoveWishProducts, ReturnOrder, getallProducts, postCartclear, getEmptyCart, getResetPassword, PostResetPassword } = require('../controllers/userContollers');
// const { addAddress } = require('../helpers/userhelper');
const { verifyLogin } = require('../middlewares/verify');
const verify = require('../middlewares/verify');
var router = express.Router();


/* -------------------------------------------------------------------------- */
/*                              User Login Routes                             */
/* -------------------------------------------------------------------------- */

router.get('/login', getLogin)

router.post('/login', postLogin)

router.get('/login-register', getLoginRegister)

router.get('/signup', getSignUp)

router.post('/signup', postSignup)

router.get('/user-logout', logout)

router.get('/',homepage)

router.get('/productdetails/:id', getproductsDetails)

router.get('/error', nodata)

router.get('/cart', verifyLogin, getcart)

router.get('/addtocart/:id',addtocart)

router.post('/delete-cart-items',deleteCart)


router.get('/checkout',verifyLogin, getcheckout)

router.post('/checkout',postcheckout)



router.get('/otp', getOtp)

router.post('/otp', postOtp)

router.get('/confirmotp', confirmOtp)

router.post('/confirmotp', postconfirmOtp)

router.get('/profile',verifyLogin, getProfile)

router.post('/change-product-quantity',changeproductquantity)

router.get('/veg/:id',vegetables)


router.get('/ordersuccess',orderplaced)


router.get('/viewOrderProducts/:id',orderProducts)

router.post('/verify-payment',verifyPayment)


router.get('/add-address',addressPage)

router.post('/add-address',postAddressAdd)

router.get('/edit-address/:id',getEditAddress)

router.post('/edit-address',postEditAddress)

router.get('/delete-address/:id',addressdelete)

router.get('/addcheck-address',getCheckoutAddress)


router.post('/addcheck-address',PostCheckoutAddress)

router.get('/order-cancel/:id',orderCancel)

router.post('/apply-coupon',PostapplyCoupon)

router.post('/remove-coupon',PostremoveCoupon)


router.get('/wishlist',verifyLogin,getWishList)

router.get('/wishlist/add-to-wishlist/:id',getAddtoWishList)

router.post('/wishlist/remove-product',postRemoveWishProducts)

router.post('/returnproduct',ReturnOrder)

router.get('/allproducts',getallProducts)

router.post('/clearcarts',postCartclear)

router.get('/emptycart',getEmptyCart)

router.get('/changepassword',getResetPassword)

router.post('/changepassword',PostResetPassword)

module.exports = router;
