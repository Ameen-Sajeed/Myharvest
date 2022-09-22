const adminhelper = require("../helpers/adminhelper")
const userhelper = require("../helpers/userhelper")
const paypal = require('paypal-rest-sdk')
const { response } = require("../app")




/* -------------------------------------------------------------------------- */
/*                            get landing/homepage                            */
/* -------------------------------------------------------------------------- */
let user
const homepage = async (req, res) => {
    user = req.session.user
    var cartcount
    if (req.session.user) {
        cartcount = await userhelper.getCartCount(req.session.user._id)
    }
    // let wish = await userhelper.getWishlistProducts(user._id)


   
   await adminhelper.ViewProduct().then(async(products) => {
        var product =[]
        for(var i=0;i<4;i++){
           product[i]= products[i]

        }


        await adminhelper.viewCategory().then(async(category) => {
            await   adminhelper.viewBanner().then((banner) => {
                // let list = await userhelper.viewCartProducts(user)

                // console.log(list,"uiiuiuiii");

                       res.render('user/index', { product, category, user, cartcount, banner });
   

       })
   

                })

            })
        }

    




/* -------------------------------------------------------------------------- */
/*                                  get login                                 */
/* -------------------------------------------------------------------------- */

const getLogin = (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('user/login-register', { "loginErr": req.session.loggedErrs })
        req.session.loggedErrs = false
    }

    // res.render('user/login-register')
}

/* -------------------------------------------------------------------------- */
/*                                 post login                                 */
/* -------------------------------------------------------------------------- */

const postLogin = (req, res) => {

    userhelper.doLogin(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn = true;
            req.session.user = response.user
            res.redirect('/')
        } else {
            req.session.loginErrs = true;
            res.redirect('/login')
        }
    })

}

/* -------------------------------------------------------------------------- */
/*                                   Log Out                                  */
/* -------------------------------------------------------------------------- */

const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}


/* -------------------------------------------------------------------------- */
/*                           User Login and Register                          */
/* -------------------------------------------------------------------------- */

const getLoginRegister = (req, res) => {
    res.render('user/login-register')
}


const getSignUp = (req, res) => {
    res.render('user/login-register')
}


/* -------------------------------------------------------------------------- */
/*                                 user Signup                                */
/* -------------------------------------------------------------------------- */

const postSignup = (req, res, next) => {

    userhelper.doSignup(req.body).then((response) => {
        if (response.status) {
            // response.user.status = true

            // console.log(req.body)

            res.redirect('/signup')
        }
        else {
            console.log(response.status)
            res.redirect('/login')
        }
    })

}
/* -------------------------------------------------------------------------- */
/*                              getProductDetails                             */
/* -------------------------------------------------------------------------- */

const getproductsDetails = async(req, res, next) => {


    try{
        
    
    let user = req.session.user
   
        let proId = req.params.id
        // console.log(proId)
        var cartcount
        if (req.session.user) {
            cartcount = await userhelper.getCartCount(req.session.user._id)
        }
        await userhelper.Viewproductdetail(proId).then(async(data) => {
       let category = await adminhelper.ViewcatOffProduct(data.category)
       let categorydet= await adminhelper.viewCategory()
       console.log(category,"777777777");
            console.log(data,"gfhjkl;");
            res.render('user/productDetails', {data,category,categorydet,user,cartcount})
    
        
        }) 
    }catch(error){
              res.redirect('/error')

        }
    
        
   
   
  
}

/* -------------------------------------------------------------------------- */
/*                                  404 Page                                  */
/* -------------------------------------------------------------------------- */

const nodata = (req, res) => {
    res.render('404page')
}

