var Gridfs = require('gridfs-stream');
var fs = require('fs');
var classUtils = require('../_utils/classUtils.js');
var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var VideoResDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(VideoResDao, AbstractFileDao);

VideoResDao.prototype.getVideoRes = function (query, callback) {
    console.log('query:');
    console.log(query);
    this.findByQuery(query, callback);
};

VideoResDao.prototype.saveVideoRes = function (Obj, callback) {
    console.log('Obj:');
    console.log(Obj);
    if(Obj.isNew)
        this.insertNewOrOverwrite(Obj, callback);
    else
        this.updateObj({id:Obj.id},Obj,callback);
};

module.exports = VideoResDao;
