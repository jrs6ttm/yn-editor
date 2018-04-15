/**
 * Created by fangz_000 on 11/11/2015.
 */
var taskCommentDao = new (require('./ProcessFileDao.js'))('taskComment');
var message = require('../_utils/messageGenerator.js');
exports.save = function (taskId, content, userData, time, fileId, next) {
    var saveObj = {
        fileId: fileId,
        taskId: taskId,
        content: content,
        userData: {
            userName: userData.name,
            userId: userData.id
        },
        time: time
    };
    taskCommentDao.saveAndNeedCallbackAll(saveObj, function (resData) {
        next(resData);
    })
};
exports.find = function (taskId, fileId, next) {
    var findObj = {
        fileId: fileId,
        taskId: taskId
    };
    taskCommentDao.findByQuery(findObj, function (resData) {
        next(message.genSimpSuccessMsg('', resData));
    })
};
exports.remove = function(taskCommentId,next){
    taskCommentDao.removeById(taskCommentId, function (resData) {
        next(message.genSimpSuccessMsg('', resData));
    })
};
exports.removeComments = function(fileId,taskId,next){
    taskCommentDao.removeByIds(fileId,taskId, function (resData) {
        next(message.genSimpSuccessMsg('', resData));
    })
}