/* -------------------------------------------------------------------------- */
/*                                  get cart                                  */
/* -------------------------------------------------------------------------- */
const getcart = async (req, res, next) => {
    let subtotal;
    var cartcount
    if (req.session.user) {
        cartcount = await userhelper.getCartCount(req.session.user._id)
    }
    let products = await userhelper.viewCartProducts(req.session.user._id)
    let category = await adminhelper.viewCategory()
    let totalValue = 0;
    if (products.length > 0) {
        totalValue = await userhelper.getTotalAmount(req.session.user._id)

    }
    // console.log("hjjhdsgjgf");
    // console.log(products);

    subtotal = await userhelper.getSubTotalAmount(req.session.user._id)
    for (var i = 0; i < products.length; i++) {
        products[i].subTotal = subtotal[i].suBtotal
    }

    // console.log(subtotal);
    // console.log(user)

    if(totalValue  == 0){
        res.redirect('/emptycart')
    }
    else {

    res.render('user/cart', { products, user, totalValue,category,cartcount })


}
}

/* -------------------------------------------------------------------------- */
/*                                 add to Cart                                */
/* -------------------------------------------------------------------------- */

const addtocart = (req, res) => {
    console.log(req.params.id);

    userhelper.addtoCarts(req.params.id, req.session.user._id).then(() => {


        res.json({ status: true })
   
    })

}

/* -------------------------------------------------------------------------- */
/*                                 delete Cart                                */
/* -------------------------------------------------------------------------- */

const deleteCart = (req, res) => {
    userhelper.deleteCartItems(req.body).then((response) => {
        res.json(response)
    })

}


/* -------------------------------------------------------------------------- */
/*                                get checkout                                */
/* -------------------------------------------------------------------------- */

const getcheckout = async (req, res) => {

    let products = await userhelper.getCartProductList(req.session.user._id)


    let category = await adminhelper.viewCategory()

    var cartcount
    if (req.session.user) {
        cartcount = await userhelper.getCartCount(req.session.user._id)
    }

    let total = await userhelper.getTotalAmount(req.session.user._id)

    let address = await userhelper.viewAddress(req.session.user._id)

    let subtotal ;

    
    subtotal = await userhelper.getSubTotalAmount(req.session.user._id)
    for (var i = 0; i < products.length; i++) {
        products[i].subTotal = subtotal[i].suBtotal
    }

console.log(products,"hjkl");
    user = req.session.user

    console.log(total,'fghjkl');

 
    res.render('user/checkout', { total, user, address,subtotal,products,category,cartcount })
    }



/* -------------------------------------------------------------------------- */
/*                                post checkout                               */
/* -------------------------------------------------------------------------- */

const postcheckout = async (req, res) => {
    let products = await userhelper.getCartProductList(req.body.userId)
    let totalPrice = await userhelper.getTotalAmount(req.body.userId)
    let subtotal = await userhelper.getSubTotalAmount(req.session.user._id)


    let couponVerify = await adminhelper.couponVerify(req.session.user._id)

    console.log(req.body,"7876767676");

    // console.log("logging req - body", req.body);
    if (couponVerify.code == req.body.couponcode ) { 

      

        let discountAmount = (totalPrice * parseInt(couponVerify.value)) / 100
        let amount = totalPrice - discountAmount 


        await userhelper.placeOrder(req.body, products, amount,subtotal).then((orderId) => {

            if (req.body['payment-method'] === 'COD') {
                res.json({ codSuccess: true })

            } else if (req.body['payment-method'] === 'RAZORPAY') {
             
                if(req.body.useWallet =='1'){

                    console.log(req.body.payable,"oooooooo");
                    amount = req.body.payable              
                }
              

                userhelper.generateRazorpay(orderId, amount).then((response) => {
                    response.razorPay = true;  
                    res.json(response)
                })
            }

            else if (req.body['payment-method'] === 'PAYPAL') {
                console.log('vjhdbfjbfh');
                userhelper.generatePayPal(orderId, amount).then((response) => {
                    response.payPal = true;
                    res.json(response)
                })
            }
            else if(req.body['payment-method'] === 'walletPay'){
                res.json({ codSuccess: true })
                
            }


        })
    

    }
    else {

        await userhelper.placeOrder(req.body, products, totalPrice,subtotal).then(async(orderId) => {

            if (req.body['payment-method'] === 'COD') {
                let resp = userhelper.cartClear(req.session.user._id)
                res.json({ codSuccess: true })

            } else if (req.body['payment-method'] === 'RAZORPAY') {

                   if(req.body.useWallet =='1'){

                    console.log(req.body.payable,"oooooooo");
                    totalPrice = req.body.payable              
                }

                console.log(req.body.payable,"oooooooo");
               await userhelper.generateRazorpay(orderId, totalPrice).then((response) => {
                    response.razorPay = true;
                    res.json(response)
                })
            }

            else if (req.body['payment-method'] === 'PAYPAL') {
                if(req.body.useWallet =='1'){

                    console.log(req.body.payable,"oooooooo");
                    totalPrice = req.body.payable              
                }
              await  userhelper.generatePayPal(orderId, totalPrice).then((response) => {
                    response.payPal = true;
                    res.json(response)
                })
            }
              
            else if(req.body['payment-method']=== 'walletPay'){

                res.json({ codSuccess: true })
            }


        })

    }

}





