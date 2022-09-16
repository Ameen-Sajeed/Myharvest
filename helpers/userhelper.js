const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')
const objectId = require('mongodb').ObjectId
const otp = require('../config/otp')
// const { serviceID } = require('../config/otp')
// const { response } = require('../app')
const { ObjectId } = require('mongodb')
const client = require('twilio')(otp.accountSID, otp.authToken)
const Razorpay = require('razorpay')
const paypal = require('paypal-rest-sdk')
const moment = require("moment")
// const { resolve } = require('path')

var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});    

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
});


module.exports = {

    /* -------------------------------------------------------------------------- */
    /*                                 User SignUp                                */
    /* -------------------------------------------------------------------------- */

    doSignup: (userData) => {
        console.log(userData);

        let response = {}
        return new Promise(async (resolve, reject) => {
            let email = await db.get().collection(collection.USERCOLLECTION).findOne({ email: userData.email })
            // let phone = await db.get().collection(collection.USERCOLLECTION).findOne({ phone: userData.phone })


            if (email) {
                response.status = true;
                console.log(response);
                resolve(response)

            }

            else {


                userData.wallet = 0;
                userData.state = true;
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.USERCOLLECTION).insertOne(userData).then((data) => {
                    resolve(data.insertedId)

                })
                resolve({ status: false })




            }
        })


    },

    /* -------------------------------------------------------------------------- */
    /*                                 User Login                                 */
    /* -------------------------------------------------------------------------- */

    doLogin: (userData) => {
        let response = {}
        let loginStatus = false
        userData.state = true
        return new Promise(async (resolve, reject) => {

            let user = await db.get().collection(collection.USERCOLLECTION).findOne({ $and: [{ email: userData.email }, { state: userData.state }] })


            if (user) {
                console.log(user);
                bcrypt.compare(userData.Password, user.password).then((status) => {
                    console.log(status);
                    if (status) {
                        console.log('login-success')
                        response.user = user;
                        response.user.status = true
                        response.status = true;
                        resolve(response)
                    }
                    else {

                        resolve({ status: false })
                    }
                })

            }
            else {
                response.status = false
                resolve(response)
            }

        })


    },

    /* -------------------------------------------------------------------------- */
    /*                                View product                                */
    /* -------------------------------------------------------------------------- */

    viewProducts: (product) => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCTCOLLECTION).find().toArray()
            resolve(product)
            // console.log(product)
        })
    },


    /* -------------------------------------------------------------------------- */
    /*                               Product detail                               */
    /* -------------------------------------------------------------------------- */

    Viewproductdetail: (proId,error) => {
        return new Promise(async (resolve, reject) => {
        
            let data = await db.get().collection(collection.PRODUCTCOLLECTION).findOne({_id:objectId(proId)})
            // let data = await db.get().collection(collection.PRODUCTCOLLECTION).aggregate([


            //     {
            //         $match:{ _id: objectId(proId) }

            //     },

            //     {
            //       $lookup:{
            
            //         from:collection.CATEGORYCOLLECTION,
            //         localField:'category',
            //         foreignField:'_id',
            //         as:'category'
            //       }
            //     },
            //     {
            //       $project:{
            //         category:{$arrayElemAt:['$category',0]},
            //         name:1,
            //         image:1,
            //         price:1,
            //         description:1,
            
            
            //       }
            //     }
            //    ]).toArray()

          
                      
               console.log(data,"2222222222222");
               resolve(data)

            
      
        
            })
            
                },
   

        
    

    /* -------------------------------------------------------------------------- */
    /*                                Generate OTP                                */
    /* -------------------------------------------------------------------------- */

    doOTP: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USERCOLLECTION).findOne({ phone: userData.phone })

            if (user) {
                response.status = true
                response.user = user
                client.verify.services(otp.serviceID)
                    .verifications
                    .create({ to: `+91${userData.phone}`, channel: 'sms' })
                    .then((verification) => {

                    });
                // console.log(response);
                resolve(response)

            }
            else {
                response.status = false;
                resolve(response)



            }
        })
    },


    /* -------------------------------------------------------------------------- */
    /*                                 Confirm OTP                                */
    /* -------------------------------------------------------------------------- */

    doOTPconfirm: (confirmOtp, userData) => {
        // console.log('hello');
        // console.log(userData);
        // console.log(confirmOtp);

        return new Promise((resolve, reject) => {

            client.verify.services(otp.serviceID)
                .verificationChecks
                .create({
                    to: `+91${userData.phone}`,
                    code: confirmOtp.phone
                })
                .then((data) => {
                    if (data.status == 'approved') {
                        // response.user = user;
                        // response.user.status = true
                        // // response.status = true;
                        resolve({ status: true })
                    }
                    else {
                        resolve({ status: false })
                    }

                })

        })

    },

    /* -------------------------------------------------------------------------- */
    /*                                 Add to Cart                                */
    /* -------------------------------------------------------------------------- */

    addtoCarts: (proId, userId) => {
        let proObj = {
            item: objectId(proId),
            quantity: 1
        }
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let usercart = await db.get().collection(collection.CARTCOLLECTION).findOne({ user: objectId(userId) })
            // console.log(usercart);
            if (usercart) {
                let proExist = usercart.products.findIndex(product => product.item == proId)
                console.log(proExist);
                if (proExist != -1) {
                    db.get().collection(collection.CARTCOLLECTION)
                        .updateOne({ user: objectId(userId), 'products.item': objectId(proId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve()
                        })

                }
                else {
                    db.get().collection(collection.CARTCOLLECTION)
                        .updateOne({ user: objectId(userId) },
                            {
                                $push: { products: proObj }

                            }

                        ).then((response) => {
                            resolve()

                        })


                }



            } else {
                let Cartobj = {
                    user: objectId(userId),
                    products: [proObj]
                }

                db.get().collection(collection.CARTCOLLECTION)

                    .insertOne(Cartobj).then((response) => {
                        resolve()
                    })
            }




        })
    },

    /* -------------------------------------------------------------------------- */
    /*                                  View Cart                                 */
    /* -------------------------------------------------------------------------- */

    viewCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CARTCOLLECTION).aggregate([

                {
                    $match: { user: objectId(userId) }
                },

                {
                    $unwind: '$products'
                },

                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }

                },
                {
                    $lookup: {
                        from: collection.PRODUCTCOLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },

            ]).toArray()

            // console.log(cartItems[0].products)

            resolve(cartItems)
        })
    },

    /* -------------------------------------------------------------------------- */
    /*                              Count of the Cart                             */
    /* -------------------------------------------------------------------------- */

    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db.get().collection(collection.CARTCOLLECTION).findOne({ user: objectId(userId) })

            if (cart) {

                count = cart.products.length;

            }
            resolve(count)
        })


    },

