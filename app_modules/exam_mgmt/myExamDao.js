var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var MyExamDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(MyExamDao, AbstractFileDao);

MyExamDao.prototype.initMyExamAnswer = function (initMyExam, callback) {
    console.log('initMyExam:');
    console.log(initMyExam);

    this.insertNewOrOverwrite(initMyExam, callback);

};

MyExamDao.prototype.updateMyExamAnswer = function (query, setObj, callback) {
    console.log('setObj:');
    console.log(setObj);

    this.updateObj(query, setObj, callback);

};

MyExamDao.prototype.getMyExamAnswer = function (query1, query2, sort, callback) {
    console.log('query1:');
    console.log(query1);
    console.log('query2:');
    console.log(query2);

    if(query2){//获取页级别的作答
        this.findByQuerys(query1, query2, callback);
    }else{//获取试卷级别的作答
        if(sort){
            this.findAndSort(query1, sort, callback);
        }else {
            this.findByQuery(query1, callback);
        }
    }
};

MyExamDao.prototype.deleteExamItem = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.deleteRecord(query, callback);

};

module.exports = MyExamDao;
