/**
 * Created by DISI on 03.07.2015.
 */
//todo
var currHandleId;
var meHandle=[];
var appSocket;
var app_socket;
var usersNotice = [];


var Communication = function (editorUi) {
    mxEventSource.call(this);
    this.editorUi = editorUi;
    this.editor = editorUi.editor;
    this.graph = this.editor.graph;
    this.apis = {
        retrieveGraphModel: 'Retrieve_Graph_Model',
        persistModelFile: 'Persist_Model_File'
    };
    this.addMaterialIds = [];
    this.delMaterialIds = [];

    var me = this;
    if (isStartProcessEngine) {
        this.socket = io.connect(engineSocketUrl);
        this.socket.on('getStartFigures', function (StartFigures) {
            console.log(StartFigures);
            me.sendGraphMessage(new BasicMessage(true, 'getStartFigures', null, StartFigures));
        });
        this.socket.on('TaskStarted', function (nextFigures) {
            //console.log(nextFigures);
            me.sendGraphMessage(new BasicMessage(true, 'TaskStarted', null, nextFigures));
        });
        this.socket.on('TaskEnded', function (nextFigures) {
            //console.log(nextFigures);
            me.sendGraphMessage(new BasicMessage(true, 'TaskEnded', null, nextFigures));
        });
        this.socket.on('getAllTopProcess', function (data) {
            console.log(data);
        });
        this.socket.on('allIsEnd', function () {
            me.sendGraphMessage(new BasicMessage(true, 'allIsEnd', null, null));
        });
    }

    //this.fireEvent(new mxEventObject('onNewMessage'), {success: true});
    /*this.socket = io();
     if (urlParams['ch']) {
     this.socket.emit('room', urlParams['ch']);

     this.socket.on('geometryChange', function (data) {
     var changes = data.changes;
     //next(changes);
     ecEditorUi.editor.graph.updateCellGeometry(changes.id, changes.x, changes.y, changes.width, changes.height);
     });
     }*/
    if(urlParams['ui']){
        app_socket = io.connect();
        var user = {
            id:userId,
            name:userName
        };
        app_socket.emit('ui',user);
        app_socket.on('newNotice',function(msgObj){
            var users = msgObj.toOthers;
            var myNoticeNum = editorUi.getNoticeNum();
            for(var i = 0; i < users.length; i++){
                if(userId === users[i].id){
                    console.log(msgObj);
                    myNoticeNum.innerHTML = msgObj.noticeNum;
                    //myNoticeNum.title = ' share file';
                    //var message = msgObj.fromMe.userName + '  shares a file to you!';
                    //var noticeDialog = new tipDialogBody(editorUi,message);
                    //editorUi.showDialog(noticeDialog, 300, null, true, true);
                    if(msgObj.noticeNum > 0){
                        myNoticeNum.style.display= 'block';
                    }
                }
            }
        });
    }

    /**
     *  Re-organize later
     */
    if (urlParams['ch']) {
        appSocket = io.connect();
        currHandleId = [];
        var users = [];
        var count = 0;
        var newUser = {
            'id':userId,
            'name':userName
        };
        var roomInfo = {
            'room':urlParams['ch'],
            'user':newUser
        };
        appSocket.emit('room',roomInfo);
        me.editor.passiveChangeList = [];
        appSocket.on('controlId', function (data) {
            var mark = 0;
            for (var i = 0; i < currHandleId.length; i++) {
                if (currHandleId[i] === data) {
                    mark = 1;
                    break;
                }
            }
            if (mark === 0) {
                currHandleId.push(data);
                ecEditorUi.editor.graph.updateCellLockState(data, 'lock', 'This cell is locked.');
            }
            console.log(currHandleId);
        });
        appSocket.on('removeId', function (data) {
            var index=-1;
            for(var i=0;i<currHandleId.length;i++){
                if(currHandleId[i]===data){
                    index=i;
                    break;
                }
            }
            if(index!==-1){
                console.log(currHandleId);
                var temp=currHandleId[index];
                for(var i=index;i<currHandleId.length-1;i++){
                    currHandleId[i]=currHandleId[i+1];
                }
                currHandleId.pop();
                console.log(currHandleId);
                ecEditorUi.editor.graph.updateCellLockState(data, 'unlock');
            }
        });

        appSocket.on('geometryChange', function (data) {
            me.editor.passiveChangeList.push(data.id);
            ecEditorUi.editor.graph.updateCellGeometry(data.id, data.x, data.y, data.width, data.height);
        });

        appSocket.on('removeCell', function (id) {
            var cellArray = editorUi.editor.graph.findAllCellsUndParent();
            for (var i = 0; i<cellArray.length; i++) {
                if (cellArray[i].id === id){
                    var cell = cellArray[i];
                    me.editor.passiveChangeList.push(id);
                    editorUi.editor.graph.removeCells([cell]);
                }
            }
        });
        appSocket.on('changeLabel', function (data) {
            var cellArray = editorUi.editor.graph.findAllCellsUndParent();
            var model = editorUi.editor.graph.getModel();
            for (var i = 0; i<cellArray.length; i++) {
                if (cellArray[i].id === data.id){
                    var cell = cellArray[i];
                    model.beginUpdate();
                    cell.setAttribute('label',data.attributes);
                    model.endUpdate();
                    editorUi.editor.graph.refresh();
                }
            }
        });
        appSocket.on('changeParent', function (data) {
            me.editor.passiveChangeList.push(data.id);
            var cellArray = editorUi.editor.graph.findAllCellsUndParent();
            for (var i = 0; i<cellArray.length; i++) {
                if (cellArray[i].id === data.id){
                    var cell = cellArray[i];
                    cell.parent = data.parent;
                }
            }
        });
        appSocket.on('addNew',function(data){
            console.log(data);
            //find if the cell exists or not
            var cellArray = editorUi.editor.graph.findAllCellsUndParent();
            console.log(cellArray);
            for (var i = 0; i<cellArray.length; i++) {
                if (cellArray[i].id === data.id){
                    //delete it
                    var cell = cellArray[i];
                    me.editor.passiveChangeList.push(data.id);//change type也可加.注意：每改变一次，则push一次，而不是接收到socket一次就push一次
                    editorUi.editor.graph.removeCells([cell]);
                }
            }
            //console.log(ecCellValue);
            var parent=ecEditorUi.editor.graph.getModel().getCell(data.parent);
            var id=data.id;
            var x=data.geometry.x;
            var y=data.geometry.y;
            var width=data.geometry.width;
            var height=data.geometry.height;
            var relative=data.geometry.relative;
            var style=data.style;
            var graph=ecEditorUi.editor.graph;
            me.editor.passiveChangeList.push(data.id);
            if(data.value===''){
                var offset=data.geometry.offset;
                console.log(offset);
                appUtils.insertVertexToGraph(graph, parent, id, '', x, y, width, height, style, relative);
            }else{
                var ecCellValue=appUtils.genMxCellValueFromPersistObj(data);
                appUtils.insertVertexToGraph(graph, parent, id, ecCellValue, x, y, width, height, style, relative);
            }

        });
        appSocket.on('sendMessage',function(msgData){
            var chatBox = editorUi.chatDiv;
            if(editorUi.chatDivContainer.style.display === 'block') {
                count = 0;
            } else {
                count ++;
            }
            editorUi.dealMsgRemind(count);
            chatBox.addMessage(msgData,false);
        });
        appSocket.on('joinRoom',function(newUser) {
            editorUi.addParticipant(newUser.id,newUser.name);
        });
        appSocket.on('joinSuccess',function(users){
            for(var i=0;i<users.length;i++) {
                // 注释部分为 ：任务分析工具中，过滤在线成员显示列表中，自己的显示！
                //if(users[i].name !== userName){
                editorUi.addParticipant(users[i].id,users[i].name);
                //}
            }
        });
        appSocket.on('logout',function(userId) {
            editorUi.removeParticipant(userId);
        });
    }
};
mxUtils.extend(Communication, mxEventSource);
Communication.prototype.handleNoSession = function () {
    //var url = 'http://' + loginHost + '/index.php?redirect_url=/';
    var url = 'http://' + loginHost;
    var msg='<b>' + mxResources.get('lPleaseLoginAgain', ['<a href=' + url + ' target="_blank"><button>'+mxResources.get('login')+'</button></a></b><br><br>']);
    //var msg='<b>抱歉！您已离线，请重新<a href=' + url + ' target="_blank"><button>'+mxResources.get('login')+'</button></a></b><br><br>登陆后此页面依旧有效';
    this.editorUi.showDialog(new tipDialogBody(this.editorUi, msg, 'left'), 300, null, true, false);
    this.editor.setModified('break');
};
//链接资源，用于记录资源被哪些文件用了。link file and resource to record all files which are using the resource.
Communication.prototype.linkResource = function (islink, resourceId) {
    if (islink) {
        this.addMaterialIds.push(resourceId);
    } else {
        this.delMaterialIds.push(resourceId);
    }
};
Communication.prototype.handleLinkResourceList = function () {
    for (var i = 0; i < this.addMaterialIds.length; i++) {
        for(var j = 0; j < this.delMaterialIds.length; j++){
            if (this.addMaterialIds[i] === this.delMaterialIds[j]) {
                this.addMaterialIds.splice(i, 1);
                this.delMaterialIds.splice(j, 1);
                break;
            }
        }
    }
    //区别model和instance
    var courseId;
    if (this.editor.getProcessId()) {
        courseId = this.editor.getProcessId();
    } else {
        courseId = this.editor.getFileId();
    }
    var queryObj = {
        oldMaterialsId: JSON.stringify(this.delMaterialIds),
        newMaterialsId: JSON.stringify(this.addMaterialIds),
        courseId:courseId
    };
    //this.sendLinkResourceList(queryObj, function () {
    this.addMaterialIds = [];
    this.delMaterialIds = [];
    //})
};
Communication.prototype.sendLinkResourceList = function (queryObj, handleRes) {
    new mxXmlRequest('/LR/updateCourses' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        }
    })
};
Communication.prototype.sendGraphMessage = function (message) {
    this.fireEvent(new mxEventObject('onGraphMessage'), message);
};
Communication.prototype.sendEditorUiMessage = function (message) {
    this.fireEvent(new mxEventObject('onEditorUiMessage'), message);
};