/* -------------------------------------------------------------------------- */
/*                         change quantity of products                        */
/* -------------------------------------------------------------------------- */

    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        console.log(details);

        return new Promise((resolve, reject) => {

            if (details.count == -1 && details.quantity == 1) {

                db.get().collection(collection.CARTCOLLECTION)
                    .updateOne({ _id: objectId(details.cart) },
                        {
                            $pull: { products: { item: objectId(details.product) } }

                        }

                    ).then((response) => {

                        resolve({ removeProduct: true })

                    })



            }
            else {



                db.get().collection(collection.CARTCOLLECTION)
                    .updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }
                    ).then((response) => {
                        resolve({ status: true })
                    })

            }
        })

    },

/* -------------------------------------------------------------------------- */
/*                        total Amount of the Products                        */
/* -------------------------------------------------------------------------- */

    getTotalAmount: (userId) => {
        console.log('userId');
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CARTCOLLECTION).aggregate([

                {
                    $match: { user: objectId(userId) }
                },

                {
                    $unwind: '$products'
                },

                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }

                },
                {
                    $lookup: {
                        from: collection.PRODUCTCOLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $multiply: [
                                    {

                                        $toInt: '$quantity'
                                    },
                                    {
                                        $toInt: '$product.price'
                                    }]
                            }

                        }
                    }
                }

            ]).toArray()
            console.log('hai guys');
            // console.log(total,"swedrfg");
            // console.log(total)

            resolve(total[0].total)
        })

    },

    /* -------------------------------------------------------------------------- */
    /*                             checkout after Cart                            */
    /* -------------------------------------------------------------------------- */

    placeOrder: (order, products, total,subtotal) => {
        return new Promise((resolve, reject) => {
            console.log(order,"55555555555555555555555");
            let status = order['payment-method'] == 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: objectId(order['payment-address']),

                userId: objectId(order.userId),
                paymentMethod: order['payment-method'],
                products: products,
                totalAmount: total,
                date: new Date(),
                SubTotalAmount:subtotal,
                status: status
            }

            if(order.couponcode){

                db.get().collection(collection.COUPENCOLLECTION).updateOne({code: order.couponcode},
                {
                    $push:{
                        Users: objectId(order.userId)

                        
                    }
                }
                
                )
            }

            db.get().collection(collection.ORDERCOLLECTION).insertOne(orderObj).then((response) => {
                // db.get().collection(collection.CARTCOLLECTION).deleteOne({ user: objectId(order.userId) })
                console.log(response);
                resolve(response.insertedId)
            })
        })

    },

    /* -------------------------------------------------------------------------- */
    /*                              products in Cart                              */
    /* -------------------------------------------------------------------------- */

    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CARTCOLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCTCOLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] },
                    }
                },

            ]).toArray()
            resolve(cartItems)

        })
    },

    /* -------------------------------------------------------------------------- */
    /*                              product Sub total                             */
    /* -------------------------------------------------------------------------- */

    getSubTotalAmount: (userId) => {
        console.log('userId');
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            let subtotal = await db.get().collection(collection.CARTCOLLECTION).aggregate([

                {
                    $match: { user: objectId(userId) }
                },

                {
                    $unwind: '$products'
                },

                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }

                },
                {
                    $lookup: {
                        from: collection.PRODUCTCOLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: {
                        _id: 0,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },

                {
                    $project: {
                        suBtotal: {
                            $multiply: [
                                {

                                    $toInt: '$quantity'
                                },
                                {
                                    $toInt: '$product.price'
                                }]

                        }
                    }
                }



            ]).toArray()

            // console.log(subtotal);
            resolve(subtotal)
        })






    },


    /* -------------------------------------------------------------------------- */
    /*                                 subtotal                               */
    /* -------------------------------------------------------------------------- */


    getSubTotal: (detail) => {

        return new Promise(async (resolve, reject) => {
            let subtotal = await db.get().collection(collection.CARTCOLLECTION).aggregate([
                {
                    $match: { user: ObjectId(detail.user) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                }
                , {

                    $match: { item: ObjectId(detail.product) }
                },
                {
                    $lookup: {
                        from: collection.PRODUCTCOLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        _id: 0, quantity: 1, product: { $arrayElemAt: ["$product", 0] }

                    }
                },
                {
                    $project: {

                        //    total:{$sum:{$multiply:['$quantity','$product.price']}}
                        total: { $multiply: [{ $toInt: '$quantity' }, { $toInt: '$product.price' }] }

                    }
                }

            ]).toArray()
            console.log(subtotal);
            if (subtotal.length != 0) {
                resolve(subtotal[0].total)
            } else {
                resolve()
            }

        })
    },




    /* -------------------------------------------------------------------------- */
    /*                                 Remove Cart                                */
    /* -------------------------------------------------------------------------- */

    deleteCartItems: (details) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CARTCOLLECTION).updateOne({ _id: objectId(details.cart) },

                {
                    $pull: { products: { item: objectId(details.product) } }



                }).then((response) => {
                    resolve(response)
                })

        })



    },

    /* -------------------------------------------------------------------------- */
    /*                               RazorPay Config                              */
    /* -------------------------------------------------------------------------- */

    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {

            var options = {
                amount: total * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                }
                else {

                    // console.log("new order:", order);
                    resolve(order)
                }

            });

        })
    },


    /* -------------------------------------------------------------------------- */
    /*                               Generate PayPal                               */
    /* -------------------------------------------------------------------------- */

    generatePayPal: (orderId, totalPrice) => {
        console.log('paypal working');
        return new Promise((resolve, reject) => {
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    // return_url: "http://localhost:3000/ordersuccess",
                    // cancel_url: "http://localhost:3000/cancel"
                },
                "transactions": [
                    {
                        "item_list": {
                            "items": [
                                {
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": totalPrice,
                                    "currency": "USD",
                                    "quantity": 1
                                }
                            ]
                        },
                        "amount": {
                            "currency": "USD",
                            "total": totalPrice
                        },
                        "description": "Hat for the best team ever"
                    }
                ]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log("paypal int. err stp ...4", error);
                    throw error;

                } else {
                    // console.log(payment, "********a");
                    resolve(payment);
                }
            });
        });
    },

    /* -------------------------------------------------------------------------- */
    /*                               Verfiy Payment                               */
    /* -------------------------------------------------------------------------- */

    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)

            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            }
            else {
                reject()
            }

        })

    },

    /* -------------------------------------------------------------------------- */
    /*                   Checking Payment Status after Verifying                  */
    /* -------------------------------------------------------------------------- */

    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDERCOLLECTION)

                .updateOne({ _id: objectId(orderId) },
                    {
                        $set: {
                            status: 'placed'
                        }
                    }
                ).then(() => {
                    resolve()
                })

        }




        )
    },

    /* -------------------------------------------------------------------------- */
    /*                                 Cart clear                                 */
    /* -------------------------------------------------------------------------- */

    cartClear: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orderDelete = await db.get().collection(collection.CARTCOLLECTION).deleteOne({ user: objectId(userId) })
            resolve(orderDelete)
        })



    },



    /* -------------------------------------------------------------------------- */
    /*                             View Order Product:                            */
    /* -------------------------------------------------------------------------- */

    getOrderProduct: (orderId) => {


        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDERCOLLECTION).aggregate([

                {
                    $match: { _id: objectId(orderId) }
                },

                {
                    $unwind: '$products'
                },

                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }

                },
                {
                    $lookup: {
                        from: collection.PRODUCTCOLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },

            ]).toArray()

            // console.log(cartItems[0].products)

            resolve(orderItems)
        })

    },

    /* -------------------------------------------------------------------------- */
    /*                              View User Orders                              */
    /* -------------------------------------------------------------------------- */

    viewOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let order = await db.get().collection(collection.ORDERCOLLECTION).find({ userId: objectId(userId) }).toArray()
            resolve(order)
            // console.log(order)
        })
    },


    /* -------------------------------------------------------------------------- */
    /*                                delete Orders                               */
    /* -------------------------------------------------------------------------- */

    cancelOrder:(orderId)=>{
        return new Promise (async(resolve,reject)=>{

            db.get().collection(collection.ORDERCOLLECTION).updateOne({
                _id: objectId(orderId)


            },
            {
                $set: {
                    status:"cancelled"
                    
                }
            }).then((data)=>{
                resolve(data)
            })
            
            
        })
    },

    /* -------------------------------------------------------------------------- */
    /*                              View Users order                              */
    /* -------------------------------------------------------------------------- */

    getUserOrders:(userId)=>{

        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDERCOLLECTION).aggregate([
                {
                    $match:{ userId:objectId(userId)}
                },
                {
                    $lookup:{
                        from: collection.ADDRESSCOLLECTION,
                        localField:'deliveryDetails',
                        foreignField:'_id',
                        as:'address'
                    }
                },
                {
                    $unwind:'$address'
                },
                {
                    $sort: {
                        date:-1

                }
            },
                {
                    $project:{
                        date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } },totalAmount:1,products:1,paymentMethod:1,address:1,status:1
                    }
                },
              
            ]).toArray()

            // console.log("bdcbhdsa");

            // console.log(orders);

            resolve(orders)
        })
    },

