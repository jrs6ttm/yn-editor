/**
 * Created by fangz_000 on 11/11/2015.
 */
var taskCommentService = require('./taskCommentService.js');

exports.save = function (req, res) {
    var taskId = req.query.taskId;
    var content = req.query.content;
    var userData = req.session.userData;
    var time = new Date();
    var fileId = req.query.fileId;
    taskCommentService.save(taskId, content, userData, time, fileId, function (resData) {
        res.send(resData);
    })
};
exports.find = function (req, res) {
    var taskId = req.query.taskId;
    var fileId = req.query.fileId;
    taskCommentService.find(taskId, fileId, function (resData) {
        res.send(resData);
    })
};
exports.remove = function (req, res) {
 var taskCommentId = req.query.id;
    taskCommentService.remove(taskCommentId, function (resData) {
        res.send(resData);
    });
};
exports.removeComments = function (req, res) {
    var fileId = req.query.fileId;
    var taskId = req.query.taskId;
    taskCommentService.removeComments(fileId,taskId, function (resData) {
        res.send(resData);
    });
};