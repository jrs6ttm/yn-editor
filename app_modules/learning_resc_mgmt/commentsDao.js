/**
 * commentsDao.js
 * @type {exports|module.exports}
 */
var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var CommentsDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(CommentsDao, AbstractFileDao);

CommentsDao.prototype.saveComment = function (commentObj, callback) {
    delete commentObj._id;
    console.log('commentObj:');
    console.log(commentObj);

    this.save(commentObj, callback);
    this.updateObj({id: commentObj.reply_to_id}, {$inc : {childComments : 1}}, null);
};

CommentsDao.prototype.getComments = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.findByQuery(query, callback);

};

module.exports = CommentsDao;