/* -------------------------------------------------------------------------- */
/*                           Add address of the User                          */
/* -------------------------------------------------------------------------- */

    addAddress:(userId,details)=>{
        return new Promise((resolve,reject)=>{
            let tempId= moment().format().toString()

            tempId.replace(/\s+/g, ' ').trim()

            let date = new Date()


            let address = db.get().collection(collection.ADDRESSCOLLECTION).insertOne({

                user: objectId(userId),
                name: details.name,

                address: details.address,

                pincode: details.pincode,

                number: details.number,

                state: details.state,

                city: details.city,

                country:details.country,
                
                landMark: details.landMark,

                id: tempId
            })

            resolve(address)

        })
    },


/* -------------------------------------------------------------------------- */
/*                           View Addres of the user                          */
/* -------------------------------------------------------------------------- */


viewAddress:(userId)=>{
    return new Promise(async(resolve,reject)=>{

        let address = await db.get().collection(collection.ADDRESSCOLLECTION).find({user:objectId(userId)}).toArray()

        resolve(address)
    })
},


/* -------------------------------------------------------------------------- */
/*                             View Update Address                            */
/* -------------------------------------------------------------------------- */

getAddressEdit:(Id,userId)=>{

    return new Promise(async(resolve,reject)=>{

        let data = await db.get().collection(collection.ADDRESSCOLLECTION).findOne({$and:[{user:objectId(userId)},{id:Id}]})

        resolve(data)
    })
},