/* -------------------------------------------------------------------------- */
/*                                   GET OTP                                  */
/* -------------------------------------------------------------------------- */

const getOtp = (req, res) => {
    res.render('user/otp')
}

/* -------------------------------------------------------------------------- */
/*                                get Confirm OTP                             */
/* -------------------------------------------------------------------------- */

const confirmOtp = (req, res) => {
    res.render('user/confirmotp')
}

/* -------------------------------------------------------------------------- */
/*                                  Post OTP                                  */
/* -------------------------------------------------------------------------- */

let signupData
const postOtp = (req, res) => {
    userhelper.doOTP(req.body).then((response) => {
        if (response.status) {
            signupData = response.user
            res.redirect('/confirmotp')
        }
        else {
            res.redirect('/otp')
        }
    })
}


/* -------------------------------------------------------------------------- */
/*                                 Resend Otp                                 */
/* -------------------------------------------------------------------------- */

const postresendOtp = (req, res) => {
    userhelper.doOTP(req.body).then((response) => {
        if (response.status) {
            signupData = response.user
            res.redirect('/confirmotp')
        }
        else {
            res.redirect('/otp')
        }
    })
}


/* -------------------------------------------------------------------------- */
/*                              POST Confirm OTP                              */
/* -------------------------------------------------------------------------- */

const postconfirmOtp = (req, res) => {
    userhelper.doOTPconfirm(req.body, signupData).then((response) => {
        if (response.status) {
            req.session.loggedIn = true;
            req.session.user = signupData

            res.redirect('/')
        }
        else {
            res.redirect('/confirmotp',)
        }
    })
}

/* -------------------------------------------------------------------------- */
/*                         view   Orders in User Profile                      */
/* -------------------------------------------------------------------------- */

const getProfile = async (req, res) => {
    let orders = await userhelper.getUserOrders(req.session.user._id)
    let details = await userhelper.viewAddress(req.session.user._id)
    let Id=req.params.id
    let coupon = await adminhelper.viewCoupens()
    let disCoup = await userhelper.displayCoupon(req.session.user._id)

    console.log(details,"90909090");


    
        res.render('user/userProfile', { orders, user, details , coupon,disCoup})
    }

    
   





/* -------------------------------------------------------------------------- */
/*                       View Ordered Products For user                       */
/* -------------------------------------------------------------------------- */


const orderProducts = async (req, res) => {
    let user = req.session.user
    let products = await userhelper.getOrderProduct(req.params.id)
    let orders = await userhelper.getOrderSummary(req.params.id)

    console.log(products,"9887878");

    console.log(orders,"90909090");
  
    res.render('user/orderProducts', { products, user,orders })
}


/* -------------------------------------------------------------------------- */
/*                           change product Quantity                          */
/* -------------------------------------------------------------------------- */


const changeproductquantity = (req, res, next) => {
    console.log(req.body);


    userhelper.changeProductQuantity(req.body).then(async (response) => {
        console.log('response');
        console.log(response);
        response.total = await userhelper.getTotalAmount(req.body.user)
        response.subtotal = await userhelper.getSubTotal(req.body)

        // response.total=data

        res.json(response)

    })


}

/* -------------------------------------------------------------------------- */
/*                           CATEGORY WISE PRODUCTS                           */
/* -------------------------------------------------------------------------- */

