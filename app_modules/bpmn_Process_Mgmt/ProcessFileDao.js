var classUtils = require('../_utils/classUtils.js');

var AbstractFileDao = require('../_abstract_file_mgmt/AbstractFileDao.js');
var ProcessFileDao = function(dataCollectionName){
    AbstractFileDao.call(this, dataCollectionName);
};
classUtils.extend(ProcessFileDao, AbstractFileDao);

ProcessFileDao.prototype.findFileByNameUnderAccount=function(fileName,user,next){
    this.dataCollection.find({fileName:fileName,userId: user.id}).toArray(function(err,doc){
        if (err){
            throw err;
        }else{
            next(doc);
        }
    });
};
ProcessFileDao.prototype.checkBoardUser = function (id, user, next) {
    this.dataCollection.find({boardId: id, "userData.id": user.id}).toArray(function (err, data) {
        if (err) {
            next();
        } else {
            next(data[0]);
        }
    });
};
ProcessFileDao.prototype.updateBoardById = function (id, user, next) {
    this.dataCollection.update({'boardId': id}
        , {
            $push: {
                'modifyRec': {
                    'modifyTime': new Date(),
                    'modifyUserId': user.id
                }
            }
        }, {
            multi: true
        },function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result);
            }
        });
};
ProcessFileDao.prototype.findAllUserOfBoard = function(boardId, next) {
    this.dataCollection.find({boardId: boardId}).toArray(function (err, data) {
        if (err){
            throw err;
        } else {
            next(data);
        }
    })
};
ProcessFileDao.prototype.courseLog = function (actionType, logObj, next) {
    logObj.time = new Date();
    logObj.action = actionType;
    this.saveNew(logObj, function (data) {
        next(data);
    });
};
ProcessFileDao.prototype.saveNew = function (saveObj, next) {
    this.dataCollection.save(saveObj, function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    })
};
ProcessFileDao.prototype.updateInstanceFileById = function (id,name,detailDes, fileIcon,groupRange,isCooperation, next) {
    this.dataCollection.update({'id': id}, {$set: {'name': name, 'detailDes':detailDes,'fileIcon':fileIcon, 'groupRange':groupRange, 'isCooperation':isCooperation}}, function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result);
            }
        }
    );
};
ProcessFileDao.prototype.delBoardUser = function (delObj, next) {
    this.dataCollection.remove(delObj, function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    })
};
ProcessFileDao.prototype.findFileByIdUnderAccount = function (id, user, next) {
    this.dataCollection.findOne({id: id, userId: user.id},function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    });
};
ProcessFileDao.prototype.findFileByIdUnderAccount1 = function (id, next) {
    this.dataCollection.findOne({id: id}, function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    });
};
ProcessFileDao.prototype.findOneBoardById = function (num, boardId, next) {
    this.dataCollection.findOne({boardId: boardId},function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data, num);
        }
    });
};
ProcessFileDao.prototype.findFileByProcessId = function (processId, isDeleted, next) {
    this.dataCollection.find({isDeleted: isDeleted, processId: processId}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    });
};
ProcessFileDao.prototype.findOneInstanceFileById = function(instanceId,next){
  this.dataCollection.findOne({id:instanceId},function(err,data){
      if(err){
          throw err;
      }else{
          next(data);
      }
  })
};
ProcessFileDao.prototype.findFileByLikeNameUnderAccount = function (fileLikeName,user, next) {
    var likeName = new RegExp("^.*" + fileLikeName + ".*$");
    this.dataCollection.find({fileName: likeName,userId:user.id,fileType: "process_design"}).toArray(function (err, result) {
        if (err) {
            var resDoc = false;
            next(resDoc);
            throw err;
        } else {
            next(result);
        }
    });
};

ProcessFileDao.prototype.findAllByTrashFlagUnderAccount = function (findObj, next ) {
    this.dataCollection.find(findObj).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    });
};

ProcessFileDao.prototype.findAllTopProcess = function(next){
    this.dataCollection.find({"$or":[{isTopProcess:true, fileType:"process_design"}, {isTopProcess:true, fileType:"ople_design"}]}).toArray(function(err,doc){
        if(err){
            throw err;
        }else{
            next(doc);
        }
    });
};