/* -------------------------------------------------------------------------- */
/*                              Post user Address                             */
/* -------------------------------------------------------------------------- */

postAddressEdit:(details,userId,id)=>{

    return new Promise(async(resolve,reject)=>{

        try{

            let data = await db.get().collection(collection.ADDRESSCOLLECTION).updateOne({user:objectId(userId),id:id},
            
            {
            $set: 
            {

                name: details.name,

                address: details.address,

                pincode: details.pincode,

                number: details.number,

                country: details.country,

                state: details.state,

                city: details.city,

                landMark: details.landMark,
            }


         })
        

        resolve(data)

     } catch(error){
            // console.log(error);
        }
    })
},


/* -------------------------------------------------------------------------- */
/*                               delete Address                               */
/* -------------------------------------------------------------------------- */

deleteAddress:(userId,Id)=>{

    return new Promise(async(resolve,reject)=>{

        await db.get().collection(collection.ADDRESSCOLLECTION).deleteOne({user:objectId(userId),id:Id})

        .then((data)=>{

            resolve(data)
        })
    })
},



/* -------------------------------------------------------------------------- */
/*                               Add to Wishlist                              */
/* -------------------------------------------------------------------------- */



addToWishlist:(proId,userId)=>{
    return new Promise(async(resolve,reject)=>{
      let  response={}
        let userWishlist = await db.get().collection(collection.WISHLISTCOLLECTION).findOne({user:objectId(userId)})
        if(userWishlist){
            console.log(userWishlist.products,'yu');
            let proExist = userWishlist.products.findIndex(product=> product == proId)
            console.log(proExist,'poexy');
            if(proExist != -1){
                response.status=false
                resolve(response)
            }else{
                db.get().collection(collection.WISHLISTCOLLECTION).updateOne({user:objectId(userId)},
                {
                    $push:{products:objectId(proId)}
                }).then((response)=>{
                    response.status=true
                    resolve(response)
                })
            }
        }else{
            let wishlistObj = {
                user:objectId(userId),
                products:[objectId(proId)],
                state: true
            }
            db.get().collection(collection.WISHLISTCOLLECTION).insertOne(wishlistObj).then((response)=>{
                response.status=true
                resolve(response)
            })
        }
    })
},



