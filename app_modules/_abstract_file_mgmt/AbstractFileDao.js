
var classUtils = require('../_utils/classUtils.js');
var AbstractDao = require('../AbstractDao.js');
var message = require('../_utils/messageGenerator.js');
var uuid = require('node-uuid');

var AbstractFileDao = function(dataCollectionName){
    AbstractDao.call(this);
    this.dataCollection = this.db.collection(dataCollectionName);
};
classUtils.extend(AbstractFileDao, AbstractDao);

AbstractFileDao.prototype.renameById = function (id, fileName, next) {
    this.dataCollection.update(
        {'id': id},
        {
            $set: {
                'name': fileName
            }
        },
        function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result);
            }
        }
    );
};
AbstractFileDao.prototype.renameInstanceById = function (id, name, users, next) {
    this.dataCollection.update(
        {'id': id},
        {
            $set: {
                'name': name
            }
        },
        function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result);
            }
        }
    );
};

AbstractFileDao.prototype.updateById = function (id, next) {
    console.log('abstract update');
    this.dataCollection.update({'id': id}
        , {
            $set: {
                'lastModify': new Date()
            }
        }, function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result);
            }
        });
};

AbstractFileDao.prototype.removeById = function (id, next) {
    this.dataCollection.remove({'id': id}, function (err, result) {
        if (err) {
            throw err;
        } else {
            next(result);
        }
    });
};
AbstractFileDao.prototype.removeByIds = function (fileId,taskId, next) {
    this.dataCollection.remove({'fileId': fileId,'taskId':taskId}, function (err, result) {
        if (err) {
            throw err;
        } else {
            next(result);
        }
    });
};

AbstractFileDao.prototype.toTrashById = function (id, next) {
    this.dataCollection.update(
        {'id': id},
        {
            $set: {
                'isDeleted': true
            }
        },
        function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result, id);
            }
        }
    );
};

AbstractFileDao.prototype.restoreById = function (gFileId, next) {
    this.dataCollection.update(
        {'id': gFileId},
        {
            $set: {
                'isDeleted': false
            }
        },
        function (err, result) {
            if (err) {
                throw err;
            } else {
                next(result);
            }
        }
    );
};

AbstractFileDao.prototype.fileNameIsExist = function(fileName,user,fileType,next){
    this.dataCollection.find({fileName:fileName,userId: user.id,fileType:fileType}).toArray(function(err,doc){
        if (err){
            throw err;
        }else{
            next(doc);
        }
    });
};


AbstractDao.prototype.findByQuery = function(query, callback){
    this.dataCollection.find(query).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

AbstractDao.prototype.findByQuerys = function(query1, query2, callback){
    this.dataCollection.find(query1, query2).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

AbstractDao.prototype.findAndSort = function(query, sort, callback){
    this.dataCollection.find(query).sort(sort).toArray(function (err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

AbstractDao.prototype.findOneObj = function(query, callback){
    this.dataCollection.findOne(query, function (err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

AbstractDao.prototype.recordsCount = function(query, callback){
    this.dataCollection.count(query, function (err, count) {
        if (err) {
            throw err;
        } else {
            callback(count);
        }
    });
};

AbstractFileDao.prototype.insertNewOrOverwrite = function(obj, callback){

    obj = this.prepareNewObj(obj);

    /*
    if(this.validateUserOfObj(obj)){
        obj = this.prepareFileObj(obj);
    }else{
        callback(message.genSimpFailedMsg('User is Null'));
        return;
    }
    */
    this.dataCollection.save(obj, function (err, data) {
        if (err) {
            callback(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            callback(message.genSimpSuccessMsg(null, obj.id));
        }
    });
};

AbstractFileDao.prototype.batchInsert = function(array, callback){
    this.dataCollection.insertMany(array, function (err, data) {
        if (err) {
            callback(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            callback(message.genSimpSuccessMsg(null, data));
        }
    });
};

AbstractFileDao.prototype.updateObj = function(query, setObj, callback){
    this.dataCollection.updateOne(query, setObj,
        function (err, result) {
            if (err) {
                throw err;
            } else {
                if(callback)
                    callback(message.genSimpSuccessMsg(null, result));
            }
        });
};

AbstractDao.prototype.updateAndResMessage = function(query, setObj, callback){
    this.dataCollection.updateOne(query, setObj,
        function (err, result) {
            if (err) {
                callback(message.genSimpFailedMsg(err.message, err.stack));
            } else {
                callback(message.genSimpSuccessMsg(null, result));
            }
        }
    );
};

AbstractDao.prototype.findAndResMessage = function(query, callback){
    this.dataCollection.find(query).sort({'publishModifyTime':-1}).toArray(function (err, data) {
        if (err) {
            callback(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            callback(message.genSimpSuccessMsg(null, data));
        }
    });
};

AbstractFileDao.prototype.save = function(obj, callback){

    obj.id = uuid.v1();

    this.dataCollection.save(obj, function (err, data) {
        if (err) {
            callback(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            callback(message.genSimpSuccessMsg(null, obj.id));
        }
    });
    /*
    var query = {};
    if(obj.hasOwnProperty('materialsId')) {
        query.materialsId = obj.materialsId;
        delete obj.materialsId;
    }else if(obj.hasOwnProperty('commentId')){
        query.
    }*/
};
AbstractFileDao.prototype.saveAndNeedCallbackAll = function(obj, callback){

    obj.id = uuid.v1();

    this.dataCollection.save(obj, function (err, data) {
        if (err) {
            callback(message.genSimpFailedMsg(err.message, err.stack));
        } else {
            callback(message.genSimpSuccessMsg(null, obj));
        }
    });
};

AbstractFileDao.prototype.prepareFileObj = function (obj) {
        obj.isDeleted = false;
        obj.userId = obj.user.id;
        obj.userName = obj.user.name;
        delete obj.user;
        return obj;
};

AbstractFileDao.prototype.validateUserOfObj = function(obj){
    if(obj.user === undefined || obj.user === null){
        return false;
    }else{
        return true;
    }
};

module.exports = AbstractFileDao;