Communication.prototype.genQueryStrFromObj = function (obj, isWithQuestMark) {
    var parts = [], queryStr = "";
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]!=='') {
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    queryStr = parts.join('&');
    if (isWithQuestMark === undefined || isWithQuestMark) {
        queryStr = '?' + queryStr;
    }
    return queryStr;
};

Communication.prototype.genQueryStrFromObjs = function (obj, isWithQuestMark) {
    var parts = [], queryStr = "";
    for (var i = 0; i < obj.length; i++) {
        for (var key in obj[i]) {
            if (obj[i].hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[i][key]));
            }
        }
        queryStr = parts.join('&');
    }
    if (isWithQuestMark === undefined || isWithQuestMark) {
        queryStr = '?' + queryStr;
    }
    return queryStr;
};

Communication.prototype.loadTinymceEditScript = function (onload) {
    if (typeof nicEditors != 'undefined') {
        onload();
    } else {
        var headEl = document.getElementsByTagName('HEAD').item(0);
        var scriptEl = document.createElement("script");
        scriptEl.type = "text/javascript";
        scriptEl.src = "tinymce/tinymce.min.js";

        scriptEl.onload = onload;
        headEl.appendChild(scriptEl);
    }
};

Communication.prototype.loadJqueryScript = function (onload) {
    if (typeof queryBuilder != 'undefined') {
        onload();
    }
    else {
        var headEl = document.getElementsByTagName('HEAD').item(0);
        var scriptEl = document.createElement("script");
        scriptEl.type = "text/javascript";
        scriptEl.src = "src/js/query-builder.standalone.min.js";
        scriptEl.onload = onload;
        headEl.appendChild(scriptEl);
    }
};

Communication.prototype.delayLoad = function () {
    setTimeout(function(){
        var headEl = document.getElementsByTagName('HEAD').item(0);
        var csses = [
            'app_3th_js/query-builder/query-builder.default.min.css',
            'app_3th_js/jplayer/skin/blue.monday/css/jplayer.blue.monday.css',
            'styles/video.css',
            'app_3th_js/summernote/css/summerNote.css'
        ];
        var scripts = [
            'app_3th_js/jscolor/jscolor.js',
            'app_3th_js/tinymce/tinymce.min.js',
            'app_3th_js/query-builder/query-builder.standalone.min.js',
            'app_3th_js/jplayer/js/jquery.jplayer.js',
            'app_ui_js/video.js',
            'app_3th_js/bootstrap/bootstrap.min.js',
            'app_3th_js/localeCompare/localeCompare.js',
            'app_3th_js/summernote/js/summerNote.js'
        ];
        for (var i = 0; i < csses.length; i++) {
            var linkEl = document.createElement("link");
            linkEl.rel = "stylesheet";
            linkEl.type = "text/css";
            linkEl.href = csses[i];
            headEl.appendChild(linkEl);
        }
        for (var i = 0; i < scripts.length; i++) {
            var scriptEl = document.createElement("script");
            scriptEl.type = "text/javascript";
            scriptEl.src = scripts[i];
            headEl.appendChild(scriptEl);
        }
    }, 1000);

};