ProcessFileDao.prototype.findAllTopProcessUnderAccount = function(user,next){
    this.dataCollection.find({isTopProcess:true, userId: user.id}).toArray(function(err,doc){
        if(err){
            throw err;
        }else{
            next(doc);
        }
    });
};

ProcessFileDao.prototype.findByInstanceRole = function (instanceId, roleId, next) {
    this.dataCollection.find({processInstanceId: instanceId, roleId: roleId}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    })
};
ProcessFileDao.prototype.findAllUserBoard = function (userId, next) {
    this.dataCollection.find({'userData.id': userId,userType:'edit'}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    })
};
ProcessFileDao.prototype.removeSelectedInstance = function(obj,next) {
    this.dataCollection.remove({'courseId':obj.courseId,'userEmail':obj.userEmail},function(err,data) {
        if(err) {
            throw err;
        } else {
            next(data.result.n);
        }
    });
};
ProcessFileDao.prototype.checkAcourseSelected = function (obj,next) {
    this.dataCollection.find({'courseId':obj.courseId,'userEmail':obj.userEmail}).toArray(function(err,data) {
       if(err) {
           throw err;
       } else {
           next(data);
       }
    });
};
ProcessFileDao.prototype.getCourseById = function(courseId,next) {
  this.dataCollection.findOne({'id':courseId}, function(err,data) {
        if(err) {
            throw err;
        } else {
            next(data);
        }
    });
};

ProcessFileDao.prototype.getPublishedCourseByUserId = function(userId,next) {
    this.dataCollection.find({'userId':userId,'isPublished':true}).toArray(function(err,data) {
        if(err) {
            throw err;
        } else {
            next(data);
        }
    });
};
ProcessFileDao.prototype.getCourseId = function(query,next) {
  this.dataCollection.find(query).toArray(function(err,data) {
    if(err) {
        throw err;
    } else {
        next(data);
    }
  });
};

ProcessFileDao.prototype.findAndDeliver_temp = function(query, deliverNum, callback){
    this.dataCollection.find(query).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            callback(deliverNum, data);
        }
    });
};
ProcessFileDao.prototype.findChatHistory = function (gFileId,next) {
    this.dataCollection.find({'id': gFileId}).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            next(data);
        }
    });
};
ProcessFileDao.prototype.updateChatHistory = function(query,update, callback) {
    this.dataCollection.update({'id':query}, {$pushAll: {'chatHistory.msgObj':update}}, function (err, result) {
        if (err) {
            throw err;
        } else {
            callback(result);
        }
    });
};
ProcessFileDao.prototype.loadOneModelFile = function(fileId,next){
    this.dataCollection.findOne({id:fileId},function(err,result){
        if(err){
            throw err;
        }else{
            next(result);
        }
    })
};
ProcessFileDao.prototype.updateOneModelFile = function(fileId,fileName,fileDesc,next){
    this.dataCollection.update({'id':fileId},{$set:{'fileName':fileName,'fileDesc':fileDesc}},function(err,result){
        if(err){
            throw err;
        }else{
            next(result);
        }
    });
};
ProcessFileDao.prototype.updateOneTaskFile = function(fileId,fileName,fileDesc,fileIcon,categoryId,next){
    this.dataCollection.update({'id':fileId},{$set:{'fileName':fileName,'fileDesc':fileDesc, 'fileIcon':fileIcon, 'categoryId':categoryId}},function(err,result){
        if(err){
            throw err;
        }else{
            next(result);
        }
    });
};
ProcessFileDao.prototype.updateOneCourseInfo = function(id,name,briefDes,detailDes,categoryId,fileIcon,next){
    this.dataCollection.update({'id':id},{
        $set:{
            'name':name,
            'briefDes':briefDes,
            'detailDes':detailDes,
            'categoryId':categoryId,
            'fileIcon':fileIcon,
            'lastModify': new Date()
        }
    },function(err,result){
        if(err){
            throw err;
        }else{
            next(result);
        }
    });
};
//v2.2
ProcessFileDao.prototype.updateById = function(id, setObj, next){
    this.dataCollection.update({'id':id},{
        $set: setObj
    },function(err, result){
        if(err){
            throw err;
        }else{
            next(result);
        }
    });
}
module.exports = ProcessFileDao;