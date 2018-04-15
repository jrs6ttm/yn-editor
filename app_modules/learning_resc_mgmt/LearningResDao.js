/**
 * LearningResDao.js
 * @type {exports|module.exports}
 */
var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var LearningResDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(LearningResDao, AbstractFileDao);

LearningResDao.prototype.searchLearningRes = function (query, sortQuery, callback) {
    if(sortQuery){
        this.findAndSort(query, sortQuery, callback);
    }else{
        this.findByQuery(query, callback);
    }
};

LearningResDao.prototype.saveLearningRes = function (saveObj, callback) {
    console.log('saveObj:');
    console.log(saveObj);

    this.insertNewOrOverwrite(saveObj, callback);
};

LearningResDao.prototype.deleteLR = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.deleteRecord(query, callback);
};

LearningResDao.prototype.updateLR = function (query, updateObj, callback) {
    console.log('updateObj:');
    console.log(updateObj);

    //this.updateOneRecord({materialsId : updateObj.materialsId}, {$set: updateObj}, callback);
    this.updateOneRecord(query, updateObj, callback);
};

module.exports = LearningResDao;