Communication.prototype.retrieveGraphModel = function (queryObj, handleRes, next) {
    var me = this;
    //if (urlParams['ch']){
    //    if (urlParams['theKey']) {
    //        queryObj.userKey = urlParams['theKey'];
    //        queryObj.ch = urlParams['ch'];
    //    }
    //} else {
    //}
    if (queryObj.ui){
        queryObj['fileType'] = queryObj.ui;
        delete queryObj.ui;
    }
    var URL;
    if (queryObj.fileType === 'process_design') {
        URL = '/load/loadInstance';
    } else {
        URL = '/load';
    }
    new mxXmlRequest(URL + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
        //alert(req.request.response);
        if (mxXmlRequest.getJsonData().success === true) {
            var graphModel = mxXmlRequest.getJsonData().data;
            if (handleRes) {
                if (handleRes(graphModel)) {
                    if (next) {
                        next();
                    }
                }

            }
            //var urlQueryObj = appUtils.convertQueryStrToJSON();
            //if (queryObj.isInstance){
            //
            //    History.pushState(queryObj, me.apis.retrieveGraphModel, '?instanceId=' + queryObj.gFileId);
            //} else {
            //    urlQueryObj.fileId = queryObj.gFileId;
            //    History.pushState(queryObj, me.apis.retrieveGraphModel, appUtils.convertJSONToQueryStr(urlQueryObj, '?'));
            //}
        } else if (mxXmlRequest.getJsonData().msg === 'no_session'){
            me.handleNoSession();
        } else {

            me.sendEditorUiMessage(new BasicMessage(true, 'no limit or file has been deleted', null, null));
            //why does the string in second place but not third?

        }

    });

};
Communication.prototype.persistModelFile = function (paramObj, handleRes) {
    if (this.graph.savable) {

        var fileName = paramObj.fileName, xml = paramObj.xml;
        var me = this;
        if (fileName && (xml||paramObj.xmlId)) {
            if (xml && xml.length > MAX_REQUEST_SIZE) {
                //mxUtils.alert(mxResources.get('drawingTooLarge'));
                this.editorUi.showDialog(new tipDialogBody(this.editorUi, mxResources.get('drawingTooLarge')), 300, null, true, true);
                mxUtils.popup(xml);
                return;
            }
            try {
                new mxXmlRequest(SAVE_URL, this.genQueryStrFromObj(paramObj, false), 'POST', true).send(function (mxXmlRequest) {
                    //console.log(req.request.response);
                    var resMessage = mxXmlRequest.getJsonData();
                    if (resMessage.success){
                        if (resMessage.data && resMessage.data.gFileId) {
                            paramObj.gFileId = resMessage.data.gFileId;
                            if (paramObj.isSaveNewFile) {
                                delete paramObj.xml;
                                delete paramObj.isSaveNewFile;
                                if (!paramObj.isOpenSubPro) {
                                    var urlQueryObj = appUtils.convertQueryStrToJSON();
                                    urlQueryObj.gFileId = paramObj.gFileId;
                                    if (mxUi === 'task_design') {
                                        urlQueryObj.ch = paramObj.gFileId;
                                    }
                                    History.ecDoRetrieveGraphModel = false;
                                    History.pushState(urlQueryObj, me.apis.retrieveGraphModel, appUtils.convertJSONToQueryStr(urlQueryObj, '?'));
                                    if (mxUi === 'task_design') {
                                        me.editorUi.addChatDiv();
                                    }
                                }
                            }
                        }
                        handleRes(resMessage);
                    }
                    else if (resMessage.msg === 'no_session'){
                        me.handleNoSession();
                    }
                });
            } catch (e) {
                var errMessage = new BasicMessage(false, 'err', mxResources.get('errorSavingFile'), null);
                handleRes(errMessage);
            }
        }
    } else {
        //alert(mxResources.get('ItIsNotAllowedToSaveTheGraphAtTheCurrentContext'));
        this.editorUi.showDialog(new tipDialogBody(this.editorUi, mxResources.get('ItIsNotAllowedToSaveTheGraphAtTheCurrentContext')), 300, null, true, true);
    }

};
Communication.prototype.retrieveInstance = function (queryObj, handleRes, next) {
    var me = this;
    queryObj.userKey = apiKey;
    new mxXmlRequest(Load_URL + '/loadInstance' + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
        console.log(mxXmlRequest.getJsonData());
        if (mxXmlRequest.getJsonData().success === true) {
            var graphModel = mxXmlRequest.getJsonData().data;
            if (handleRes) {
                if (handleRes(graphModel)) {
                    if (next) {
                        next();
                    }
                }
            }
        } else {
            me.sendEditorUiMessage(new BasicMessage(true, 'file_has_been_delete', null, null));
        }
    });
};
Communication.prototype.persistInstanceFile = function (paramObj, handleRes) {
    this.sendPostRequest(SAVE_INSTANCE_URL, paramObj, function (msg) {
        handleRes(msg.data);
    });
};
Communication.prototype.persistSubCourse = function (paramObj, handleRes) {
    var me = this;
    if (paramObj.xml){
        this.editorUi.beforeSave();
    }
    this.sendPostRequest(SAVE_INSTANCE_URL, paramObj,  function (msg) {
        if (msg.success) {
            handleRes(msg.data);
        } else if (msg.msg === 'exist'){
            var message = mxResources.get('fileExists');
            var tipDialog = new tipDialogBody(this,message);
            this.editorUi.showDialog(tipDialog, 300, null, true, true);
            this.editor.setModified('break');
        }
    });
};
Communication.prototype.persistCourse = function (paramObj, handleRes) {
    if (this.graph.savable) {
        var fileName = paramObj.fileName, xml = paramObj.xml;
        var me = this;
        if (fileName && (xml||paramObj.xmlId)) {
            if (xml && xml.length > MAX_REQUEST_SIZE) {
                this.editorUi.showDialog(new tipDialogBody(this.editorUi, mxResources.get('drawingTooLarge')), 300, null, true, true);
                mxUtils.popup(xml);
                return;
            }
            try {
                this.sendPostRequest(SAVE_URL, paramObj, function (resMsg) {
                    if (resMsg.success){
                        var resData = resMsg.data;
                        if (resData && resData.gFileId) {
                            paramObj.gFileId = resData.gFileId;
                            if (paramObj.isSaveNewFile) {
                                var urlQueryObj = appUtils.convertQueryStrToJSON();
                                urlQueryObj.gFileId = paramObj.gFileId;
                                if (mxUi === 'task_design') {
                                    urlQueryObj.ch = paramObj.gFileId;
                                }
                                History.ecDoRetrieveGraphModel = false;
                                History.pushState(urlQueryObj, me.apis.retrieveGraphModel, appUtils. convertJSONToQueryStr(urlQueryObj, '?'));
                                if (mxUi === 'task_design') {
                                    me.editorUi.addChatDiv();
                                }
                            }
                        }
                        handleRes(new BasicMessage(true, null, null, resData));
                    } else if (resMsg.msg === 'exist') {
                        //mxUtils.confirm(mxResources.get('fileExists'));
                        var message = mxResources.get('fileExists');
                        var tipDialog = new tipDialogBody(this,message);
                        me.editorUi.showDialog(tipDialog, 300, null, true, true);
                    }
                });
            } catch (e) {
                var errMessage = new BasicMessage(false, 'err', mxResources.get('errorSavingFile'), null);
                handleRes(errMessage);
            }
        }
    } else {
        this.editorUi.showDialog(new tipDialogBody(this.editorUi, mxResources.get('ItIsNotAllowedToSaveTheGraphAtTheCurrentContext')), 300, null, true, true);
    }
};
Communication.prototype.sendPostRequest = function (url, queryObj, handleRes) {
    var me = this;
    new mxXmlRequest(url, this.genQueryStrFromObj(queryObj, false), 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
        }else if (message.msg === 'no_session'){
            me.handleNoSession();
            return;
        }else {
            throw message;
        }
        if (handleRes) {
            handleRes(message);
        }
    })
};
Communication.prototype.changePublicState = function (fileId, isInstance, handleRes) {
    var me = this;
    var paramObj = {
        "fileId": fileId,
        "isInstance": isInstance
    };
    new mxXmlRequest('/update/changePublicState' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var resMessage = mxXmlRequest.getJsonData();
        if (resMessage.success) {
            console.log('success');
            handleRes(resMessage);
        }else if (resMessage.msg === 'no_session'){
            me.handleNoSession();
        }
    })
};
Communication.prototype.getAllLane = function (fileId, handleRes) {
    var paramObj = {
        fileId: fileId
    };
    var me = this;
    new mxXmlRequest(Load_URL + '/loadAllLane' + this.genQueryStrFromObj(paramObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            handleRes(message.data.roleData);
        } else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    })
};
Communication.prototype.loadAllTaskType = function (boardId, handleRes) {
    var paramObj = {
        boardId: boardId
    }
    new mxXmlRequest(Load_URL + '/loadTaskType' + this.genQueryStrFromObj(paramObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message) {
            handleRes(message.taskData);
        } else {

        }
    })
};
Communication.prototype.persistInsRoleUser = function (paramObj, handleRes) {

    console.log(paramObj);
    new mxXmlRequest('/saveInstanceUser', this.genQueryStrFromObj(paramObj, false), 'POST', true).send(function (mxXmlRequest) {
        var resData = mxXmlRequest.getJsonData();
        console.log(resData);
        if (resData) {
            handleRes(resData);
        }
    })
};

