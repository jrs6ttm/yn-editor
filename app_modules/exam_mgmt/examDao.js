var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var ExamDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(ExamDao, AbstractFileDao);

ExamDao.prototype.saveExam = function (Obj, callback) {
    console.log('examObj:');
    console.log(Obj);

    this.insertNewOrOverwrite(Obj, callback);

};

ExamDao.prototype.getExam = function (query, callback) {
    console.log('examQuery:');
    console.log(query);

    this.findByQuery(query, callback);

};

ExamDao.prototype.updateExam = function (query, setObj, callback) {
    console.log('setObj:');
    console.log(setObj);

    this.updateObj(query, setObj, callback);

};

module.exports = ExamDao;