const vegetables = async(req, res) => {

    let Id = req.params.id
    let user = req.session.user
    var cartcount
    if (req.session.user) {
        cartcount = await userhelper.getCartCount(req.session.user._id)
    }

    console.log(Id);
      await userhelper.productCount(Id).then(async(ct)=>{

        let category = await adminhelper.viewCategory()
        await adminhelper.ViewcatOffProduct(Id).then((data)=>{
           
           
               // console.log(data,"8888888888");
   
               res.render('user/veg',{data,user,cartcount,category,ct})

     })

    })

}

/* -------------------------------------------------------------------------- */
/*                              ORDER SUCCES PAGE                             */
/* -------------------------------------------------------------------------- */

const orderplaced = (req, res) => {

    let resp = userhelper.cartClear(req.session.user._id)
    res.render('user/orderplaced')
}


/* -------------------------------------------------------------------------- */
/*                              Verfiying Payment                             */
/* -------------------------------------------------------------------------- */



const verifyPayment = (req, res) => {
    console.log(req.body);
    userhelper.verifyPayment(req.body).then(() => {
        userhelper.changePaymentStatus(req.body['order[receipt]']).then(() => {
            let removeCart = userhelper.cartClear(req.session.user._id)
            console.log('payment success');
            res.json({ status: true })
        })

    }).catch((err) => {
        res.json({ status: false, errMsg: "Payment Failed" })
    })
}



/* -------------------------------------------------------------------------- */
/*                                Address Page                                */
/* -------------------------------------------------------------------------- */

const addressPage = async(req, res) => {
    let user = req.session.user
   let category = await adminhelper.viewCategory()
   var cartcount
   if (req.session.user) {
       cartcount = await userhelper.getCartCount(req.session.user._id)
   }
    res.render('user/addUserAddress',{category,user,cartcount})
}


/* -------------------------------------------------------------------------- */
/*                        get Checkout add address                            */
/* -------------------------------------------------------------------------- */

const getCheckoutAddress = async(req, res) => {
    let user = req.session.user
   let category = await adminhelper.viewCategory()
   var cartcount
   if (req.session.user) {
       cartcount = await userhelper.getCartCount(req.session.user._id)
   }

    res.render('user/postcheckadd',{user,category,cartcount})
}



/* -------------------------------------------------------------------------- */
/*                        Post Checkout add Address                           */
/* -------------------------------------------------------------------------- */


const PostCheckoutAddress = (req, res) => {

    userhelper.addAddress(req.session.user._id, req.body).then((data) => {
        res.redirect('/checkout')
    })

}


/* -------------------------------------------------------------------------- */
/*                               Post  Add address                                */
/* -------------------------------------------------------------------------- */

const postAddressAdd = (req, res) => {

    userhelper.addAddress(req.session.user._id, req.body).then((data) => {
        res.redirect('/profile')
    })
}

/* -------------------------------------------------------------------------- */
/*                                Edit Address                                */
/* -------------------------------------------------------------------------- */

const getEditAddress = (req, res) => {

    let id = req.params.id

    userhelper.getAddressEdit(id, req.session.user._id).then((data) => {

        res.render('user/editAddress', { data })
    })
}

/* -------------------------------------------------------------------------- */
/*                              Post Edit Address                             */
/* -------------------------------------------------------------------------- */


const postEditAddress = (req, res) => {

    let userId = req.body.user;

    let Id = req.body.id

    userhelper.postAddressEdit(req.body, userId, Id).then((response) => {

        res.redirect('/profile')
    }).catch((err) => {
        console.log(err);
    })
}

/* -------------------------------------------------------------------------- */
/*                               Delete Address                               */
/* -------------------------------------------------------------------------- */


const addressdelete = (req, res) => {

    let id = req.params.id

    userhelper.deleteAddress(req.session.user._id, id).then((response) => {

        res.redirect('/profile')
    })
}


/* -------------------------------------------------------------------------- */
/*                                Order Cancel                                */
/* -------------------------------------------------------------------------- */

const orderCancel = (req, res) => {
    userhelper.cancelOrder(req.params.id).then((response) => {

        res.json(response)
    })
}