Communication.prototype.loadInstanceUser = function (paramObj, handleRes) {
    new mxXmlRequest(Load_URL + '/loadInstanceUser' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getText();
        console.log(message);
        handleRes(message);
    });

};

Communication.prototype.getBindTaskXmlData = function(paramObj,resHandler) {
    new mxXmlRequest(Load_URL + '/getBindTaskXml', this.genQueryStrFromObj(paramObj, false), 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message);
    });
};
//todo fz 170423
Communication.prototype.loadAllModelFiles = function (paramObj, resHandler) {
    console.log(paramObj);
    var me = this;
    new mxXmlRequest(Load_URL + '/loadAllModelFile' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        //console.log(req.request.response);
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if(message.success){
            resHandler(message);
        } else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};
//Communication.prototype.loadAllTashedModelFiles = function (resHandler) {
//    new mxXmlRequest(Load_URL + '/loadAllTrashFileNames', null, 'GET', true).send(function (mxXmlRequest) {
//        var message = mxXmlRequest.getJsonData();
//        console.log(message);
//        resHandler(message);
//    });
//};

Communication.prototype.loadInstanceOfProcess = function (paramObj, resHandler) {
    new mxXmlRequest(Load_URL + '/loadInstanceOfProcess' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        //console.log(req.request.response);
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message);
    });

};
Communication.prototype.loadModelFile = function (paramObj, resHandler) {
    var me = this;
    new mxXmlRequest(Load_URL + '/loadModelFile' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        //console.log(req.request.response);
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if (message.success){
            resHandler(message);
        } else if (message.msg === 'no_session'){
            me.handleNoSession();
        } else {
            console.log(message);
        }
    });

};
//Communication.prototype.updateModelFile = function(paramObj,resHandler) {
//    new mxXmlRequest(SAVE_URL + '/saveModelFile'+this.genQueryStrFromObj(paramObj),null,'GET',true).send(function(mxXmlRequest) {
//        var message = mxXmlRequest.getJsonData();
//        console.log(message);
//        resHandler(message);
//    });
//};
Communication.prototype.updateModelFile = function(paramObj,resHandler) {
    var me = this;
    new mxXmlRequest(SAVE_URL + '/saveModelFile', this.genQueryStrFromObj(paramObj, false), 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if(message.success){
            resHandler(message);
        } else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};
Communication.prototype.loadInstanceFile = function (paramObj, resHandler) {
    new mxXmlRequest(Load_URL + '/loadInstanceFile' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        //console.log(req.request.response);
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message);
    });

};
Communication.prototype.updateInstanceFile = function(paramObj,resHandler) {
    var me = this;
    new mxXmlRequest(SAVE_URL + '/saveInstanceFile', this.genQueryStrFromObj(paramObj, false),'POST',true).send(function(mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if(message.success){
            resHandler(message);
        } else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};
/*Communication.prototype.syncChanges = function (title, change, next) {
 if (title === 'geometryChange') {
 appSocket.emit(title, change);
 }
 };*/
/**
 * send to processEngine
 */
Communication.prototype.parseSequence = function (next) {
    new mxXmlRequest('/parseSequence', '', 'POST', true).send(function (req) {
        next(req.request.response);
    });
};
/*Communication.prototype.getStartFigure = function (xml,next) {
 new mxXmlRequest('/getStartFigure', 'xml=' + xml , 'POST', true).send(function (req) {
 next(req.request.response);
 });
 };
 Communication.prototype.getNextFigure = function (id,next) {
 var id={id:id};
 var idJSONStr=JSON.stringify(id);
 new mxXmlRequest('/getNextFigure', 'id=' + idJSONStr, 'POST', true).send(function (req) {
 next(req.request.response);
 });

 };*/
Communication.prototype.getAllTopProcess = function (resHandler) {
    new mxXmlRequest(Load_URL + '/loadAllTopProcess', null, 'GET', true).send(function (mxXmlRequest) {
        //console.log(mxXmlRequest);
        var message = mxXmlRequest.getJsonData();
        //console.log(message);
        if (message.success) {
            var data = message.data;
            resHandler(data);
        } else {

        }
    });
};
Communication.prototype.sendAllTopProcess = function (data) {
    appSocket.emit('sendAllTopProcess', data);
};
Communication.prototype.getStartFigure = function (fileId) {
    //console.log(file);
    var data = {
        role:{role:'市场部发言人'},
        count:1,
        fileId: fileId,
        userKey: '123'
    };
    this.socket.emit('getStartFigures', data);
};
Communication.prototype.getNextFigure = function (ids) {
    this.socket.emit('getNextFigures', ids);
};
Communication.prototype.endAllStep = function (processId) {
    this.socket.emit('endAllStep',processId);
};
Communication.prototype.endMe = function (ids) {
    //console.log(ids);
    this.socket.emit('endMe', ids);
};
Communication.prototype.loadAllUsers = function (handleRes) {
    new mxXmlRequest('/load/allusers', null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            //console.log(message);
            if (handleRes) {
                handleRes(message.data);
            }
        }
    });
};
Communication.prototype.updateProcessIsTopProcess = function (saveObj, value, handleRes) {
    var _comm = this;
    var fileId = saveObj.fileId;
    var fileType = saveObj.fileType;
    new mxXmlRequest('/file/metaData?fileId=' + fileId + '&isTopProcess=' + value +'&fileType=' + fileType, null, 'PUT', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            //console.log(message);
            if (handleRes) {
                handleRes(message.data);
            }
        } else {
            _comm.showErrMsgWin(message.msg);
        }
    });
};


