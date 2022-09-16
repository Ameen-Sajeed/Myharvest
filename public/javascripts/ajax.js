
/* -------------------------------------------------------------------------- */
/*                                 add to Cart                                */
/* -------------------------------------------------------------------------- */



function addtocart(proId) {
    $.ajax({
        url: '/addtocart/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
            }
            swal({
                title: "Product is added!",
                text: "You have added to you cart !",
                icon: "success",
                button: "OK!",
            });
        }
    })
}


/* -------------------------------------------------------------------------- */
/*                           Change quantity of Cart                          */
/* -------------------------------------------------------------------------- */

function changeQuantity(cartId, proId, userId, count) {

    event.preventDefault()
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    count = parseInt(count)
    console.log(count);

    $.ajax({
        url: '/change-product-quantity',
        data: {
            cart: cartId,
            product: proId,
            count: count,
            quantity: quantity,
            user: userId
        },
        method: 'post',
        success: (response) => {
            console.log(response);
            if (response.removeProduct) {
                alert('Product Removed from cart')
                location.reload()
            }
            else {
                document.getElementById('a' + proId).innerHTML = response.subtotal

                document.getElementById(proId).innerHTML = quantity + count
                document.getElementById('total').innerHTML = response.total
                // console.log('a'+proId,'iuytfrerftgyhuj');


            }
        }
    })
}


/* -------------------------------------------------------------------------- */
/*                                checkout form                               */
/* -------------------------------------------------------------------------- */

$('#checkout-form').submit((e) => {
    e.preventDefault()

    swal({
        title: "Are you sure?",
        text: "Please Confirm Your Order !",
        icon: "success",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/checkout',
                    method: 'post',
                    data: $('#checkout-form').serialize(),
                    success: (response) => {
                        // alert(response)
                        // window.location=response.message

                        if (response.codSuccess) {
                            swal("Order Placed ! ordered succesfully !", {
                                icon: "success",

                                
                            });
                            location.href='/ordersuccess'

                        }
                        else if(response.razorPay)          
                        {
                            razorpayPayment(response)
                        }
                        else if(response.payPal){

                            for(let i =0; i < response.links.length; i++) {

                                if(response.links[i].rel === "approval_url"){

                                    location.href= response.links[i].href;

                                }


                            }

                            // location.href='/ordersuccess'



                        }


                    }

                })


            } else {
                swal("Order not placed!");
            }
        });


})


/* -------------------------------------------------------------------------- */
/*                           delete products in Cart                          */
/* -------------------------------------------------------------------------- */


function deleteItem(cartId, proId) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: '/delete-cart-items',
                    data: {
                        cart: cartId,
                        product: proId
                    },

                    method: 'post',
                    success: (response) => {
                        swal("Poof! Your product has been deleted!", {
                            icon: "success",
                        });

                        location.reload()
                    }
                })


            } else {
                swal("Your product is safe!");
            }
        });

}

/* -------------------------------------------------------------------------- */
/*                               Razor Paymenet                               */
/* -------------------------------------------------------------------------- */

function razorpayPayment(order) {
    var options = {
        "key": "rzp_test_msmwm7MIJkbUbi", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Harvest",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)


            verifyPayment(response, order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}


/* -------------------------------------------------------------------------- */
/*                             Verify RazorPayment                            */
/* -------------------------------------------------------------------------- */

function verifyPayment(payment,order) {

    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order
        },

        method: 'post',
        success:(response)=>{
            if(response.status){

                location.href='/ordersuccess'
            }
            else{
                swal('Payment Failed BRO!')
            }
        }

    })

}



/* ----------------------------- delete address ----------------------------- */
function deleteAddress(id){

    swal({
        title: "Delete Address",
        text: "Once Deleted, the address get cancelled",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/delete-address/' + id,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        // document.getElementById(proId).innerHTML = "cancelled"
                        swal("address cancelled", "sucessfully", "success");
                      
                        location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your address id safe");
        }
      })
}


/* -------------------------------------------------------------------------- */
/*                                Cancel Order                                */
/* -------------------------------------------------------------------------- */


function cancelOrderUser(proId) {
    
   
    swal({
        title: "Order cancel",
        text: "Once cancel, the order get cancelled",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/order-cancel/' + proId,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(proId).innerHTML = "cancelled"
                        swal("order cancelled", "sucessfully", "success");
                      
                        location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order safe");
        }
      })

}



