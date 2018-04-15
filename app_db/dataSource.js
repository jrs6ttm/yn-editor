var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var ObjectID= mongo.ObjectID;
var ecgeditorDb;

exports.connectDb=function(url, next){
    MongoClient.connect(url, function(err, dbInstance) {
        if(err){
            console.log('ERROR: Connection to database cannot to be established. \n' +
                'Please check if the database has been started.');
        }else{
            console.log("Database connection established.");
            ecgeditorDb=dbInstance;
            next(ecgeditorDb);
        }


    });
};

exports.connectSecondDb=function(url, next){
    MongoClient.connect(url, function(err, dbInstance) {
        if(err){
            console.log('ERROR: Connection to database2 cannot to be established. \n' +
                'Please check if the database2 has been started.');
        }else{
            console.log("Database2 connection established.");
            next(dbInstance);
        }
    });
};

exports.getMongo=function(){
    return mongo;
}
exports.getDB=function(){
    return ecgeditorDb;
};
exports.getObjectId=function(){
    return ObjectID;
};