Communication.prototype.removeFileCmc = function (queryObj, handleRes) {
    //var me = this;
    //console.log("queryObj: "+this.genQueryStrFromObj(queryObj));
    new mxXmlRequest(REMOVE_URL + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            //console.log(message);
            if (handleRes) {
                handleRes();
            }
        }
    });
};

Communication.prototype.removeAllFileCmc = function (queryObj, handleRes) {
    var me = this;
    //console.log("queryObj: "+this.genQueryStrFromObj(queryObj));
    new mxXmlRequest(REMOVE_ALL_URL, this.genQueryStrFromObjs(queryObj, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        } else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};

Communication.prototype.restoreAllFileCmc = function (queryObj, handleRes) {
    var me = this;
    new mxXmlRequest(RESTORE_ALL_URL, this.genQueryStrFromObjs(queryObj, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        }else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};

/**
 * trashFile by Eamonn
 */
Communication.prototype.trashFileCmc = function (queryObj, handleRes) {
    var me = this;
    new mxXmlRequest(TRASH_URL + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            //console.log(message);
            if (handleRes) {
                handleRes();
            }
        }else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};



Communication.prototype.renameLR = function (updateObj, handleRes) {
    var queryObj = {
        "updateObj" : JSON.stringify(updateObj)
    };
    new mxXmlRequest('/LR/updateLR', this.genQueryStrFromObj(queryObj, false), null, 'POST', true).send(function (mxXmlRequest) {
        var graphModel = mxXmlRequest.getJsonData();
        if (handleRes) {
            handleRes(graphModel);
        }
    });
};
/**
 * Batch Remove resource files
 * By adamm
 * */
Communication.prototype.delAllResFileCmc = function(queryObj,handleRes) {
    for(var i = 0;i < queryObj.length;i ++) {
        new mxXmlRequest(REMOVE_URL + '/deleteLR' + this.genQueryStrFromObj(queryObj[i]), null, 'GET', true).send(function (mxXmlRequest) {
            var message = mxXmlRequest.getJsonData();
            if (message.success) {
                if (handleRes) {
                    handleRes();
                }
            }
        });
    }
};

/**
 * load all trashed Files
 * @param resHandler
 */
Communication.prototype.loadTrashedInstOfProcess = function (paramObj, resHandler) {
    new mxXmlRequest(Load_URL + '/loadTrashedInstOfProcess' + this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message);
    });
};
/**
 *  restore trash file
 * @param queryObj
 * @param handleRes
 */

Communication.prototype.trashToNormalCmc = function (queryObj, handleRes) {
    var me = this;
    new mxXmlRequest(TRASH_TO_NORMAL + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        }else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};

/**
 * Batch Remove
 * @param queryObj
 * @param handleRes
 */

