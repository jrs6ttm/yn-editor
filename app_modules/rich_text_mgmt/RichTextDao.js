/**
 * Created by Eamonn on 2015/8/25.
 */
var classUtils = require('../_utils/classUtils.js');
var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');

var RichTextDao =  function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};

classUtils.extend(RichTextDao, AbstractFileDao);


RichTextDao.prototype.saveRichText = function (obj, callback) {
    console.log('Obj:');
    console.log(obj);
    this.insertNewOrOverwrite(obj, callback);
};

RichTextDao.prototype.findAllByTrashFlagUnderAccount = function (user, isOut, next ) {
    this.dataCollection.find({"user.id": user.id}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    });
};


RichTextDao.prototype.findFileByIdUnderAccount = function (id, user, next) {
    this.dataCollection.find({id: id, "user.id": user.id}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data[0]);
        }
    });
};

RichTextDao.prototype.findFileById= function (id, next) {
    this.dataCollection.find({id: id}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data[0]);
        }
    });
};



module.exports = RichTextDao;