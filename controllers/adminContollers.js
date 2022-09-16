const adminhelper = require("../helpers/adminhelper")
// const userhelper = require("../helpers/userhelper")


const admin = {
    myEmail: "ameen@gmail.com",
    myPassword: 123
}
/* -------------------------------------------------------------------------- */
/*                                  get Login                                 */
/* -------------------------------------------------------------------------- */

const getLogin = (req, res) => {

    // if(req.session.admin){
    //     res.redirect('/admindashboard')
    // }
    //  else {
    //     res.render('admin/adminLogin')
    // }

    res.render('admin/adminLogin')
}

/* -------------------------------------------------------------------------- */
/*                                 Post Login                                 */
/* -------------------------------------------------------------------------- */

const postLogin = (req, res) => {
    const { email, password } = req.body;
    if (email == admin.myEmail && password == admin.myPassword) {

        req.session.admin = req.body.email;
        res.redirect('/admindashboard')
    } else {

        req.flash('msg', 'INCORRECT DETAILS');
        res.redirect('/admin-login');
    }
}


/* -------------------------------------------------------------------------- */
/*                                 Get Logout                                 */
/* -------------------------------------------------------------------------- */

const getlogout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
            res.send('error')
        }
        else {
            res.redirect('/admin-login')
        }
    })
}


/* -------------------------------------------------------------------------- */
/*                             get Admindashboard                             */
/* -------------------------------------------------------------------------- */

const admindashboard = async (req, res) => {
  let data= await adminhelper.doNutchartData()
    let year = await adminhelper.yearlyChart()
    let month = await adminhelper.salesMonthlyGraph()
    let daily = await adminhelper.salesGraph()
    // for(var i=0;i<7;i++){
        
    // }
    let dailysales = await adminhelper.getDailySales()
    let dailyorders = await adminhelper.getDailyOrders()
    let TotalUsers = await adminhelper.getTotalUsers()
    let TotalInactiveUsers = await adminhelper.getTotalInactiveUsers()
    let status = await adminhelper.piechartData()
    let payment = await adminhelper.barchartData()
    let sum=0
    for(var i=0;i<dailysales.length;i++){
    sum=sum+dailysales[i].totalAmount
    }
   console.log(sum,"mmmmmmmmmmmmmmmmm");
    let sumFinal= Math.round(sum)
    console.log(sumFinal);
    res.render('admin/Admin-dashboard',{data,year,dailysales,sumFinal,dailyorders,
        TotalUsers,TotalInactiveUsers,status,payment,month,daily})

 }   


       



/* -------------------------------------------------------------------------- */
/*                                  get Users                                 */
/* -------------------------------------------------------------------------- */

const getUsers = (req, res) => {

    adminhelper.viewUsers().then((data) => {
        console.log(data)
        res.render('admin/User', { data })
    })

}

/* -------------------------------------------------------------------------- */
/*                                 block Users                                */
/* -------------------------------------------------------------------------- */

const blockUsers = (req, res) => {
    let Id = req.params.id
    // console.log(proId)
    adminhelper.blockUser(Id).then((response) => {
        // res.redirect('/admin-users')

        res.json(response)
        // console.log("ghjgjwheg");
        // console.log(response);
    })
}

/* -------------------------------------------------------------------------- */
/*                                unblock Users                               */
/* -------------------------------------------------------------------------- */

const unblockUsers = (req, res) => {
    let proId = req.params.id
    console.log(proId)
    adminhelper.unblockUser(proId).then((data) => {
        res.redirect('/admin-users')
    })
}

/* -------------------------------------------------------------------------- */
/*                                get Products                                */
/* -------------------------------------------------------------------------- */

const getproducts = (req, res) => {
    adminhelper.ViewProduct().then((data) => {
        // console.log(product)
        res.render('admin/product', { data })
    })
}


/* -------------------------------------------------------------------------- */
/*                               get addproduct                               */
/* -------------------------------------------------------------------------- */

const getaddproducts = (req, res) => {

    adminhelper.viewCategory().then((category) => {
        res.render('admin/addproduct', { category: category})
    })


}

/* -------------------------------------------------------------------------- */
/*                               post addproduct                              */
/* -------------------------------------------------------------------------- */

const postaddproducts = (req, res) => {
    console.log(req.files);
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminhelper.addproduct(req.body).then((data) => {
        // if (response.status) {
            res.redirect('/admin-products')
        // } else {
        //     // res.send('product added')
        //     res.redirect('/admin-products')


        

    })
}




/* -------------------------------------------------------------------------- */
/*                               delete products                              */
/* -------------------------------------------------------------------------- */

const deleteProducts = (req, res) => {

    let delId = req.params.id
    adminhelper.deleteproduct(delId).then((data) => {
        res.redirect('/admin-products')
    })

}
/* -------------------------------------------------------------------------- */
/*                               update Product                               */
/* -------------------------------------------------------------------------- */

const getupdateproduct = (req, res) => {

    let Id = req.params.id
    adminhelper.ViewUpdateproduct(Id).then((data) => {
        adminhelper.viewCategory().then((category) => {
            console.log(data)
            res.render('admin/updateproduct', { data, category })
        })

    })
}

