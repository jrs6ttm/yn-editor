/**
 * Created by Administrator on 2016/4/1.
 */
var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var ExamStatisticDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(ExamStatisticDao, AbstractFileDao);

ExamStatisticDao.prototype.saveExamStatistic = function (Obj, callback) {
    console.log('examStatisticObj:');
    console.log(Obj);

    this.insertNewOrOverwrite(Obj, callback);
};

ExamStatisticDao.prototype.getExamStatistic = function (query, sort, callback) {
    console.log('examStatisticQuery:');
    console.log(query);

    this.findAndSort(query, sort, callback);
};

module.exports = ExamStatisticDao;