Communication.prototype.trashAllFileCmc = function (queryObj, handleRes) {
    var me = this;
    var url;
    //看上去不会出现url为/allInstanceToTrash 的情况
    if (queryObj.isInstance) {
        url = '/allInstanceToTrash';
    } else {
        url = ALL_TO_TRASH_URL;
    }
    new mxXmlRequest(ALL_TO_TRASH_URL, this.genQueryStrFromObjs(queryObj, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success){
            if (handleRes) {
                handleRes();
            }
        }else if (message.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};

/**
 * rename by Eamonn
 */
Communication.prototype.renameFileCmc = function (queryObj, handleRes) {
    console.log("queryObj: " + this.genQueryStrFromObj(queryObj));
    var me = this;
    var url;
    if (queryObj.isInstance) {
        url = '/renameInstance';
    } else {
        url = RENAME_URL;
    }
    new mxXmlRequest(url + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
        var graphModel = mxXmlRequest.getJsonData();
        if (graphModel.success){
            if (handleRes) {
                handleRes(graphModel);
            }
        }else if (graphModel.msg === 'no_session'){
            me.handleNoSession();
        }
    });
};
Communication.prototype.showErrMsgWin = function (message) {
    if (this.errMsgWin) {
        // todo new method: setMessage
        this.errMsgWin.setMessage(message);
    } else {
        //alert(message);
        this.editorUi.showDialog(new tipDialogBody(this.editorUi, message), 300, null, true, true);
    }
};
/**
 * materials
 */
/*
 path: http://localhost:8080/ec_engine/fileManager/getOwnFiles
 //参数不是必须，根据需要
 params: {userId: "", fileId: "", fileName: "", startTime: "", endTime: ""}

 response: JSONArray:[
 {"fileName":"upload.html","fileSize":"2KB",

 "filePath":"zhangll\\own\\2017-02\\static\\ea2de577-c885-430f-be21-9974c4d1535b.html",

 "createType":"own","fileType":"html",

 "fileId":"ea2de577-c885-430f-be21-9974c4d1535b"}
 ]*/
Communication.prototype.loadAllLearningRes = function (resHandler) {
    var paramObj = {
        userId: userId
    };
    /*var resData = [{
        "fileId":"ea2de577-c885-430f-be21-9974c4d1535b",
        "fileName":"upload.html",
        "fileSize":"2KB",
        "filePath":"zhangll\\own\\2017-02\\static\\ea2de577-c885-430f-be21-9974c4d1535b.html",
        "createType":"own",
        "fileType":"html",
        "createTime":'2017-02-01',
        "lastModify":'2017-02-01'
    }];
    for (var i = 0; i < resData.length; i++){
        resData[i].createTime = new Date(resData[i].createTime);
        resData[i].lastModify = new Date((resData[i].lastModify)?(resData[i].lastModify):(resData[i].createTime));
        resData[i].ownerId = userId;
    }
    resHandler(resData);*/
    new mxXmlRequest(MATERIAL_URL + '/getOwnFiles'+ this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var resData = mxXmlRequest.getJsonData();
        console.log(resData);
        for (var i = 0; i < resData.length; i++){
            resData[i].materialsId = resData[i].fileId;
            resData[i].ownerId = userId;
            resData[i].createTime = new Date(resData[i].createTime);
            resData[i].lastModify = new Date((resData[i].lastModify)?(resData[i].lastModify):(resData[i].createTime));
        }
        resHandler(resData);
    });
};
//Communication.prototype.loadAllLearningRes = function (resHandler) {
//    new mxXmlRequest(Load_URL + '/loadAllLearningRes', null, 'GET', true).send(function (mxXmlRequest) {
//        var message = mxXmlRequest.getJsonData();
//        console.log(message);
//        resHandler(message);
//    });
//};
Communication.prototype.loadAllRichTextsModel = function (resHandler) {
    //new mxXmlRequest(Load_URL + '/loadAllRichTextRes', null, 'GET', true).send(function (mxXmlRequest) {
    //    var message = mxXmlRequest.getJsonData();
    //    console.log(message);
    //    resHandler(message);
    //});
    var paramObj = {
        userId: userId,
        fileType: 'html'
    };
    new mxXmlRequest(MATERIAL_URL + '/getOwnFiles'+ this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var resData = mxXmlRequest.getJsonData();
        console.log(resData);
        var richTextArr = [];
        for (var i = 0; i < resData.length; i++){
            if (resData[i].fileType =='html' || resData[i].fileType =='txt'){
                resData[i].materialsId = resData[i].fileId;
                resData[i].createTime = new Date(resData[i].createTime);
                resData[i].lastModify = new Date((resData[i].lastModify)?(resData[i].lastModify):(resData[i].createTime));
                richTextArr.push(resData[i]);
            }}
        resHandler(richTextArr);
    });
};
Communication.prototype.getOfficeFilePath = function (paramObj, next) {
    $.get(MATERIAL_URL + '/getOwnFiles'+ this.genQueryStrFromObj(paramObj), function (res) {
        if (res){
            var resData = JSON.parse(res);
            if (next) next(resData[0]);
            //todo 测试失败时返回啥
        }
    })
};
Communication.prototype.deleteLR = function (paramObj, handleRes) {
    /* v2.1_20170301
     new mxXmlRequest(REMOVE_URL + '/deleteLR' + this.genQueryStrFromObj(queryObj), null, 'GET', true).send(function (mxXmlRequest) {
     var message = mxXmlRequest.getJsonData();
     if (message.success) {

     if (handleRes) {
     handleRes();
     }
     }
     });*/
    var me = this;
    new mxXmlRequest(MATERIAL_URL + '/fileDelete'+ this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var resData = mxXmlRequest.getJsonData();
        console.log(resData);
        if (resData.isSucess) {
            if (handleRes) {
                handleRes();
            }
        }else {
            me.editorUi.showDialog(new tipDialogBody(me.editorUi, resData.msg, 'left'), 300, null, true, false);
        }
    });
};
/**
 * Extention
 */
mxXmlRequest.prototype.getJsonData = function () {
    return JSON.parse(this.getText());
};



Communication.prototype.loadAllUserBoard = function (resHandler) {
    new mxXmlRequest(Load_URL + '/loadAllUserBoard', null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message);
    });
};
/*
 // by Eamon
 Communication.prototype.loadAllRichTextsModel = function (paramObj,resHandler) {
 new mxXmlRequest(Load_URL + '/loadAllRichTextsModel'+this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
 var message = mxXmlRequest.getJsonData();
 console.log(message);
 resHandler(message);
 });
 };
 */

Communication.prototype.loadRichTextsModel = function (paramObj,resHandler) {
    new mxXmlRequest(Load_URL + '/loadRichTextsModel'+this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        console.log('aaaaa');
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message.data);
    });
};

Communication.prototype.searchLearningRes = function (query, resHandler) {
    new mxXmlRequest(Load_URL + '/searchLearningRes' + this.genQueryStrFromObj(query), null, 'GET', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        resHandler(message);
    });

};
Communication.prototype.loadChatHistory = function (queryObj, handleRes) {
    new mxXmlRequest(Load_URL + '/loadChatHistory' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message) {
            handleRes(message);
        } else {

        }
    })

};
/*
 Communication.prototype.saveLearningRes = function (query, resHandler) {
 new mxXmlRequest(Load_URL + '/saveLearningRes' + this.genQueryStrFromObj(query), null, 'GET', true).send(function (mxXmlRequest) {
 var message = mxXmlRequest;
 console.log(message);
 resHandler(message);
 });

 };
 */
