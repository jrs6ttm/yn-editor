var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var ExamItemDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(ExamItemDao, AbstractFileDao);

ExamItemDao.prototype.saveExamItem = function (Obj, callback) {
    console.log('Obj:');
    console.log(Obj);

    this.insertNewOrOverwrite(Obj, callback);
};

ExamItemDao.prototype.saveExamItemBatch = function (examItemArray, callback) {
    console.log('Obj:');
    console.log(examItemArray);

    this.batchInsert(examItemArray, callback);
};

ExamItemDao.prototype.updateExamItem = function (query, setObj, callback) {
    console.log('setObj:');
    console.log(setObj);

    this.updateObj(query, setObj, callback);
};

ExamItemDao.prototype.getExamItems = function (query, callback) {
    console.log('query:');
    console.log(query);

    if(query.hasOwnProperty('isExample')){
        delete query.isExample;
        this.findOneObj(query, callback);
    }else{
        this.findAndSort(query, {itemPosition : 1}, callback);
    }
};

ExamItemDao.prototype.deleteExamItem = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.deleteRecord(query, callback);
};

module.exports = ExamItemDao;
