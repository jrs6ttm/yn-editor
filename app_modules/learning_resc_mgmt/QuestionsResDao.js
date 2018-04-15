/**
 * QuestionResDao.js
 * @type {exports|module.exports}
 */
var classUtils = require('../_utils/classUtils.js');
var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var QuestionsResDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(QuestionsResDao, AbstractFileDao);

QuestionsResDao.prototype.getVideoRes = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.findByQuery(query, callback);

};

QuestionsResDao.prototype.saveQuestionForm = function (Obj, callback) {
    console.log('Obj:');
    console.log(Obj);

    this.insertNewOrOverwrite(Obj, callback);

};

/*
QuestionsResDao.prototype.saveAnswerForm = function (Obj, callback) {
    console.log('Obj:');
    console.log(Obj);

    this.updateQuestionItem(Obj, callback);

};
*/

QuestionsResDao.prototype.getAnswerQuestionPanel = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.findByQuery(query, callback);

};
module.exports = QuestionsResDao;
