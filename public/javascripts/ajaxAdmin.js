/* ------------------------------- block and unblock user ------------------------------- */


function blockUser(userId) {
    event.preventDefault
//    alert('ghdghdgl')
    swal({
        title: "Confirm Action",
        text: "Once confirmed, can't go back",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin-users/' + userId,
                method: 'get',
                success: (response) => {
                   
                    if(response.status){
                        // alert('hai')

                        document.getElementById(userId).innerHTML = "Unblock"
                        swal("Action Processed ", "Sucessfully", "success");
                        // location.reload()
                           
                    }else{
                        document.getElementById(userId).innerHTML = "Block"
                        swal("Action Processed ", "Sucessfully", "success");
                    }
                            
                }
            })
        } else {
          swal("No Action Processed");
        }
      })
 
}

/* -------------------------------------------------------------------------- */
/*                                Cancel Order                                */
/* -------------------------------------------------------------------------- */


function cancelOrderUser(proId) {
    event.preventDefault
    
   
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
                url: '/order-canceladmin/' + proId,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(proId).innerHTML = "Cancelled"
                        swal("Order Cancelled", "Sucessfully", "success",{
                            icon: "success",
                          });
                      
                        // location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order  is safe");
        }
      })

}


/* -------------------------------------------------------------------------- */
/*                            order shipping status                           */
/* -------------------------------------------------------------------------- */




function shipOrderUser(proId) {
    event.preventDefault
    
   
    swal({
        title: "Order Shipped",
        text: "Once shipped, the order get Shipped",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/order-shipped/' + proId,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(proId).innerHTML = "Shipped"
                        swal("Order Shipped", "Sucessfully", "Success",{
                            icon: "success",
                          });
                        
                      
                        // location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order is not Shipped");
        }
      })

}


/* -------------------------------------------------------------------------- */
/*                           order delivered status                           */
/* -------------------------------------------------------------------------- */

function deliverOrderUser(proId) {
    event.preventDefault
    
   
    swal({
        title: "Order Delivered",
        text: "Once delivered, the order get Delivered",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/order-deliver/' + proId,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(proId).innerHTML = "Delivered"
                        swal("Order Delivered", "Sucessfully", "Success",{
                            icon: "success",
                          });
                      
                        // location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order is not Delivered");
        }
      })

}