Communication.prototype.saveLearningRes = function (query, resHandler) {
    new mxXmlRequest(SAVE_URL + '/saveLearningRes' , this.genQueryStrFromObj(query, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest;
        console.log(message);
        resHandler(message);
    });

};

Communication.prototype.saveUploadFile = function (query, resHandler) {
    new mxXmlRequest(SAVE_URL + '/saveUploadFile' , this.genQueryStrFromObj(query, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest;
        console.log(message);
        resHandler(message);
    });
};

Communication.prototype.deleteUploadFile = function (query, resHandler) {
    new mxXmlRequest(REMOVE_URL + '/deleteUploadFile' , this.genQueryStrFromObj(query, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest;
        console.log(message);
        resHandler(message);
    });
};

Communication.prototype.saveRichTextareaModel = function (query, resHandler) {
    new mxXmlRequest(SAVE_URL + '/saveRichTextareaModel' , this.genQueryStrFromObj(query, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if(message.success){
            resHandler(message.obj);
        }
    });
};

Communication.prototype.deleteRichTextareaModel = function (query, resHandler) {
    new mxXmlRequest(REMOVE_URL + '/deleteRichTextareaModel' , this.genQueryStrFromObj(query, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if(message.success){
            resHandler(message);
        }
    });
};

Communication.prototype.getvideoRes = function(queryObj,handleRes) {
    new mxXmlRequest('/load/getVideoRes' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (handleRes) {
            handleRes(message);
        }
    })
};

Communication.prototype.saveVideoRes = function (queryObj, handleRes) {
    new mxXmlRequest(SAVE_URL + '/saveVideoRes', this.genQueryStrFromObjs(queryObj, false), null, 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        }
    })
};
Communication.prototype.savePdfToOC = function (queryObj, handleRes) {
    new mxXmlRequest('/savePdfToOC', this.genQueryStrFromObj(queryObj, false), 'POST', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    });
};

