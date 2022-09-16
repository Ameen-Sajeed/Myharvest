const mongoClient=require('mongodb').MongoClient

const state={
    db:null
}

module.exports.connect=function(done){
    // const url="mongodb://0.0.0.0:27017/";
    const url = "mongodb+srv://Amien:ameen123@cluster0.twrgq.mongodb.net/?retryWrites=true&w=majority"
    const dbname='harvest'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done ()
    })

  
}

module.exports.get=function(){
    return state.db
}