
var dataSource = require('../app_db/dataSource.js');

var uuid = require('node-uuid');
var message = require('./_utils/messageGenerator.js');

var AbstractDao = function () {
    this.db = dataSource.getDB();
    this.mongo = dataSource.getMongo();
};

AbstractDao.prototype.findByQueryAndPage = function(query, callback){
    var recordsSize = query.recordsSize;
    var skipRecords = (query.currentPage - 1)*recordsSize;

    delete query.recordsSize;
    delete query.currentPage;

    this.dataCollection.find(query).limit(recordsSize).skip(skipRecords).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};


AbstractDao.prototype.insertNewOrOverwrite = function(obj, callback){
    obj = this.prepareNewObj(obj);
    this.dataCollection.save(obj, function (err, data) {
        if (err) {
            throw err;
            callback({success:false});
        } else {
            callback({success:true});
        }
    });
};


AbstractDao.prototype.insertNew = function (data, callback) {
    this.dataCollection.insert(data, function (err, result) {
        if (err) {
            var resDoc = false;
            next(resDoc);
            throw err;
        } else {
            callback(result);
        }
    });
};

AbstractDao.prototype.insertManyNew = function(data, callback){
    this.dataCollection.insertMany(data, function (err, data) {
        if(err){
            throw err;
        }else{
            callback(data);
        }
    });
};

AbstractDao.prototype.deleteRecord = function(query, callback){
    this.dataCollection.deleteMany(query, {safe: true}, function (err, data) {
        if (err) {
            throw err;
            callback({success:false});
        } else {

            callback({success:true});
        }
    });
};

AbstractDao.prototype.updateMultiRecords = function(query,update,callback){
    this.dataCollection.update(query , { $set: update }, callback);
};
AbstractDao.prototype.updateOneRecord = function(query,update, callback) {
    this.dataCollection.updateOne(query, update, function (err, result) {
        if (err) {
            throw err;
        } else {
            callback(result);
        }
    });
};

AbstractDao.prototype.prepareNewObj = function (obj) {

    if(obj === undefined || obj === null){
        obj = {};
    }

    if(!obj.id) obj.id = uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
    obj.createTime = new Date();

    obj.lastModify = obj.createTime;
    return obj;

};

module.exports = AbstractDao;