/* -------------------------------------------------------------------------- */
/*                             Post update Product                            */
/* -------------------------------------------------------------------------- */

const postupdateproduct = (req, res) => {

    // console.log(req.files)
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename

    let Id = req.params.id
    console.log(req.body);
    adminhelper.updateProduct(Id, req.body).then((data) => {
        // console.log(data)
        res.redirect('/admin-products')
    })
}



/* -------------------------------------------------------------------------- */
/*                                get Category                                */
/* -------------------------------------------------------------------------- */

const getCategory = (req, res) => {
    adminhelper.viewCategory().then((category) => {
        res.render('admin/category', { category })
    })
}

/* -------------------------------------------------------------------------- */
/*                                post category                               */
/* -------------------------------------------------------------------------- */

const postCategory = (req, res) => {
    adminhelper.addcategory(req.body).then((response) => {
        console.log(response)
        if(response.status){
            res.redirect('/admin-category')


        }
        else{

            req.session.catmsg = "Category Already Exist"
            // res.redirect('/admin-category')
            res.send("Category exists.....")
        }
    })


}

/* -------------------------------------------------------------------------- */
/*                                view Category                               */
/* -------------------------------------------------------------------------- */

const viewCategory = (req, res) => {
    res.render('admin/viewCategory')
}

/* -------------------------------------------------------------------------- */
/*                               delete category                              */
/* -------------------------------------------------------------------------- */

const deletecategorys = (req, res) => {
    let catId = req.params.id
    adminhelper.deletecategory(catId).then((data) => {
        res.redirect('/admin-category')
    })
}

/* -------------------------------------------------------------------------- */
/*                                 View Banner                                */
/* -------------------------------------------------------------------------- */

const getBanner = (req, res) => {
    adminhelper.viewBanner().then((banner) => {
        console.log(banner);
        res.render('admin/viewBanner', { banner })
    })
}

/* -------------------------------------------------------------------------- */
/*                                 Add Banner                                 */
/* -------------------------------------------------------------------------- */

const addBanner = (req, res) => {
    res.render('admin/addBanner')


}

/* -------------------------------------------------------------------------- */
/*                               Post AddBanner                               */
/* -------------------------------------------------------------------------- */

const postaddBanner = (req, res) => {
    console.log(req.body)

    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminhelper.addBanner(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin-addbanner')
        } else {
            // res.send('product added')
            res.redirect('/admin-banner')


        }

    })

}

/* -------------------------------------------------------------------------- */
/*                                delete Banner                               */
/* -------------------------------------------------------------------------- */

const deleteBanner = (req, res) => {

    let delId = req.params.id
    adminhelper.deleteBanner(delId).then((data) => {
        res.redirect('/admin-banner')
    })

}


/* -------------------------------------------------------------------------- */
/*                               Display orders                               */
/* -------------------------------------------------------------------------- */

const viewOrders=(req,res)=>{
    adminhelper.viewOrders().then((orders)=>{

        res.render('admin/viewOrders',{orders})

    })

  
}



/* -------------------------------------------------------------------------- */
/*                           donut Chart of Payment                           */
/* -------------------------------------------------------------------------- */


const donutChartData= async(req,res)=>{

    let data = await adminhelper.doNutchartData()

    console.log("baha");

    console.log(data);

    res.json(data)

}


const getSalesReport= async(req,res)=>{
    res.render('admin/salesReport')
}

/* -------------------------------------------------------------------------- */
/*                             daily sales report                             */
/* -------------------------------------------------------------------------- */

const dailysales = async(req,res)=>{
 day= req.body.day   
let dailysalePro = await adminhelper.getDailySalespro(day)    

let sum=0;
for(var i=0;i<dailysalePro.length;i++){
    sum=sum+dailysalePro[i].quantity
}

let sum2=0;
for(var i=0;i<dailysalePro.length;i++){
    sum2=sum2+dailysalePro[i].totalAmount
}

let dailysale = await adminhelper.getDailySales(day)

 res.render('admin/dailySales',{dailysale:true,dailysalePro,sum,sum2,dailysale})
}

/* -------------------------------------------------------------------------- */
/*                            monthly sales report                            */
/* -------------------------------------------------------------------------- */

const monthlysales = async(req,res)=>{
  let day=req.body.year+"-"+req.body.month
  console.log(day);
  let monthly = await adminhelper.getMonthlySalesPro(day)

  let sum=0
  for(var i=0;i<monthly.length;i++){
    sum=sum+monthly[i].count
  }
  
  let sum2=0
  for(var i=0;i<monthly.length;i++){
    sum2=sum2+monthly[i].totalAmount
  }
 
  console.log("sjdkkdj");
  console.log(monthly);

  res.render('admin/dailySales',{monthlysales:true,sum,sum2,monthly})

}

/* -------------------------------------------------------------------------- */
/*                             yearly Sales Report                            */
/* -------------------------------------------------------------------------- */