function removeCoupon(event) {
    event.preventDefault();
    let coupon = document.getElementById('couponName').value
    console.log(coupon , "hvhv")
    $.ajax({
        url: '/remove-coupon',
        data: {
            coupon
        },
        method: 'post',
        success: ((response) => {
            swal({
                title: "Coupon Deleted!",
                text: "You clicked the button!",
                icon: "success",
                button: "OK!",
            }).then(() => {
                document.getElementById('percentage').innerHTML=0
                document.getElementById('discount').innerHTML=0
                document.getElementById('error2').innerHTML = ''
                document.getElementById('couponName').value = ''

                // document.getElementById('couponName').value = ""
                document.getElementById("applybutton").hidden = false
                document.getElementById("deletebutton").hidden = true
                document.getElementById("error").innerHTML = ""
                document.getElementById('totall').innerHTML=response.totalAmount
            })
        })
})
    }




    function applyCoupon(event) {
        event.preventDefault();
        let coupon = document.getElementById('couponName').value
        // let total = document.getElementById('totalAM').innerText
        console.log(coupon,"bjhgfhdgs")
        $.ajax({
            url: '/apply-coupon',
            data: {
                coupon
            },
            method: 'post',
            success: (response) =>{
                console.log(response,"ghbkjldfs");
             if(response.verify){

                document.getElementById('discount').innerHTML="₹"+response.discountAmount
                document.getElementById('totall').innerHTML= "₹"+response.amount
                document.getElementById('percentage').innerHTML=response.couponData.value+'%'
                document.getElementById('error').innerHTML = ''
                document.getElementById('error2').innerHTML = '(Coupon has Applied)'
                document.getElementById("applybutton").hidden = true
                document.getElementById("deletebutton").hidden = false
                
                
    
               }else{

                
                document.getElementById('discount').innerHTML= "₹" +0
                document.getElementById('totall').innerHTML= "₹"+response.Total
                document.getElementById('percentage').innerHTML= 0 + "%"
    
                if(response.used){
                    document.getElementById('error').innerHTML = response.used
                   }else if(response.minAmount){
                    document.getElementById('error').innerHTML = response.minAmountMsg
                   }else if(response.maxAmount){
                    document.getElementById('error').innerHTML = response.maxAmountMsg
                   }else if(response.invalidDate){
                    document.getElementById('error').innerHTML = response.invalidDateMsg
                   }else if(response.invalidCoupon){
                    document.getElementById('error').innerHTML = response.invalidCouponMsg
                   }else if(response.noCoupon){
                    document.getElementById('error').innerHTML = 'Invalid Coupon Details'
                   }
        
               }
            }
        })
    
    }
    
/* -------------------------------------------------------------------------- */
/*                               ADD TO WISHLIST                              */
/* -------------------------------------------------------------------------- */


function addToWishlist(proId){

    $.ajax({
        url:'/wishlist/add-to-wishlist/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                swal({
                    title: "Product added to Wishlist!",
                    text: "You have added to you Wishlist !",
                    icon: "success",
                    button: "OK!",
                });            }
        }
    })

}
 /* -------------------------------------------------------------------------- */
 /*                        REMOVE PRODUCT FROM WISHLIST                        */
 /* -------------------------------------------------------------------------- */

function removeFromWishlist(wishlistId,proId){
    console.log(wishlistId,proId,'data');

    swal({
        title:"Remove Product!",
        text:'Press Ok to confirm',
        icon:'warning',
        buttons: ["Cancel", "Ok"],
       dangerMode:'Ok'
    }).then(
    function(isConfirm){
        if(isConfirm){
    $.ajax({
        url:'/wishlist/remove-product',
        data:{
            wishlist:wishlistId,
            product:proId
        },
        method:'post',
        success:(response)=>{
            location.reload()
        }
    })
}else{
    swal("Your product not removed");
}
    })
}


/* -------------------------------------------------------------------------- */
/*                                RETURN ORDER                                */
/* -------------------------------------------------------------------------- */


function returnOrder(orderId,amount){

    $.ajax({
        url:'/returnproduct ',
        method:'post',
        data:{
            orderId,
            amount

        },
        success:(response)=>{



            alertify.set('notifier','position', '');
            alertify.success('Products returned successfully...!!! : ' + alertify.get('notifier','position'));
            // location.reload()

        }
    })
}

/* -------------------------------------------------------------------------- */
/*                                 CLEAR CART                                 */
/* -------------------------------------------------------------------------- */

function clearCart(userId){
    console.log(userId);
alert('hai')
    $.ajax({

        url:'/clearcarts',
        method:'post',
        data:{
            user:userId
        },
        // console.log("bjhgbhjghj");
        success:(response)=>{

            location.reload()
        }
    })
}