/* -------------------------------------------------------------------------- */
/*                                Apply Coupon                                */
/* -------------------------------------------------------------------------- */

const PostapplyCoupon = async (req, res) => {
    let user= req.session.user._id


    // console.log("fcghvjbknlm");
    // console.log(req.body);

    const date = new Date()

    let totalAmount = await userhelper.getTotalAmount(user)



// console.log(totalAmount,"666");


let Total = totalAmount

    // console.log(req.body,"ghjkl;");

    if (req.body.coupon == '') {
        res.json({ noCoupon: true,Total })
    } else {
        let couponResponse = await adminhelper. applyCoupon(req.body, user, date,totalAmount)
          console.log(couponResponse,"dfghjk");
        if (couponResponse.verify) {
            let discountAmount = (totalAmount * parseInt(couponResponse.couponData.value)) / 100
            let amount = totalAmount - discountAmount
            couponResponse.discountAmount = Math.round(discountAmount)
            couponResponse.amount = Math.round(amount)
            res.json(couponResponse)
            console.log(couponResponse,"DFGHJKL");
        } else {
            couponResponse.Total = totalAmount

            // couponResponse.noCoupon = req.body.total

            // console.log( couponResponse.Total);
            res.json(couponResponse)
        }
    }
}







/* -------------------------------------------------------------------------- */
/*                                Remove Coupon                               */
/* -------------------------------------------------------------------------- */

const PostremoveCoupon = async (req, res) => {

    let user = req.session.user._id
    await adminhelper.removeCoupon(req.session.user._id).then(async (response) => {

        response.totalAmount = await userhelper.getTotalAmount(user)

        res.json(response)


    })
}



/* -------------------------------------------------------------------------- */
/*                                get Wishlist                                */
/* -------------------------------------------------------------------------- */


const getWishList = async(req,res)=>{


    let user = req.session.user
    let category = await adminhelper.viewCategory()
    var cartcount
    if (req.session.user) {
        cartcount = await userhelper.getCartCount(req.session.user._id)
    }

    let products = await userhelper.getWishlistProducts(user._id)
    res.render('user/wishList',{products,category,cartcount,user})
}

/* -------------------------------------------------------------------------- */
/*                             GET ADD TO WISHLIST                            */
/* -------------------------------------------------------------------------- */

const getAddtoWishList=(req,res)=>{
    userhelper.addToWishlist(req.params.id,user._id).then((response)=>{
        res.json(response)
    })
}
/* -------------------------------------------------------------------------- */
/*                          POST REMOVE FROM WISHLIST                         */
/* -------------------------------------------------------------------------- */

const postRemoveWishProducts =(req,res)=>{

    userhelper.removeFromWishlist(req.body).then((response)=>{
        res.json(response)
    })
}


/* -------------------------------------------------------------------------- */
/*                                RETURN ORDER                                */
/* -------------------------------------------------------------------------- */

const ReturnOrder = (req,res)=>{

    let user = req.session.user

    // console.log(req.body);

    userhelper.returnOrder(req.body,user).then((response)=>{

        res.json(response)


    })
}

/* -------------------------------------------------------------------------- */
/*                              VIEW ALL PRODUCTS                             */
/* -------------------------------------------------------------------------- */


const getallProducts = async(req,res)=>{

    let user = req.session.user
    var cartcount
    if (req.session.user) {
        cartcount = await userhelper.getCartCount(req.session.user._id)
    }
    let count =  await adminhelper.Procount()

    let pageNum = Math.round(count)/4;
 
    let p =[];
    for(i=0;i<pageNum;i++){
 
     p[i]=i+1;
 
    }
 
    console.log(p,"jinga");

    await adminhelper.ViewProduct().then(async(product) => {
        await adminhelper.viewCategory().then((category) => {

                    // console.log(wish,"xgfhjkl");
                    res.render('user/allproducts', { product, category, user,cartcount,p })

                })

            }) 
        


}

/* -------------------------------------------------------------------------- */
/*                                 CLEAR CART                                 */
/* -------------------------------------------------------------------------- */