const yearlysales = async(req,res)=>{

    let day=req.body.year
    console.log(day);
    let yearly = await adminhelper.getYearlySalesPro(day)
  
    let sum=0
    for(var i=0;i<yearly.length;i++){
      sum=sum+yearly[i].count
    }
    
    let sum2=0
    for(var i=0;i<yearly.length;i++){
      sum2=sum2+yearly[i].totalAmount
    }
   
    console.log("sjdkkdj");
    console.log(yearly);
  
    res.render('admin/dailySales',{yearlysales:true,sum,sum2,yearly})
  
  }
   
  const orderCanceladmin=(req,res)=>{
    adminhelper.cancelOrder(req.params.id).then((response)=>{

        res.json(response)
    })
}

const orderShipadmin=(req,res)=>{
    adminhelper.shippedOrder(req.params.id).then((response)=>{

        res.json(response)
    })
}

const orderDeliveradmin=(req,res)=>{
    adminhelper.deliveredOrder(req.params.id).then((response)=>{

        res.json(response)
    })
}


/* -------------------------------------------------------------------------- */
/*                                 View Coupon                                */
/* -------------------------------------------------------------------------- */


const getCoupens = (req, res) => {
    adminhelper.viewCoupens().then((coupen) => {
        // console.log(product)
        res.render('admin/ViewCoupons',{coupen})
    })

    // res.send('hai')
}


/* -------------------------------------------------------------------------- */
/*                               GET ADD COUPON                               */
/* -------------------------------------------------------------------------- */

const getAddCoupen = (req,res)=>{

    res.render('admin/addCoupens')
}

/* -------------------------------------------------------------------------- */
/*                               POST ADD COUPON                              */
/* -------------------------------------------------------------------------- */

const postAddCoupon = (req,res)=>{

//    req.body.user = user = [];
     
    adminhelper.addCoupon(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin-addcoupen')
        } else {
            // res.send('product added')
            res.redirect('/admin-viewcoupen')


        }

    })

}


/* -------------------------------------------------------------------------- */
/*                           GET ADD CATEGORY OFFER                           */
/* -------------------------------------------------------------------------- */

const addCategoryOffer = (req,res)=>{

    adminhelper.viewCategory().then((data)=>{
        res.render('admin/addCoffer',{data})

    
    // res.send("jhakj")
    })
}

/* -------------------------------------------------------------------------- */
/*                           POST ADD CATEGORY OFFER                          */
/* -------------------------------------------------------------------------- */

const postAddcatOffer = async(req,res)=>{

    // console.log(req.body,"vvvvvvvvvvvvvvvvvv");

    let offer = req.body.categoryofferper

    if(req.body.category !=""){

        
    let products = await adminhelper.ViewcatOffProduct(req.body.category)

    // console.log(offer,"ghjkl;");
//    console.log(products,"66666666666");

   for(var i=0;i<products.length;i++){

    if(products[i].originalPrice){
        newprice = Math.round((products[i].originalPrice)*((100-offer)/100))

    }
    else {

        newprice = Math.round((products[i].price)*((100-offer)/100))

    

    }

    addoffer = await adminhelper.updateOffer(products[i]._id,newprice,offer)




   }

    }

    res.redirect('back')

}



/* -------------------------------------------------------------------------- */
/*                           GET VIEW CATEGORY OFFER                          */
/* -------------------------------------------------------------------------- */

// const ViewCategoryOffer = (req,res)=>{

//     adminhelper.viewCategoryOffer().then((data)=>{

//         res.render('admin/ViewCatoffer',{data})

//     })
// }


/* -------------------------------------------------------------------------- */
/*                            DELETE CATEGORY OFFER                           */
/* -------------------------------------------------------------------------- */


// const delCategoryOffer = async(req,res)=>{

//     catOffId = req.params.id

//     let catOffData = await adminhelper.viewCategoryOffer(catOffId)

//     adminhelper.ViewcatOffProduct(catOffData.category).then(async(response)=>{

//         let deleteCatOFF = await adminhelper.deleteCategoryOffer(catOffId)

//         res.json(response)
//     })
// }


/* -------------------------------------------------------------------------- */
/*                            GET ADD PRODUCT OFFER                           */
/* -------------------------------------------------------------------------- */


// const addProdOffer =(req,res)=>{

//     adminhelper.ViewProduct().then((data)=>{
  
//         res.render('admin/addProdOffer',{data})


//     })

// }

/* -------------------------------------------------------------------------- */
/*                            POST ADDPRODUCT OFFER                           */
/* -------------------------------------------------------------------------- */


// const postAddProdOffer =(req,res)=>{



// console.log(req.body,"gfffffffffffffffff");
 
// res.redirect('back')

// }


module.exports = {
    admindashboard, getproducts, getUsers,
    getLogin, getaddproducts, postLogin, getlogout, getCategory, postCategory,
    blockUsers, unblockUsers, deleteProducts, viewCategory, deletecategorys,
    getupdateproduct, postupdateproduct, postaddproducts, getBanner, addBanner,
     postaddBanner, deleteBanner,viewOrders,donutChartData,getSalesReport,dailysales,monthlysales,yearlysales,orderCanceladmin,orderDeliveradmin,
     orderShipadmin,getCoupens,getAddCoupen,
     postAddCoupon,
     addCategoryOffer,
     postAddcatOffer
};