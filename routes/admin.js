const express = require('express');
const { admindashboard, getproducts, getUsers, getLogin, getaddproducts, postLogin, getlogout, postaddproducts, getCategory, postCategory, blockUsers, unblockUsers, deleteProducts, viewCategory, deletecategorys, updateproduct, getupdateproduct, postupdateproduct, getBanner, addBanner, postaddBanner, deleteBanner, viewOrders, donutChartData, getSalesReport, dailysales, monthlysales, yearlysales, orderCanceladmin, orderShipadmin, orderDeliveradmin, addCoupen, AddCoupen, getCoupens, getAddCoupen, postAddCoupon, addCategoryOffer, ViewCategoryOffer, delCategoryOffer, postAddcatOffer, addProdOffer } = require('../controllers/adminContollers');
const adminhelper = require('../helpers/adminhelper')
const router = express.Router();
const multer = require('../helpers/multer')


/* -------------------------------------------------------------------------- */
/*                                 admin Login  Routes                       */
/* -------------------------------------------------------------------------- */

router.get('/admin-login', getLogin)

router.post('/admin-login', postLogin)

router.get("/logout", getlogout)

/* -------------------------------------------------------------------------- */
/*                                 User Routes                                */
/* -------------------------------------------------------------------------- */

router.get('/admindashboard', admindashboard)

router.get('/admin-users/:id', blockUsers)

// router.get('/admin-user/:id', unblockUsers)


/* -------------------------------------------------------------------------- */
/*                               Products Routes                              */
/* -------------------------------------------------------------------------- */

router.get('/admin-products', getproducts)

router.get('/admin-users', getUsers)

router.get('/admin-addproducts', getaddproducts)

router.post('/admin-addproducts', multer.array('image', 4), postaddproducts)

router.get('/admin-deleteProduct/:id', deleteProducts)

router.get('/admin-updateproducts/:id', getupdateproduct)

router.post('/admin-updateproducts/:id', multer.array('image', 4), postupdateproduct)


/* -------------------------------------------------------------------------- */
/*                               Category Routes                              */
/* -------------------------------------------------------------------------- */


router.get('/admin-category', getCategory)

router.post('/admin-category', postCategory)

router.get('/admin-viewcategory', viewCategory)

router.get('/admin-deletecategory/:id', deletecategorys)

/* -------------------------------------------------------------------------- */
/*                                Banner Routes                               */
/* -------------------------------------------------------------------------- */

router.get('/admin-banner', getBanner)

router.get('/admin-addbanner', addBanner)

router.get('/admin-deletebanner/:id', deleteBanner)


router.post('/admin-addbanner', multer.array('image'), postaddBanner)



router.get('/admin-orders',viewOrders)



router.post('/loadDonutChart',donutChartData)


router.get('/admin-sales',getSalesReport)


router.post('/admin-dailysales',dailysales)

router.post('/admin-monthlysales',monthlysales)

router.post('/admin-yearlysales',yearlysales)

router.get('/order-canceladmin/:id',orderCanceladmin)

router.get('/order-shipped/:id',orderShipadmin)

router.get('/order-deliver/:id',orderDeliveradmin)

router.get('/admin-viewcoupen',getCoupens)

router.get('/admin-addcoupen',getAddCoupen)

router.post('/admin-addcoupen',postAddCoupon)

router.get('/admin-addCatOffer',addCategoryOffer)

router.post('/admin-addCatOffer',postAddcatOffer)

// router.get('/admin-ViewCatoffer',ViewCategoryOffer)

// router.post('/admin-ViewCatoffer',ViewCategoryOffer)


// router.get('/delete-category-offer/:id',delCategoryOffer)

// router.get('/admin-addProdOffer',addProdOffer)

// router.post('/admin-addProdOffer',addProdOffer)


// router.get('/admin-ViewProdoffer',ViewCategoryOffer)


module.exports = router;




