var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var ExamPageDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(ExamPageDao, AbstractFileDao);

ExamPageDao.prototype.getExamPage = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.findByQuery(query, callback);
};

ExamPageDao.prototype.getExamPageCount = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.recordsCount(query, callback);
};

ExamPageDao.prototype.saveExamPage = function (saveExamPageObj, callback) {
    console.log('saveExamPageObj:');
    console.log(saveExamPageObj);

    this.insertNewOrOverwrite(saveExamPageObj, callback);
};

ExamPageDao.prototype.saveExamPageBatch = function (examPageArray, callback) {
    console.log('examPageArray:');
    console.log(examPageArray);

    this.batchInsert(examPageArray, callback);
};

ExamPageDao.prototype.updateExamPages = function (query, setObj, callback) {
    console.log('setObj:');
    console.log(setObj);

    this.updateObj(query, setObj, callback);
};

ExamPageDao.prototype.deleteExamPage = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.deleteRecord(query, callback);
};

module.exports = ExamPageDao;