Communication.prototype.loadAllUserOfBoard = function (queryObj, handleRes) {
    new mxXmlRequest('/load/loadAllUserOfBoard' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.removeAllUserOfBoard = function (queryObj, handleRes) {
    new mxXmlRequest('/remove/removeAllUserOfBoard' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.saveBoardUsers = function (queryObj, handleRes) {
    new mxXmlRequest('/save/saveBoardUsers' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.deleteBoardUsers = function (queryObj, handleRes) {
    new mxXmlRequest('/remove/deleteBoardUsers' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.changeBoardUserType = function (queryObj, handleRes) {
    new mxXmlRequest('/update/changeBoardUserType' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.loadBoardUserInfo = function (boardId, userId, handleRes) {
    var queryObj = {
        boardId: boardId,
        userId: userId
    };
    this.sendGetRequest('/load/loadBoardUserInfo', queryObj, handleRes);
};
Communication.prototype.getVMTypes = function (handleRes) {
    new mxXmlRequest('/load/getVMTypes', null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        } else {
            handleRes();
        }
    })
};
Communication.prototype.saveTaskComment = function (queryObj, handleRes) {
    new mxXmlRequest('/save/saveTaskComment' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.loadTaskComment = function (queryObj, handleRes) {
    new mxXmlRequest('/load/loadTaskComment' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
Communication.prototype.removeTaskComment = function (queryObj, handleRes) {
    new mxXmlRequest('/remove/removeTaskComment' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        }
    })
};
Communication.prototype.removeCommentsOfTask = function (queryObj, handleRes) {
    new mxXmlRequest('/remove/removeCommentsOfTask' + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        console.log(message);
        if (message.success) {
            if (handleRes) {
                handleRes();
            }
        }
    })
};
Communication.prototype.loadAllForm = function (resHandler) {
    var paramObj = {
        userId: userId
    };
    //var resData = [{"formId":"7cf099c9-9e6c-4cfe-ac6d-9cb138120d7b","formName":"ofo单车报损统计","description":"针对ofo单车的损坏情况进行统计的表单。","userId":"zhangll","userName":null,"formStatus":"0","formHtml":"<link href=\"http://localhost:8080/ec_engine/css/bootstrap.min.css\" rel=\"stylesheet\" type=\"text/css\" /><div id=\"form_7cf099c9-9e6c-4cfe-ac6d-9cb138120d7b\"><div id=\"form-header\"><div class=\"form-group\" align=\"center\" style=\"margin-bottom:20px;\"><span style=\"font-size:20px;\" form-id=\"7cf099c9-9e6c-4cfe-ac6d-9cb138120d7b\"><strong>ofo单车报损统计</strong></span></div></div><div id=\"form-body\"><div class=\"form-group\"><label for=\"3aaae0f4-a454-4bb2-b089-80fa37c9a58d\">编号：</label><input type=\"text\" class=\"form-control form-attr attr-required\" name=\"formCid\" id=\"3aaae0f4-a454-4bb2-b089-80fa37c9a58d\" data-label=\"编号\" value=\"\" placeholder=\"请输入编号\"></div><div class=\"form-group\"><label for=\"f6973992-9c54-449a-b63e-8a522aa58f03\">地点：</label><input type=\"text\" class=\"form-control form-attr attr-required\" name=\"place\" id=\"f6973992-9c54-449a-b63e-8a522aa58f03\" data-label=\"地点\" value=\"\" placeholder=\"请输入地点\"></div><div class=\"form-group\"><label for=\"4320062a-10ab-41c4-b25f-89a4dacfcc6e\">单车数量：</label><input type=\"text\" class=\"form-control form-attr attr-required\" name=\"num\" id=\"4320062a-10ab-41c4-b25f-89a4dacfcc6e\" data-label=\"单车数量\" value=\"\" placeholder=\"请输入单车数量\"></div><div class=\"form-group\"><label for=\"9ac6009b-abe6-4793-931e-7be4d7faca86\">损坏程度：</label><select class=\"form-control form-attr\" name=\"level\" id=\"9ac6009b-abe6-4793-931e-7be4d7faca86\" data-label=\"损坏程度\"><option value=\"\">---请选择---</option><option value=\"optionValue_0\" selected=\"\">较轻</option><option value=\"optionValue_1\">一般</option><option value=\"optionValue_2\">严重</option></select></div><div class=\"form-group\"><label for=\"2aa1e40c-8734-4041-b748-5fc4f2625114\">上报人：</label><input type=\"text\" class=\"form-control form-attr attr-required\" name=\"assignee\" id=\"2aa1e40c-8734-4041-b748-5fc4f2625114\" data-label=\"上报人\" value=\"\" placeholder=\"请输入上报人\"></div><div class=\"form-group\"><label for=\"a0deb4f0-f461-4803-9d65-139d9ff036eb\">上报日期：</label><input type=\"text\" class=\"form-control form-attr attr-required\" name=\"reportDate\" id=\"a0deb4f0-f461-4803-9d65-139d9ff036eb\" data-label=\"上报日期\" value=\"\" placeholder=\"请输入上报日期\"></div></div></div><script src=\"http://localhost:8080/ec_engine/js/jquery.min.js\" type=\"text/javascript\"></script><script src=\"http://localhost:8080/ec_engine/js/underscore.js\" type=\"text/javascript\"></script><script src=\"http://localhost:8080/ec_engine/js/backbone.js\" type=\"text/javascript\"></script><script src=\"http://localhost:8080/ec_engine/my_js/parseFormAttrs.js\" type=\"text/javascript\"></script><script src=\"http://localhost:8080/ec_engine/my_js/form.player.js\" type=\"text/javascript\"></script>","formXml":"","createTime":"2017-05-03 16:01:56","lastUpdateTime":"2017-05-05 09:46:38"},{"formId":"8ad1e426-b3da-47c0-9ff0-c3e4d6828d3b","formName":"测试表单123","description":"近日，习近平作出重要指示，要求广大党员、干部要向廖俊波同志学习，不忘初心、扎实工作、廉洁奉公，身体力行把党的方针政策落实到基层和群众中去，真心实意为人民造福。习近平称廖俊波以实际行动体现了对党忠诚、心系群众、忘我工作、无私奉献的优秀品质，无愧于“全国优秀县委书记”的称号。","userId":"zhangll","userName":null,"formStatus":"0","formHtml":"<div class=\"my-form\"><div class=\"form-group\" align=\"center\" style=\"margin-bottom:20px;\"><span style=\"font-size:20px;\" form-id=\"8ad1e426-b3da-47c0-9ff0-c3e4d6828d3b\"><strong>测试表单123</strong></span></div><div class=\"form-group\"><label for=\"059e4498-f685-489b-8a58-8910114cb26f\">损坏程度：</label><select class=\"form-control form-attr\" name=\"[object HTMLInputElement]\" id=\"059e4498-f685-489b-8a58-8910114cb26f\"><option value=\"\">---请选择---</option><option value=\"optionValue_0\">不严重</option><option value=\"optionValue_1\">一般</option><option value=\"optionValue_2\">严重</option><option value=\"optionValue_3\" selected=\"\">超级严重</option></select></div></div>","formXml":"","createTime":"2017-04-27 16:23:49","lastUpdateTime":"2017-04-27 18:07:29"}]
    new mxXmlRequest(MATERIAL_FORM_URL + '/getFormList'+ this.genQueryStrFromObj(paramObj), null, 'GET', true).send(function (mxXmlRequest) {
        var resData = mxXmlRequest.getJsonData();
        console.log(resData);
    var formArr = [];
    for (var i = 0; i < resData.length; i++){
        if (resData[i].formId){
            resData[i].fileName = resData[i].formName;
            resData[i].createTime = new Date(resData[i].createTime);
            resData[i].lastModify = new Date((resData[i].lastUpdateTime)?(resData[i].lastUpdateTime):(resData[i].createTime));
            formArr.push(resData[i]);
        }}
    resHandler(formArr);

    //    resHandler(resData);
    });
};
Communication.prototype.sendGetRequest = function (url, queryObj, handleRes) {
    new mxXmlRequest(url + this.genQueryStrFromObj(queryObj), null, 'get', true).send(function (mxXmlRequest) {
        var message = mxXmlRequest.getJsonData();
        if (message.success) {
            if (handleRes) {
                handleRes(message.data);
            }
        }
    })
};
var syncChanges = function (title, change, next) {
    var id = change.id;
    console.log(currHandleId);
    if (currHandleId.length > 0) {
        var isControlled=0;
        for (var i = 0; i < currHandleId.length; i++) {
            if (currHandleId[i] === id) {
                isControlled=1;
                break;
            }
        }
        if(isControlled===0){
            if(title==='addNew'){
                console.log(change);
                appSocket.emit(title,change);
            }
            if (title === 'geometryChange') {
                console.log(change.id);
                console.log(currHandleId);
                //meHandle = change.id;
                meHandle.push(change.id);
                appSocket.emit(title, change);
            }
            if (title === 'removeCell') {
                meHandle.push(change.id);
                appSocket.emit(title, change);
            }
            if(title === 'changeLabel') {
                meHandle.push(change.id);
                appSocket.emit(title, change);
            }
            if(title==='changeParent'){
                console.log(change);
                appSocket.emit(title,change);
            }
        }else{
            console.log('someone is controlling');

        }
    } else {
        if(title==='addNew'){
            console.log(change);
            appSocket.emit(title,change);
        }
        if (title === 'geometryChange') {
            console.log(change.id);
            //meHandle = change.id;
            meHandle.push(change.id);
            appSocket.emit(title, change);
        }
        if (title === 'removeCell') {
            meHandle.push(change.id);
            appSocket.emit(title, change);
        }
        if(title === 'changeLabel') {
            meHandle.push(change.id);
            appSocket.emit(title, change);
        }
        if(title==='changeParent'){
            console.log(change);
            appSocket.emit(title,change);
        }
    }
};
var sendMsg = function(title,msgData){
    if(title === 'sendMessage'){
        appSocket.emit('sendMessage',msgData);
    }
};
var currSelection = function (currentSelection) {
    //console.log(currentSelection);
    if (currentSelection!=='false') {
        var id = currentSelection.id;
        for(var i=0;i<meHandle.length;i++){
            if (meHandle[i] !== id) {
                appSocket.emit('removeId', meHandle[i]);
            } else {

            }
        }

    } else {
        for(var i=0;i<meHandle.length;i++){
            appSocket.emit('removeId', meHandle[i]);
        }

    }

    /*var room = urlParams['ch'];
     var data = {
     id: id,
     room: room
     };
     appSocket.emit('currentHandleId', data);*/
};