const postCartclear = async(req,res)=>{

    let user = req.session.user._id
    await userhelper.cartClear(user).then((response)=>{

        res.json(response)
    })
}

/* -------------------------------------------------------------------------- */
/*                               EMPTY CART PAGE                              */
/* -------------------------------------------------------------------------- */


const getEmptyCart =(req,res)=>{

    res.render('user/emptycart')
}

/* -------------------------------------------------------------------------- */
/*                             GET RESET PASSWORD                             */
/* -------------------------------------------------------------------------- */

const getResetPassword = async(req,res)=>{
    let user = req.session.user
    let chpsd = null;
    let notchpsd = null;
    if (req.session.psdCh) {
      chpsd = true;
      req.session.psdCh = null;
    }
    if (req.session.notpsdCh) {
      notchpsd = true;
      req.session.notpsdCh = null;
    }

    let category = await adminhelper.viewCategory()
    res.render('user/changePassword',{user,category,
        chpsd,
        notchpsd})
}

/* -------------------------------------------------------------------------- */
/*                               CHANGE PASSWORD                              */
/* -------------------------------------------------------------------------- */

const PostResetPassword = async(req,res)=>{

await userhelper.updatePassword(req.body).then((response)=>{

    if(response.status){
    
        req.session.psdCh = true;
        res.redirect('/profile')

    }
    else {
        req.session.notpsdCh = true;
        alert("error")
        res.redirect('/changepassword')
    }
}) .catch((err) => {
    res.send("error......");
  });
}

/* -------------------------------------------------------------------------- */
/*                                 USE WALLET                                 */
/* -------------------------------------------------------------------------- */

const useWallet =async(req,res)=>{
    // console.log(user._id,'uid');
    let walletAmt = await userhelper.getUserWallet(user._id)
    // console.log(walletAmt.wallet,"mnmnja");
    await userhelper.useWallet(req.body,user,walletAmt.wallet).then((response)=>{

        // console.log("helooooi");
        // console.log(response);
        res.json(response)
    })
}

/* -------------------------------------------------------------------------- */
/*                                REMOVE WALLET                               */
/* -------------------------------------------------------------------------- */

const removeWalletUser =async (req,res)=>{
console.log('hiiiii');
    let walletAmt = await userhelper.getUserWallet(user._id)
    // console.log(walletAmt,'ggggggg'); 
    // console.log(req.body,'0000000000007'); 
    await userhelper.removeWallet(user,req.body,walletAmt.wallet).then((response)=>{

        res.json(response)
    })
}



/* -------------------------------------------------------------------------- */
/*                                 pagiantion                                 */
/* -------------------------------------------------------------------------- */

const getChangePageuser = async(req,res)=>{

    
    let count =  await adminhelper.Procount()
 
    let pageNum = Math.round(count)/4;
 
    let p =[];
    for(i=0;i<pageNum;i++){
 
     p[i]=i+1;
 
    }
 
    console.log(p,"jinga");
 
    let startIndex = parseInt(req.query.page)
 
    let limit = parseInt(req.query.lim)

    console.log(limit,"popopo");  
 
 
     await adminhelper.getprodlist(startIndex,limit).then((product) => {
         res.render('user/allproducts', { product,p })
     })
 
 
 }

module.exports = {
    getLogin, getLoginRegister, postSignup, postLogin, getproductsDetails, homepage, nodata, getcart,
    getcheckout, getOtp, confirmOtp, postOtp, postconfirmOtp, getSignUp, addtocart, logout, getProfile,
    changeproductquantity, vegetables, postcheckout, deleteCart, orderplaced, verifyPayment, orderProducts, PostremoveCoupon, PostapplyCoupon,
    addressPage, postAddressAdd, getEditAddress, postEditAddress, addressdelete,
     PostCheckoutAddress, getCheckoutAddress, orderCancel,getWishList,getAddtoWishList,
     postRemoveWishProducts,ReturnOrder,getallProducts,postCartclear,getEmptyCart,getResetPassword,PostResetPassword,useWallet,
     removeWalletUser,postresendOtp,getChangePageuser
}