/* -------------------------- GET WISHLIST PRODUCTS ------------------------- */

getWishlistProducts:(userId)=>{

    return new Promise(async(resolve,reject)=>{
      let products = await  db.get().collection(collection.WISHLISTCOLLECTION).aggregate([
            {
                $match:{user: objectId(userId)}
            },
            {
                $unwind:'$products'
            },
            {
                $lookup:{
                    from:collection.PRODUCTCOLLECTION,
                    localField:'products',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                
                    $project:{
                        
                        product:{$arrayElemAt:['$product',0]}
                    }
                
            }
        ]).toArray()
        resolve(products)
    })

},



/* ---------------------- REMOVE PRODUCT FROM WISHLIST ---------------------- */



removeFromWishlist:(details)=>{
    console.log(details,'dtls');
return new Promise((resolve,reject)=>{

    db.get().collection(collection.WISHLISTCOLLECTION).updateOne({_id:objectId(details.wishlist)},
    {
        $pull:{products: objectId(details.product)}
    }).then((response)=>{
        console.log(response,'hi');
        resolve(response)
    })
})
},







/* -------------------------------------------------------------------------- */
/*                    RETURN PRODUCT AFTER DELIVERY STATUS                    */
/* -------------------------------------------------------------------------- */

returnOrder:(order,user)=>{
    return new Promise(async(resolve,reject)=>{

     await  db.get().collection(collection.ORDERCOLLECTION).updateOne({_id:objectId(order.orderId)},
        {
            $set:{status:'Returned'}
        }).then(async(response)=>{
            console.log(user.wallet,"9999999");
            console.log(order.amount,"888");
            let amount = parseInt(order.amount)+user.wallet
          let data =await  db.get().collection(collection.USERCOLLECTION).updateOne({_id:objectId(user._id)},
            {
                $set:{wallet:amount}
            })
        })
        // console.log('hhhhhhhhhhhhhh');
        resolve({status:true})
    })
},


/* -------------------------------------------------------------------------- */
/*                               UPDATE PASSWORD                              */
/* -------------------------------------------------------------------------- */


updatePassword:(data)=>{

    return new Promise(async(resolve,reject)=>{

        let user = await db.get().collection(collection.USERCOLLECTION).findOne({email:data.email})
        let response ={}

        if(user && user.state == true){

            response = user

            bcrypt.compare(data.password, user.password).then(async(stat)=>{

                if(stat){
                    let det = await bcrypt.hash(data.newPassword,10)

                    console.log("Password matched....");

                    await db.get().collection(collection.USERCOLLECTION).updateOne({email:data.email},{

                    
                        $set:{
                            password:det
                        }
                    }).then((data)=>{

                        console.log('\nPassword data at helper : '+JSON.stringify(data));
                                      
                    })

                    response.status = true
                    response.msg ="Password Changed"
                    resolve(response)
                }
                else {
                    console.log("Password Miss Match");
                    response.status = false
                    response.msg = "Password MissMatch"
                    resolve(response)
                }
            })
        }
        else {
            console.log("email is not valid");
            response.status = false

            response.msg = "Email Missmatch"

            resolve(response)
        }

    })
}

}