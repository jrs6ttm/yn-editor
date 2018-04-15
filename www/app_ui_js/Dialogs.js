/**
 * Constructs a new dialog.
 */
function Dialog(editorUi, dialogBody, width, height, modal,closable, onClose) {
    this.isCancel = true;
    this.editorUi = editorUi;
    this.dialogEl = editorUi.createDiv('geDialog unselectable');
    if (dialogBody) {
        this.id = dialogBody.id;
        this.title = dialogBody.getTitle();

        this.dialogBody = dialogBody;
        this.isCloseRichEditor = this.dialogBody.isCloseRichEditor;
    }

    this.fitCompatibility();

    this.incZIndex();
    this.setWidth(width);
    this.setHeight(height);

    this.dialogEl.style.zIndex = this.zIndex;
    if (this.title) {
        var titleEl = document.createElement('div');
        titleEl.style.marginTop = '-24px';
        titleEl.style.padding = '0px 10px 5px 2px';
        titleEl.style.fontSize = '14px';
        titleEl.style.fontWeight = 'bold';
        titleEl.innerHTML = this.title;
        this.dialogEl.appendChild(titleEl);
    }

    if (this.bg == null) {
        this.bg = editorUi.createDiv('background');
        //this.bg.setAttribute('style','pointer-events:none');
        this.bg.style.position = 'absolute';
        this.bg.style.background = 'white';
        this.bg.style.left = '0px';
        this.bg.style.top = '0px';
        this.bg.style.bottom = '0px';
        this.bg.style.right = '0px';
        this.bg.style.zIndex = this.zIndex - 2;
        mxUtils.setOpacity(this.bg, this.bgOpacity);
        if (mxClient.IS_QUIRKS) {
            new mxDivResizer(this.bg);
        }
    }

    if (modal) {
        document.body.appendChild(this.bg);
    }

    if (dialogBody) {
        this.dialogEl.appendChild(dialogBody.getBodyContainer());
        mxEvent.addListener(dialogBody.getBodyContainer(), 'click', mxUtils.bind(this, function (evt) {
            this.clearContextMenu();
        }));
    }

    document.body.appendChild(this.dialogEl);
    mxEvent.addListener(this.dialogEl, 'click', mxUtils.bind(this, function (evt) {
        this.clearContextMenu();
    }));
    this.createCloseIcon(closable);

    this.setOffset();
    this.onDialogClose = onClose;
    this.container = this.dialogEl;


    dialogBody.fireEvent(new mxEventObject('onRendered'), {innerHeight: this.height});
    editorUi.editor.fireEvent(new mxEventObject('showDialog'));
}

/**
 *
 */
Dialog.prototype.zIndex = mxPopupMenu.prototype.zIndex - 1;

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.bgOpacity = 80;


Dialog.prototype.fitCompatibility = function () {
    this.dx = 0;
    if (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) {
        // Adds padding as a workaround for box model in older IE versions
        // This needs to match the total padding of geDialog in CSS
        this.dx = 80;
    }

};
Dialog.prototype.getDx = function () {
    return this.dx;
};

Dialog.prototype.setTopOffset = function (top) {
    this.topOffset = top;
    this.dialogEl.style.top = this.topOffset + 'px';
};
Dialog.prototype.getTopOffset = function () {
    return this.topOffset;
};
Dialog.prototype.setLeftOffset = function (left) {
    this.leftOffset = left;
    this.dialogEl.style.left = this.leftOffset + 'px';
};
Dialog.prototype.getLeftOffset = function () {
    return this.leftOffset;
};
Dialog.prototype.setHeight = function (height) {
    if(height){
        if (height > 40) {
            this.height = height;
        } else if( height < 0){
            this.height = window.innerHeight - 52;
            this.isMaxHeight = true;
        }
        this.dialogEl.style.height = this.height + 'px';
    }

};
Dialog.prototype.setWidth = function (width) {
    if(width){
        if (width > 100) {
            this.width = width
        } else if(width < 0){
            this.width = window.innerWidth -28;
            this.isMaxWidth = true;

        } else {
            this.width = 100;
        }
        this.dialogEl.style.width = this.width + 'px';
    }


};
Dialog.prototype.getWidth = function () {
    return this.width;
};
Dialog.prototype.incZIndex = function () {
    // Increments zIndex to put subdialogs and background over existing dialogs and background
    if (this.editorUi.dialogs.length > 0) {
        this.zIndex += this.editorUi.dialogs.length * 2;
    }
};
Dialog.prototype.caluDialogHeight = function () {
    if (this.height) {
        return this.height;
    } else {
        return this.dialogEl.offsetHeight;
    }
};
Dialog.prototype.setOffset = function () {
    if(this.isMaxWidth){
        this.setLeftOffset(8);
    }else{
        this.setLeftOffset((Math.max(0, Math.round((document.body.scrollWidth - this.getWidth()) / 2)))-5);

    }
    if(this.isMaxHeight){
        this.setTopOffset(8)
    }else{
        this.setTopOffset(Math.max(0, Math.round((Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - this.caluDialogHeight() + this.getDx()) / 2.5)));

    }

};

Dialog.prototype.createCloseIcon = function (closable) {
    if (closable) {
        var img = document.createElement('img');

        img.setAttribute('src', IMAGE_PATH + '/close.png');
        img.setAttribute('title', mxResources.get('close'));
        img.className = 'geDialogClose';
        img.style.top = 10 + 'px';
        img.style.left = this.getWidth() - 10 + 'px';
        //img.style.zIndex = this.zIndex;

        this.dialogEl.appendChild(img);
        this.dialogImg = img;

        mxEvent.addListener(img, 'click', mxUtils.bind(this, function () {
            //this.editorUi.isTrashSelected=false;
            this.editorUi.hideDialog();
        }));
        mxEvent.addListener(this.bg, 'click', mxUtils.bind(this, function () {
            //this.editorUi.isTrashSelected=false;
            this.editorUi.hideDialog();
        }));
    }
};

/**
 * 创建最大化按钮 by fanmiaomiao
 */
/*
 Dialog.prototype.createMaxIcon = function(maxable){
 if(maxable){
 var img1 = document.createElement('img');

 img1.setAttribute('src',IMAGE_PATH + '/maximum.png');
 img1.setAttribute('title',mxResources.get('maximum'));
 img1.className = 'geDialogMaximum';
 img1.style.top = 10 + 'px';
 img1.style.left = this.getWidth()- 25+ 'px';
 img1.style.zIndex = this.zIndex;

 this.dialogEl.appendChild(img1);
 this.dialogImg = img1;

 mxEvent.addListener(img1, 'click', mxUtils.bind(this, function () {

 }));
 }
 };
 */

/**
 * 创建还原事件 by fanmiaomiao
 */
//Dialog.prototy.createRestoreIcon = function (restore){
//    if(restore){}
//    var img = document.createElement('img');
//
//    img.setAttributr('src',IMAGE_PATH+'/restore.img');
//    img.setAttribute('title',mxResources.get('restoreState'));
//
//    img.style.top = 10 + 'px';
//    img.style.left = this.getWidth() - 10 + 'px';
//    img.style.zIndex = this.zIndex;
//
//    this.dialogEl.appendChild(img);
//    this.dialogImg = img;
//
//    mxEvent.addListener(img, 'click', mxUtils.bind(this, function () {
//
//        //this.editorUi.isTrashSelected=false;
//        //this.editorUi.hideDialog(true);
//
//    }));
//
//
//
//};

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.close = function () {
    if (this.onDialogClose != null) {
        this.onDialogClose(this.isCancel);
        this.onDialogClose = null;
    }

    if (this.dialogImg != null) {
        this.dialogImg.parentNode.removeChild(this.dialogImg);
        this.dialogImg = null;
    }

    if (this.bg != null && this.bg.parentNode != null) {
        this.bg.parentNode.removeChild(this.bg);
    }

    this.container.parentNode.removeChild(this.container);

    this.clearContextMenu();
    if(tinymce && this.isCloseRichEditor !== false){
        this.dialogBody.removeRichTextAreaInstance();
    }
};
/**
 * Auto remove context menu
 */
Dialog.prototype.clearContextMenu = function () {
    if (this.dialogBody) {
        this.dialogBody.clearContextMenu();
    }
};
Dialog.prototype.getDialogBody = function(){
    return this.dialogBody;
};
/**
 * Constructs a new dialog body.
 */
var DialogBody = function (title, editorUi) {
    mxEventSource.call(this);
    this.editorUi = editorUi;
    this.richTextAreaInstances = [];
    this.bodyContainer = document.createElement('div');
    this.bodyContainer.setAttribute('class', 'dialogBody');
    this.bodyContainer.setAttribute('style', 'border: solid 1px #C5C5C5;overflow:hidden;font-family: "Hiragino Sans GB",  "宋体", 宋体, Tahoma, Helvetica, STHeiti');
    this.setTitle(title);
};
mxUtils.extend(DialogBody, mxEventSource);

DialogBody.prototype.getBodyContainer = function () {
    return this.bodyContainer;
};
DialogBody.prototype.regRichTextAreaInstance = function (instanceId) {
    this.richTextAreaInstances.push(instanceId);
};
DialogBody.prototype.removeRichTextAreaInstance = function () {
    for(var i = 0; i < this.richTextAreaInstances.length; i++){
        tinymce.remove('#'+  this.richTextAreaInstances.pop());
    }
};

DialogBody.prototype.setTitle = function (title) {
    this.title = title;
};

DialogBody.prototype.getTitle = function () {
    return this.title;
};
/**
 * Adds a handler of showing context menu for file element.
 */
DialogBody.prototype.addMenuHandler = function (elt, funct) {
    if (funct != null) {
        var show = true;
        var clickHandler = mxUtils.bind(this, function (evt) {
            if (show && elt.enabled == null || elt.enabled) {
                this.editorUi.editor.graph.popupMenuHandler.hideMenu();
                var menu = new mxPopupMenu(funct);
                menu.div.className += ' geMenubarMenu';
                menu.smartSeparators = true;
                menu.showDisabled = true;
                menu.autoExpand = true;

                // Disables autoexpand and destroys menu when hidden
                menu.hideMenu = mxUtils.bind(this, function () {
                    mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
                    menu.destroy();
                    this.currentMenu = null;
                    this.currentElt = null;
                });

                var offset = mxUtils.getOffset(elt);
                menu.popup(evt.x, evt.y, null, evt);
                this.currentMenu = menu;
                this.currentElt = elt;
            }

            mxEvent.consume(evt);
        });

        mxEvent.addListener(elt, 'contextmenu', mxUtils.bind(this, function (evt) {
            if (this.currentMenu != null) {
                this.currentMenu.hideMenu();
            }
            clickHandler(evt);
            show = true;
        }));
    }
};
/**
 * Auto remove context menu
 */
DialogBody.prototype.clearContextMenu = function () {
    if (this.currentMenu) {
        this.currentMenu.hideMenu();
    }
};
/**
 * Constructs a new open dialog.
 */
var ImportDialogBody = function (title) {
    DialogBody.call(this, title);
    var container = this.getBodyContainer();
    var iframe = document.createElement('iframe');
    iframe.style.backgroundColor = 'transparent';
    iframe.allowTransparency = 'true';
    iframe.style.borderStyle = 'none';
    iframe.style.borderWidth = '0px';
    iframe.style.overflow = 'hidden';
    iframe.frameBorder = '0';

    // Adds padding as a workaround for box model in older IE versions
    var dx = (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) ? 20 : 0;

    iframe.setAttribute('width', (320 + dx) + 'px');
    iframe.setAttribute('height', (220 + dx) + 'px');
    iframe.setAttribute('src', OPEN_FORM);
    container.appendChild(iframe);
    this.container = container;
};
mxUtils.extend(ImportDialogBody, DialogBody);

/**
 *
 * @param holderDialogBody
 * @param fileEntity: contain: 'fileName','lastModify','createTime',['description']
 * @param viewType
 * @param entityType: 'resource','course_design'
 * @constructor
 */
var FileEntityBox = function (holderDialogBody, fileEntity, viewType, entityType) {
    this.entityType = entityType;
    this.isToShow = true;
    this.holderDialogBody = holderDialogBody;
    this.gFileId = fileEntity.gFileId;
    this.taskFileId = fileEntity.taskFileId;
    this.viewType = viewType;
    this.isShared = fileEntity.isShared;
    this.isPublished = fileEntity.isPublished;
    this.fileInfoDiv = this.createFileInfoDiv(fileEntity);
    this.setIsSelected(fileEntity.isSelected);

    this.isInstance = (this.entityType==='sub_course')? true:false;
    this.chatHistory = (fileEntity.chatHistory)?fileEntity.chatHistory:null;

    this.sourceF = fileEntity.sourceF;
    this.transformF = fileEntity.transformF;
    this.materialsId = fileEntity.materialsId;
    this.ownerId = fileEntity.ownerId;
    this.toUser= fileEntity.toUser;
    this.description= fileEntity.description;
    this.fileType= fileEntity.fileType;
    this.isCreated= fileEntity.isCreated;
    this.usageType= fileEntity.usageType;
    this.processId= fileEntity.processId;

    if ((fileEntity.fileType === 'course_design')) {
        this.gFileId = fileEntity.gFileId;
        this.fileType= fileEntity.fileType;
        this.isPublished = fileEntity.isPublished;
    }else if (entityType === 'resource' || entityType === 'textArea'){
        this.materialsId = fileEntity.materialsId;
        this.fileName = fileEntity.fileName;
        this.fileType= fileEntity.fileType;
        this.filePath = fileEntity.filePath;
        this.createTime= fileEntity.createTime;
        this.lastModify= fileEntity.lastModify;
        this.fileSize= fileEntity.fileSize;
        this.createType= fileEntity.createType;
        this.ownerId = fileEntity.ownerId;
    }else if (entityType === 'form'){
        this.formId = fileEntity.formId;
        this.fileName = fileEntity.fileName;
        this.description= fileEntity.description;
        this.formStatus = fileEntity.formStatus;
        this.formHtml = fileEntity.formHtml;
        this.formXml = fileEntity.formXml;
        this.createTime= fileEntity.createTime;
        this.lastModify= fileEntity.lastModify;
        this.fileType= 'form';
        this.ownerId= userId;
    }

    this.getContainerEl().onclick = mxUtils.bind(this, function () {
        this.holderDialogBody.unSelectAllFileEntity();
        //okButton
        if(!this.holderDialogBody.trashConfig.back){
            this.holderDialogBody.dialogFootOk.setAttribute('disabled','disabled');
        }else{
            this.holderDialogBody.okButtonClick();
        }
        if(!this.getIsSelected()){
            this.setIsSelected(true);
        }else{
            this.setIsSelected(false);
        }
    });

    this.getContainerEl().onmouseover = mxUtils.bind(this, function () {
        if (!this.getIsSelected()) {
            this.makeMOHighLight();
        }
    });

    this.getContainerEl().onmouseout = mxUtils.bind(this, function () {
        if (!this.getIsSelected()) {
            this.resetHighLight();
        }
    });

};
FileEntityBox.prototype.getEditorUi = function(){
    return this.holderDialogBody.editorUi;
};

FileEntityBox.prototype.setIsSelected = function (isSelected) {

    this.isSelected = isSelected;
    if (this.isSelected) {
        this.makeHighLight();
    } else {
        this.resetHighLight();

    }
};
FileEntityBox.prototype.getIsSelected = function () {
    return this.isSelected;
};
FileEntityBox.prototype.makeHighLight = function () {
    this.fileInfoDiv.style.background = '#CEECF5';
    this.fileInfoDiv.firstChild.style.whiteSpace = 'pre-wrap';
    this.fileInfoDiv.style.border = 'solid 1px #70c0e7';
};

FileEntityBox.prototype.makeMOHighLight = function () {
    this.fileInfoDiv.style.background = '#e5f3fb';
    this.fileInfoDiv.style.border = 'solid 1px #70c0e7';
};
FileEntityBox.prototype.makeAllSelectHighLight = function () {
    var fileEntityBoxList = this.holderDialogBody.getFileEntityBoxList();
    for (var i = 0; i < fileEntityBoxList.length; i++) {
        if (fileEntityBoxList[i].getIsSelected()) {
            fileEntityBoxList[i].makeHighLight();
        } else {
            fileEntityBoxList[i].resetHighLight();
        }
    }
};
FileEntityBox.prototype.resetHighLight = function () {
    this.fileInfoDiv.style.background = '';
    this.fileInfoDiv.firstChild.style.whiteSpace = 'nowrap';
    this.fileInfoDiv.style.border = 'solid 1px #FFF';
};


FileEntityBox.prototype.setIsToShow = function (isToShow) {
    this.isToShow = isToShow;
};

FileEntityBox.prototype.getIsToShow = function () {
    return this.isToShow;
};


FileEntityBox.prototype.removeMe = function () {
    //remove后将其标记设为false，不影响再次多选 eamonn
    this.setIsSelected(false);
    this.holderDialogBody.removeFileEntityBox(this);
    if(this.getFileId()===this.getEditorUi().editor.getFileId()){
        this.holderDialogBody.isNeedReloadApp = true;
    }
};

FileEntityBox.prototype.getFileEntity = function () {
    var fileEntityInfo = {};
    if (this.entityType === 'resource' || this.entityType === 'textArea'){
        fileEntityInfo = {
            "materialsId":this.materialsId,
            "fileName": this.fileName,
            "fileType": this.fileType,
            "filePath": this.filePath,
            "createTime": this.createTime,
            "lastModify": this.lastModify,
            "fileSize": this.fileSize,
            "createType": this.createType,
            "ownerId": this.ownerId
        };
    } else if (this.entityType === 'form'){
        fileEntityInfo = {
            "formId":this.formId,
            "fileName": this.fileName,
            "description": this.description,
            "formStatus": this.formStatus,
            "formHtml": this.formHtml,
            "formXml": this.formXml,
            "createTime": this.createTime,
            "lastModify": this.lastModify,
            "fileType": this.fileType,
            "ownerId": this.ownerId
        };
    } else {
        fileEntityInfo = {
            gFileId: this.gFileId,
            taskFileId: this.taskFileId,
            materialsId: this.materialsId,
            fileName: this.fileName,
            lastModify: this.lastModify,
            createTime: this.createTime,
            isInstance: this.isInstance,
            isSelected: this.isSelected,
            isShared: this.isShared,
            isPublished: this.isPublished,
            flag : this.flag,
            sourceF: this.sourceF,
            transformF: this.transformF,
            ownerId: this.ownerId,
            toUser: this.toUser,
            description: this.description,
            fileType: this.fileType,
            isCreated: this.isCreated,
            usageType: this.usageType,
            processId:this.processId
        };
    }
    return fileEntityInfo;

};

FileEntityBox.prototype.getFileId = function () {
    return this.gFileId;
};
FileEntityBox.prototype.setFileName = function (title) {
    if(typeof title == 'string'){
        this.fileName = title;
        if (this.fileSpan) {
            this.fileSpan.innerHTML = this.fileName;
            this.fileInfoDiv.setAttribute('title', mxResources.get('filename') + ': ' + this.fileName);
        }
    }else{
        this.fileName = title.fileName;
        if (this.fileSpan) {
            this.fileSpan.innerHTML = this.fileName;
            this.fileInfoDiv.setAttribute('title', mxResources.get('description') + ':' + title.description);
        }
    }
};
/* by fanmiaopmiao */
FileEntityBox.prototype.setFileFlag = function(flag){
    return this.flag = flag;
};

FileEntityBox.prototype.setModifyTime = function (date) {
    this.lastModify = date;
    this.modifyTime = new Date(date).toLocaleString();
    if (this.modifyTimeSpan) {
        this.modifyTimeSpan.innerHTML = this.modifyTime;
    }
};
FileEntityBox.prototype.setCreateTime = function(date){
    this.createTime = date;
    this.CreatedTime = new Date(date).toLocaleString();
    if(this.createTimeSpan){
        this.createTimeSpan.innerHTML = this.CreatedTime;
    }
};
FileEntityBox.prototype.getContainerEl = function () {
    return this.fileInfoDiv;
};
FileEntityBox.prototype.createFileSpan = function (fileName,num) {
    this.fileSpan = document.createElement('div');
    this.fileSpan.setAttribute('class', 'fileNameItem');
    if (this.viewType === 'titles') {
        this.fileSpan.setAttribute('style', 'font-size: 14px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;');
    } else if (this.viewType === 'details') {
        this.fileSpan.setAttribute('style', 'font-size: 14px;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;float:left;');
        this.fileSpan.style.width = num +'px';
    }
    this.setFileName(fileName);
    return this.fileSpan;
};
FileEntityBox.prototype.createfileSign = function (text) {
    this.fileSign = document.createElement('span');
    this.fileSign.innerHTML = text;
    if (this.viewType === 'titles') {
        this.fileSign.setAttribute('style', 'float: right;color: #1B4EA0;border: 1px solid;font-size: x-small;border-radius: 2px;');
    }
    return this.fileSign;
};

FileEntityBox.prototype.removefileSign = function () {
    this.fileSign.parentNode.removeChild(this.fileSign);
};
FileEntityBox.prototype.createModifyTimeSpan = function (date,num) {
    this.modifyTimeSpan = document.createElement('div');
    this.modifyTimeSpan.setAttribute('class', 'modifyTimeItem');
    if (this.viewType === 'titles') {
        this.modifyTimeSpan.setAttribute('style', 'font-size: 9px;display:block;opacity:0.6');
    } else if (this.viewType === 'details') {

        this.modifyTimeSpan.setAttribute('style', 'font-size: 9pt;opacity:0.6;float:left;');
        this.modifyTimeSpan.style.width = num +'px';
    }
    this.setModifyTime(date);
    return this.modifyTimeSpan;

};
FileEntityBox.prototype.createdFileTimeSpan =function (date,num){
    this.createTimeSpan = document.createElement('div');
    this.createTimeSpan.setAttribute('class','createTimeItem');
    if(this.viewType === 'titles'){
        this.createTimeSpan.style.display = 'none';
    }
    else{
        this.createTimeSpan.setAttribute('style','font-size: 9pt;opacity:0.6;float:left;');
        this.createTimeSpan.style.width = num + 'px';
    }

    this.setCreateTime(date);
    return this.createTimeSpan;
};

FileEntityBox.prototype.createdLROpt = function(transformF, materialsId, num){
    //var path = 'http://218.106.119.150:8088/OfficeTransfer/';
    this.LROptDiv = document.createElement('div');
    this.LROptDiv.style.width = num + 'px';
    this.LROptDiv.setAttribute('style','font-size: 9pt;opacity:0.6;float:left;');
    var LROptShow = document.createElement('a');


    this.LROptDiv.appendChild(LROptShow);

    LROptShow.innerHTML = mxResources.get('preview');
    LROptShow.setAttribute('href', resourceServerHost + transformF);


    return this.LROptDiv;
};

FileEntityBox.prototype.createFileInfoDiv = function (fileEntity) {

    var fileName = fileEntity.fileName;
    var date = fileEntity.lastModify;
    var fileCreatedTime = fileEntity.createTime;
    var flag = fileEntity.flag;

    var description = fileEntity.description;
    if (description) {
        var title = {fileName: fileName, description: description};
    } else {
        var title = fileName;
    }
    var transformF = fileEntity.transformF;
    var materialsId = fileEntity.materialsId;

    /*
     ***在添加列项时,需要更改下面col列数 ****
     * by fanmiaomiao
     */
    var col = 3;

    //var fileInfoDiv = document.createElement('div');
    this.fileInfoDiv = document.createElement('div');
    var num0 = (760/col);
    var num1 = 760 / col *0.9;
    this.fileInfoDiv.setAttribute('class', 'bar');
    //this.fileInfoDiv.setAttribute('title', mxResources.get('filename') + ':' + fileName);
    /*
     ***向fileInfoDiv的节点中添加子节点,除了文件名调用num0，其它全部调用参数num1 ***
     * by fanmiaomiao
     */
    this.fileInfoDiv.appendChild(this.createFileSpan(title,num0));
    if (this.isShared) {
        this.fileInfoDiv.appendChild(this.createfileSign(mxResources.get('shared')));
    }
    if (this.isPublished) {
        this.fileInfoDiv.appendChild(this.createfileSign(mxResources.get('published')));
    }
    //console.log('fileName===='+fileName);
    this.fileInfoDiv.appendChild(this.createModifyTimeSpan(date,num1));
    //console.log('date ===='+date);
    this.fileInfoDiv.appendChild(this.createdFileTimeSpan(fileCreatedTime,num1));

    //this.fileInfoDiv.appendChild(this.createdLROpt(transformF,materialsId,num1));
    //console.log('fileCreatedTime ===='+fileCreatedTime);
    if (this.viewType === 'titles') {
        this.fileInfoDiv.setAttribute('style', 'padding:5px;margin:5px;border:solid 1px #FFF;opacity:0.8;height:40px;width:168px;float:left;overflow:hidden;cursor:pointer;');
    } else if (this.viewType === 'details') {
        this.fileInfoDiv.setAttribute('style', 'height:20px;margin:5px;border:solid 1px #FFF;opacity:0.8;width:760px;cursor:pointer;');
        //fileInfoDiv.setAttribute('style', 'height:20px;margin:5px;border:solid 1px #FFF;opacity:0.8;width:550px;cursor:pointer;');
    }
    return this.fileInfoDiv;
};


var RichTextsModelEntityBox = function (holderDialogBody, fileEntity, viewType) {
    FileEntityBox.call(this,holderDialogBody, fileEntity, viewType);
    console.log('richtextBox');
    this.id=fileEntity.id;
    this.typeId=fileEntity.typeId;
    this.userId=fileEntity.userId;
    this.userName=fileEntity.userName;
    this.textContent = fileEntity.textContent;
};
mxUtils.extend(RichTextsModelEntityBox, FileEntityBox);

RichTextsModelEntityBox.prototype.getFileEntity = function(){
    console.log('run subbox');
    return {
        id : this.id,
        typeId : this.typeId,
        fileName : this.fileName,
        description : this.description,
        textContent:this.textContent,
        userName : this.userName,
        userId : this.userId,
        createTime : this.createTime,
        lastModify : this.lastModify,
        isSelected : this.isSelected
    };
};


/*insteaded of by FileManagerDialogBodyPro


 /!**
 * Constructs a new open dialog for manage file.
 *!/
 var FileManagerDialogBody = function (editorUi, title, processId, isOpenNewWindow, graph) {

 DialogBody.call(this, title, editorUi);
 //if (processId) it's a instance instead of a model file
 this.isInstanceFile = (processId) ? true : false;
 // fileEntityBoxList is for client side searching
 this.fileEntityBoxList = [];
 //selectedFileList store the selected fileEntityBox
 this.selectedFileList = [];
 this.isOpenNewWindow = isOpenNewWindow;
 this.graph = graph;

 this.sortConfig = {
 nameAsc: true,
 timeAsc: false,
 titlesView: true
 };
 //create sortConfig Cookie
 if (getCookie('sortConfig') == '') {
 var jsonSortConfig = JSON.stringify(this.sortConfig);
 addCookie('sortConfig', jsonSortConfig, 12);
 }
 var sortConfigStr = unescape(getCookie('sortConfig'));
 this.sortConfigFromCookie = JSON.parse(sortConfigStr);

 this.trashConfig = {
 back: true
 };
 //  this.searchConfig = {
 //    back:true
 //};

 this.isMultiSelect = false;
 this.allContainer = this.getBodyContainer();
 var _allFileDialogBody = this;

 var dialogHeadContainer = document.createElement('div');
 this.fileSortByTimeDesc = document.createElement('span');
 this.fileSortByNameDesc = document.createElement('span');
 this.fileViewInTiles = document.createElement('span');
 var fileTimeRange = document.createElement('span');
 //multi
 var multiSelect = document.createElement('span');
 multiSelect.setAttribute('class', 'geBtn2');
 //multiSelect.innerHTML = '多选';
 multiSelect.innerHTML = mxResources.get('multiple');
 this.deletedFileView = document.createElement('span');

 ////增加搜索框 by fanmiaomiao
 var searchForm = document.createElement('form');   //创建表单
 var inputText = document.createElement('input');
 this.fileSearch = document.createElement('span');
 this.createAllFileContainer();
 var dialogFootContainer = document.createElement('div');
 this.dialogFootOk = document.createElement('button');
 var dialogFootCancel = document.createElement('button');
 this.allContainer.appendChild(dialogHeadContainer);
 dialogHeadContainer.appendChild(multiSelect);
 dialogHeadContainer.appendChild(this.fileSortByTimeDesc);
 dialogHeadContainer.appendChild(this.fileSortByNameDesc);
 dialogHeadContainer.appendChild(this.fileViewInTiles);
 dialogHeadContainer.appendChild(fileTimeRange);
 dialogHeadContainer.appendChild(this.deletedFileView);
 dialogHeadContainer.appendChild(searchForm);
 searchForm.setAttribute('class', 'searchForm');
 //searchForm.setAttribute('style','float:right;');
 searchForm.appendChild(inputText);

 searchForm.appendChild(this.fileSearch);
 //dialogHeadContainer.appendChild(this.fileSearch);


 this.allContainer.appendChild(this.allFileContainer);
 this.allContainer.appendChild(dialogFootContainer);
 var dialogFootDiv1 = document.createElement('div');
 dialogFootDiv1.setAttribute('class', 'dialogFootDiv1');

 dialogFootContainer.appendChild(dialogFootDiv1);
 dialogFootDiv1.appendChild(this.dialogFootOk);//dialogFootDiv
 dialogFootDiv1.appendChild(dialogFootCancel);
 //dialogFootDiv1.setAttribute('class','dialogDiv1');
 //dialogFootDiv1.setAttribute('style','border-bottom:solid 1px #e8e9ea;');

 dialogHeadContainer.setAttribute('class', 'dialogHeadDiv');
 //dialogHeadContainer.setAttribute('style', 'border-bottom:solid 1px #e8e9ea; background-color:#f5f6f7;padding: 5px 10px;color: #737373;');

 //if(!this.sortConfigFromCookie.timeAsc){
 this.fileSortByTimeDesc.innerHTML = mxResources.get('timeDesc');
 //}else{
 //    this.fileSortByTimeDesc.innerHTML = mxResources.get('timeAsc');
 //}

 if (this.sortConfigFromCookie.nameAsc) {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameDesc');
 } else {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameAsc');
 }

 if (this.sortConfigFromCookie.titlesView) {
 this.viewType = 'titles';
 this.fileViewInTiles.innerHTML = mxResources.get('tilesView');
 } else {
 this.viewType = 'details';
 this.fileViewInTiles.innerHTML = mxResources.get('detailsView');
 }

 //this.fileViewInTiles.innerHTML = mxResources.get('tilesView');
 fileTimeRange.innerHTML = mxResources.get('timeRange');
 this.deletedFileView.innerHTML = mxResources.get('deletedFile');

 this.fileSearch.innerHTML = mxResources.get('search');
 this.fileSortByTimeDesc.setAttribute('class', 'geBtn');
 this.fileSortByNameDesc.setAttribute('class', 'geBtn');
 this.fileViewInTiles.setAttribute('class', 'geBtn');
 fileTimeRange.setAttribute('class', 'geBtn');
 this.deletedFileView.setAttribute('class', 'geBtn');
 this.fileSearch.setAttribute('class', 'geButn');
 //this.fileSortByTimeDesc.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //this.fileSortByNameDesc.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //fileViewInDetails.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //fileViewInTiles.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //fileTimeRange.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 dialogFootContainer.setAttribute('class', 'dialogFootDiv');
 //dialogFootContainer.setAttribute('style', 'height: 50px;background:#f0f0f0');
 this.dialogFootOk.innerHTML = mxResources.get('ok');
 this.dialogFootOk.setAttribute('class', 'geBtn gePrimaryBtn');
 //set dialogFootOk disabled
 this.dialogFootOk.setAttribute('disabled', true);

 dialogFootCancel.innerHTML = mxResources.get('cancel');
 dialogFootCancel.setAttribute('class', 'geBtn');

 //dialogFootCancel.setAttribute('style', 'float:right;margin-top:12px;margin-right:16px;');
 mxEvent.addListener(dialogFootCancel, 'click', mxUtils.bind(this, function () {
 this.editorUi.isTrashSelected = false;
 this.editorUi.hideDialog();
 }));

 mxEvent.addListener(multiSelect, 'click', mxUtils.bind(this, function () {
 if (this.isMultiSelect) {
 this.isMultiSelect = !this.isMultiSelect;
 this.unSelectAllFileEntity();
 multiSelect.setAttribute('style', '');
 } else {
 this.unSelectAllFileEntity();
 this.isMultiSelect = !this.isMultiSelect;
 multiSelect.setAttribute('style', 'background-color:#498AF3; color:#fff;');
 }
 }));


 mxEvent.addListener(this.dialogFootOk, 'click', mxUtils.bind(this, function () {
 var selectedFileList = this.getSelectedFile();
 this.openSelectedFile(selectedFileList);

 }));

 mxEvent.addListener(fileTimeRange, 'click', mxUtils.bind(this, function () {
 var timeRangeDailogBody = new TimeRangeDialogBody(editorUi, mxUtils.bind(this, function (startTime, endTime) {
 this.findFileByTime(startTime, endTime);
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));
 editorUi.showDialog(timeRangeDailogBody, 300, null, true, true);
 YYYYMMDDstart();
 }));
 //搜索按钮触发事件 by fanmiaomiao
 mxEvent.addListener(this.fileSearch, 'click', mxUtils.bind(this, function () {
 this.searchLikeFileByName();
 //alert('1');
 this.removeAllFileEntityBoxes();
 //alert('2');
 this.showFileEntityBox();
 //alert('3');
 }));
 mxEvent.addListener(this.fileSortByTimeDesc, 'click', mxUtils.bind(this, function () {
 this.sortFileByTime();
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));

 mxEvent.addListener(this.fileSortByNameDesc, 'click', mxUtils.bind(this, function () {
 this.sortFileByName();
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));
 mxEvent.addListener(this.fileViewInTiles, 'click', mxUtils.bind(this, function () {
 this.fileView();
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));
 mxEvent.addListener(this.deletedFileView, 'click', mxUtils.bind(this, function () {
 this.fileDeleted();
 var paramObj = {};
 if (this.isInstanceFile) {
 paramObj = {
 processId: processId,
 isOut : !this.editorUi.isTrashSelected
 };
 editorUi.communication.loadInstanceOfProcess(paramObj, mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 this.removeAllFileEntityBoxes();
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.showFileEntityBox();
 }
 }));
 }else {
 paramObj = {
 isOut : !this.editorUi.isTrashSelected
 };
 editorUi.communication.loadAllModelFiles(paramObj,mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 this.removeAllFileEntityBoxes();
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.showFileEntityBox();
 }
 }));
 }
 }));

 mxEvent.addListener(_allFileDialogBody.allFileContainer, 'scroll', function () {
 _allFileDialogBody.clearContextMenu();
 });
 var paramObj={};
 if (this.isInstanceFile) {
 paramObj = {
 processId: processId,
 isOut : !this.editorUi.isTrashSelected
 };
 editorUi.communication.loadInstanceOfProcess(paramObj, mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.sortFileByTime();
 this.showFileEntityBox();
 }

 }));
 } else {
 paramObj = {
 isOut : !this.editorUi.isTrashSelected
 };
 editorUi.communication.loadAllModelFiles(paramObj,mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 console.log(fileEntities);
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.sortFileByTime();
 this.showFileEntityBox();
 }

 }));
 }
 };
 mxUtils.extend(FileManagerDialogBody, DialogBody);

 FileManagerDialogBody.prototype.NAME = 'FileManagerDialogBody';

 //searchLikeFileByName by fanmiaomao
 FileManagerDialogBody.prototype.searchLikeFileByName = function() {

 var fileEntityBoxList = this.getFileEntityBoxList();
 var str = document.getElementsByTagName('input');
 var n = str.length - 1;
 //console.log(str[n].value);
 var likeName = str[n].value;
 searchByLikeName(likeName, fileEntityBoxList);
 };

 /!**
 * set dialogFootOk can click  by chenwenyan
 *!/
 FileManagerDialogBody.prototype.okButtonClick = function() {
 this.dialogFootOk.removeAttribute('disabled');
 };

 /!**
 * findFileByTime by eamonn
 *!/
 FileManagerDialogBody.prototype.findFileByTime = function(startTime,endTime) {
 this.fileEntityBoxList= this.findTimeRangeFile(this.fileEntityBoxList,startTime,endTime)
 };

 FileManagerDialogBody.prototype.sortFileByTime = function () {
 if (this.sortConfig.timeAsc) {
 this.fileSortByTimeDesc.innerHTML = mxResources.get('timeAsc');
 this.fileEntityBoxList = dateAscSort(this.fileEntityBoxList);

 } else {
 this.fileSortByTimeDesc.innerHTML = mxResources.get('timeDesc');
 this.fileEntityBoxList = dateDescSort(this.fileEntityBoxList);
 }
 this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
 };
 FileManagerDialogBody.prototype.sortFileByName = function () {
 if (this.sortConfig.nameAsc) {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameAsc');
 this.fileEntityBoxList = nameAscSort(this.fileEntityBoxList);
 } else {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameDesc');
 this.fileEntityBoxList = nameDescSort(this.fileEntityBoxList);
 }
 this.sortConfig.nameAsc = !this.sortConfig.nameAsc;

 //deleteCookie('sortConfig');
 //addCookie('sortConfig',JSON.stringify(this.sortConfigFromCookie),12);
 };


 // 回收站的返回按钮  by fanmiaomiao
 FileManagerDialogBody.prototype.fileDeleted = function(){
 if(this.trashConfig.back ){
 this.deletedFileView.innerHTML = mxResources.get('return1');
 this.editorUi.isTrashSelected=true;
 this.dialogFootOk.setAttribute('disabled',false);
 // this.okButtonClick();
 }else{
 this.deletedFileView.innerHTML = mxResources.get('deletedFile');
 //this.fileEntityBoxList = loadDeletedFile(this.fileEntityBoxList);
 this.editorUi.isTrashSelected=false;
 }
 this.trashConfig.back =!this.trashConfig.back;
 };

 FileManagerDialogBody.prototype.fileView = function () {

 //点击详细视图和方块视图会触发，如果方块视图不为真，证明
 if (!this.sortConfigFromCookie.titlesView) {
 this.fileViewInTiles.innerHTML = mxResources.get('tilesView');
 this.viewType = 'titles';
 } else {
 this.fileViewInTiles.innerHTML = mxResources.get('detailsView');
 this.viewType = 'details';
 }


 this.buildFileEntityBoxList(this.extractFileEntities(), this.viewType);
 this.sortConfigFromCookie.titlesView = !this.sortConfigFromCookie.titlesView;
 deleteCookie('sortConfig');
 addCookie('sortConfig',JSON.stringify(this.sortConfigFromCookie),12);
 };
 FileManagerDialogBody.prototype.validateFileEntities = function (fileEntities) {
 if (fileEntities && fileEntities.length > 0) {
 return true;
 } else {
 var fileInfoDiv = document.createElement('div');
 fileInfoDiv.innerHTML = mxResources.get('nofile');
 this.allFileContainer.appendChild(fileInfoDiv);
 return false;
 }
 };
 FileManagerDialogBody.prototype.buildFileEntityBoxList = function (fileEntities, viewType) {
 // note: for-loop is the faster iteration method in javascript
 this.fileEntityBoxList = [];
 for (var i = 0; i < fileEntities.length; i++) {
 this.addFileEntityBox(new FileEntityBox(this, fileEntities[i], viewType));
 }
 };
 FileManagerDialogBody.prototype.extractFileEntities = function () {
 var fileEntities = [];
 for (var i = 0; i < this.fileEntityBoxList.length; i++) {
 fileEntities.push(this.fileEntityBoxList[i].getFileEntity());
 }
 return fileEntities;
 };
 FileManagerDialogBody.prototype.addFileEntityBox = function (fileEntityBox) {
 this.fileEntityBoxList.push(fileEntityBox);

 this.addMenuHandler(fileEntityBox.getContainerEl(), mxUtils.bind(this, function (menu, cell, evt) {
 this.unSelectAllFileEntity();
 fileEntityBox.setIsSelected(true);
 this.editorUi.currentSeletedFiles = [fileEntityBox];
 this.editorUi.selectFilesList = this.getSelectedFile();
 if(this.isInstanceFile) {
 if(!this.editorUi.isTrashSelected) {
 this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'renameFile', 'assignRole', '-'], null, evt);
 }else{
 this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'cancelDelete', '-'], null, evt);
 }
 } else {
 if(!this.editorUi.isTrashSelected) {
 this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'renameFile', '-'], null, evt);
 }else{
 this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'cancelDelete', '-'], null, evt);
 }
 }
 }));
 fileEntityBox.getContainerEl().ondblclick = mxUtils.bind(this, function () {

 var gFileId = fileEntityBox.getFileId();
 console.log(this.trashConfig.back);
 if(this.trashConfig.back){
 if (this.isOpenNewWindow) {
 this.graph.setAttribute('subProcessId', gFileId);
 this.editorUi.editor.setModified(true);
 //disi todo
 var queryObj = appUtils.convertQueryStrToJSON();
 queryObj.gFileId = gFileId;
 queryObj.isInstance = false;
 delete queryObj.instanceId;
 window.open(appUtils.convertJSONToQueryStr(queryObj, true));
 } else {
 //this.editorUi.communication.retrieveGraphModel({gFileId: gFileId, isInstance: this.isInstanceFile}, mxUtils.bind(this.editorUi.editor, this.editorUi.editor.setGraphModel));
 //this.editorUi.editor.setModified(false);
 var queryObj = appUtils.convertQueryStrToJSON();
 queryObj.isInstance = this.isInstanceFile;
 if(queryObj.isInstance){
 queryObj.instanceId = gFileId;
 delete queryObj.gFileId
 }else{
 queryObj.gFileId = gFileId;
 delete queryObj.instanceId;

 }
 History.pushState(queryObj, this.editorUi.communication.apis.retrieveGraphModel, appUtils.convertJSONToQueryStr(queryObj, '?'));
 }
 this.editorUi.hideDialog();
 this.editorUi.menus.updateRecentOpenFileList(fileEntityBox.getFileEntity());

 this.selectedFileList.push(fileEntityBox);
 this.openSelectedFile(this.selectedFileList);
 }
 });
 };

 FileManagerDialogBody.prototype.showFileEntityBox = function () {
 this.removeAllFileEntityBoxes();
 var fileEntityBox;
 for (var i = 0; i < this.fileEntityBoxList.length; i++) {
 fileEntityBox = this.fileEntityBoxList[i];
 if (fileEntityBox.getIsToShow()) {
 this.allFileContainer.appendChild(fileEntityBox.getContainerEl());
 }

 }
 };
 FileManagerDialogBody.prototype.removeAllFileEntityBoxes = function () {
 // note: using myNode.innerHTML = '' to remove the content is much slower
 while (this.allFileContainer.firstChild) {
 this.allFileContainer.removeChild(this.allFileContainer.lastChild);
 }
 };
 FileManagerDialogBody.prototype.removeFileEntityBox = function (fileEntityBox) {
 if (this.allFileContainer) {
 this.allFileContainer.removeChild(fileEntityBox.getContainerEl());
 }
 };
 FileManagerDialogBody.prototype.createAllFileContainer = function () {
 this.allFileContainer = document.createElement('div');
 this.allFileContainer.setAttribute('class', 'dialogCenterDiv');
 this.allFileContainer.setAttribute('style', 'overflow: auto; height: 300px;padding:10px 5px;');
 return this.allFileContainer;
 };
 FileManagerDialogBody.prototype.getFileEntityBoxList = function () {
 return this.fileEntityBoxList;
 };
 FileManagerDialogBody.prototype.unSelectAllFileEntity = function () {
 if (!this.isMultiSelect) {
 var fileEntityBoxList = this.getFileEntityBoxList();
 for (var i = 0; i < fileEntityBoxList.length; i++) {
 if (fileEntityBoxList[i].getIsSelected()) {
 fileEntityBoxList[i].setIsSelected(false);
 }
 }
 }
 };



 /!**
 * return all selected file for more operation
 *!/
 FileManagerDialogBody.prototype.getSelectedFile = function () {
 this.selectedFileList=[];
 //this.unSelectAllFileEntity();
 for (var i=0;i<this.fileEntityBoxList.length;i++) {
 if (this.fileEntityBoxList[i].isSelected === true){
 this.selectedFileList.push(this.fileEntityBoxList[i]);
 }
 }
 if (this.selectedFileList.length>0) {
 console.log(this.selectedFileList);
 return(this.selectedFileList);
 }
 };

 FileManagerDialogBody.prototype.openSelectedFile = function (selectedFileList) {
 if (selectedFileList) {
 if (selectedFileList.length>10) {
 //dialog
 var message = new BasicMessage(true, null, mxResources.get('openMaximumnFile'), null);
 //var message = new BasicMessage(true, null, 'should not open more than 10 each time', null);
 if(message.success===true) {
 this.editorUi.showDialog(new messageDialogBody(this.editorUi, message.msg),300,null,true,true);
 }
 this.isMultiSelect = !this.isMultiSelect;
 this.unSelectAllFileEntity();
 this.isMultiSelect = !this.isMultiSelect;
 } else {
 // bug
 // fangzhou todo: only when the selection.length > 1, open new window
 for(var i=0;i<selectedFileList.length;i++) {
 var gFileId = selectedFileList[i].getFileId();
 var queryObj = appUtils.convertQueryStrToJSON();
 if (this.isOpenNewWindow) {
 this.graph.setAttribute('subProcessId', gFileId);
 this.editorUi.editor.setModified(true);
 queryObj.gFileId = gFileId;
 queryObj.isInstance = this.isInstanceFile;
 delete queryObj.instanceId;
 window.open(appUtils.convertJSONToQueryStr(queryObj, true));
 } else {
 if (i===0) {
 if(this.isInstanceFile) {
 queryObj.instanceId = gFileId;
 delete queryObj.gFileId;
 }else {
 queryObj.gFileId = gFileId;
 delete queryObj.instanceId;
 }
 queryObj.isInstance = this.isInstanceFile;
 History.pushState(queryObj, this.editorUi.communication.apis.retrieveGraphModel, appUtils.convertJSONToQueryStr(queryObj, '?'));

 } else if(this.isInstanceFile) {
 queryObj.instanceId = gFileId;
 queryObj.isInstance = true;
 delete queryObj.gFileId;
 window.open(appUtils.convertJSONToQueryStr(queryObj, true));
 } else {
 queryObj.gFileId = gFileId;
 queryObj.isInstance = this.isInstanceFile;
 delete queryObj.instanceId;
 window.open(appUtils.convertJSONToQueryStr(queryObj, true));
 }
 this.editorUi.editor.setModified(false);
 }
 this.editorUi.hideDialog();
 this.editorUi.menus.updateRecentOpenFileList(selectedFileList[i].getFileEntity());
 }
 }
 }
 };


 /!**
 * findTimeFile
 *!/
 FileManagerDialogBody.prototype.findTimeRangeFile = function(list,startTime,endTime){

 var ascList = dateAscSort(list);
 var sflag = false;
 var eflag = false;
 for(var i=0;i<ascList.length;i++){
 //月份在new Date后会自动+1
 //var startTime = new Date(2015,6,26);
 var fileTime = new Date(ascList[i].lastModify);
 if(fileTime >= startTime){
 if(!sflag){
 var start = i;
 console.log('start: '+start);
 sflag = true;
 }
 }
 if(fileTime > endTime ){
 if(!eflag){
 var end = i;
 console.log('end: '+end);
 eflag = true;
 break;
 }
 }
 }
 if(!sflag&&!eflag){
 var list =[];
 return list;
 }else{
 return ascList.slice(start,end);
 }
 };*/
/*insteaded of by FileManagerDialogBodyPro


 var LearningResourceDialogBody = function (editorUi, title, processId, isOpenNewWindow, graph, callback) {
 this.id='editStudyResource';
 DialogBody.call(this, title, editorUi);
 if (processId == 'learningResSearch') {
 this.isLearningRes = true;
 } else if (processId == 'manageRichTextsModel') {
 this.isRichText = true;
 } else {
 this.isLearningRes = false;
 this.isRichText = false;
 }

 this.fileEntityBoxList = [];
 //selectedFileList store the selected fileEntityBox
 this.selectedFileList = [];
 this.isOpenNewWindow = isOpenNewWindow;
 this.graph = graph;

 this.sortConfig = {
 nameAsc: true,
 timeAsc: false,
 titlesView: true
 };
 //create sortConfig Cookie
 if (getCookie('sortConfig') == '') {
 var jsonSortConfig = JSON.stringify(this.sortConfig);
 addCookie('sortConfig', jsonSortConfig, 12);
 }
 var sortConfigStr = unescape(getCookie('sortConfig'));
 this.sortConfigFromCookie = JSON.parse(sortConfigStr);

 this.trashConfig = {
 back: true
 };
 //  this.searchConfig = {
 //    back:true
 //};

 this.isMultiSelect = false;
 this.allContainer = this.getBodyContainer();
 var _allFileDialogBody = this;

 var dialogHeadContainer = document.createElement('div');
 this.fileSortByTimeDesc = document.createElement('span');
 this.fileSortByNameDesc = document.createElement('span');
 this.fileViewInTiles = document.createElement('span');
 //文件时间范围按钮 by Eamonn
 var fileTimeRange = document.createElement('span');
 //multi
 var multiSelect = document.createElement('span');
 multiSelect.setAttribute('class', 'geBtn2');
 //multiSelect.innerHTML = '多选';
 multiSelect.innerHTML = mxResources.get('multiple');
 this.deletedFileView = document.createElement('span');

 var LRShow = document.createElement('span');
 LRShow.setAttribute('class', 'geBtn2');
 //multiSelect.innerHTML = '多选';
 LRShow.innerHTML = mxResources.get('showLR');

 // 上传资料
 var uploadMaterial = document.createElement('span');
 uploadMaterial.setAttribute('class','geBtn2');
 uploadMaterial.innerHTML = mxResources.get('uploadMaterial');

 var searchForm = document.createElement('form');   //创建表单
 var inputText = document.createElement('input');
 inputText.setAttribute('name', 'fileName');
 inputText.setAttribute('id', 'fileName');
 this.fileSearch = document.createElement('span');

 this.createAllFileContainer();
 var dialogFootContainer = document.createElement('div');
 this.dialogFootOk = document.createElement('button');
 var dialogFootCancel = document.createElement('button');
 this.allContainer.appendChild(dialogHeadContainer);
 dialogHeadContainer.appendChild(multiSelect);
 if(this.isLearningRes){
 dialogHeadContainer.appendChild(LRShow);
 }
 dialogHeadContainer.appendChild(uploadMaterial);
 //dialogHeadContainer.appendChild(this.fileSortByTimeDesc);
 //dialogHeadContainer.appendChild(this.fileSortByNameDesc);
 //dialogHeadContainer.appendChild(this.fileViewInTiles);
 //dialogHeadContainer.appendChild(fileTimeRange);
 //if (!this.isInstanceFile) {
 //dialogHeadContainer.appendChild(this.deletedFileView);
 //}

 var options = [{name:'全部',value:0},{name:'新手',value:1},{name:'生手',value:2},{name:'熟手',value:3},{name:'能手',value:4},{name:'高手',value:5}];
 var testRadio = editorUi.formItems.genRadioField('适用用户:', 'toUser', options);
 var radioDOM = testRadio.getElContainer();
 if(this.isLearningRes){
 dialogHeadContainer.appendChild(radioDOM);
 }
 radioDOM.appendChild(searchForm);
 searchForm.setAttribute('class', 'searchForm');
 //searchForm.setAttribute('style','float:right;');
 searchForm.appendChild(inputText);

 searchForm.appendChild(this.fileSearch);
 if(this.isRichText){
 dialogHeadContainer.appendChild(searchForm);
 }
 //dialogHeadContainer.appendChild(this.fileSearch);
 this.allContainer.appendChild(this.allFileContainer);
 this.allContainer.appendChild(dialogFootContainer);
 var dialogFootDiv1 = document.createElement('div');
 dialogFootDiv1.setAttribute('class', 'dialogFootDiv1');

 dialogFootContainer.appendChild(dialogFootDiv1);
 dialogFootDiv1.appendChild(this.dialogFootOk);//dialogFootDiv
 dialogFootDiv1.appendChild(dialogFootCancel);
 //dialogFootDiv1.setAttribute('class','dialogDiv1');
 //dialogFootDiv1.setAttribute('style','border-bottom:solid 1px #e8e9ea;');

 dialogHeadContainer.setAttribute('class', 'dialogHeadDiv');
 //dialogHeadContainer.setAttribute('style', 'border-bottom:solid 1px #e8e9ea; background-color:#f5f6f7;padding: 5px 10px;color: #737373;');

 //if(!this.sortConfigFromCookie.timeAsc){
 this.fileSortByTimeDesc.innerHTML = mxResources.get('timeDesc');
 //}else{
 //    this.fileSortByTimeDesc.innerHTML = mxResources.get('timeAsc');
 //}

 if (this.sortConfigFromCookie.nameAsc) {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameDesc');
 } else {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameAsc');
 }

 if (this.sortConfigFromCookie.titlesView) {
 this.viewType = 'titles';
 this.fileViewInTiles.innerHTML = mxResources.get('tilesView');
 } else {
 this.viewType = 'details';
 this.fileViewInTiles.innerHTML = mxResources.get('detailsView');
 }

 //this.fileViewInTiles.innerHTML = mxResources.get('tilesView');
 fileTimeRange.innerHTML = mxResources.get('timeRange');
 this.deletedFileView.innerHTML = mxResources.get('deletedFile');

 this.fileSearch.innerHTML = mxResources.get('search');
 this.fileSortByTimeDesc.setAttribute('class', 'geBtn');
 this.fileSortByNameDesc.setAttribute('class', 'geBtn');
 this.fileViewInTiles.setAttribute('class', 'geBtn');
 fileTimeRange.setAttribute('class', 'geBtn');
 this.deletedFileView.setAttribute('class', 'geBtn');
 this.fileSearch.setAttribute('class', 'geButn');
 //this.fileSortByTimeDesc.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //this.fileSortByNameDesc.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //fileViewInDetails.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //fileViewInTiles.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 //fileTimeRange.setAttribute('style', 'font-size: 14px;font-weight: normal;line-height: 19px;height:19px; margin: 2px;padding: 2px 5px;');
 dialogFootContainer.setAttribute('class', 'dialogFootDiv');
 //dialogFootContainer.setAttribute('style', 'height: 50px;background:#f0f0f0');
 this.dialogFootOk.innerHTML = mxResources.get('ok');
 this.dialogFootOk.setAttribute('class', 'geBtn gePrimaryBtn');
 //set dialogFootOk disabled
 this.dialogFootOk.setAttribute('disabled', 'disabled');

 dialogFootCancel.innerHTML = mxResources.get('cancel');
 dialogFootCancel.setAttribute('class', 'geBtn');
 //dialogFootCancel.setAttribute('style', 'float:right;margin-top:12px;margin-right:16px;');
 mxEvent.addListener(dialogFootCancel, 'click', mxUtils.bind(this, function () {
 this.editorUi.isTrashSelected = false;
 this.editorUi.hideDialog();
 }));
 mxEvent.addListener(multiSelect, 'click', mxUtils.bind(this, function () {
 if (this.isMultiSelect) {
 this.isMultiSelect = !this.isMultiSelect;
 this.unSelectAllFileEntity();
 multiSelect.setAttribute('style', '');
 } else {
 this.unSelectAllFileEntity();
 this.isMultiSelect = !this.isMultiSelect;
 multiSelect.setAttribute('style', 'background-color:#498AF3; color:#fff;');
 }
 }));

 mxEvent.addListener(LRShow, 'click', mxUtils.bind(this, function () {
 var selectedFileList = this.getSelectedFile();
 if(selectedFileList.length > 0){
 var lRShowDialogBody = new LRShowDialogBody(editorUi, selectedFileList[0].fileName, selectedFileList[0].transformF);
 this.editorUi.showDialog(lRShowDialogBody, 880, 650, true, true);
 }else{
 alert('请选择资料!');
 }
 }));
 // 上传资料  fanmiaomiao todo
 mxEvent.addListener(uploadMaterial,'click',mxUtils.bind(this,function(){
 editorUi.editLearningResource('learningResEdit');
 editorUi.flag = false;
 }));

 if(this.isLearningRes){
 mxEvent.addListener(this.dialogFootOk, 'click', mxUtils.bind(this, function () {
 var selectedFileList = this.getSelectedFile();
 var fEL = [];
 for(var i=0; i<selectedFileList.length;i++){
 var f = selectedFileList[i].getFileEntity();
 fEL.push(f);
 }
 this.editorUi.hideDialog();
 if(callback){
 callback(fEL);
 }
 //this.editorUi.hideDialog();
 /!*
 var lRShowDialogBody = new LRShowDialogBody(editorUi, selectedFileList[0].fileName, selectedFileList[0].transformF);
 this.editorUi.showDialog(lRShowDialogBody, 880, 650, true, true);
 *!/
 }));
 }
 if(this.isRichText){
 mxEvent.addListener(this.dialogFootOk, 'click', mxUtils.bind(this, function () {
 var selectedFileList = this.getSelectedFile();
 var fEL = [];
 for(var i=0; i<selectedFileList.length;i++){
 //console.log(selectedFileList[i]);
 var f = selectedFileList[i].getFileEntity();
 console.log(f);
 fEL.push(f);
 }
 if(callback){
 callback(fEL);
 }
 }));
 }


 mxEvent.addListener(fileTimeRange, 'click', mxUtils.bind(this, function () {
 var timeRangeDailogBody = new TimeRangeDialogBody(editorUi, mxUtils.bind(this, function (startTime, endTime) {
 this.findFileByTime(startTime, endTime);
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));
 editorUi.showDialog(timeRangeDailogBody, 300, null, true, true);
 YYYYMMDDstart();
 }));


 //搜索按钮触发事件
 mxEvent.addListener(this.fileSearch, 'click', mxUtils.bind(this, function () {
 var query = {};

 var strDOM = document.getElementById('fileName');
 query.fileName = strDOM.value;

 var radioDOM = document.getElementsByName('toUser');
 for(var i=0; i<radioDOM.length;i++){
 if(radioDOM[i].checked)
 query.toUser = radioDOM[i].value;
 }

 this.removeAllFileEntityBoxes();
 editorUi.communication.searchLearningRes(query,mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.sortFileByTime();
 this.showFileEntityBox();
 }

 }));
 }));

 mxEvent.addListener(this.fileSortByTimeDesc, 'click', mxUtils.bind(this, function () {
 this.sortFileByTime();
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));

 mxEvent.addListener(this.fileSortByNameDesc, 'click', mxUtils.bind(this, function () {
 this.sortFileByName();
 this.removeAllFileEntityBoxes();
 this.showFileEntityBox();
 }));

 mxEvent.addListener(this.deletedFileView, 'click', mxUtils.bind(this, function () {
 // Adamm TODO
 this.fileDeleted();
 //if (this.editorUi.isTrashSelected) {
 var isOutObj = {
 isOut : !this.editorUi.isTrashSelected
 };
 editorUi.communication.loadAllModelFiles(isOutObj,mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 this.removeAllFileEntityBoxes();
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.showFileEntityBox();
 }
 }));
 ////} else {
 //    editorUi.communication.loadAllModelFiles(mxUtils.bind(this, function (message) {
 //        var fileEntities = message.data;
 //        this.removeAllFileEntityBoxes();
 //        if (this.validateFileEntities(fileEntities)) {
 //            this.buildFileEntityBoxList(fileEntities, this.viewType);
 //            //this.sortFileByTime();
 //            this.showFileEntityBox();
 //        }
 //    }));
 ////}
 }));

 mxEvent.addListener(_allFileDialogBody.allFileContainer, 'scroll', function () {
 _allFileDialogBody.clearContextMenu();
 });

 if(this.isLearningRes){

 editorUi.communication.loadAllLearningRes(mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.sortFileByTime();
 this.showFileEntityBox();
 }

 }));
 }
 if(this.isRichText){
 var isOutObj = {
 isOut : !this.editorUi.isTrashSelected
 };
 editorUi.communication.loadAllRichTextsModel(isOutObj,mxUtils.bind(this, function (message) {
 var fileEntities = message.data;
 console.log(fileEntities);
 if (this.validateFileEntities(fileEntities)) {
 this.buildFileEntityBoxList(fileEntities, this.viewType);
 this.sortFileByTime();
 this.showFileEntityBox();
 }
 }));
 }
 };

 mxUtils.extend(LearningResourceDialogBody, DialogBody);

 LearningResourceDialogBody.prototype.createAllFileContainer = function () {
 this.allFileContainer = document.createElement('div');
 this.allFileContainer.setAttribute('class', 'dialogCenterDiv');
 this.allFileContainer.setAttribute('style', 'overflow: auto; height: 300px;padding:10px 5px;');
 return this.allFileContainer;
 };

 LearningResourceDialogBody.prototype.okButtonClick = function() {
 this.dialogFootOk.removeAttribute('disabled');
 };

 LearningResourceDialogBody.prototype.validateFileEntities = function (fileEntities) {
 if (fileEntities && fileEntities.length > 0) {
 return true;
 } else {
 var fileInfoDiv = document.createElement('div');
 fileInfoDiv.innerHTML = mxResources.get('nofile');
 this.allFileContainer.appendChild(fileInfoDiv);
 return false;
 }
 };

 LearningResourceDialogBody.prototype.buildFileEntityBoxList = function (fileEntities, viewType) {
 // note: for-loop is the faster iteration method in javascript
 this.fileEntityBoxList = [];
 if(this.isRichText){
 for (var i = 0; i < fileEntities.length; i++) {
 this.addFileEntityBox(new RichTextsModelEntityBox(this, fileEntities[i], viewType));
 }
 }else{
 for (var i = 0; i < fileEntities.length; i++) {
 this.addFileEntityBox(new FileEntityBox(this, fileEntities[i], viewType));
 }
 }
 };

 LearningResourceDialogBody.prototype.sortFileByTime = function () {
 if (this.sortConfig.timeAsc) {
 this.fileSortByTimeDesc.innerHTML = mxResources.get('timeAsc');
 this.fileEntityBoxList = dateAscSort(this.fileEntityBoxList);

 } else {
 this.fileSortByTimeDesc.innerHTML = mxResources.get('timeDesc');
 this.fileEntityBoxList = dateDescSort(this.fileEntityBoxList);
 }
 this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
 };

 LearningResourceDialogBody.prototype.showFileEntityBox = function () {
 this.removeAllFileEntityBoxes();
 var fileEntityBox;
 for (var i = 0; i < this.fileEntityBoxList.length; i++) {
 fileEntityBox = this.fileEntityBoxList[i];
 if (fileEntityBox.getIsToShow()) {
 this.allFileContainer.appendChild(fileEntityBox.getContainerEl());
 }
 }
 };

 LearningResourceDialogBody.prototype.removeAllFileEntityBoxes = function () {
 // note: using myNode.innerHTML = '' to remove the content is much slower
 while (this.allFileContainer.firstChild) {
 this.allFileContainer.removeChild(this.allFileContainer.lastChild);
 }
 };

 LearningResourceDialogBody.prototype.sortFileByName = function () {
 if (this.sortConfig.nameAsc) {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameAsc');
 this.fileEntityBoxList = nameAscSort(this.fileEntityBoxList);
 } else {
 this.fileSortByNameDesc.innerHTML = mxResources.get('fileNameDesc');
 this.fileEntityBoxList = nameDescSort(this.fileEntityBoxList);
 }
 this.sortConfig.nameAsc = !this.sortConfig.nameAsc;

 //deleteCookie('sortConfig');
 //addCookie('sortConfig',JSON.stringify(this.sortConfigFromCookie),12);
 };

 LearningResourceDialogBody.prototype.addFileEntityBox = function (fileEntityBox) {
 this.fileEntityBoxList.push(fileEntityBox);

 this.addMenuHandler(fileEntityBox.getContainerEl(), mxUtils.bind(this, function (menu, cell, evt) {
 this.unSelectAllFileEntity();
 fileEntityBox.setIsSelected(true);

 this.editorUi.currentSeletedFiles = [fileEntityBox];

 this.editorUi.selectFilesList = this.getSelectedFile();

 this.editorUi.menus.addMenuItems(menu, ['deleteLearningRes'], null, evt);

 }));
 if(this.isLearningRes){
 fileEntityBox.getContainerEl().ondblclick = mxUtils.bind(this, function () {

 window.open('http://218.106.119.150:8088/OfficeTransfer/' + fileEntityBox.transformF);
 //this.editorUi.menus.updateRecentOpenFileList(fileEntityBox.getFileEntity());

 });
 }else{
 //eamonn todo
 fileEntityBox.getContainerEl().ondblclick = mxUtils.bind(this, function () {

 this.editorUi.loadEditRichTextsModel(fileEntityBox.getFileEntity(),mxUtils.bind(this, function (richTextData) {
 console.log(richTextData);
 fileEntityBox.setFileName(richTextData.name);
 }));
 //this.editorUi.hideDialog.call(this);
 //this.editorUi.menus.updateRecentOpenFileList(fileEntityBox.getFileEntity());
 });
 }
 };

 LearningResourceDialogBody.prototype.unSelectAllFileEntity = function () {
 if (!this.isMultiSelect) {
 var fileEntityBoxList = this.getFileEntityBoxList();
 for (var i = 0; i < fileEntityBoxList.length; i++) {
 if (fileEntityBoxList[i].getIsSelected()) {
 fileEntityBoxList[i].setIsSelected(false);
 }
 }
 }
 };

 LearningResourceDialogBody.prototype.getSelectedFile = function () {
 this.selectedFileList=[];

 for (var i=0;i<this.fileEntityBoxList.length;i++) {
 if (this.fileEntityBoxList[i].isSelected === true){
 this.selectedFileList.push(this.fileEntityBoxList[i]);
 }
 }

 return(this.selectedFileList);
 };

 LearningResourceDialogBody.prototype.getFileEntityBoxList = function () {
 return this.fileEntityBoxList;
 };

 LearningResourceDialogBody.prototype.removeAllFileEntityBoxes = function () {
 // note: using myNode.innerHTML = '' to remove the content is much slower
 while (this.allFileContainer.firstChild) {
 this.allFileContainer.removeChild(this.allFileContainer.lastChild);
 }
 };
 LearningResourceDialogBody.prototype.removeFileEntityBox = function (fileEntityBox) {
 if (this.allFileContainer) {
 this.allFileContainer.removeChild(fileEntityBox.getContainerEl());
 }
 };*/

//相关知识   by adamm
var resources={};
var k;
var RelatedKnowledge = function(Ui,cell, title, originalKnowleg){
    this.knowledgeName  = [];
    this.file = [];
    this.div = document.createElement('div');
    this.dialogBodyContainer = [];
    this.topicSoftKill = [];
    this.titleSoftKill = [];
    this.titleSoftKillDiv = [];
    this.btDiv = [];
    this.topicSoftKillName = [];
    this.addSoftKillBtn = [];
    this.setRole = [];
    this.SoftKillContext = [];
    this.softKillMaterial = [];
    this.softKillTopicMaterial = [];
    this.softKillSpan = [];
    this.btnsDiv = [];
    this.editBtn = [];
    this.previewBtn = [];
    this.CancelBtn = [];
    var recordNum = 0;
    var fNum = 0;
    k = -1;
    this.dialogContainer = document.createElement('div');
    this.dialogContainer.setAttribute('style','min-height:150px;width:100%');
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('style','height:50px');
    this.text = document.createElement('input');
    this.text.setAttribute('style', 'margin: 10px 5px;float:left;height:23px');
    this.text.placeholder = mxResources.get('inputKnowledgePointsName');
    var adBtn = document.createElement('button');
    adBtn.innerHTML = mxResources.get('addKnowledgePoint');
    adBtn.className = 'geBtn gePrimaryBtn';
    adBtn.setAttribute('style', 'margin:10px;float:left;height:28px');
    btnDiv.appendChild(this.text);
    btnDiv.appendChild(adBtn);
    this.dialogContainer.appendChild(btnDiv);
    if (originalKnowleg) {
        var originalKnowlegJson = JSON.parse(originalKnowleg);
        for (var i=0;i<originalKnowlegJson.length;i++){
            k++;
            this.text.value = originalKnowlegJson[i].topic;
            this.knowledgeName[k] = originalKnowlegJson[i].topic;
            var knowledgeContainer = this.createKnowlegArea(Ui, cell, recordNum, fNum, originalKnowlegJson[i]);
            var oneKnowledgeContainer = Ui.formItems.genDropDownBar(mxResources.get('knowledgPoint')+ (k+1) +' ---- "'+this.knowledgeName[k] + '"', '100', '', knowledgeContainer, ((k == 0)? false : true),mxUtils.bind(this,(function(k){
                return mxUtils.bind(this,function() {
                    this.knowledgeName[k] = null;
                });
            }))(k));
            this.dialogContainer.appendChild(oneKnowledgeContainer.getElContainer());
        }
    }
    mxEvent.addListener(adBtn, 'click', mxUtils.bind(this, function () {
        if (!this.text.value) {
            //alert(mxResources.get('nullKnowledgeInput'));
            Ui.showDialog(new tipDialogBody(Ui, mxResources.get('nullKnowledgeInput')), 300, null, true, true);
        } else {
            k ++ ;
            this.knowledgeName[k] = this.text.value;
            var knowledgeContainer = this.createKnowlegArea(Ui, cell, recordNum, fNum);
            var oneKnowledgeContainer = Ui.formItems.genDropDownBar(mxResources.get('knowledgPoint')+ (k+1) +' ---- "'+this.knowledgeName[k] + '"', '100', '', knowledgeContainer, false,mxUtils.bind(this, (function(k){
                return mxUtils.bind(this,function(){
                    this.knowledgeName[k] = null ;
                });
            }))(k));
            this.dialogContainer.appendChild(oneKnowledgeContainer.getElContainer());
        }
    }));
    this.div.appendChild(this.dialogContainer);
};
RelatedKnowledge.prototype.createKnowlegArea = function (Ui, cell, recordNum, fNum, originalKnowleg) {
    this.dialogBodyContainer[k] = document.createElement('div');
    this.dialogBodyContainer[k].setAttribute('style','min-height:150px;');
    this.dialogBodyContainer[k].setAttribute('id',k);
    this.topicSoftKill[k] = document.createElement('div');
    this.topicSoftKill[k].setAttribute('style','min-height:148px;');
    this.titleSoftKill[k] = document.createElement('div');
    this.titleSoftKill[k].setAttribute('style','height:35px;');
    this.titleSoftKillDiv[k] = document.createElement('div');
    this.titleSoftKillDiv[k].setAttribute('style','height:34px;margin-left:5px;padding-top:5px;');
    this.topicSoftKillName[k] = document.createElement('span');
    this.topicSoftKillName[k].setAttribute('style','width:70px;font-size:13px;font-weight: bold;');
    this.topicSoftKillName[k].innerHTML = this.knowledgeName[k];
    this.btDiv[k] = document.createElement('div');
    this.btDiv[k].setAttribute('style','height:30px;float:right;width:70px');
    this.addSoftKillBtn[k] = document.createElement('span');
    this.addSoftKillBtn[k].innerHTML = mxResources.get('addMaterial');
    this.addSoftKillBtn[k].setAttribute('id',k);
    this.addSoftKillBtn[k].setAttribute('style','font-weight:bold;height:29px;line-height:27px;outline:0;padding:5px 5px 5px;background-color:#f5f5f5;font-size:13px;border-radius:2px;border:1px solid #d8d8d8;cursor:pointer;color:#333;width:60px;text-align:center');
    this.titleSoftKillDiv[k].appendChild(this.topicSoftKillName[k]);
    this.btDiv[k].appendChild(this.addSoftKillBtn[k]);
    if(cell.parent.id !=='1' && cell.parent.getAttribute('label')){
        var label = cell.parent.getAttribute('label').split('+');
        if (label.length > 1) {
            var userData = [];
            for (var i = 0; i < label.length; i++) {
                userData.push({id: label[i], name: label[i]});
            }
            var originalRole;
            if (originalKnowleg && originalKnowleg.role) {
                originalRole = JSON.stringify(originalKnowleg.role);
            }
            this.setRole[k] = Ui.formItems.genComboBox('', 'member', cell, userData, '90', null, originalRole);
            this.setRole[k].getElContainer().setAttribute('style','float:right;height:100px;overflow-y:auto;padding-right:0px;width:150px;margin-right:10px');
            this.titleSoftKillDiv[k].appendChild(this.setRole[k].getElContainer());
        }
    }
    this.titleSoftKillDiv[k].appendChild(this.btDiv[k]);
    this.titleSoftKill[k].appendChild(this.titleSoftKillDiv[k]);
    this.topicSoftKill[k].appendChild(this.titleSoftKill[k]);
    this.SoftKillContext[k] = document.createElement('div');
    this.SoftKillContext[k].setAttribute('style','border:5px;margin-left:20px');
    this.SoftKillContext[k].setAttribute('id',k);
    var me = this;
    var resourceList = [];
    var addNum = 0;
    if(originalKnowleg) {
        var arr = originalKnowleg.link;
        addNum = arr.length;
        for (var i = 0; i < arr.length; i++ ) {
            me.softKillMaterial[i] = document.createElement('div');
            me.softKillMaterial[i].setAttribute('style','width:97%;height:22px;margin-left:10px');
            me.softKillMaterial[i].setAttribute('id',i);
            me.softKillTopicMaterial[i] = document.createElement('div');
            me.softKillTopicMaterial[i].setAttribute('style', 'width:340px;height:20px;border:1px solid #d8d8d8;float:left; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;' );
            me.softKillSpan[i] = document.createElement('span');
            me.softKillSpan[i].innerHTML = arr[i].name;
            me.softKillTopicMaterial[i].appendChild(me.softKillSpan[i]);
            me.btnsDiv[i] = document.createElement('div');
            me.btnsDiv[i].setAttribute('style','width:123px;float:left;margin-left:12%');
            /* if(arr[i].fileType == 'mp4' || arr[i].fileType=='avi' ||arr[i].fileType == '3gp' || arr[i].fileType == 'mp3' || arr[i].fileType == 'rm' || arr[i].fileType == 'rmvb' || arr[i].fileType == 'mov' || arr[i].fileType == 'wmv' || arr[i].fileType == 'amv' || arr[i].fileType == 'dmv')
             {
             me.editBtn[i] = document.createElement('span');
             me.editBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;width:60px;padding: 0px 15px 2px');
             me.editBtn[i].innerHTML = mxResources.get('edit');
             me.editBtn[i].setAttribute('id',i);
             //fz 12.11
             me.btnsDiv[i].appendChild(me.editBtn[i]);
             mxEvent.addListener(me.editBtn[i], 'click',function () {
             recordNum = this.id;
             Ui.editVideo(arr[recordNum]);
             });
             }else{*/
            me.previewBtn[i] = document.createElement('span');
            me.previewBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;padding: 0px 15px 2px');
            me.previewBtn[i].innerHTML = mxResources.get('preview');
            me.previewBtn[i].setAttribute('id',i);
            me.btnsDiv[i].appendChild(me.previewBtn[i]);
            mxEvent.addListener(me.previewBtn[i], 'click',function () {
                recordNum = this.id;
                var showPath = arr[recordNum].filePath;
                var ownerId =  arr[recordNum].ownerId;
                var lRShowDialogBody = new LRShowDialogBody(Ui, arr[recordNum].name,arr[recordNum].id, showPath,arr[recordNum].fileType, ownerId);
                Ui.showDialog(lRShowDialogBody, 880, 650, true, true);
            });
            //}
            me.CancelBtn[i] = document.createElement('span');
            me.CancelBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;height:20px;padding: 0px 15px 2px');
            me.CancelBtn[i].innerHTML = mxResources.get('cancel');
            me.CancelBtn[i].setAttribute('id',i);
            me.CancelBtn[i].setAttribute('materialsId',arr[i].id);
            mxEvent.addListener(me.CancelBtn[i],'click',function (){
                recordNum = this.id;
                var knowlegNum = this.parentNode.parentNode.parentNode.id;
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                for (var m = 0; m < resources['resourceList'+knowlegNum].length; m++) {
                    if (resources['resourceList'+knowlegNum][m].id === this.getAttribute('materialsId')) {
                        //解除引用资源
                        Ui.communication.linkResource(false,resources['resourceList'+knowlegNum][m].id);
                        resources['resourceList' + knowlegNum].splice(m,1);
                    }
                }
            });
            me.btnsDiv[i].appendChild(me.CancelBtn[i]);
            me.softKillMaterial[i].appendChild(me.softKillTopicMaterial[i]);
            me.softKillMaterial[i].appendChild(me.btnsDiv[i]);
            me.SoftKillContext[k].appendChild(me.softKillMaterial[i]);
        }
        for(var i = 0; i< arr.length; i ++){
            var record = {
                "id": arr[i].id,
                "name": arr[i].name,
                "filePath":arr[i].filePath,
                "fileType":arr[i].fileType,
                "ownerId":arr[i].ownerId,
                "sourceF":arr[i].sourceF
            };
            resourceList.push(record);
        }
        resources['resourceList'+k]= resourceList;
    }
    mxEvent.addListener(this.addSoftKillBtn[k], 'click',function () {
        fNum = this.id;
        Ui.showAllLearningResource('learningResSearch', '', '', false, '10011', function (arr) {
            if (arr) {
                for (var i = 0; i < arr.length; i++ ) {
                    // 引用新的资源
                    Ui.communication.linkResource(true,arr[i].materialsId);
                    me.softKillMaterial[i] = document.createElement('div');
                    me.softKillMaterial[i].setAttribute('style','width:97%;height:22px;margin-left:10px');
                    me.softKillMaterial[i].setAttribute('id',i+addNum);
                    me.softKillTopicMaterial[i] = document.createElement('div');
                    me.softKillTopicMaterial[i].setAttribute('style', 'width:340px;height:20px;border:1px solid #d8d8d8;float:left; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;' );
                    me.softKillSpan[i] = document.createElement('span');
                    me.softKillSpan[i].innerHTML = arr[i].fileName;
                    me.softKillTopicMaterial[i].appendChild(me.softKillSpan[i]);
                    me.btnsDiv[i] = document.createElement('div');
                    me.btnsDiv[i].setAttribute('style','width:123px;float:left;margin-left:12%');
                    /*  if(arr[i].fileType == 'mp4' || arr[i].fileType=='avi' ||arr[i].fileType == '3gp' || arr[i].fileType == 'mp3' || arr[i].fileType == 'rm' || arr[i].fileType == 'rmvb' || arr[i].fileType == 'mov' || arr[i].fileType == 'wmv' || arr[i].fileType == 'amv' || arr[i].fileType == 'dmv')
                     {
                     me.editBtn[i] = document.createElement('span');
                     me.editBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;width:60px;padding: 0px 15px 2px');
                     me.editBtn[i].innerHTML = mxResources.get('edit');
                     me.editBtn[i].setAttribute('id',i+addNum);
                     //fz 12.11
                     me.btnsDiv[i].appendChild(me.editBtn[i]);
                     mxEvent.addListener(me.editBtn[i], 'click',function () {
                     recordNum = this.id - addNum;
                     Ui.editVideo(arr[recordNum]);
                     });
                     }else{*/
                    me.previewBtn[i] = document.createElement('span');
                    me.previewBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;padding: 0px 15px 2px');
                    me.previewBtn[i].innerHTML = mxResources.get('preview');
                    me.previewBtn[i].setAttribute('id',i+addNum);
                    me.btnsDiv[i].appendChild(me.previewBtn[i]);
                    mxEvent.addListener(me.previewBtn[i], 'click',function () {
                        recordNum = this.id - addNum;
                        var showPath;
                        if (arr[recordNum].filePath) {
                            showPath = arr[recordNum].filePath;
                        }else if (arr[recordNum].transformF) {
                            showPath = arr[recordNum].transformF;
                        }else {
                            showPath = arr[recordNum].sourceF;
                        }
                        var lRShowDialogBody = new LRShowDialogBody(Ui, arr[recordNum].fileName, arr[recordNum].materialsId, showPath, arr[recordNum].fileType, arr[recordNum].ownerId);
                        Ui.showDialog(lRShowDialogBody, 880, 650, true, true);
                    });
                    //}
                    me.CancelBtn[i] = document.createElement('span');
                    me.CancelBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;height:20px;padding: 0px 15px 2px');
                    me.CancelBtn[i].innerHTML = mxResources.get('cancel');
                    me.CancelBtn[i].setAttribute('id',i+addNum);
                    me.CancelBtn[i].setAttribute('materialsId', arr[i].materialsId);
                    mxEvent.addListener(me.CancelBtn[i],'click',function (){
                        recordNum = this.id;
                        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                        for (var m = 0; m < resources['resourceList'+fNum].length; m++) {
                            if (resources['resourceList'+fNum][m].id === this.getAttribute('materialsId')) {
                                // 解除引用资源
                                Ui.communication.linkResource(false,resources['resourceList'+fNum][m].id);
                                resources['resourceList' + fNum].splice(m,1);
                            }
                        }
                    });
                    me.btnsDiv[i].appendChild(me.CancelBtn[i]);
                    me.softKillMaterial[i].appendChild(me.softKillTopicMaterial[i]);
                    me.softKillMaterial[i].appendChild(me.btnsDiv[i]);
                    me.SoftKillContext[fNum].appendChild(me.softKillMaterial[i]);
                }
                for(var i = 0; i< arr.length; i ++){
                    var record = {
                        "id": arr[i].materialsId,
                        "name": arr[i].fileName,
                        "filePath": arr[i].filePath,
                        "fileType":arr[i].fileType,
                        "ownerId":arr[i].ownerId,
                        "sourceF":arr[i].sourceF
                    };
                    resourceList.push(record);
                }
                resources['resourceList'+fNum]= resourceList;
            }
        });
    });
    var br1 = document.createElement('br');
    this.topicSoftKill[k].appendChild(this.SoftKillContext[k]);
    this.dialogBodyContainer[k].appendChild(this.topicSoftKill[k]);
    this.dialogBodyContainer[k].appendChild(br1);
    this.dialogContainer.appendChild(this.dialogBodyContainer[k]);
    this.text.value = '';
    return this.dialogBodyContainer[k];
}
RelatedKnowledge.prototype.getContainer = function () {
    return this.div;
};

// 相关技能 by adamm
var resources2={};
var k2;
var RelateSkill = function(Ui,cell, title,originalSkill) {
    this.skillName = [];
    this.file = [];
    this.div = document.createElement('div');
    this.dialogContainer = [];
    this.dialogBodyContainer = [];
    this.topicSoftKill = [];
    this.titleSoftKill = [];
    this.titleSoftKillDiv = [];
    this.btDiv = [];
    this.topicSoftKillName = [];
    this.addSoftKillBtn = [];
    this.setRole = [];
    this.SoftKillContext = [];
    this.softKillMaterial = [];
    this.softKillTopicMaterial = [];
    this.softKillSpan = [];
    this.btnsDiv = [];
    this.editBtn = [];
    this.previewBtn = [];
    this.CancelBtn = [];
    var recordNum = 0;
    var fNum = 0;
    k2 = -1;
    this.dialogContainer = document.createElement('div');
    this.dialogContainer.setAttribute('style', 'min-height:150px;width:100%');
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('style','height:50px');
    this.text1 = document.createElement('input');
    this.text1.setAttribute('style', 'margin: 10px 5px;float:left;height:23px');
    this.text1.placeholder = mxResources.get('inputSkillName');
    var adBtn = document.createElement('button');
    //adBtn.setAttribute('style', 'margin:5px');
    adBtn.innerHTML = mxResources.get('addSkill');
    adBtn.className = 'geBtn gePrimaryBtn';
    adBtn.setAttribute('style', 'margin:10px;float:left;height:28px');
    btnDiv.appendChild(this.text1);
    btnDiv.appendChild(adBtn);
    this.dialogContainer.appendChild( btnDiv);
    if (originalSkill) {
        var originalSkillJson = JSON.parse(originalSkill);
        for (var i = 0; i < originalSkillJson.length; i++) {
            k2++;
            this.text1.value = originalSkillJson[i].topic;
            this.skillName[k2] = originalSkillJson[i].topic;
            var skillContainer = this.createSkillArea(Ui, cell, recordNum, fNum, originalSkillJson[i]);
            var oneSkillContainer = Ui.formItems.genDropDownBar(mxResources.get('skill')+(k2+1)+'----"'+this.skillName[k2]+'"','100','',skillContainer,false,mxUtils.bind(this,function(k2){
                return mxUtils.bind(this,function(){
                    this.skillName[k2] = null;
                });
            })(k2));
            this.dialogContainer.appendChild(oneSkillContainer.getElContainer());
        }
    }
    mxEvent.addListener(adBtn, 'click', mxUtils.bind(this, function () {
        if (!this.text1.value) {
            //alert(mxResources.get('nullSkillInput'));
            Ui.showDialog(new tipDialogBody(Ui, mxResources.get('nullSkillInput')), 300, null, true, true);
        } else {
            k2++;
            this.skillName[k2] = this.text1.value;
            var skillContainer = this.createSkillArea(Ui, cell, recordNum, fNum);
            var oneSkillContainer = Ui.formItems.genDropDownBar(mxResources.get('skill')+(k2+1)+'----"'+this.skillName[k2]+'"','100','',skillContainer,false,mxUtils.bind(this,function(k2){
                return mxUtils.bind(this,function(){
                    this.skillName[k2] = null ;
                });
            })(k2));
            this.dialogContainer.appendChild(oneSkillContainer.getElContainer());
        }
    }));

    this.div.appendChild(this.dialogContainer);
};
RelateSkill.prototype.createSkillArea = function(Ui,cell,recordNum,fNum,originalSkill) {
    this.dialogBodyContainer[k2] = document.createElement('div');
    this.dialogBodyContainer[k2].setAttribute('style','min-height:150px;');
    this.dialogBodyContainer[k2].setAttribute('id',k2);
    this.topicSoftKill[k2] = document.createElement('div');
    this.topicSoftKill[k2].setAttribute('style','min-height:148px;');
    this.titleSoftKill[k2] = document.createElement('div');
    this.titleSoftKill[k2].setAttribute('style','height:35px;');
    this.titleSoftKillDiv[k2] = document.createElement('div');
    this.titleSoftKillDiv[k2].setAttribute('style','height:34px;margin-left:5px;padding-top:5px;');
    this.topicSoftKillName[k2] = document.createElement('span');
    this.topicSoftKillName[k2].setAttribute('style','width:70px;font-size:13px;font-weight: bold');
    this.topicSoftKillName[k2].innerHTML = this.skillName[k2];
    this.btDiv[k2] = document.createElement('div');
    this.btDiv[k2].setAttribute('style','height:30px;float:right;width:70px');
    this.addSoftKillBtn[k2] = document.createElement('span');
    this.addSoftKillBtn[k2].innerHTML = mxResources.get('addMaterial');
    this.addSoftKillBtn[k2].setAttribute('id',k2);
    this.addSoftKillBtn[k2].setAttribute('style','font-weight:bold;height:29px;line-height:27px;outline:0;padding:5px 5px 5px;background-color:#f5f5f5;font-size:13px;border-radius:2px;border:1px solid #d8d8d8;cursor:pointer;color:#333;width:60px;text-align:center');
    this.titleSoftKillDiv[k2].appendChild(this.topicSoftKillName[k2]);
    this.btDiv[k2].appendChild(this.addSoftKillBtn[k2]);
    if(cell.parent.id !=='1' && cell.parent.getAttribute('label')){
        var label = cell.parent.getAttribute('label').split('+');
        if(label.length > 1){
            var userData = [];
            for (var i = 0; i < label.length; i++) {
                userData.push({id: label[i], name: label[i]});
            }
            var originalRole;
            if(originalSkill && originalSkill.role) {
                originalRole = JSON.stringify(originalSkill.role);
            }

            this.setRole[k2] = Ui.formItems.genComboBox('', 'member', cell, userData, '90',null,originalRole);
            this.setRole[k2].getElContainer().setAttribute('style','float:right;    height:100px;overflow-y:auto;padding-right:0px;width:150px;margin-right:10px');
            this.titleSoftKillDiv[k2].appendChild(this.setRole[k2].getElContainer());
        }
    }
    this.titleSoftKillDiv[k2].appendChild(this.btDiv[k2]);
    this.titleSoftKill[k2].appendChild(this.titleSoftKillDiv[k2]);
    this.topicSoftKill[k2].appendChild(this.titleSoftKill[k2]);
    this.SoftKillContext[k2] = document.createElement('div');
    this.SoftKillContext[k2].setAttribute('style','border:5px;margin-left:20px');
    this.SoftKillContext[k2].setAttribute('id',k2);
    var me = this;
    var resourceList = [];
    var addNum = 0;
    if(originalSkill) {
        var arr = originalSkill.link;
        addNum = arr.length;
        for(var i=0;i<arr.length;i++) {
            me.softKillMaterial[i] = document.createElement('div');
            me.softKillMaterial[i].setAttribute('style','width:97%;height:22px;margin-left:10px');
            me.softKillMaterial[i].setAttribute('id',i);
            me.softKillTopicMaterial[i] = document.createElement('div');
            me.softKillTopicMaterial[i].setAttribute('style', 'width:340px;height:20px;border:1px solid #d8d8d8;float:left; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;' );
            me.softKillSpan[i] = document.createElement('span');
            me.softKillSpan[i].innerHTML = arr[i].name;
            me.softKillTopicMaterial[i].appendChild(me.softKillSpan[i]);
            me.btnsDiv[i] = document.createElement('div');
            me.btnsDiv[i].setAttribute('style','width:123px;float:left;margin-left:12%');
            /* if(arr[i].fileType == 'mp4' || arr[i].fileType=='avi' ||arr[i].fileType == '3gp' || arr[i].fileType == 'mp3' || arr[i].fileType == 'rm' || arr[i].fileType == 'rmvb' || arr[i].fileType == 'mov' || arr[i].fileType == 'wmv' || arr[i].fileType == 'amv' || arr[i].fileType == 'dmv')
             {
             me.editBtn[i] = document.createElement('span');
             me.editBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;width:60px;padding: 0px 15px 2px');
             me.editBtn[i].innerHTML = mxResources.get('edit');
             me.editBtn[i].setAttribute('id',i);
             //fz 12.11
             //me.btnsDiv[i].appendChild(me.editBtn[i]);
             mxEvent.addListener(me.editBtn[i], 'click',function () {
             recordNum = this.id;
             Ui.editVideo(arr[recordNum]);
             });
             }else{*/
            me.previewBtn[i] = document.createElement('span');
            me.previewBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;padding: 0px 15px 2px');
            me.previewBtn[i].innerHTML = mxResources.get('preview');
            me.previewBtn[i].setAttribute('id',i);
            me.btnsDiv[i].appendChild(me.previewBtn[i]);
            mxEvent.addListener(me.previewBtn[i], 'click',function () {
                recordNum = this.id;
                var showPath = arr[recordNum].filePath;
                var ownerId =  arr[recordNum].ownerId;
                var lRShowDialogBody = new LRShowDialogBody(Ui, arr[recordNum].name,arr[recordNum].id, showPath,arr[recordNum].fileType, ownerId);
                Ui.showDialog(lRShowDialogBody, 880, 650, true, true);
            });
            //}
            me.CancelBtn[i] = document.createElement('span');
            me.CancelBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;height:20px;padding: 0px 15px 2px');
            me.CancelBtn[i].innerHTML = mxResources.get('cancel');
            me.CancelBtn[i].setAttribute('id',i);
            me.CancelBtn[i].setAttribute('materialsId',arr[i].id);
            mxEvent.addListener(me.CancelBtn[i],'click',function (){
                recordNum = this.id;
                var skillNum = this.parentNode.parentNode.parentNode.id;
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                for (var m = 0; m < resources2['resourceList'+skillNum].length; m++) {
                    if (resources2['resourceList'+skillNum][m].id === this.getAttribute('materialsId')) {
                        Ui.communication.linkResource(false,resources2['resourceList'+skillNum][m].id);
                        resources2['resourceList'+skillNum].splice(m,1);
                    }
                }
            });
            me.btnsDiv[i].appendChild(me.CancelBtn[i]);
            me.softKillMaterial[i].appendChild(me.softKillTopicMaterial[i]);
            me.softKillMaterial[i].appendChild(me.btnsDiv[i]);
            me.SoftKillContext[k2].appendChild(me.softKillMaterial[i]);
        }
        for(var i = 0; i< arr.length; i ++){
            var record = {
                "id": arr[i].id,
                "name": arr[i].name,
                "description":arr[i].description,
                "fileType":arr[i].fileType,
                "ownerId":arr[i].ownerId,
                "sourceF":arr[i].sourceF
            };
            resourceList.push(record);
        }
        resources2['resourceList'+k2] = resourceList;
    }
    mxEvent.addListener(this.addSoftKillBtn[k2], 'click',function ()                              {
        fNum = this.id;
        Ui.showAllLearningResource('learningResSearch', '', '',false, '10011', function (arr) {
            if (arr) {
                for (var i = 0; i < arr.length; i++ ) {
                    Ui.communication.linkResource(true,arr[i].materialsId);
                    me.softKillMaterial[i] = document.createElement('div');
                    me.softKillMaterial[i].setAttribute('style','width:97%;height:22px;margin-left:10px');
                    me.softKillMaterial[i].setAttribute('id',i+addNum);
                    me.softKillTopicMaterial[i] = document.createElement('div');
                    me.softKillTopicMaterial[i].setAttribute('style', 'width:340px;height:20px;border:1px solid #d8d8d8;float:left; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;' );
                    me.softKillSpan[i] = document.createElement('span');
                    me.softKillSpan[i].innerHTML = arr[i].fileName;
                    me.softKillTopicMaterial[i].appendChild(me.softKillSpan[i]);
                    me.btnsDiv[i] = document.createElement('div');
                    me.btnsDiv[i].setAttribute('style','width:123px;float:left;margin-left:12%');
                    //if(arr[i].fileType == 'mp4' || arr[i].fileType=='avi' ||arr[i].fileType == '3gp' || arr[i].fileType == 'mp3' || arr[i].fileType == 'rm' || arr[i].fileType == 'rmvb' || arr[i].fileType == 'mov' || arr[i].fileType == 'wmv' || arr[i].fileType == 'amv' || arr[i].fileType == 'dmv')
                    //{
                    //    me.editBtn[i] = document.createElement('span');
                    //    me.editBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;width:60px;padding: 0px 15px 2px');
                    //    me.editBtn[i].innerHTML = mxResources.get('edit');
                    //    me.editBtn[i].setAttribute('id',i+addNum);
                    //    //fz 12.11
                    //    //me.btnsDiv[i].appendChild(me.editBtn[i]);
                    //    mxEvent.addListener(me.editBtn[i], 'click',function () {
                    //        recordNum = this.id - addNum;
                    //        Ui.editVideo(arr[recordNum]);
                    //    });
                    //}else{
                    me.previewBtn[i] = document.createElement('span');
                    me.previewBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;padding: 0px 15px 2px');
                    me.previewBtn[i].innerHTML = mxResources.get('preview');
                    me.previewBtn[i].setAttribute('id',i+addNum);
                    me.btnsDiv[i].appendChild(me.previewBtn[i]);
                    mxEvent.addListener(me.previewBtn[i], 'click',function () {
                        recordNum = this.id - addNum;
                        var showPath;
                        if (arr[recordNum].filePath) {
                            showPath = arr[recordNum].filePath;
                        }else if (arr[recordNum].transformF) {
                            showPath = arr[recordNum].transformF;
                        }else {
                            showPath = arr[recordNum].sourceF;
                        }
                        var lRShowDialogBody = new LRShowDialogBody(Ui, arr[recordNum].fileName, arr[recordNum].materialsId, showPath, arr[recordNum].fileType, arr[recordNum].ownerId);
                        Ui.showDialog(lRShowDialogBody, 880, 650, true, true);
                    });
                    //}
                    me.CancelBtn[i] = document.createElement('span');
                    me.CancelBtn[i].setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;height:20px;padding: 0px 15px 2px');
                    me.CancelBtn[i].innerHTML = mxResources.get('cancel');
                    me.CancelBtn[i].setAttribute('id',i+addNum);
                    me.CancelBtn[i].setAttribute('materialsId',arr[i].materialsId);
                    mxEvent.addListener(me.CancelBtn[i],'click',function () {
                        recordNum = this.id;
                        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                        for (var m = 0; m < resources2['resourceList'+fNum].length; m++) {
                            if (resources2['resourceList'+fNum][m].id === this.getAttribute('materialsId')) {
                                console.log(1);
                                Ui.communication.linkResource(false,resources2['resourceList'+fNum][m].id);
                                resources2['resourceList'+fNum].splice(m,1);
                            }
                        }
                    });
                    me.btnsDiv[i].appendChild(me.CancelBtn[i]);
                    me.softKillMaterial[i].appendChild(me.softKillTopicMaterial[i]);
                    me.softKillMaterial[i].appendChild(me.btnsDiv[i]);
                    me.SoftKillContext[fNum].appendChild(me.softKillMaterial[i]);
                }
                for(var i = 0; i< arr.length; i ++){
                    var record = {
                        "id": arr[i].materialsId,
                        "name": arr[i].fileName,
                        "description":arr[i].description,
                        "fileType":arr[i].fileType,
                        "ownerId":arr[i].ownerId,
                        "sourceF":arr[i].sourceF
                    };
                    resourceList.push(record);
                }
                resources2['resourceList'+fNum]= resourceList;
            }
        });
    });
    var br1 = document.createElement('br');
    this.topicSoftKill[k2].appendChild(this.SoftKillContext[k2]);
    this.dialogBodyContainer[k2].appendChild(this.topicSoftKill[k2]);
    this.dialogBodyContainer[k2].appendChild(br1);
    this.dialogContainer.appendChild(this.dialogBodyContainer[k2]);
    this.text1.value = '';
    return this.dialogBodyContainer[k2];
};
RelateSkill.prototype.getContainer = function () {
    return this.div;
};

//学习情景
var LearningEnvir = function(ui,cell,title,originalSitu){
    this.resource = {};
    this.cell = cell;
    this.ui = ui;
    var me = this;
    var originalSituation = originalSitu;
    var originalSituJson = originalSituation?JSON.parse(originalSituation):'';
    this.div = document.createElement('div');
    //tt暂时用来解决按钮组btns放置位置的问题
    var tt = document.createElement('div');
    this.div.appendChild(tt);
    //按钮组
    var btns = document.createElement('div');
    btns.setAttribute('style','text-align:right;padding-right:5px;height:30px;with:100%;padding-top:5px;');
    //上传学习情境按钮
    this.uploadEnvirBtn = document.createElement('button');
    this.uploadEnvirBtn.innerHTML = mxResources.get('uploadLearningEnvir');
    this.uploadEnvirBtn.className = 'geBtn gePrimaryBtn';
    //应用按钮
    //var applyBtn = document.createElement('button');
    //applyBtn.innerHTML = mxResources.get('apply');
    //applyBtn.className = 'geBtn gePrimaryBtn';
    if(originalSituJson){
        if(originalSituJson.resourceName!= undefined){
            var createRes = me.createResourceDiv(originalSituJson.resourceName,originalSituJson.resourceType);
            tt.appendChild(createRes);
            //预览
            mxEvent.addListener(me.learningPreBtn,'click',mxUtils.bind(this,function() {
                var showPath;
                if(originalSituJson.resourceType ==='mp4' || originalSituJson.resourceType ==='avi' ||originalSituJson.resourceType ==='3gp' ||originalSituJson.resourceType ==='amv' ||originalSituJson.resourceType ==='mp3' ||originalSituJson.resourceType ==='rmvb' ||originalSituJson.resourceType ==='rm' ||originalSituJson.resourceType ==='mov' ||originalSituJson.resourceType ==='wmv' ||originalSituJson.resourceType ==='dmv' ||originalSituJson.resourceType ==='html'){
                    showPath = 'upload/'+originalSituJson.resourceId+'.'+originalSituJson.resourceType;
                }else{
                    showPath = 'transfer/'+ originalSituJson.resourceId+'.pdf';
                }
                //todo
                var lRShowDialogBody = new LRShowDialogBody(me.ui, originalSituJson.resourceName, showPath);
                me.ui.showDialog(lRShowDialogBody, 880, 650, true, true);
            }));
            me.resource = {
                "resourceId":originalSituJson.resourceId,
                "resourceType":originalSituJson.resourceType,
                "resourceName":originalSituJson.resourceName
            };
            mxEvent.addListener(me.learningEditBtn,'click',function(){
                var query = {
                    'materialsId':originalSituJson.resourceId
                };
                me.ui.communication.getvideoRes(query,mxUtils.bind(this, function (message){
                    var videoFile = message;
                    me.ui.editVideo(videoFile, function (situationToXml) {
                        me.resource['segments'] = situationToXml['segments'];
                    });
                }));
            });
            //重置
            mxEvent.addListener(me.learningResetBtn,'click',function(){
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                me.resource = {};
                me.uploadEnvirBtn.setAttribute('style','display:block');
                me.ui.communication.linkResource(true,originalSituJson.resourceId);
            });
        }
    }
    mxEvent.addListener(this.uploadEnvirBtn,'click',mxUtils.bind(this,function() {
        //applyBtn.setAttribute('style','display:block');
        me.ui.showAllLearningResource('learningResSearch','','',false,'00011',function(arr){
            if(!arr || arr.length !== 1) {
                //alert(mxResources.get('pleaseChooseAFile'));
                me.ui.showDialog(new tipDialogBody(me.ui, mxResources.get('pleaseChooseAFile')), 300, null, true, true);
            }else{
                me.ui.communication.linkResource(true,arr[0].materialsId);
                var createResDiv = me.createResourceDiv(arr[0].fileName,arr[0].fileType);
                //var createResDiv = me.createResourceDiv(arr[0].fileName);
                tt.appendChild(createResDiv);
                mxEvent.addListener(me.learningPreBtn,'click',mxUtils.bind(this,function() {
                    var showPath ;
                    if(arr[0].transformF) {
                        showPath = arr[0].transformF;
                    }else{
                        showPath = arr[0].sourceF;
                    }
                    //todo
                    var lRShowDialogBody = new LRShowDialogBody(me.ui, arr[0].fileName, showPath);
                    me.ui.showDialog(lRShowDialogBody, 880, 650, true, true);
                }));
                me.resource = {
                    "resourceId":arr[0].materialsId,
                    "resourceType":arr[0].fileType,
                    "resourceName":arr[0].fileName
                };
                mxEvent.addListener(me.learningEditBtn,'click',function(){
                    var query = {
                        'materialsId':arr[0].materialsId
                    };
                    me.ui.communication.getvideoRes(query,mxUtils.bind(this, function (message){
                        var videoRes = message;
                        me.ui.editVideo(videoRes, function (situationToXml) {
                            me.resource['segments'] = situationToXml['segments'];
                        });
                    }));
                });
                mxEvent.addListener(me.learningResetBtn,'click',function(){
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                    me.resource = {};
                    me.uploadEnvirBtn.setAttribute('style','display:block');
                    me.ui.communication.linkResource(false,arr[0].materialsId);
                });
            }
        });
    }));
    //mxEvent.addListener(applyBtn,'click',mxUtils.bind(this,function() {
    //    cell.setAttribute('studySituation',JSON.stringify(resource));
    //    ui.communication.handleLinkResourceList();
    //    ui.editor.setModified(true);
    //    alert('success');
    //}));
    //btns.appendChild(applyBtn);
    btns.appendChild(this.uploadEnvirBtn);
    this.div.appendChild(btns);
};
LearningEnvir.prototype.applyTheTab = function() {
    this.cell.setAttribute('studySituation',JSON.stringify(this.resource));
    this.ui.communication.handleLinkResourceList();
    //this.ui.editor.setModified(true);
    console.log('4学习情境保存成功');
};
LearningEnvir.prototype.getContainer = function() {
    return this.div;
};
LearningEnvir.prototype.createResourceDiv = function(name,fileType){
    //上传按钮隐藏
    this.uploadEnvirBtn.setAttribute('style','display:none');
    //已上传的一行资料
    this.learningEnvirDiv = document.createElement('div');
    this.learningEnvirDiv.setAttribute('style','overflow:auto;width:96%;margin-left:10px;padding-top:5px');
    //资源文件名
    this.learningNameDiv = document.createElement('div');
    this.learningNameDiv.setAttribute('style', 'width:340px;height:20px;border:1px solid #d8d8d8;float:left; white-space:nowrap;text-overflow:ellipsis;overflow:hidden');
    this.learningNameDiv.innerHTML = name;
    //按钮组
    this.btnsDiv = document.createElement('div');
    this.btnsDiv.setAttribute('style','float:left;margin-left:12%');
    //预览按钮
    this.learningPreBtn = document.createElement('span');
    this.learningPreBtn.setAttribute('style','text-align:center;border:1px solid #d8d8d8;cursor:pointer;width:60px;padding: 0px 15px 2px');
    this.learningPreBtn.innerHTML = mxResources.get('preview');
    //编辑按钮
    this.learningEditBtn = document.createElement('span');
    this.learningEditBtn.setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;height:20px;padding: 0px 15px 2px');
    this.learningEditBtn.innerHTML = mxResources.get('edit');
    //重置按钮
    this.learningResetBtn = document.createElement('span');
    this.learningResetBtn.setAttribute('style', 'text-align:center;border:1px solid #d8d8d8;cursor:pointer;height:20px;padding: 0px 15px 2px');
    this.learningResetBtn.innerHTML = mxResources.get('reset');
    this.btnsDiv.appendChild(this.learningPreBtn);
    if(fileType === 'mp4' || fileType === 'avi' || fileType === '3gp' || fileType === 'amv' || fileType === 'mp3' || fileType === 'rmvb' || fileType === 'rm' || fileType === 'mov' || fileType === 'wmv' || fileType === 'dmv'){
        this.btnsDiv.appendChild(this.learningEditBtn);
    }
    this.btnsDiv.appendChild(this.learningResetBtn);
    this.learningEnvirDiv.appendChild(this.learningNameDiv);
    this.learningEnvirDiv.appendChild(this.btnsDiv);
    return this.learningEnvirDiv;
};

var  LRShowDialogBody = function(ui, fileName, fileId, path, fileType, ownerId){
    DialogBody.call(this, fileName);
    /* v2.1_170301
    var tmp = path.split('.');
    var fileType = tmp[tmp.length - 1];var beginNum = 1;
    if (path[0]!='/'){beginNum = 0;}
    tmp = path.split('/');
    if (tmp[beginNum] == userName + '_sys_file'){
        path = '/user_file' + path;
        ownerId = 'system';
    }
    var fileName = tmp[tmp.length - 1];*/
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','width:100%;height:612px;');

    var fileShowIframe = document.createElement('iframe');
    form.appendChild(fileShowIframe);
    if (ui.isOffice(fileType)){
        /*
        var url = 'http://' + pageOfficeHost + '/NKTOForMyDemo/MyNTKODemo/MyFirstWordEditor.jsp';
        var fileUrl = MATERIAL_URL.substring(7) + '/fileRead?fileId=' + fileId + '&userId=' + ownerId + '&createType=own&ignoreme=';
        fileUrl = escape(fileUrl);
        var permission = 'r';
        var officeHref = "PageOffice://|" + url + "?path=" + fileUrl + "&fileName=" + fileName + "&permission=" + permission + "&userName=" + userName;
*/
        var filePath = '';
        $.ajax({
            url: '/yn-engine/fileManager/getOwnFiles',
            data:{fileId : arr[0].materialsId},
            cache: false,
            async:false,
            type: 'POST',
            success : function(result){
                if(result){
                    result = JSON.parse(result);
                    console.log(result[0]);
                    filePath = result[0].filePath;
                }
            }
        });
        var url = 'http://' + pageOfficeHost + '/yn-engine/pageOffice/editFile.jsp';
        var permission = 'r';
        var officeHref = "PageOffice://|" + url + "?filePath=" + filePath + "&fileName=" + fileName + "&permission=" + permission + "&userName=" + userName;

        var openOfficeBtn = document.createElement('a');
        openOfficeBtn.innerHTML = '单击此处打开文件: '+fileName;
        openOfficeBtn.href = officeHref;
        form.removeChild(form.firstChild);
        form.appendChild(openOfficeBtn);
        form.setAttribute('style', 'height: 592px;padding: 10px;font-size: medium;');
    }else if (fileType == 'html' || fileType == 'txt'){
        //fileShowIframe.setAttribute('src', '/load/loadStr?path='+path+'&ownerId='+ownerId);
        fileShowIframe.setAttribute('src', MATERIAL_URL + '/fileContentRead?fileId=' + fileId + '&userId=' + ownerId + '&createType=own');
    }else {
        //fileShowIframe.setAttribute('src', '/load/loadPdfFile?path='+path+'&ownerId='+ownerId/*resourceServerHost + filepath*/);
        fileShowIframe.setAttribute('src', MATERIAL_URL + '/fileRead?fileId=' + fileId + '&userId=' + ownerId + '&createType=own');
    }
    fileShowIframe.setAttribute('style', 'width:100%;height:100%;border:0px;');

    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';

    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    //buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
};
mxUtils.extend(LRShowDialogBody, DialogBody);

var FormEditDialogBody = function(ui, fileName, fileId, ownerId){
    DialogBody.call(this, fileName);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','width:100%;height:612px;');
    var fileShowIframe = document.createElement('iframe');
    form.appendChild(fileShowIframe);
    fileShowIframe.setAttribute('src', MATERIAL_FORM_URL + '/design.jsp?formId=' + fileId + '&userId=' + ownerId);
    fileShowIframe.setAttribute('style', 'width:100%;height:100%;border:0px;');

    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';

    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    //buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
};
mxUtils.extend(FormEditDialogBody, DialogBody);

var FormManageDialogBody = function(ui, ownerId, next){
    DialogBody.call(this, '表单管理');
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','width:100%;height:612px;');
    var fileShowIframe = document.createElement('iframe');
    form.appendChild(fileShowIframe);
    fileShowIframe.setAttribute('src', MATERIAL_FORM_URL + '/list.jsp?userId=' + ownerId);
    fileShowIframe.setAttribute('style', 'width:100%;height:100%;border:0px;');

    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        ui.hideDialog.apply(ui, arguments);
        next();
    });
    cancelBtn.className = 'geBtn';

    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    //buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
};
mxUtils.extend(FormManageDialogBody, DialogBody);

var FormPreviewDialogBody = function(ui, fileName, formId){
    DialogBody.call(this, fileName);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','width:100%;height:612px;');
    var fileShowIframe = document.createElement('iframe');
    fileShowIframe.setAttribute('id', 'form-show'+formId);
    fileShowIframe.setAttribute('srcdoc', '网络卡，请等等哦:)');
    fileShowIframe.setAttribute('style', 'width:100%;height:100%;border:0px;');
    form.appendChild(fileShowIframe);
    //var formData = {"formId":"8ad1e426-b3da-47c0-9ff0-c3e4d6828d3b","formName":"测试表单123","description":"近日，习近平作出重要指示，要求广大党员、干部要向廖俊波同志学习，不忘初心、扎实工作、廉洁奉公，身体力行把党的方针政策落实到基层和群众中去，真心实意为人民造福。习近平称廖俊波以实际行动体现了对党忠诚、心系群众、忘我工作、无私奉献的优秀品质，无愧于“全国优秀县委书记”的称号。","userId":"zhangll","userName":null,"formStatus":"0","formHtml":"<div class=\"my-form\"><div class=\"form-group\" align=\"center\" style=\"margin-bottom:20px;\"><span style=\"font-size:20px;\" form-id=\"8ad1e426-b3da-47c0-9ff0-c3e4d6828d3b\"><strong>测试表单123</strong></span></div><div class=\"form-group\"><label for=\"059e4498-f685-489b-8a58-8910114cb26f\">损坏程度：</label><select class=\"form-control form-attr\" name=\"[object HTMLInputElement]\" id=\"059e4498-f685-489b-8a58-8910114cb26f\"><option value=\"\">---请选择---</option><option value=\"optionValue_0\">不严重</option><option value=\"optionValue_1\">一般</option><option value=\"optionValue_2\">严重</option><option value=\"optionValue_3\" selected=\"\">超级严重</option></select></div></div>","formXml":"","createTime":"2017-04-27 16:23:49","lastUpdateTime":"2017-04-27 18:07:29"};
    $.get(MATERIAL_FORM_URL + '/getForm?formId=' + formId, function (formData) {
        if (formData){
            fileShowIframe/*$('#form-show'+formId)[0]*/.setAttribute('srcdoc', formData.formHtml);
        }
    });

    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';

    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    //buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
};
mxUtils.extend(FormPreviewDialogBody, DialogBody);

var EditLRPropertyDialogBody = function (ui, cell, title, usageType, callback) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','height: 100%; padding: 15px;');

    var sOptions = [{name:mxResources.get('uploadAMaterial'),value:1, disabled:'disabled'},{name:mxResources.get('editMaterialOnline'),value:2, checked:'checked'}];
    var sRadio = ui.formItems.genRadioField(mxResources.get('editType') + ':', 'editType', sOptions);
    var sRadioDOM = sRadio.getElContainer();
    form.appendChild(sRadioDOM);

    var titleDiv = document.createElement('div');
    var titleSpan = document.createElement('span');
    var titleInput = document.createElement('input');

    var uploadDiv = document.createElement('div');
    var uploadSpan = document.createElement('span');
    var uploadInput = document.createElement('input');
    var resultSpan = document.createElement('span');

    form.appendChild(titleDiv);
    titleDiv.appendChild(titleSpan);
    titleSpan.innerHTML = mxResources.get('materialsName') + ': ';
    titleDiv.appendChild(titleInput);
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'LRTitle');
    titleInput.setAttribute('style', 'width:70%;');
    titleDiv.appendChild(resultSpan);
    resultSpan.setAttribute('id', 'resultSpanId');
    resultSpan.setAttribute('style', 'float:right');

    uploadDiv.setAttribute('style', 'margin-top:5px; margin-bottom:5px;display:block');
    uploadDiv.setAttribute('id', 'uploadDivId');

    form.appendChild(uploadDiv);
    uploadDiv.appendChild(uploadSpan);
    uploadSpan.innerHTML = mxResources.get('uploadMaterial') + ': ';
    uploadDiv.appendChild(uploadInput);
    uploadInput.setAttribute('type', 'file');
    uploadInput.setAttribute('name', 'file');
    uploadInput.setAttribute('id', 'myfile');

    var editDiv = document.createElement('div');
    editDiv.setAttribute('style', 'display: none;margin: 20px 0;');
    editDiv.setAttribute('id', 'editDivId');
    // 16.08.30 fz 舍弃旧富文本编辑器
    //var eFieldCmpDescription = ui.formItems.genTextareaInputFieldPro(this, mxResources.get('description'), 'description', cell, '100%');
    //this.regRichTextAreaInstance(eFieldCmpDescription.getInputFieldId());
    //editDiv.appendChild(eFieldCmpDescription.getElContainer());
    var eFieldCmpDescription = document.createElement('textArea');
    eFieldCmpDescription.style.height = '500px';
    eFieldCmpDescription.className = 'workbenchDesc';
    this.addListener('onRendered', function () {
        $('.workbenchDesc').summernote({height: '200px'});
    });
    editDiv.appendChild(eFieldCmpDescription);
    form.appendChild(editDiv);
    if(usageType && usageType.trim() == 'richText'){
        uploadDiv.style.display = 'none';
        editDiv.style.display = 'block';
    } else {
        sRadio.radio[0].checked = 'checked';
        sRadio.radio[1].disabled = 'disabled';
    }
    var textAreaDiv = document.createElement('div');
    var textAreaSpan = document.createElement('span');
    textAreaSpan.setAttribute('style', 'display: block;');
    var textArea = ui.formItems.msTextarea('', '662px');
    textAreaDiv.setAttribute('style', 'border:1px;');
    form.appendChild(textAreaDiv);
    textAreaDiv.appendChild(textAreaSpan);
    textAreaDiv.appendChild(textArea);
    textArea.setAttribute('rows', '4');
    textArea.setAttribute('cols', '80%');
    textArea.setAttribute('id', 'desTextAreaId');
    textAreaSpan.innerHTML = mxResources.get('description') + ':';
    var options = [{name:mxResources.get('beginner'),value:1},{name:mxResources.get('primaryUser'),value:2},{name:mxResources.get('skilledUser'),value:3},{name:mxResources.get('expert'),value:4},{name:mxResources.get('master'),value:5}];
    var testRadio = ui.formItems.genRadioField(mxResources.get('applicableUsers') + ':', 'toUser', options);
    form.appendChild(testRadio.getElContainer());

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
        if (callback) {
            callback();
        }
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = document.createElement('button');
    applyBtn.className = 'geBtn gePrimaryBtn';
    if(!usageType || usageType.trim() != 'richText'){
        applyBtn.disabled = true;
    }
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
    applyBtn.innerHTML=mxResources.get('ok');

    mxEvent.addListener(sRadioDOM, 'click', mxUtils.bind(this, function () {
        var radioDOM = document.getElementsByName('editType');
        if(radioDOM[0].checked){//上传编辑
            editDiv.style.display = 'none';
            uploadDiv.setAttribute('style', 'margin-top:5px; margin-bottom:5px;display:block');
        }
        if(radioDOM[1].checked){//在线编辑
            uploadDiv.style.display = 'none';
            editDiv.style.display = 'block';
        }
    }));

    mxEvent.addListener(uploadInput, 'change', mxUtils.bind(this, function () {
        var files = uploadInput.files;
        if(files.length > 0){
            var fileName = files[0].name;
            var is = fileName.lastIndexOf('.');
            if(is == -1){
                //alert(mxResources.get('incorrectMaterialFormat'));
                ui.showDialog(new tipDialogBody(ui, mxResources.get('incorrectMaterialFormat')), 300, null, true, true);
                return false;
            }else{
                //过滤文件类型
                var testFileType = fileName.substring(is+1);
                if(AllowFileType.hasOwnProperty(testFileType.toLowerCase())) {
                    titleInput.value = fileName;
                    applyBtn.disabled = false;
                }else{
                    //alert(mxResources.get('lSystemDoesNotSupportTheFormatConvertAndReupload', testFileType));
                    ui.showDialog(new tipDialogBody(ui, mxResources.get('lSystemDoesNotSupportTheFormatConvertAndReupload', testFileType)), 300, null, true, true);
                    return false;
                }
            }
        }else{
            titleInput.value = '';
            applyBtn.disabled = true;
        }
    }));

    mxEvent.addListener(applyBtn, 'click', mxUtils.bind(this, function () {

        //alert(textArea.value);
        var formData = new FormData();
        var learningResObj = {usageType: usageType};

        var titleDOM = document.getElementById('LRTitle');
        var titleText = titleDOM.value;
        if(!titleText || titleText.trim() == ''){
            //alert(mxResources.get('inputMaterialName'));
            ui.showDialog(new tipDialogBody(ui, mxResources.get('inputMaterialName')), 300, null, true, true);
            return false;
        }

        //formData.append("fileName",titleText);

        var radioDOM = document.getElementsByName('editType');
        if(radioDOM[0].checked){//上传编辑
            learningResObj.isCreated = 'NO';

            var fileInput = document.getElementById('myfile');
            var fileText = fileInput.value;
            if(!fileText || fileText.trim() == ''){
                //alert(mxResources.get('uploadMaterialFirst'));
                ui.showDialog(new tipDialogBody(ui, mxResources.get('uploadMaterialFirst')), 300, null, true, true);
                return false;
            }

            var files = fileInput.files;
            var file = files[0];

            formData.append("userId", userId);
            formData.append("fileName",titleText);
            formData.append("file",file);

        }else if(radioDOM[1].checked){//在线编辑
            learningResObj.isCreated = 'YES';
            var richText = eFieldCmpDescription.value;
            //formData.append("uuid",'702bb230-3a08-46b9-856c-ae1c5f96b35f');
            titleText = titleText + '.html';
            formData.append("userId", userId);
            formData.append("fileName",titleText);
            formData.append("fileStr",richText);
        }

        var resultSpan = document.getElementById('resultSpanId');
        resultSpan.innerHTML = mxResources.get('editing');
        applyBtn.setAttribute('disabled', 'disabled');

        var radioDOM = document.getElementsByName('toUser');
        for(var i=0; i<radioDOM.length;i++){
            if(radioDOM[i].checked)
                learningResObj.toUser = radioDOM[i].value;
        }

        //var richText = inputFieldCmpDescription.getInputValue();
        var textAreaText = textArea.value;
        learningResObj.description = textAreaText;

        var xhr = new XMLHttpRequest();
        //var path = 'http://218.106.119.150:8088/OfficeTransfer/OfficeHandler';
        var path,isTransfer,isPdfNeeded;
        /* v2.1_20170103
         var fileType = titleText.split('.');
        if (fileType.length > 1 && (ui.isOffice(fileType[fileType.length-1]))){
            path = resourceServerHost + 'transfer';
            isTransfer = true;
            isPdfNeeded = true;
        } else if (fileType.length > 1 && learningResObj.isCreated==='YES'){
            formData.append("fileType", fileType[fileType.length-1]);
            path = '/saveStrToOC';
            isTransfer = false;
        }else {
            //传到易编后台
            formData.append("fileType", fileType[fileType.length-1]);
            path = '/saveFileToOC';
            isTransfer = false;
        }*/
        path = MATERIAL_URL + '/fileUpload';
        isTransfer = false;
        xhr.open('post', path, true);
        xhr.onload = function(e){
                if (this.status == 200) {
                    var result = this.response;
                    result = JSON.parse(result);
                    if (result.errorMsg) {
                        resultSpan.innerHTML = '';
                        applyBtn.setAttribute('disabled', false);
                        //alert(mxResources.get('failToEdit'));
                        ui.showDialog(new tipDialogBody(ui, mxResources.get('failToEdit')+'<br>' + result.errorMsg, 'left'), 300, null, true, true);
                        return false;
                    }
                    if (isTransfer) {
                        learningResObj.sourceF = result.sourceF;
                        //learningResObj.fileName = titleText + '.' + result.fileType;
                        learningResObj.fileName = titleText;
                        learningResObj.transformF = result.transformF;
                        learningResObj.fileType = result.fileType;
                        learningResObj.materialsId = result.materialsId;
                        learningResObj.size = result.fileSize;
                        learningResObj.isStatic = result.isStatic;
                        learningResObj.readTimes = 0;
                        learningResObj.downloadTimes = 0;
                        learningResObj.praiseTimes = 0;
                        if (result.videoImagePath)
                            learningResObj.videoImagePath = result.videoImagePath;
                        ui.communication.saveLearningRes(learningResObj, mxUtils.bind(this, function (message) {
                            resultSpan.innerHTML = '';
                            applyBtn.setAttribute('disabled', false);
                            //console.log(message);
                            //alert(mxResources.get('editSuccessfully'));
                            var paramObj = {
                                ofcPath: result.sourceF,
                                pdfPath: isPdfNeeded?result.transformF:false,
                                fileName: titleText.split('.')[0],
                                ofcType: fileType[fileType.length-1]
                            };
                            ui.communication.savePdfToOC(paramObj, function (data) {


                                ui.showDialog(new tipDialogBody(ui, mxResources.get('editSuccessfully')), 300, null, true, true);
                                ui.hideDialog.apply(ui, arguments);
                                ui.editLearningResource('learningResEdit', null, null, usageType, callback);
                                if (ui.flag === false) {
                                    //    //fanmiaomiao todo
                                    //ui.hideDialog.apply(ui, arguments);
                                    ui.hideDialog();
                                    //    ui.showAllLearningResource('learningResSearch');
                                }
                                //ui.isTrashSelected = false;
                                if (callback) {
                                    callback(learningResObj);
                                }


                            })
                        }));
                    }else {
                        if(result.fileId){
                            learningResObj.materialsId = result.fileId;
                            learningResObj.fileName = result.fileName;
                            learningResObj.fileType = result.fileType;
                            learningResObj.filePath = result.filePath;
                            learningResObj.createTime =new Date(result.createTime);
                            learningResObj.lastModify = new Date(result.createTime);
                            learningResObj.fileSize = result.fileSize;
                            learningResObj.createType = result.createType;
                            learningResObj.ownerId = result.ownerId;
                            ui.showDialog(new tipDialogBody(ui, mxResources.get('editSuccessfully')), 300, null, true, true);
                            ui.hideDialog.apply(ui, arguments);
                            //ui.isTrashSelected = false;
                            if (callback) {
                                callback(learningResObj);
                            }
                        }

                    }

                }
        };
        xhr.send(formData);
    }));

    var AllowFileType = {
        //文档类型
        'txt' : 0,
        'doc' : 1,
        'docx' : 2,
        'pdf' : 3,
        'ppt' : 4,
        'pptx' : 5,
        'xls' : 6,
        'xlsx' : 7,
        'html' : 8,
        'htm' : 9,
        'xml' : 10,
        'chm' : 11,
        'rtf' : 12,

        //图片
        'jpg' : 13,
        'jpeg' : 14,
        'png' : 15,
        'gif' : 16,
        'psd' : 17,
        'swf' : 18,
        'svg' : 19,
        'ico' : 20,
        'bmp': 21,

        //音频
        'mp3' : 22,
        'wma' : 23,
        'wav' : 24,
        'ape' : 25,
        'ogg' : 26,
        'flac' : 27,

        //视频
        '3gp' : 28,
        'mp4' : 29,
        'mpg' : 30,
        'mpeg' : 31,
        'avi' : 32,
        'wmv' : 33,
        'vcd' : 34,
        'dvd' : 35,
        'rmvb' : 36,
        'flv' : 37,
        'flash' : 38,
        'f4v' : 39,
        'mov' : 40,

        //压缩文件
        'zip' : 41,
        'rar' : 42,
        '7z' : 43,
        'jar' : 44
    };
};
mxUtils.extend(EditLRPropertyDialogBody, DialogBody);
// upload zip file for users  by chenwenyan
var UploadModelFileDialogBody = function (ui, title, usageType, callback) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','height: 100%; padding: 15px;');

    var fileName = document.createElement('div');
    var fileNameText = document.createElement('span');
    fileNameText.innerHTML = mxResources.get('filename') + ': ';
    fileName.appendChild(fileNameText);
    var fileNameInput = document.createElement('input');
    fileName.appendChild(fileNameInput);
    fileNameInput.setAttribute('style','width:300px;margin:0 0 10px 0;height:20px;padding:0 5px');
    fileNameInput.setAttribute('id','fileName');
    form.appendChild(fileName);

    var uploadFileBox = document.createElement('div');
    var uploadFileText = document.createElement('span');
    uploadFileText.innerHTML = mxResources.get('uploadFile') + '：';
    uploadFileBox.appendChild(uploadFileText);
    var uploadFileInput = document.createElement('input');
    uploadFileInput.setAttribute('type','file');
    var resultSpan = document.createElement('span');
    resultSpan.setAttribute('id', 'resultSpanId');
    resultSpan.setAttribute('style', 'float:right');
    uploadFileBox.appendChild(uploadFileInput);
    uploadFileBox.appendChild(resultSpan);
    form.appendChild(uploadFileBox);
    //设置默认运行文件的路径
    var defaultRunningFileDiv = document.createElement('div');
    defaultRunningFileDiv.setAttribute('style','margin-top:10px');
    var defaultRunningFileText = document.createElement('span');
    defaultRunningFileText.innerHTML = '启动文件：';
    defaultRunningFileText.setAttribute('style','');
    var defaultRunningFileInput = document.createElement('input');
    defaultRunningFileInput.id = 'defaultRunningFileInput';
    defaultRunningFileInput.placeholder = '填写启动文件的路径';
    defaultRunningFileInput.setAttribute('style','width:300px;margin:0 0 10px 0;height:20px;padding:0 5px');
    defaultRunningFileDiv.appendChild(defaultRunningFileText);
    defaultRunningFileDiv.appendChild(defaultRunningFileInput);
    form.appendChild(defaultRunningFileDiv);
    //设置默认打开文件的路径
    var defaultOpenFileDiv = document.createElement('div');
    //defaultOpenFileDiv.setAttribute('style','margin:10px 0 10px 0');
    var defaultOpenFileText = document.createElement('span');
    defaultOpenFileText.innerHTML = '打开文件：';
    defaultOpenFileText.setAttribute('style','');
    var defaultOpenFileInput = document.createElement('input');
    defaultOpenFileInput.id = 'defaultOpenFileInput';
    defaultOpenFileInput.placeholder = '填写默认打开文件的路径;若多个请用;连接';
    defaultOpenFileInput.setAttribute('style','width:300px;margin:0 0 10px 0;height:20px;padding:0 5px');
    var addOpenFileSpan = document.createElement('span');
    addOpenFileSpan.innerHTML = '+';
    addOpenFileSpan.title = '点击添加默认打开文件路径';
    addOpenFileSpan.setAttribute('style','margin-left:10px;cursor:pointer;');
    defaultOpenFileDiv.appendChild(defaultOpenFileText);
    defaultOpenFileDiv.appendChild(defaultOpenFileInput);
    defaultOpenFileDiv.appendChild(addOpenFileSpan);
    form.appendChild(defaultOpenFileDiv);


    var fileDesc = document.createElement('div');
    var fileDescText = document.createElement('span');
    fileDescText.innerHTML = mxResources.get('fileDescription') + '：';
    fileDesc.appendChild(fileDescText);
    var fileDescInput = document.createElement('textarea');
    fileDesc.appendChild(fileDescInput);
    fileDescInput.setAttribute('style','width:310px;height:50px;');
    fileDescInput.value = 'No Description';
    fileDescInput.setAttribute('id','fileDesc');
    fileDesc.setAttribute('style','margin-top:10px;');
    form.appendChild(fileDesc);

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
        if (callback) {
            callback();
        }
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = document.createElement('button');
    applyBtn.className = 'geBtn gePrimaryBtn';
    applyBtn.disabled = true;
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
    applyBtn.innerHTML=mxResources.get('ok');
    var zipFileName ;
    mxEvent.addListener(uploadFileInput, 'change', mxUtils.bind(this, function () {
        var files = uploadFileInput.files;
        if(files.length > 0){
            zipFileName = files[0].name;
            var is = zipFileName.lastIndexOf('.');
            if(is == -1){
                //alert(mxResources.get('incorrectMaterialFormat'));
                ui.showDialog(new tipDialogBody(ui, mxResources.get('incorrectMaterialFormat')), 300, null, true, true);
                return false;
            }else{
                //过滤文件类型
                var testFileType = zipFileName.substring(is+1);
                if((testFileType === 'rar') || (testFileType === 'zip')) {
                    fileNameInput.value = zipFileName;
                    defaultRunningFileInput.value = zipFileName.substring(0,zipFileName.lastIndexOf('.'))+'/';
                    defaultOpenFileInput.value = zipFileName.substring(0,zipFileName.lastIndexOf('.'))+'/';
                    $("#defaultRunningFileInput").focus(function(){
                        $("#defaultRunningFileInput").val($("#defaultRunningFileInput").val());
                    });
                    $("#defaultRunningFileInput").focus();
                    applyBtn.disabled = false;
                }else{
                    //alert(mxResources.get('lSystemDoesNotSupportTheFormatConvertAndReupload', testFileType));
                    ui.showDialog(new tipDialogBody(ui, mxResources.get('lSystemDoesNotSupportTheFormatConvertAndReupload', testFileType)), 300, null, true, true);
                    return false;
                }
            }
        }else{
            applyBtn.disabled = true;
        }
    }));

    addOpenFileSpan.onclick = function(){
        if(zipFileName){
            var index = zipFileName.lastIndexOf('.');
            var tempStr = zipFileName.substring(0,index-1);
            defaultOpenFileInput.value  = defaultOpenFileInput.value + ';' + tempStr + '/';
        }else{
            alert('请先选择上传的文件!');
        }
        defaultOpenFileInput.focus();
    };
    var handlePathStr = function(pathStr){
        var pathArr = [];
        if(pathStr.indexOf(';')){
            pathArr = pathStr.split(';');
        }else{
            pathArr.push(pathStr);
        }
        return pathArr;
    };
    mxEvent.addListener(applyBtn,'click',mxUtils.bind(this,function(){
        var files = uploadFileInput.files;
        var uploadedFile = files[0];
        var formData = new FormData();
        formData.append('file',uploadedFile);
        var fileNameInput = document.getElementById('fileName');
        var fileDescInput = document.getElementById('fileDesc');
        //var patrn = /^[^/].*$/;
        var patrn = /^([0-9a-zA-Z\u4e00-\u9fa5]*)$/;
        //var openPathPatrn = /^[^/].*$/;
        //if(!(defaultRunningFileInput.value.trim()).match(patrn) || !(defaultOpenFileInput.value.trim()).match(patrn)){
        //    alert('文件路径不正确，请检查！');
        //}else{
            var resultSpan = document.getElementById('resultSpanId');
            resultSpan.innerHTML = '正在编辑...';
            var xhr = new XMLHttpRequest();
            //var resourceServerHost = 'htp://192.168.1.8:4000/zipFiles';
            xhr.open('post',resourceServerHost+'OfficeHandler',true);
            //xhr.open('post',resourceServerHost,true);
            var resultFile = {};
            xhr.onload = function(e){
                if(this.status == 200){
                    var result = this.response;
                    if(result === 'error'){
                        //alert('edit error');
                        ui.showDialog(new tipDialogBody(ui, 'edit error'), 300, null, true, true);
                    }
                    var  res = JSON.parse(result);
                    var openPathArr = handlePathStr(defaultOpenFileInput.value.trim());

                    resultFile = {
                        materialsId :   res.materialsId,
                        filePath : res.sourceF,
                        fileName : fileNameInput.value,
                        fileDesc : fileDescInput.value,
                        runFile : defaultRunningFileInput.value.trim(),
                        openFile : openPathArr
                    };
                    ui.communication.saveUploadFile(resultFile, mxUtils.bind(this, function (message) {
                        resultSpan.innerHTML = '';
                        //alert(mxResources.get('editSuccessfully'));
                        ui.showDialog(new tipDialogBody(ui, mxResources.get('editSuccessfully')), 300, null, true, true);
                        //ui.hideDialog.apply(ui, arguments);
                        ui.hideDialog();
                        console.log(message);
                    }));
                    callback(resultFile);
                }
            };
            xhr.send(formData);
        //}
    }));
};
mxUtils.extend(UploadModelFileDialogBody, DialogBody);
//eamonn todo
var EditRichTextareaModelDialogBody = function(ui, cell, title,callback){
    DialogBody.call(this,title);
    var bodyContainer = this.getBodyContainer();
    bodyContainer.style.overflow = 'auto';
    //var topContainer = document.createElement('div');
    var topDiv = document.createElement('div');
    var textTypeSelectDiv = document.createElement('div');
    var textTypeSpan = document.createElement('span');
    textTypeSpan.innerHTML = mxResources.get('textType')+'：';
    var textSelect = document.createElement('select');
    var formModel = document.createElement('option');
    var otherModel = document.createElement('option');
    formModel.innerHTML = mxResources.get('formModel');
    otherModel.innerHTML = mxResources.get('otherModel');
    textSelect.appendChild(formModel);
    textSelect.appendChild(otherModel);
    formModel.setAttribute('value','form');
    otherModel.setAttribute('value','other');
    textTypeSelectDiv.appendChild(textTypeSpan);
    textTypeSelectDiv.appendChild(textSelect);
    textTypeSelectDiv.setAttribute('style','padding:5px 5px 5px 10px; float:left; background-color: #F5F5F5;');

    var nameDiv = document.createElement('div');
    var nameSpan = document.createElement('span');

    nameSpan.innerHTML = mxResources.get('name')+'：';
    var nameInput = document.createElement('input');
    nameInput.setAttribute('size','47');
    nameDiv.appendChild(nameSpan);
    nameDiv.appendChild(nameInput);
    nameDiv.setAttribute('style','padding:5px 5px 5px 15px; background-color: #F5F5F5;');
    topDiv.appendChild(textTypeSelectDiv);
    topDiv.appendChild(nameDiv);
    var descDiv1 = document.createElement('div');
    var descSpan = document.createElement('span');
    descSpan.innerHTML = mxResources.get('description')+'：';
    descDiv1.appendChild(descSpan);
    descDiv1.setAttribute('style','padding:5px 5px 5px 10px; float:left; background-color: #F5F5F5;');
    var descDiv2 = document.createElement('div');
    var descTextArea = document.createElement('textarea');
    descTextArea.rows='2';
    descTextArea.cols='70';
    descDiv2.appendChild(descTextArea);
    descDiv2.setAttribute('style','padding:5px 5px 5px 10px; background-color: #F5F5F5;');
    var textArea = document.createElement('div');
    var textAreaInputField = ui.formItems.genTextareaInputFieldPro(this, mxResources.get('description'), 'description', cell, '100%');
    textArea.appendChild(textAreaInputField.getElContainer());
    if(cell.id){
        if(cell.typeId==='1'){
            formModel.selected='selected';
        }else{
            otherModel.selected='selected';
        }
        nameInput.value = cell.fileName;
        descTextArea.value = cell.description;
    }
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('save'), function () {

        if(nameInput.value===''){
            //alert(mxResources.get('emptyName'));
            ui.showDialog(new tipDialogBody(ui, mxResources.get('emptyName')), 300, null, true, true);
        }else{
            console.log(cell);
            var richTextData={};
            if(cell.id){
                richTextData.isSaveNew = false;
                richTextData.id = cell.id;
            }else{
                richTextData.isSaveNew = true;
            }
            richTextData.modelType = textSelect.value,
                richTextData.textValue = textAreaInputField.getInputValue(),
                richTextData.nameValue = nameInput.value,
                richTextData.descValue = descTextArea.value

            callback(richTextData);
            ui.hideDialog.apply(ui, arguments);
        }
    });

    applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    bodyContainer.appendChild(topDiv);
    bodyContainer.appendChild(descDiv1);
    bodyContainer.appendChild(descDiv2);
    bodyContainer.appendChild(textArea);
    bodyContainer.appendChild(buttons);
};
mxUtils.extend(EditRichTextareaModelDialogBody, DialogBody);

/*
 * searchByLikeName by fanmiaomiao
 */

function searchByLikeName(likename,array){
    var name = likename;
    var file = array;
    searchFileByString(name,file);
    for(var i=0;i<array.length;i++){
        array[i].setIsToShow(true);
        if(array[i].flag == 0){
            array[i].setIsToShow(false);
            //console.log("array["+i+"] :" +array[i].fileName)
        }
    }
    return array;
}

/*对文件的模糊查询  by fanmiaomiao*/
function searchFileByString(string,array) {
    var allString = [];
    var file = new Array();
    for (var i = 0; i < array.length; i++)
    {
        //array[i].setIsToShow(true);
        array[i].setFileFlag(1);

        allString[i] = array[i].fileName;
    }
    var likeString = Order(string);
    if(string.length == 0){
        return array;
    }else {
        var i, j,k;
        for (i = 0; i < allString.length; i++) {
            file = Order(allString[i]);
            /*
             pattern = new RegExp(likeString, "gi");
             var flag = pattern.test(file);
             */
            var temp = 0;
            var count = 0;
            for (j = 0; j < likeString.length; j++) {
                for (k = temp; k < file.length; k++) {
                    res = new RegExp(likeString[j]);
                    if (res.test(file[k])) {
                        count ++;
                        break;
                    }else{
                        continue;
                    }
                }
                temp = k + 1;
            }
            if (count != likeString.length) {
                array[i].setFileFlag(0);
                //console.log('time '+i+'::222222');
                //array[i].setIsToShow(false);
            } else {
                //console.log( 'time '+i+'::333333');
            }
        }
        return array;
    }
}
/*
 *by fanmiaomiao
 */
function Order(array){
    if(array.length == 0){
        return array;
    }
    var first = array[0];
    var smaller =[];
    var bigger = [];
    for(var i=1;i<array.length;i++){
        if(array[i] < first)
            smaller.push(array[i]);
        else
            bigger.push(array[i]);
    }
    return Array.prototype.concat(Order(smaller),[first],Order(bigger));
}

/*
 sort by dateDesc
 by chenwenyan
 */
function dateDescSort(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++)
        arr[i] = array[i];
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].lastModify > pivot.lastModify) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return dateDescSort(left).concat([pivot], dateDescSort(right));
}

/*
 sort by dateAsc
 by chenwenyan
 */
function dateAscSort(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++)
        arr[i] = array[i];
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].lastModify < pivot.lastModify) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return dateAscSort(left).concat([pivot], dateAscSort(right));
}


/*
 sort by nameDesc
 by chenwenyan
 */
function nameDescSort(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++)
        arr[i] = array[i];
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].fileName.localeCompare(pivot.fileName) >= 0) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return nameDescSort(left).concat([pivot], nameDescSort(right));
}
/*
 sort by nameAsc
 by chenwenyan
 */
function nameAscSort(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++)
        arr[i] = array[i];
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].fileName.localeCompare(pivot.fileName) < 0) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return nameAscSort(left).concat([pivot], nameAscSort(right));
}
/**
 * quick sort.
 */
function quickSort(fileArray) {
    var newArray = [];
    for (var i = 0; i < fileArray.length; i++) {
        newArray[i] = fileArray[i];
    }
    function sort(startNum, endNum) {
        var start = startNum;
        var end = endNum - 1;
        var flag = newArray[startNum];
        if ((endNum - startNum) > 1) {
            while (start < end) {
                for (; start < end; end--) {
                    if (newArray[end].lastModify > flag.lastModify) {
                        //console.log(newArray[end].lastModify +'>'+ flag.lastModify);
                        newArray[start++] = newArray[end];
                        break;
                    }

                }
                for (; start < end; start++) {
                    if (newArray[start].lastModify < flag.lastModify) {
                        //console.log(newArray[end].lastModify +'<'+ flag.lastModify);
                        newArray[end--] = newArray[start];
                        break;
                    }
                }
            }
            newArray[start] = flag;
            sort(0, start);
            sort(start + 1, endNum);
        }
    }

    sort(0, newArray.length);
    return newArray;
}
/*function nameSort(fileArray){
 var newArray=[];
 for(var i=0;i<fileArray.length;i++) {
 newArray[i] = fileArray[i];
 }
 function sort(startNum, endNum){
 var start = startNum;
 var end = endNum -1;
 var flag = newArray[startNum];
 if ((endNum - startNum) > 1) {
 while(start < end){
 for(; start < end; end--){
 if (newArray[end].fileName.localeCompare(flag.fileName) < 0) {
 //console.log(newArray[end].fileName +'<'+flag.fileName);
 newArray[start++] = newArray[end];
 break;
 };
 }
 for( ; start < end; start++){
 if (newArray[end].fileName.localeCompare(flag.fileName) > 0){
 //console.log(newArray[end].fileName +'>'+flag.fileName);
 newArray[end--] = newArray[start];
 break;
 }
 }
 }
 newArray[start] = flag;
 sort(0, start);
 sort(start + 1, endNum);
 }
 }
 sort(0, newArray.length);
 return newArray;
 }*/
/**
 * Constructs a new color dialog.
 */
var ColorDialog = function (editorUi, color, apply, cancelFn) {
    DialogBody.call(this, mxResources.get('colorPicker'));
    var div = this.getBodyContainer();
    this.editorUi = editorUi;

    var input = document.createElement('input');
    input.style.marginBottom = '10px';
    input.style.width = '216px';

    // Required for picker to render in IE
    if (mxClient.IS_IE) {
        input.style.marginTop = '10px';
        document.body.appendChild(input);
    }

    this.init = function () {
        if (!mxClient.IS_TOUCH) {
            input.focus();
        }
    };

    var picker = new jscolor.color(input);
    picker.pickerOnfocus = false;
    picker.showPicker();

    //var div = document.createElement('div');
    jscolor.picker.box.style.position = 'relative';
    jscolor.picker.box.style.width = '230px';
    jscolor.picker.box.style.height = '100px';
    jscolor.picker.box.style.paddingBottom = '10px';
    div.appendChild(jscolor.picker.box);

    var center = document.createElement('center');

    function addPresets(presets, rowLength) {
        rowLength = (rowLength != null) ? rowLength : 12;
        var table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.setAttribute('cellspacing', '0');
        table.style.marginBottom = '20px';
        table.style.cellSpacing = '0px';
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        var rows = presets.length / rowLength;

        for (var row = 0; row < rows; row++) {
            var tr = document.createElement('tr');

            for (var i = 0; i < rowLength; i++) {
                (function (clr) {
                    var td = document.createElement('td');
                    td.style.border = '1px solid black';
                    td.style.padding = '0px';
                    td.style.width = '16px';
                    td.style.height = '16px';

                    if (clr == 'none') {
                        td.style.background = 'url(\'' + IMAGE_PATH + '/nocolor.png' + '\')';
                    }
                    else {
                        td.style.backgroundColor = '#' + clr;
                    }

                    tr.appendChild(td);

                    mxEvent.addListener(td, 'click', function () {
                        if (clr == 'none') {
                            picker.fromString('ffffff');
                            input.value = 'none';
                        }
                        else {
                            picker.fromString(clr);
                        }
                    });
                })(presets[row * rowLength + i]);
            }

            tbody.appendChild(tr);
        }

        center.appendChild(table);

        return table;
    };

    div.appendChild(input);
    mxUtils.br(div);

    // Adds presets
    var table = addPresets(['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66'], 12);
    table.style.marginBottom = '8px';
    table = addPresets(['none', 'FFFFFF', 'E6E6E6', 'CCCCCC', 'B3B3B3', '999999', '808080', '666666', '4D4D4D', '333333', '1A1A1A', '000000', 'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6', 'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC', 'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3', 'FF3333', 'FF9933', 'FFFF33', '99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399', 'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080', 'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66', '00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066', '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D', '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066', '330066', '660066', '660033', '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A']);
    table.style.marginBottom = '16px';

    div.appendChild(center);

    var buttons = document.createElement('div');
    buttons.style.textAlign = 'right';
    buttons.style.whiteSpace = 'nowrap';

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();

        if (cancelFn != null) {
            cancelFn();
        }
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        buttons.appendChild(cancelBtn);
    }

    var applyFunction = (apply != null) ? apply : this.createApplyFunction();

    var applyBtn = mxUtils.button(mxResources.get('apply'), function () {
        var color = input.value;

        if (color != 'none') {
            color = '#' + color;
        }

        applyFunction(color);
        editorUi.hideDialog();
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    buttons.appendChild(applyBtn);

    if (!editorUi.editor.cancelFirst) {
        buttons.appendChild(cancelBtn);
    }

    if (color != null) {
        if (color == 'none') {
            picker.fromString('ffffff');
            input.value = 'none';
        }
        else {
            picker.fromString(color);
        }
    }

    div.appendChild(buttons);
    this.picker = picker;
    this.colorInput = input;

    // LATER: Only fires if input if focused, should always
    // fire if this dialog is showing.
    mxEvent.addListener(div, 'keydown', function (e) {
        if (e.keyCode == 27) {
            editorUi.hideDialog();

            if (cancelFn != null) {
                cancelFn();
            }

            mxEvent.consume(e);
        }
    });

    this.container = div;
};
mxUtils.extend(ColorDialog, DialogBody);
/* Creates function to apply value */
ColorDialog.prototype.createApplyFunction = function () {
    return mxUtils.bind(this, function (color) {
        var graph = this.editorUi.editor.graph;

        graph.getModel().beginUpdate();
        try {
            graph.setCellStyles(this.currentColorKey, color);
            this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [this.currentColorKey],
                'values', [color], 'cells', graph.getSelectionCells()));
        }
        finally {
            graph.getModel().endUpdate();
        }
    });
};

/**
 * Constructs a new about dialog.
 */
var AboutDialog = function (editorUi) {
    DialogBody.call(this, mxResources.get('about'));
    //var div = document.createElement('div');
    var div = this.getBodyContainer();
    div.setAttribute('align', 'center');
    var h3 = document.createElement('h3');
    mxUtils.write(h3, mxResources.get('eceditor'));
    div.appendChild(h3);
    var img = document.createElement('img');
    img.style.border = '0px';
    img.setAttribute('width', '176');
    img.setAttribute('width', '151');
    img.setAttribute('src', IMAGE_PATH + '/logo.jpg');
    div.appendChild(img);
    mxUtils.br(div);
    mxUtils.write(div, mxResources.get('version') + ' ' + ecEditorUi.VERSION);
    mxUtils.br(div);
    var link = document.createElement('a');
    link.setAttribute('href', 'http://www.xuezuowang.com');
    link.setAttribute('target', '_blank');
    mxUtils.write(link, 'www.xuezuowang.com');
    div.appendChild(link);
    mxUtils.br(div);
    mxUtils.br(div);
    var closeBtn = mxUtils.button(mxResources.get('close'), function () {
        editorUi.hideDialog();
    });
    closeBtn.className = 'geBtn gePrimaryBtn';
    div.appendChild(closeBtn);

    this.container = div;
};
mxUtils.extend(AboutDialog, DialogBody);
/**
 * Constructs a new page setup dialog.
 */
var PageSetupDialogBody = function (editorUi, title) {
    DialogBody.call(this, title);
    var container = this.getBodyContainer();

    var graph = editorUi.editor.graph;
    var row, td;

    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.height = '100%';
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    mxUtils.write(td, mxResources.get('paperSize') + ':');

    row.appendChild(td);

    var portraitCheckBox = document.createElement('input');
    portraitCheckBox.setAttribute('name', 'format');
    portraitCheckBox.setAttribute('type', 'radio');

    var landscapeCheckBox = document.createElement('input');
    landscapeCheckBox.setAttribute('name', 'format');
    landscapeCheckBox.setAttribute('type', 'radio');

    var formatRow = document.createElement('tr');
    formatRow.style.display = 'none';

    var customRow = document.createElement('tr');
    customRow.style.display = 'none';

    // Adds all papersize options
    var paperSizeSelect = document.createElement('select');
    var detected = false;
    var pf = new Object();
    var formats = PageSetupDialogBody.getFormats();

    for (var i = 0; i < formats.length; i++) {
        var f = formats[i];
        pf[f.key] = f;

        var paperSizeOption = document.createElement('option');
        paperSizeOption.setAttribute('value', f.key);
        mxUtils.write(paperSizeOption, f.title);
        paperSizeSelect.appendChild(paperSizeOption);

        if (f.format != null) {
            if (graph.pageFormat.width == f.format.width && graph.pageFormat.height == f.format.height) {
                paperSizeOption.setAttribute('selected', 'selected');
                portraitCheckBox.setAttribute('checked', 'checked');
                portraitCheckBox.defaultChecked = true;
                formatRow.style.display = '';
                detected = true;
            }
            else if (graph.pageFormat.width == f.format.height && graph.pageFormat.height == f.format.width) {
                paperSizeOption.setAttribute('selected', 'selected');
                landscapeCheckBox.setAttribute('checked', 'checked');
                landscapeCheckBox.defaultChecked = true;
                formatRow.style.display = '';
                detected = true;
            }
        }
    }

    // Selects custom format which is last in list
    if (!detected) {
        paperSizeOption.setAttribute('selected', 'selected');
        customRow.style.display = '';
    }

    td = document.createElement('td');
    td.style.fontSize = '14px';
    td.appendChild(paperSizeSelect);
    row.appendChild(td);

    tbody.appendChild(row);

    formatRow = document.createElement('tr');
    formatRow.style.height = '60px';
    td = document.createElement('td');
    formatRow.appendChild(td);

    td = document.createElement('td');
    td.style.fontSize = '14px';

    td.appendChild(portraitCheckBox);
    var span = document.createElement('span');
    mxUtils.write(span, ' ' + mxResources.get('portrait'));
    td.appendChild(span);

    mxEvent.addListener(span, 'click', function (evt) {
        portraitCheckBox.checked = true;
        mxEvent.consume(evt);
    });

    landscapeCheckBox.style.marginLeft = '10px';
    td.appendChild(landscapeCheckBox);

    var span = document.createElement('span');
    mxUtils.write(span, ' ' + mxResources.get('landscape'));
    td.appendChild(span);

    mxEvent.addListener(span, 'click', function (evt) {
        landscapeCheckBox.checked = true;
        mxEvent.consume(evt);
    });

    formatRow.appendChild(td);

    tbody.appendChild(formatRow);
    row = document.createElement('tr');

    td = document.createElement('td');
    customRow.appendChild(td);

    td = document.createElement('td');
    td.style.fontSize = '14px';

    var widthInput = document.createElement('input');
    widthInput.setAttribute('size', '6');
    widthInput.setAttribute('value', graph.pageFormat.width);
    td.appendChild(widthInput);
    mxUtils.write(td, ' x ');

    var heightInput = document.createElement('input');
    heightInput.setAttribute('size', '6');
    heightInput.setAttribute('value', graph.pageFormat.height);
    td.appendChild(heightInput);
    mxUtils.write(td, ' Pixel');

    customRow.appendChild(td);
    customRow.style.height = '60px';
    tbody.appendChild(customRow);

    var updateInputs = function () {
        var f = pf[paperSizeSelect.value];

        if (f.format != null) {
            widthInput.value = f.format.width;
            heightInput.value = f.format.height;
            customRow.style.display = 'none';
            formatRow.style.display = '';
        }
        else {
            formatRow.style.display = 'none';
            customRow.style.display = '';
        }
    };

    mxEvent.addListener(paperSizeSelect, 'change', updateInputs);
    updateInputs();

    row = document.createElement('tr');
    td = document.createElement('td');
    td.colSpan = 2;
    td.setAttribute('align', 'right');

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    var applyBtn = mxUtils.button(mxResources.get('apply'), function () {
        editorUi.hideDialog();
        var ls = landscapeCheckBox.checked;
        var f = pf[paperSizeSelect.value];
        var size = f.format;

        if (size == null) {
            size = new mxRectangle(0, 0, parseInt(widthInput.value), parseInt(heightInput.value));
        }

        if (ls) {
            size = new mxRectangle(0, 0, size.height, size.width);
        }

        editorUi.setPageFormat(size);
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    td.appendChild(applyBtn);

    if (!editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);

    tbody.appendChild(row);
    table.appendChild(tbody);
    container.appendChild(table);
    this.container = container;
};
mxUtils.extend(PageSetupDialogBody, DialogBody);

PageSetupDialogBody.getFormats = function () {
    return [{key: 'a3', title: 'A3 (297 mm x 420 mm)', format: new mxRectangle(0, 0, 1169, 1652)}, {
        key: 'a4',
        title: 'A4 (210 mm x 297 mm)',
        format: mxConstants.PAGE_FORMAT_A4_PORTRAIT
    }, {key: 'a5', title: 'A5 (148 mm x 210 mm)', format: new mxRectangle(0, 0, 584, 826)}, {
        key: 'letter',
        title: 'US-Letter (8,5" x 11")',
        format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT
    }, {
        key: 'tabloid',
        title: 'US-Tabloid (279 mm x 432 mm)',
        format: new mxRectangle(0, 0, 1100, 1700)
    }, {key: 'custom', title: mxResources.get('custom'), format: null}];
};



/**
 * Constructs a new print dialog.
 */
var PrintDialogBody = function (editorUi, title) {
    DialogBody.call(this, title);
    var container = this.getBodyContainer();

    var graph = editorUi.editor.graph;
    var row, td;

    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.height = '100%';
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    var pageCountCheckBox = document.createElement('input');
    pageCountCheckBox.setAttribute('type', 'checkbox');
    td = document.createElement('td');
    td.style.paddingRight = '10px';
    td.style.fontSize = '14px';
    td.appendChild(pageCountCheckBox);

    var span = document.createElement('span');
    mxUtils.write(span, ' ' + mxResources.get('posterPrint') + ':');
    td.appendChild(span);

    mxEvent.addListener(span, 'click', function (evt) {
        pageCountCheckBox.checked = !pageCountCheckBox.checked;
        mxEvent.consume(evt);
    });

    row.appendChild(td);

    var pageCountInput = document.createElement('input');
    pageCountInput.setAttribute('value', '1');
    pageCountInput.setAttribute('type', 'number');
    pageCountInput.setAttribute('min', '1');
    pageCountInput.setAttribute('size', '4');
    pageCountInput.setAttribute('disabled', 'disabled');
    pageCountInput.style.width = '50px';

    td = document.createElement('td');
    td.style.fontSize = '14px';
    td.appendChild(pageCountInput);
    mxUtils.write(td, ' ' + mxResources.get('pages') + ' (max)');
    row.appendChild(td);
    tbody.appendChild(row);

    mxEvent.addListener(pageCountCheckBox, 'change', function () {
        if (pageCountCheckBox.checked) {
            pageCountInput.removeAttribute('disabled');
        }
        else {
            pageCountInput.setAttribute('disabled', 'disabled');
        }
    });

    row = document.createElement('tr');
    td = document.createElement('td');
    mxUtils.write(td, mxResources.get('pageScale') + ':');
    td.style.paddingLeft = '20px';
    row.appendChild(td);

    td = document.createElement('td');
    var pageScaleInput = document.createElement('input');
    pageScaleInput.setAttribute('value', '100 %');
    pageScaleInput.setAttribute('size', '5');
    pageScaleInput.style.width = '50px';

    td.appendChild(pageScaleInput);
    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');
    td.colSpan = 2;
    td.style.paddingTop = '32px';
    td.setAttribute('align', 'right');

    // Overall scale for print-out to account for print borders in dialogs etc
    function preview(print) {
        var printScale = parseInt(pageScaleInput.value) / 100;

        if (isNaN(printScale)) {
            printScale = 1;
            pageScaleInput.value = '100 %';
        }

        var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
        var scale = 1 / graph.pageScale;

        if (pageCountCheckBox.checked) {
            var pageCount = parseInt(pageCountInput.value);

            if (!isNaN(pageCount)) {
                scale = mxUtils.getScaleForPageCount(pageCount, graph, pf);
            }
        }

        // Negative coordinates are cropped or shifted if page visible
        var gb = graph.getGraphBounds();
        var autoOrigin = pageCountCheckBox.checked;
        var border = 0;
        var x0 = 0;
        var y0 = 0;

        // Computes unscaled, untranslated graph bounds
        var x = (gb.width > 0) ? Math.ceil(gb.x / graph.view.scale - graph.view.translate.x) : 0;
        var y = (gb.height > 0) ? Math.ceil(gb.y / graph.view.scale - graph.view.translate.y) : 0;

        if (x < 0 || y < 0) {
            autoOrigin = true;

            if (graph.pageVisible) {
                var ps = graph.pageScale;
                var pw = pf.width * ps;
                var ph = pf.height * ps;

                // FIXME: Offset for page layout with x/y != 0
                x0 = (x > 0) ? x : pf.width * -Math.floor(Math.min(0, x) / pw) + Math.min(0, x) / graph.pageScale;
                y0 = (y > 0) ? y : pf.height * -Math.floor(Math.min(0, y) / ph) + Math.min(0, y) / graph.pageScale;
            }
            else {
                x0 = 10;
                y0 = 10;
            }
        }

        // Applies print scale
        pf = mxRectangle.fromRectangle(pf);
        pf.width = Math.round(pf.width * printScale);
        pf.height = Math.round(pf.height * printScale);
        scale *= printScale;

        // Starts at first visible page
        if (graph.pageVisible) {
            var layout = graph.getPageLayout();

            x0 -= Math.max(layout.x, 0) * pf.width;
            y0 -= Math.max(layout.y, 0) * pf.height;
        }

        return PrintDialogBody.showPreview(PrintDialogBody.createPrintPreview(graph, scale, pf, border, x0, y0, autoOrigin, print), print);
    };

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    var previewBtn = mxUtils.button(mxResources.get('preview'), function () {
        editorUi.hideDialog();
        preview(false);
    });
    previewBtn.className = 'geBtn';
    td.appendChild(previewBtn);

    var printBtn = mxUtils.button(mxResources.get('print'), function () {
        editorUi.hideDialog();
        preview(true);
    });
    printBtn.className = 'geBtn gePrimaryBtn';
    td.appendChild(printBtn);

    if (!editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);

    table.appendChild(tbody);
    container.appendChild(table);
    this.container = container;
};
mxUtils.extend(PrintDialogBody, DialogBody);

/**
 * Constructs a new print dialog.
 */
PrintDialogBody.showPreview = function (preview, print) {
    var result = preview.open();

    if (print && result != null) {
        result.print();
    }

    return result;
};

/**
 * Constructs a new print dialog.
 */
PrintDialogBody.createPrintPreview = function (graph, scale, pf, border, x0, y0, autoOrigin) {
    var preview = new mxPrintPreview(graph, scale, pf, border, x0, y0);
    preview.title = mxResources.get('preview');
    preview.printBackgroundImage = true;
    preview.autoOrigin = autoOrigin;

    return preview;
};
/**
 * Constructs a new filename dialog.
 */
var FilenameDialogBody = function (editorUi, title,isCreate,fileObj,handleRes) {
    DialogBody.call(this, title);
    this.editorUi = editorUi;
    var queryObj = appUtils.convertQueryStrToJSON();
    var mxUi = (fileObj && fileObj.fileType) ? fileObj.fileType : queryObj.ui;
    var fileNameBox, td, filename;
    //table: 整个container
    var table = document.createElement('div');
    var me = this;
    //fileNameBox:名称input
    fileNameBox = document.createElement('div');
    fileNameBox.setAttribute('style','margin:10px 0 10px 5px');
    td = document.createElement('span');
    td.setAttribute('style','padding:10px 10px 10px 10px');
    td.innerHTML = mxResources.get(mxUi) + mxResources.get('name') + ':';
    fileNameBox.appendChild(td);
    var nameInput = editorUi.formItems.msInput();
    filename = editorUi.editor.getOrCreateFilename();
    filename = (fileObj && fileObj.fileName) ? fileObj.fileName : filename;
    nameInput.setAttribute('value', filename || '');
    if(!isCreate){
        nameInput.disabled = true;
    }
    fileNameBox.appendChild(nameInput);
    var star = editorUi.formItems.msStar();
    fileNameBox.appendChild(star);

    //工具类型
    var OPLEtoolBox = document.createElement('div');
    OPLEtoolBox.setAttribute('style','margin-left:15px;');
    //temporarily hidden because of OPLE's unuse
    OPLEtoolBox.style.display = 'none';
    var OPLEtoolForm = document.createElement('form');
    var toolOption = [ {name:mxResources.get('generalCourseDesignTool'),value:'generalTool'},{name:mxResources.get('OPLECourseDesignTool'), value:'OPLETool'},{name:'OPLE难度层级课程设计工具', value:'OPLELevelTool'}];
    var chooseOPLEtool = editorUi.formItems.genRadioField('工具类型: ', 'radio', toolOption,'generalTool').getElContainer();
    var star = editorUi.formItems.msStar();
    star.style.float = 'left';
    var tips = document.createElement('span');
    tips.setAttribute('style', 'color: red;  float: left; margin: 10px 0px;');
    tips.innerHTML = '(' + mxResources.get('selectionCannotBeChange') + ')';
    chooseOPLEtool.appendChild(star);
    chooseOPLEtool.appendChild(tips);
    OPLEtoolForm.appendChild(chooseOPLEtool);
    OPLEtoolBox.appendChild(OPLEtoolForm);
    OPLEtoolForm.onchange = mxUtils.bind(this,function(){
        if($(OPLEtoolForm).serializeArray()[0].value === 'OPLETool'){
            editorUi.editor.setFileType('ople_design');
        }else if($(OPLEtoolForm).serializeArray()[0].value === 'OPLELevelTool'){
            editorUi.editor.setFileType('ople2_design');
        }
        else{
            editorUi.editor.setFileType(mxUi);
        }
    });
    //是否绑定典型工作任务
    this.bindBoardIdBox = document.createElement('div');
    this.bindBoardIdBox.style.display = 'none';
    var chooseTaskTr = document.createElement('div');
    var chooseTaskForm = document.createElement('form');
    var option = [{name:mxResources.get('bind'), value:'bindTask'},{name:mxResources.get('unbind'), value:'unbindTask'}];
    var chooseTask = editorUi.formItems.genRadioField('是否绑定典型工作任务: ', 'radio', option,'unbindTask').getElContainer();
    chooseTask.style.marginLeft = '15px';
    //temporarily hidden because of OPLE's unuse
    chooseTask.style.display = 'none';
    var tips = document.createElement('span');
    tips.setAttribute('style', 'color: red;  float: left; margin: 10px 0px;');
    tips.innerHTML = '(' + mxResources.get('selectionCannotBeChange') + ')';
    var star = editorUi.formItems.msStar();
    star.style.float = 'left';
    chooseTask.appendChild(star);
    chooseTask.appendChild(tips);
    chooseTaskForm.appendChild(chooseTask);
    chooseTaskTr.appendChild(chooseTaskForm);
    var bindTaskId = null;
    chooseTaskForm.onchange = mxUtils.bind(this,function(){
        if($(chooseTaskForm).serializeArray()[0].value == 'bindTask'){
            this.bindBoardIdBox.style.display = 'block';
            editorUi.showAllFiles(null,null,null,'','task_design', mxUtils.bind(this,function (dataObj) {
                if(dataObj){
                    var bindTaskNameLabel = document.createElement('span');
                    bindTaskNameLabel.innerHTML = mxResources.get('typicalWorkTaskName') +': ';
                    bindTaskNameLabel.setAttribute('style','width:140px;text-align:left;font-size:14px;padding:10px 0 10px 10px');
                    var bindTaskName = document.createElement('span');
                    bindTaskName.innerHTML = dataObj.fileName;
                    bindTaskId = dataObj.gFileId;
                    this.bindBoardIdBox.appendChild(bindTaskNameLabel);
                    this.bindBoardIdBox.appendChild(bindTaskName);
                }
            }));
        }else{
            this.bindBoardIdBox.style.display = 'none';
            while(this.bindBoardIdBox.hasChildNodes()){
                this.bindBoardIdBox.removeChild(this.bindBoardIdBox.firstChild);
            }
        }
    });
    ////学习形式 不再设置161229 fz
    //var isSingleSupportDiv = document.createElement('div');
    //var isSingleSupportForm = document.createElement('form');
    //var options = [{name:mxResources.get('singleRoleLearning'),value:'true'},{name:mxResources.get('multiRoleLearning'),value:'false'}];
    //var defaultValue = (isCreate)?'true':fileObj.isSingleSupported.toString();
    //var isSingleSupportRadio = editorUi.formItems.genRadioField('学习形式: ', 'radio', options,defaultValue);
    //var isSingleSupportBox = isSingleSupportRadio.getElContainer();
    ////var isSingleSupported = true;  //是否支持单人学习
    //isSingleSupportBox.style.marginLeft = '15px';
    //isSingleSupportForm.appendChild(isSingleSupportBox);
    //var star = editorUi.formItems.msStar();
    //star.style.float = 'left';
    //isSingleSupportBox.appendChild(star);
    //isSingleSupportDiv.appendChild(isSingleSupportForm);
    ////isSingleSupportForm.onchange = mxUtils.bind(this,function(){
    ////    if($(isSingleSupportForm).serializeArray()[0].value == 'true'){
    ////        isSingleSupported = true;
    ////    }
    ////});

    //160810fz 临时分组
    var groupArea= document.createElement('div');
    groupArea.setAttribute('style', 'padding: 10px 15px 20px 15px');
    var oldGroupRange = (fileObj && fileObj.groupRange) ? JSON.parse(fileObj.groupRange) : null;

    var memberNumDiv= document.createElement('div');
    memberNumDiv.style.marginBottom = '5px';
    var memberNumTitle = document.createElement('span');
    memberNumTitle.innerHTML = '每组人数：';
    var memberNumMinInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.minMember) : 1,
        "min": 0,
        "max": 99,
        "id": 'member-min'
    });
    var memberNumAndSpan = document.createElement('span');
    memberNumAndSpan.innerHTML = ' 至 ';
    var memberNumMaxInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.maxMember) : 5,
        "min": 1,
        "max": 99,
        "id": 'member-max'
    });
    memberNumMinInput.oninput = function () {
        memberNumMaxInput.min = memberNumMinInput.value;
        if (memberNumMaxInput.value < memberNumMinInput.value){
            memberNumMaxInput.value = memberNumMinInput.value;
        }
    }
    memberNumDiv.appendChild(memberNumTitle);
    memberNumDiv.appendChild(memberNumMinInput);
    memberNumDiv.appendChild(memberNumAndSpan);
    memberNumDiv.appendChild(memberNumMaxInput);
    groupArea.appendChild(memberNumDiv);
    var roleMemberDiv= document.createElement('div');
    var roleMemberTitle = document.createElement('span');
    roleMemberTitle.innerHTML = '每个角色人数：';
    var roleMemberMinInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.minRole) : 1,
        "min": 1,
        "max": 99,
        "id": 'role-min'
    });
    var roleMemberAndSpan = document.createElement('span');
    roleMemberAndSpan.innerHTML = ' 至 ';
    var roleMemberMaxInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.maxRole) : 5,
        "min": 1,
        "max": 99,
        "id": 'role-max'
    });
    roleMemberMinInput.oninput = function () {
        roleMemberMaxInput.min = roleMemberMinInput.value;
        if (roleMemberMaxInput.value < roleMemberMinInput.value){
            roleMemberMaxInput.value = roleMemberMinInput.value;
        }
    };
    roleMemberDiv.appendChild(roleMemberTitle);
    roleMemberDiv.appendChild(roleMemberMinInput);
    roleMemberDiv.appendChild(roleMemberAndSpan);
    roleMemberDiv.appendChild(roleMemberMaxInput);
    groupArea.appendChild(roleMemberDiv);

    //课程图标
    var courseIconForm = document.createElement('form');
    courseIconForm.setAttribute('style','padding: 10px 15px;');
    courseIconForm.enctype = 'multipart/form-data';
    courseIconForm.method = 'post';
    mxUtils.write(courseIconForm,'课程图标：');
    var chooseImgInput = document.createElement('input');
    chooseImgInput.type = 'file';
    chooseImgInput.accept = 'image/*';

    var courseIconUploadBtn = document.createElement('input');
    courseIconUploadBtn.setAttribute('style','margin-top:10px');
    courseIconUploadBtn.type = 'button';
    courseIconUploadBtn.value = '上传';
    courseIconUploadBtn.setAttribute('style','margin-right:50px;');

    var courseIconName = document.createElement('span');
    courseIconName.setAttribute('style','margin-top:10px;cursor:pointer;color:#3A5FCD;text-decoration:underline');
    var previewImgEditSpan = document.createElement('span');
    previewImgEditSpan.setAttribute('style','cursor:pointer;margin:10px;border:1px solid #ccc;padding:5px');
    previewImgEditSpan.innerHTML = '重新上传';
    var previewImgDeleteSpan = document.createElement('span');
    previewImgDeleteSpan.setAttribute('style','cursor:pointer;margin:10px;border:1px solid #ccc;padding:5px');
    previewImgDeleteSpan.innerHTML = '删除';

    var previewImgDiv = document.createElement('img');
    previewImgDiv.setAttribute('style','overflow:auto;margin:5px 20px');

    if(!isCreate){
        if(fileObj.fileIcon && (fileObj.fileIcon != "null")&& (fileObj.fileIcon != "undefined")){
            courseIconForm.appendChild(courseIconName);
            courseIconForm.appendChild(previewImgEditSpan);
            courseIconForm.appendChild(previewImgDeleteSpan);
            courseIconName.innerHTML = JSON.parse(fileObj.fileIcon).fileName;
            //previewImgDiv.src = JSON.parse(fileObj.fileIcon).sourceF;
        }else{
            courseIconForm.appendChild(chooseImgInput);
            //courseIconForm.appendChild(courseIconUploadBtn);
        }
        //instanceDesArea.value = instanceFile.description;
    }else{
        courseIconForm.appendChild(chooseImgInput);
    }

    //上传课程图标
    mxEvent.addListener(chooseImgInput, 'change', mxUtils.bind(this, function () {
        var files = chooseImgInput.files;
        if(files.length > 0){
            var fileName = files[0].name.toLocaleLowerCase();
            var fileSize = files[0].size;
            var is = fileName.lastIndexOf('.');
            if(is == -1) {
                editorUi.showDialog(new tipDialogBody(editorUi, mxResources.get('incorrectMaterialFormat')), 300, null, true, true);
                return false;
            }else{
                //过滤文件类型
                var testFileType = fileName.substring(is+1);
                if((testFileType === 'png') || (testFileType === 'jpg') || (testFileType === 'gif') || (testFileType === 'bmp')) {
                    if(fileSize < 5*1024*1024){
                        courseIconForm.appendChild(courseIconUploadBtn);
                        //courseIconForm.appendChild(courseIconPreviewSpan);
                    }else {
                        alert('抱歉，课程图标大小不可超过5MB');
                    }
                }else{
                    alert('抱歉，系统暂不支持'+testFileType+'格式的资料，您可以转换为其他格式再上传~');
                    return false;
                }
            }
        }else{

        }
    }));

    var resultFile={};
    courseIconUploadBtn.onclick = function(){
        var files = chooseImgInput.files;
        var formData = new FormData();
        if(files.length > 0){
            var imgObj = files[0];
            formData.append('userId', userId);
            formData.append('imageSizes','125m125');//默认图片裁剪大小"125m125_75m75"
            formData.append('file', imgObj);
            var xhr = new XMLHttpRequest();
            xhr.open('post', MATERIAL_URL + '/fileUpload' ,true);
            var result;
            xhr.onload = function(e){
                if(this.status == 200){
                    result = this.response;
                    if(result === 'error'){
                        editorUi.showDialog(new tipDialogBody(editorUi, 'edit error'), 300, null, true, true);
                    }
                    var res = JSON.parse(result);
                    res.originalName = imgObj.name;
                    res.materialsId = res.fileId;
                    res.ownerId = userId;
                    resultFile = res;
                    courseIconForm.removeChild(chooseImgInput);
                    courseIconForm.removeChild(courseIconUploadBtn);
                    //courseIconForm.removeChild(courseIconPreviewSpan);
                    courseIconForm.appendChild(courseIconName);
                    courseIconForm.appendChild(previewImgEditSpan);
                    courseIconForm.appendChild(previewImgDeleteSpan);
                    courseIconName.innerHTML = res.originalName;
                }
            };
            xhr.send(formData);
        }else{
            alert('未选择图片！');
        }
    };

    this.previewImg = true;
    courseIconName.onclick = mxUtils.bind(this, function(){
        if(this.previewImg){
            if((courseIconForm.children ||courseIconForm.childNodes).length === 3){
                courseIconForm.appendChild(previewImgDiv);
            }
            //previewImgDiv.src = resultFile.sourceF?(imageServerHost + resultFile.sourceF): JSON.parse(fileObj.fileIcon).sourceF;
            var materialsId, ownerId;
            if(resultFile.materialsId){
                materialsId = resultFile.materialsId;
                ownerId = resultFile.ownerId;
            } else {
                var tmp = JSON.parse(fileObj.fileIcon);
                materialsId = tmp.materialsId;
                ownerId = tmp.ownerId;
            }
            previewImgDiv.src = MATERIAL_URL + '/fileRead?createType=own&userId='+ ownerId +'&fileId=' + materialsId;
            previewImgDiv.onload = function(data){
                //console.log(data);
            };
            previewImgDiv.onerror = function(error){
                alert('获取图片内容出错了');
                //console.log(error);
            };
            previewImgDiv.style.width = '400px';
            previewImgDiv.style.height = '300px';
            previewImgDiv.style.display = 'block';
        }else{
            if((courseIconForm.children ||courseIconForm.childNodes).length === 4)
                courseIconForm.removeChild(previewImgDiv);
        }
        this.previewImg = !this.previewImg;
    });

    //重新选择课程图标
    previewImgEditSpan.onclick = function(){
        courseIconForm.removeChild(previewImgDeleteSpan);
        courseIconForm.removeChild(previewImgEditSpan);
        courseIconForm.removeChild(courseIconName);
        courseIconForm.appendChild(chooseImgInput);
        //chooseImgInput.createTextRange().execCommand('delete');
        chooseImgInput.outHTML = chooseImgInput.outHTML;
        resultFile = null;
    };
    //删除已选课程图标
    previewImgDeleteSpan.onclick = function(){
        courseIconForm.removeChild(previewImgDeleteSpan);
        courseIconForm.removeChild(previewImgEditSpan);
        courseIconForm.removeChild(courseIconName);
        courseIconForm.appendChild(chooseImgInput);
        //chooseImgInput.createTextRange().execCommand('delete');
        chooseImgInput.outHTML = chooseImgInput.outHTML;
        resultFile = null;
    };
    this.init = function () {
        nameInput.focus();

        if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS) {
            nameInput.select();
        }
        else {
            document.execCommand('selectAll', false, null);
        }

        // Installs drag and drop handler for links
        if (fileSupport) {
            // Setup the dnd listeners
            var dlg = table.parentNode;
            var graph = editorUi.editor.graph;
            var dropElt = null;

            mxEvent.addListener(dlg, 'dragleave', function (evt) {
                if (dropElt != null) {
                    dropElt.style.backgroundColor = '';
                    dropElt = null;
                }

                evt.stopPropagation();
                evt.preventDefault();
            });

            mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function (evt) {
                // IE 10 does not implement pointer-events so it can't have a drop highlight
                if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10)) {
                    dropElt = nameInput;
                    dropElt.style.backgroundColor = '#ebf2f9';
                }

                evt.stopPropagation();
                evt.preventDefault();
            }));

            mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function (evt) {
                if (dropElt != null) {
                    dropElt.style.backgroundColor = '';
                    dropElt = null;
                }

                if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) {
                    nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
                    genericBtn.click();
                }

                evt.stopPropagation();
                evt.preventDefault();
            }), false);
        }
    };
    //上半部分的文件基本信息
    var basicInfo = document.createElement('div');
    basicInfo.setAttribute('style', 'border-bottom:1px solid #b5b5b5;padding-bottom:10px');
    if (isCreate){
        ////提示信息 removed by course dept 170216
        //var tipsText = document.createElement('div');
        //tipsText.setAttribute('style', 'color: red; margin: 10px 15px;');
        //tipsText.innerHTML = mxResources.get('lDoTheseThingsBeforeCreatingTheFile');
        //basicInfo.appendChild(tipsText);
    }
    basicInfo.appendChild(fileNameBox);
    //basicInfo.appendChild(fileDescBox);
    table.appendChild(basicInfo);

    var row = document.createElement('div');
    td = document.createElement('div');
    td.style.padding = '15px 5px 5px 0';
    //td.style.borderTop = '1px solid #b5b5b5';
    td.style.backgroundColor = '#E5E5E5';
    td.style.overflow = 'auto';
    td.setAttribute('align', 'right');

    var queryObj = {};  //保存数据对象

    if(!isCreate){
        nameInput.value = fileObj.fileName;
        //fileDescContent.value = fileObj.fileDesc;
        var fileDescOrgData =  (fileObj.fileDesc) ? ((fileObj.fileDesc[0]=='{') ? (JSON.parse(fileObj.fileDesc)) : {"content":fileObj.fileDesc}) : null;
        OPLEtoolBox.style.display = 'none';
        chooseTaskTr.style.display = 'none';
    }
    if(mxUi === 'process_design'){
        basicInfo.appendChild(OPLEtoolBox);
        basicInfo.appendChild(chooseTaskTr);
        basicInfo.appendChild(this.bindBoardIdBox);
        basicInfo.appendChild(courseIconForm);
        basicInfo.appendChild(groupArea);
        //basicInfo.appendChild(isSingleSupportDiv);
        var tagList = [
            {name:'学习情境描述', id: 'workSituation', descrpt:'描述该课程中学习任务执行的具体工作情境'},
            {name:'学习任务', id: 'workTask', height:'50px', descrpt:'学习任务是用于学习的工作任务，学习的内容是工作和通过工作完成的学习任务。确定和设计学习任务时，应对学习目标和主要学习内容有基本的设想，清楚所采用的学习资源、途径和完成任务的操作程序与步骤，并对学习方式(独立或组合)、学生与教师的角色分配有大体的安排。'},
            {name:'学习目标', id: 'goal', height:'45px', descrpt:'有效的学习目标应能说明以下问题：1.学习该课程的主要意图是什么? 2.完成规定工作需要什么条件? 3.能达到什么样的质量标准? 4.学生要达到这个要求必须做到什么? 5.怎么知道何时学生的行为已经达到了要求? 6.能完成什么工作? '},
            {name:'学习内容', id: 'content', height:'50px', descrpt:'先按照学习目标确定学习内容，再根据学生的具体情况加以调整或补充。“学习内容”包括工作对象工具材料、工作方法、劳动组织方式和工作要求。这里既包含知识、技能成分，也包含态度和价值观成分。'},
            {name:'重难点', id: 'difficulty'},
            {name:'教学组织形式与教学方法', id: 'organizationForm'},
            {name:'考核标准', id: 'assessmentStandards'},
            {name:'教学条件', id: 'teachingCondition'},
            {name:'教学时间安排', id: 'schedule', descrpt:'该课程预计的教学时'},
            {name:'工作对象', id: 'target', height:'45px', descrpt:'“工作对象”描述的是指工作人员在具体工作情境和工作过程中行动的内容，它不仅要说明工作对象的事物本身(如机床)，而且要说明其在工作过程中的功能(如操作机床或维修机床)，也就是在工作中要做的具体事情。'},
            {name:'工作与教学用具', id: 'tool', descrpt:'完成工作任务时需用到的工具'},
            {name:'工作要求', id: 'workRequirement', descrpt:'工作要求一般按工作对象的顺序提出，不仅有企业的，还有社会的和个人的，即从不同侧面和角度对工作过程和工作对象提出要求，反映了不同利益团体矛盾和要求的博弈。'}
        ];
        table.appendChild(this.detailDescArea(tagList, fileDescOrgData));
    } else if (mxUi==='course_design'){
        basicInfo.appendChild(courseIconForm);
        //课程分类
        var courseCategoryDiv = document.createElement('div');
        courseCategoryDiv.setAttribute('style','padding: 10px 15px;display: inline-flex;');
        mxUtils.write(courseCategoryDiv, '课程分类：');
        var linkageSelect;
        $.get('/getCourseCategoryTrees', function (categoryTrees) {
            if (fileObj && fileObj.categoryId){
                var oriCategoryId = fileObj.categoryId;
                var findPathToLeaf = function (trees) {
                    for (var i = 0; i < trees.length; i++){
                        if (trees[i].value != oriCategoryId){
                            if (trees[i].child && trees[i].child.length > 0){
                                var result = findPathToLeaf(trees[i].child);
                                if (result){
                                    trees[i].selected = true;
                                    return true;
                                }
                            }
                        } else {
                            trees[i].selected = true;
                            return true;
                        }
                    }
                };
                findPathToLeaf(categoryTrees);
            }
            linkageSelect = editorUi.formItems.msLinkageSelect(categoryTrees);
            var linkageSelectDiv = linkageSelect.getContainer();
            courseCategoryDiv.appendChild(linkageSelectDiv);
        });

        basicInfo.appendChild(courseCategoryDiv);

        var tagList = [
            {name:'课程导读', id: 'courseGuide', height:'45px', descrpt:''},
            {name:'适用对象', id: 'suitableUser', height:'45px', descrpt:''},
            {name:'典型工作任务描述', id: 'typicalTaskDes', height:'50px', descrpt:''},
            {name:'课程目标', id: 'courseGoal'},
            {name:'课程内容', id: 'courseContent', descrpt:''},
            {name:'工作对象', id: 'workTarget', descrpt:''},
            {name:'工具、工作方法与工作组织方式', id: 'tool'},
            {name:'工作要求', id: 'workRequirement', descrpt:''},
            {name:'职业资格标准', id: 'vocationalStandard', descrpt:''},
            {name:'课时数', id: 'courseLength', height:'50px', descrpt:''},
            {name:'教师介绍', id: 'aboutProfessor', descrpt:''},
            {name:'工作过程', id: 'workProcess', height:'45px'}
        ];
        table.appendChild(this.detailDescArea(tagList, fileDescOrgData));
    }
    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        editorUi.hideDialog();
        handleRes();
    });
    cancelBtn.className = 'geBtn';
    var genericBtn = mxUtils.button(mxResources.get('save'), function () {
        if (editorUi.editor.validateFileName(nameInput.value)) {
            var string = nameInput.value;
            nameInput.value = string.trim();
            if (mxUi === 'process_design' || mxUi === 'course_design'){
                //var fileDesc = document.getElementById('_fileDesc').value.trim();
                var formDom = document.getElementsByName('detailDes');
                var fileDescData = {};
                for (var i = 0; i < tagList.length; i++){
                    fileDescData[tagList[i].id] = formDom[i].value
                }
            }
            if(0){
                //if(fileDesc == ''){
                var message = mxResources.get('nullDescription');
                var tipDialog = new tipDialogBody(editorUi,message);
                editorUi.showDialog(tipDialog, 300, null, true, true);
            }else{
                queryObj['fileName'] = nameInput.value;
                if (mxUi === 'process_design'){
                    queryObj['fileDesc'] = JSON.stringify(fileDescData);
                    queryObj['groupRange'] = JSON.stringify({
                        //"minGroup": $('#group-min').val(),
                        //"maxGroup": $('#group-max').val(),
                        "minMember": $('#member-min').val(),
                        "maxMember": $('#member-max').val(),
                        "minRole": $('#role-min').val(),
                        "maxRole": $('#role-max').val()
                    });
                    //queryObj['isSingleSupported'] = isSingleSupportRadio.submitRadio().value;
                    if(resultFile.materialsId){
                        var fileIconObj = {
                            materialsId : resultFile.materialsId,
                            fileName : resultFile.fileName,
                            ownerId : resultFile.ownerId,
                            filePath : resultFile.filePath
                        };
                        queryObj['fileIcon'] = JSON.stringify(fileIconObj);
                    } else if (!isCreate && fileObj.fileIcon && (fileObj.fileIcon != "null")&& (fileObj.fileIcon != "undefined")){
                        queryObj['fileIcon'] = fileObj.fileIcon;
                    }
                    //1.role范围包括1 2.泳道中角色只有一个。则isCooperation=false
                    if(($('#role-min').val()<2) && ($('#role-max').val()>1) && (editorUi.getRolePool().length === 1)){
                        queryObj['isCooperation'] = false;
                    } else {
                        queryObj['isCooperation'] = true;
                    }
                }
                if(mxUi === 'process_design' &&  $(chooseTaskForm).serializeArray()[0].value === 'bindTask'){
                    queryObj['boardId'] = bindTaskId;
                    //todo change taskXml to processXml
                    editorUi.communication.getBindTaskXmlData(queryObj, mxUtils.bind(this, function (message) {
                        console.log(message);
                        //todo test ople
                        if(message.success){
                            var cells = message.data;
                            var cellsArr = [];
                            if(cells.length > 0){
                                for(var i = 0 ; i < cells.length; i++){
                                    cellsArr = cellsArr.concat(cells[i].subTask);
                                }
                            }
                            me.initGraph(editorUi,cellsArr);
                        }else{
                            //alert(message.msg);
                            editorUi.showDialog(new tipDialogBody(editorUi, message.msg), 300, null, true, true);
                        }
                    }));
                }else if(mxUi === 'task_design' && urlParams['ch']){
                    var chatBox = editorUi.chatDiv;
                    var chatInfo = chatBox.getChatInfo();
                    console.log(chatInfo);
                    queryObj['chatInfo']= chatInfo;
                } else if (mxUi ==='course_design'){
                    queryObj['fileDesc'] = JSON.stringify(fileDescData);
                    queryObj['categoryId'] = linkageSelect.getSelectedOption().value;
                    if(resultFile.materialsId){
                        var fileIconObj = {
                            materialsId : resultFile.materialsId,
                            fileName : resultFile.fileName,
                            ownerId : resultFile.ownerId,
                            filePath : resultFile.filePath
                        };
                        queryObj['fileIcon'] = JSON.stringify(fileIconObj);
                    } else if (!isCreate && fileObj.fileIcon && (fileObj.fileIcon != "null")&& (fileObj.fileIcon != "undefined")){
                        queryObj['fileIcon'] = fileObj.fileIcon;
                    }
                }
                handleRes(queryObj);
                //editorUi.hideDialog();
            }
        }
    });
    genericBtn.className = 'geBtn gePrimaryBtn';

    //if (editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    //}

    mxEvent.addListener(nameInput, 'keypress', function (e) {
        if (e.keyCode == 13) {
            genericBtn.click();
        }
    });
    td.appendChild(genericBtn);

    //if (!editorUi.editor.cancelFirst) {
    //    td.appendChild(cancelBtn);
    //}

    row.appendChild(td);
    //table.appendChild(row);
    table.appendChild(row);
    this.getBodyContainer().appendChild(table);
    this.getBodyContainer().style.backgroundColor = '#FAFAFA';
};
mxUtils.extend(FilenameDialogBody, DialogBody);
FilenameDialogBody.prototype.detailDescArea = function (tagList, originalData) {
    var formBox = document.createElement('div');
    formBox.setAttribute('style', 'margin: 5px 0 5px 15px;height: 400px;overflow: auto;');
    for (var i = 0; i < tagList.length; i++){
        var height = (tagList[i].height) ? tagList[i].height : '30px';
        var content = (originalData)?originalData[tagList[i].id]:null;
        formBox.appendChild(this.createFormDiv(tagList[i].name, height, content, tagList[i].descrpt));
    }
    return formBox;
};
FilenameDialogBody.prototype.initGraph = function(editorUi,cells){
    var me = this;
    me.startCellStyle = 'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;verticalAlign=top;perimeter=ellipsePerimeter;outline=standard;symbol=general';
    me.endCellStyle = 'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;verticalAlign=top;perimeter=ellipsePerimeter;outline=end;symbol=general';
    me.userTaskCellStyle = 'bpmn;html=1;whiteSpace=wrap;rounded=1';
    me.userCellStyle = 'html=1;shape=mxgraph.bpmn.user_task;';
    me.poolCellStyle = 'swimlane;html=1;horizontal=0;swimlaneFillColor=white;startSize=20';
    me.edgeCellStyle = 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;entryX=0;entryY=0.5;strokeColor=#B3B3B3;strokeWidth=3';
    editorUi.editor.resetGraph();
    editorUi.editor.graph.model.clear();
    var model = new mxGraphModel();
    var graph = editorUi.editor.graph;
    var parent = graph.getDefaultParent();
    model.beginUpdate();

    try{
        var poolNode = graph.insertVertex(parent,null,'泳池',10,10,800,200*((cells.length)/4+1),me.poolCellStyle);
        var startNode = graph.insertVertex(poolNode,null,'start',40,35,50,50,me.startCellStyle);
        var endNode = graph.insertVertex(poolNode,null,'end',((cells.length+1)%4*220 === 0)?40:(cells.length+1)%4*220,parseInt((cells.length+1)/4)*120+35,50,50,me.endCellStyle);
        linkCell(poolNode,cells);
    }
    finally{
        model.endUpdate();
    }
    function linkCell(parent,cells){
        var nodesArr = [];
        if(cells.length > 0){
            for(var i = 0 ; i < cells.length; i++){
                var x = ((i+1)%4 === 0)?40:(i+1)%4*220;
                var y = (parseInt((i+1)/4) === 0)?20:parseInt((i+1)/4)*180;
                nodesArr[i] = graph.insertVertex(parent, null, cells[i].label, x, y, 120, 80,me.userTaskCellStyle);
                var user_task = graph.insertVertex(nodesArr[i], null, '', 7, 7, 14, 14,me.userCellStyle);
            }
        }
        nodesArr.splice(0,0,startNode);
        nodesArr.splice(nodesArr.length,0,endNode);
        var edgesArr = [];
        for(var i = 1 ; i < nodesArr.length; i++){
            //graph.setConnectable(true);
            edgesArr[i] = graph.insertEdge(parent, null, '', nodesArr[i-1], nodesArr[i],me.edgeCellStyle);
            //var edge = graph.createEdge(parent, null, '', nodesArr[i-1], nodesArr[i],me.edgeCellStyle);
            //graph.addEdge(edge, parent, nodesArr[i-1], nodesArr[i],me.edgeCellStyle);
        }
    }
};
FilenameDialogBody.prototype.createFormDiv = function (title, minHeight, content, placeHolder) {
    var formBox = document.createElement('div');
    formBox.style.width = "98%";
    var text = document.createElement('span');
    text.innerHTML = title + '：';
    text.className = 'explanationText';
    text.style.display = 'block';
    formBox.style.padding = '5px 0';
    formBox.appendChild(text);
    var formInput = this.editorUi.formItems.msTextarea('', '98%');
    formInput.name = 'detailDes';
    if (placeHolder){
        formInput.placeholder = placeHolder;
    }
    formInput.style.minHeight= ((minHeight) ? minHeight : '50px');
    //formInput.style.width= '600px';
    if (content) {
        formInput.value = content;
    }
    formBox.appendChild(formInput);
    return formBox;
};

/**
 * Constructs a new filename dialog.
 */
var FilenameDialogBody2 = function (editorUi, filename, buttonText, resHandler, label, validateFn) {
    DialogBody.call(this, '');
    var row, td;

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    //table.style.marginTop = '8px';

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    td.style.width = '120px';
    mxUtils.write(td, (label || mxResources.get('filename')) + ':');

    row.appendChild(td);

    var nameInput = document.createElement('input');
    nameInput.setAttribute('value', filename || '');
    nameInput.style.width = '180px';

    var genericBtn = mxUtils.button(buttonText, function () {
        if (validateFn == null || validateFn(nameInput.value)) {

            resHandler(nameInput.value, function (data) {
                if (data !== 'exist') {
                    editorUi.hideDialog();
                }
            });
        }
    });
    genericBtn.className = 'geBtn gePrimaryBtn';

    this.init = function () {
        nameInput.focus();

        if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS) {
            nameInput.select();
        }
        else {
            document.execCommand('selectAll', false, null);
        }

        // Installs drag and drop handler for links
        if (fileSupport) {
            // Setup the dnd listeners
            var dlg = table.parentNode;
            var graph = editorUi.editor.graph;
            var dropElt = null;

            mxEvent.addListener(dlg, 'dragleave', function (evt) {
                if (dropElt != null) {
                    dropElt.style.backgroundColor = '';
                    dropElt = null;
                }

                evt.stopPropagation();
                evt.preventDefault();
            });

            mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function (evt) {
                // IE 10 does not implement pointer-events so it can't have a drop highlight
                if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10)) {
                    dropElt = nameInput;
                    dropElt.style.backgroundColor = '#ebf2f9';
                }

                evt.stopPropagation();
                evt.preventDefault();
            }));

            mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function (evt) {
                if (dropElt != null) {
                    dropElt.style.backgroundColor = '';
                    dropElt = null;
                }

                if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) {
                    nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
                    genericBtn.click();
                }

                evt.stopPropagation();
                evt.preventDefault();
            }), false);
        }
    };

    td = document.createElement('td');
    td.appendChild(nameInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');
    td.colSpan = 2;
    td.style.paddingTop = '20px';
    td.style.whiteSpace = 'nowrap';
    td.setAttribute('align', 'right');

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    mxEvent.addListener(nameInput, 'keypress', function (e) {
        if (e.keyCode == 13) {
            genericBtn.click();
        }
    });

    td.appendChild(genericBtn);

    if (!editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);

    tbody.appendChild(row);
    table.appendChild(tbody);
    this.getBodyContainer().appendChild(table);
    //this.container = table;
};
mxUtils.extend(FilenameDialogBody2, DialogBody);
/**
 * Constructs a new textarea dialog.
 */
var TextareaDialog = function (editorUi, title, url, fn, cancelFn, cancelTitle, w, h, addButtons, noHide) {
    DialogBody.call(this, '');
    w = (w != null) ? w : 300;
    h = (h != null) ? h : 120;
    noHide = (noHide != null) ? noHide : false;
    var row, td;

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    td.style.width = '100px';
    mxUtils.write(td, title);

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');

    var nameInput = document.createElement('textarea');
    mxUtils.write(nameInput, url || '');
    nameInput.style.resize = 'none';
    nameInput.style.width = w + 'px';
    nameInput.style.height = h + 'px';

    this.textarea = nameInput;

    this.init = function () {
        nameInput.focus();
        nameInput.scrollTop = 0;
    };

    td.appendChild(nameInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');
    td.style.paddingTop = '14px';
    td.style.whiteSpace = 'nowrap';
    td.setAttribute('align', 'right');

    var cancelBtn = mxUtils.button(cancelTitle || mxResources.get('cancel'), function () {
        editorUi.hideDialog();

        if (cancelFn != null) {
            cancelFn();
        }
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    if (addButtons != null) {
        addButtons(td);
    }

    if (fn != null) {
        var genericBtn = mxUtils.button(mxResources.get('apply'), function () {
            if (!noHide) {
                editorUi.hideDialog();
            }

            fn(nameInput.value);
        });

        genericBtn.className = 'geBtn gePrimaryBtn';
        td.appendChild(genericBtn);
    }

    if (!editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);
    //this.container = table;
    this.getBodyContainer().appendChild(table);
};

mxUtils.extend(TextareaDialog, DialogBody);
/**
 * Constructs a new edit file dialog.
 */
var EditFileDialogBody = function (editorUi, title) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    //div.style.textAlign = 'right';
    var textarea = document.createElement('textarea');
    textarea.style.resize = 'none';
    textarea.style.width = '611px';
    textarea.style.height = '370px';
    //textarea.style.marginBottom = '16px';

    textarea.value = mxUtils.getPrettyXml(editorUi.editor.getGraphXml());
    div.appendChild(textarea);

    // Enables dropping files
    if (fileSupport) {
        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (evt.dataTransfer.files.length > 0) {
                var file = evt.dataTransfer.files[0];
                var reader = new FileReader();

                reader.onload = function (e) {
                    textarea.value = e.target.result;
                };

                reader.readAsText(file);
            }
            else {
                textarea.value = editorUi.extractGraphModelFromEvent(evt);
            }
        };

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        };

        // Setup the dnd listeners.
        textarea.addEventListener('dragover', handleDragOver, false);
        textarea.addEventListener('drop', handleDrop, false);
    }
    var btnContainer = document.createElement('div');
    btnContainer.style.textAlign = 'right'
    btnContainer.style.padding = '5px';

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        btnContainer.appendChild(cancelBtn);
    }

    var select = document.createElement('select');
    select.style.width = '180px';
    select.className = 'geBtn';

    var replaceOption = document.createElement('option');
    replaceOption.setAttribute('value', 'replace');
    mxUtils.write(replaceOption, mxResources.get('replaceExistingDrawing'));
    select.appendChild(replaceOption);

    var newOption = document.createElement('option');
    newOption.setAttribute('value', 'new');
    mxUtils.write(newOption, mxResources.get('openInNewWindow'));
    select.appendChild(newOption);

    var importOption = document.createElement('option');
    importOption.setAttribute('value', 'import');
    mxUtils.write(importOption, mxResources.get('addToExistingDrawing'));
    select.appendChild(importOption);

    btnContainer.appendChild(select);

    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        // Removes all illegal control characters before parsing
        var data = editorUi.editor.graph.zapGremlins(mxUtils.trim(textarea.value));

        if (select.value == 'new') {
            window.openFile = new OpenFile(function () {
                editorUi.hideDialog();
                window.openFile = null;
            });

            window.openFile.setData(data, null);
            window.open(editorUi.getUrl());
        }
        else if (select.value == 'replace') {
            try {
                var doc = mxUtils.parseXml(data);
                editorUi.editor.setGraphXml(doc.documentElement);
                editorUi.hideDialog();
            }
            catch (e) {
                //mxUtils.alert(e.message);
                editorUi.showDialog(new tipDialogBody(editorUi, e.message), 300, null, true, true);
            }
        }
        else if (select.value == 'import') {
            var doc = mxUtils.parseXml(data);
            var model = new mxGraphModel();
            var codec = new mxCodec(doc);
            codec.decode(doc.documentElement, model);

            var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
            editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(children));

            editorUi.hideDialog();
        }
    });
    okBtn.className = 'geBtn gePrimaryBtn';
    btnContainer.appendChild(okBtn);

    if (!editorUi.editor.cancelFirst) {
        btnContainer.appendChild(cancelBtn);
    }
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(EditFileDialogBody, DialogBody);
/**
 * Constructs a new export dialog.
 */
var ExportDialogBody = function (editorUi, title) {
    DialogBody.call(this, title);
    var container = this.getBodyContainer();

    var graph = editorUi.editor.graph;
    var bounds = graph.getGraphBounds();
    var scale = graph.view.scale;

    var width = Math.ceil(bounds.width / scale);
    var height = Math.ceil(bounds.height / scale);

    var row, td;

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    td.style.width = '100px';
    mxUtils.write(td, mxResources.get('filename') + ':');

    row.appendChild(td);

    var nameInput = document.createElement('input');
    nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
    nameInput.style.width = '280px';

    td = document.createElement('td');
    td.appendChild(nameInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    mxUtils.write(td, mxResources.get('format') + ':');

    row.appendChild(td);

    var imageFormatSelect = document.createElement('select');
    imageFormatSelect.style.width = '280px';


    if (ExportDialogBody.showXmlOption) {
        var xmlOption = document.createElement('option');
        xmlOption.setAttribute('value', 'xml');
        mxUtils.write(xmlOption, 'XML - Extensible Markup Language');
        imageFormatSelect.appendChild(xmlOption);
    }

    var svgOption = document.createElement('option');
    svgOption.setAttribute('value', 'svg');
    mxUtils.write(svgOption, 'SVG - Scalable Vector Graphics');
    imageFormatSelect.appendChild(svgOption);

    var pngOption = document.createElement('option');
    pngOption.setAttribute('value', 'png');
    mxUtils.write(pngOption, 'PNG - Portable Network Graphics');
    imageFormatSelect.appendChild(pngOption);

    var gifOption = document.createElement('option');
    gifOption.setAttribute('value', 'gif');
    mxUtils.write(gifOption, 'GIF - Graphics Interchange Format');
    imageFormatSelect.appendChild(gifOption);

    var jpgOption = document.createElement('option');
    jpgOption.setAttribute('value', 'jpg');
    mxUtils.write(jpgOption, 'JPG - JPEG File Interchange Format');
    imageFormatSelect.appendChild(jpgOption);

    var pdfOption = document.createElement('option');
    pdfOption.setAttribute('value', 'pdf');
    mxUtils.write(pdfOption, 'PDF - Portable Document Format');
    imageFormatSelect.appendChild(pdfOption);


    td = document.createElement('td');
    td.appendChild(imageFormatSelect);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    mxUtils.write(td, mxResources.get('backgroundColor') + ':');

    row.appendChild(td);

    var backgroundInput = document.createElement('input');
    backgroundInput.setAttribute('value', (graph.background || '#FFFFFF'));
    backgroundInput.style.width = '60px';

    var backgroundCheckbox = document.createElement('input');
    backgroundCheckbox.setAttribute('type', 'checkbox');
    backgroundCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;

    td = document.createElement('td');
    td.appendChild(backgroundInput);
    td.appendChild(backgroundCheckbox);
    mxUtils.write(td, mxResources.get('transparent'));

    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    mxUtils.write(td, mxResources.get('width') + ':');

    row.appendChild(td);

    var widthInput = document.createElement('input');
    widthInput.setAttribute('value', width);
    widthInput.style.width = '60px';

    td = document.createElement('td');
    td.appendChild(widthInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    mxUtils.write(td, mxResources.get('height') + ':');

    row.appendChild(td);

    var heightInput = document.createElement('input');
    heightInput.setAttribute('value', height);
    heightInput.style.width = '60px';

    td = document.createElement('td');
    td.appendChild(heightInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '14px';
    mxUtils.write(td, mxResources.get('borderWidth') + ':');

    row.appendChild(td);

    var borderInput = document.createElement('input');
    borderInput.setAttribute('value', width);
    borderInput.style.width = '60px';
    borderInput.value = '0';

    td = document.createElement('td');
    td.appendChild(borderInput);
    row.appendChild(td);

    tbody.appendChild(row);
    table.appendChild(tbody);

    // Handles changes in the export format
    function formatChanged() {
        var name = nameInput.value;
        var dot = name.lastIndexOf('.');

        if (dot > 0) {
            nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
        }
        else {
            nameInput.value = name + '.' + imageFormatSelect.value;
        }

        if (imageFormatSelect.value === 'xml') {
            widthInput.setAttribute('disabled', 'true');
            heightInput.setAttribute('disabled', 'true');
            borderInput.setAttribute('disabled', 'true');
        }
        else {
            widthInput.removeAttribute('disabled');
            heightInput.removeAttribute('disabled');
            borderInput.removeAttribute('disabled');
        }

        if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg') {
            backgroundCheckbox.removeAttribute('disabled');
        }
        else {
            backgroundCheckbox.setAttribute('disabled', 'disabled');
        }
    }

    mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
    formatChanged();

    function checkValues() {
        if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0) {
            widthInput.style.backgroundColor = 'red';
        }
        else {
            widthInput.style.backgroundColor = '';
        }

        if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0) {
            heightInput.style.backgroundColor = 'red';
        }
        else {
            heightInput.style.backgroundColor = '';
        }
    }

    mxEvent.addListener(widthInput, 'change', function () {
        if (width > 0) {
            heightInput.value = Math.ceil(parseInt(widthInput.value) * height / width);
        }
        else {
            heightInput.value = '0';
        }

        checkValues();
    });

    mxEvent.addListener(heightInput, 'change', function () {
        if (height > 0) {
            widthInput.value = Math.ceil(parseInt(heightInput.value) * width / height);
        }
        else {
            widthInput.value = '0';
        }

        checkValues();
    });

    // Resuable image export instance
    var imgExport = new mxImageExport();

    function getSvg() {
        var b = Math.max(0, parseInt(borderInput.value)) + 1;
        var scale = parseInt(widthInput.value) / width;
        var bg = null;

        if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE && !backgroundCheckbox.checked) {
            bg = backgroundInput.value;
        }

        return graph.getSvg(bg, scale, b);
    };

    function getXml() {
        return mxUtils.getXml(editorUi.editor.getGraphXml());
    };

    row = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('align', 'right');
    td.style.paddingTop = '24px';
    td.colSpan = 2;

    var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function () {
        if (parseInt(widthInput.value) <= 0 && parseInt(heightInput.value) <= 0) {
            //mxUtils.alert(mxResources.get('drawingEmpty'));
            editorUi.showDialog(new tipDialogBody(editorUi, mxResources.get('drawingEmpty')), 300, null, true, true);
        }
        else {
            var format = imageFormatSelect.value;
            var name = nameInput.value;


            if (format == 'xml') {
                var xml = getXml();
                //++--
                var blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
                appUtils.saveToLocalDisk(blob, name);

            } else if (format == 'svg') {
                var xml = mxUtils.getXml(getSvg());

                if (xml.length < MAX_REQUEST_SIZE) {
                    var blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
                    appUtils.saveToLocalDisk(blob, name);
                }
                else {
                    //mxUtils.alert(mxResources.get('drawingTooLarge'));
                    editorUi.showDialog(new tipDialogBody(editorUi, mxResources.get('drawingTooLarge')), 300, null, true, true);
                    mxUtils.popup(xml);
                }
            } else {
                // todo
                //alert(mxResources.get('notYetSupported'));
                editorUi.showDialog(new tipDialogBody(editorUi, mxResources.get('notYetSupported')), 300, null, true, true);
                //var param = null;
                //var w = parseInt(widthInput.value) || 0;
                //var h = parseInt(heightInput.value) || 0;
                //var b = Math.max(0, parseInt(borderInput.value)) + 1;
                //
                //var exp = ExportDialogBody.getExportParameter(editorUi, format);
                //
                //if (typeof exp == 'function')
                //{
                //param = exp();
                //} else {
                //	var scale = parseInt(widthInput.value) / width;
                //	var bounds = graph.getGraphBounds();
                //	var vs = graph.view.scale;
                //
                //// New image export
                //	var xmlDoc = mxUtils.createXmlDocument();
                //	var root = xmlDoc.createElement('output');
                //	xmlDoc.appendChild(root);
                //
                //    // Renders graph. Offset will be multiplied with state's scale when painting state.
                //	var xmlCanvas = new mxXmlCanvas2D(root);
                //	xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs), Math.floor((b / scale - bounds.y) / vs));
                //	xmlCanvas.scale(scale / vs);
                //    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
                //
                //	// Puts request data together
                //	w = Math.ceil(bounds.width * scale / vs + 2 * b);
                //	h = Math.ceil(bounds.height * scale / vs + 2 * b);
                //	param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
                //}
                //
                //// Requests image if request is valid
                //if (param != null && param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
                //{
                //	var bg = '';
                //
                //	if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE &&
                //		(format != 'png' || !backgroundCheckbox.checked))
                //	{
                //		bg = '&bg=' + backgroundInput.value;
                //	}
                //
                //	new mxXmlRequest(EXPORT_URL, 'filename=' + name + '&format=' + format +
                //	bg + '&w=' + w + '&h=' + h + '&border=' + b + '&' + param).
                //	simulate(document, '_blank');
                //} else
                //{
                //	mxUtils.alert(mxResources.get('drawingTooLarge'));
                //}
            }

            editorUi.hideDialog();
        }
    }));
    saveBtn.className = 'geBtn gePrimaryBtn';

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        td.appendChild(cancelBtn);
        td.appendChild(saveBtn);
    }
    else {
        td.appendChild(saveBtn);
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);
    container.appendChild(table);
    this.container = container;
};
/**
 * Global switches for the export dialog.
 */
ExportDialogBody.showXmlOption = true;

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialogBody.getExportParameter = function (ui, format) {
    return null;
};
mxUtils.extend(ExportDialogBody, DialogBody);

/**
 * Constructs a new metadata dialog.
 */
var MetadataDialogBody = function (ui, cell, title) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();

    div.style.height = '310px';
    div.style.overflow = 'auto';

    var value = ui.editor.graph.getModel().getValue(cell);

    // Converts the value to an XML node
    if (!mxUtils.isNode(value)) {
        var doc = mxUtils.createXmlDocument();
        var obj = doc.createElement('object');
        obj.setAttribute('label', value || '');
        value = obj;
    }

    // Creates the dialog contents
    var form = new mxForm('properties');
    form.table.style.width = '100%';
    form.table.style.paddingRight = '25px';

    var attrs = value.attributes;
    var names = [];
    var texts = [];
    var count = 0;

    // FIXME: Fix remove button for quirks mode
    var addRemoveButton = function (text, name) {
        text.parentNode.style.marginRight = '12px';

        var removeAttr = document.createElement('a');
        var img = mxUtils.createImage(IMAGE_PATH + '/close.png');
        img.style.height = '9px';
        img.style.fontSize = '9px';
        img.style.marginBottom = '7px';

        removeAttr.className = 'geButton';
        removeAttr.setAttribute('title', mxResources.get('delete'));
        removeAttr.style.margin = '0px';
        removeAttr.style.width = '14px';
        removeAttr.style.height = '14px';
        removeAttr.style.fontSize = '14px';
        removeAttr.style.cursor = 'pointer';
        removeAttr.style.marginLeft = '6px';
        removeAttr.appendChild(img);

        var removeAttrFn = (function (name) {
            return function () {
                var count = 0;

                for (var j = 0; j < names.length; j++) {
                    if (names[j] == name) {
                        texts[j] = null;
                        form.table.deleteRow(count);

                        break;
                    }

                    if (texts[j] != null) {
                        count++;
                    }
                }
            };
        })(name);

        mxEvent.addListener(removeAttr, 'click', removeAttrFn);

        text.parentNode.style.whiteSpace = 'nowrap';
        text.parentNode.appendChild(removeAttr);
    };

    var addTextArea = function (index, name, value) {
        names[index] = name;
        texts[index] = form.addTextarea(names[count] + ':', value, 2);
        texts[index].style.width = '100%';

        addRemoveButton(texts[index], name);
    };

    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].nodeName != 'label') {
            addTextArea(count, attrs[i].nodeName, attrs[i].nodeValue);
            count++;
        }
    }

    div.appendChild(form.table);

    var newProp = document.createElement('div');
    newProp.style.whiteSpace = 'nowrap';
    newProp.style.marginTop = '6px';

    //mxUtils.write(newProp, mxResources.get('addProperty') + ':');

    var addPropertyTextLabelNode = document.createElement('span');
    addPropertyTextLabelNode.innerHTML = mxResources.get('addProperty') + ':';
    addPropertyTextLabelNode.style.margin = '2px';
    newProp.appendChild(addPropertyTextLabelNode);
    mxUtils.br(newProp);

    var nameInput = document.createElement('input');
    nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
    nameInput.setAttribute('type', 'text');
    //nameInput.setAttribute('size', (mxClient.IS_QUIRKS) ? '18' : '22');
    nameInput.style.width = '24%';
    nameInput.style.margin = '2px';

    newProp.appendChild(nameInput);
    mxUtils.write(newProp, ':');

    var valueInput = document.createElement('input');
    valueInput.setAttribute('placeholder', mxResources.get('enterValue'));
    valueInput.setAttribute('type', 'text');
    valueInput.style.width = '72%';
    valueInput.style.margin = '2px';

    newProp.appendChild(valueInput);

    div.appendChild(newProp);

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';

    var applyBtn = mxUtils.button(mxResources.get('apply'), function () {
        if (nameInput.value.length > 0) {
            var name = nameInput.value;

            if (name != null && name.length > 0 && name != 'label') {
                try {
                    var idx = mxUtils.indexOf(names, name);

                    if (idx >= 0 && texts[idx] != null) {
                        texts[idx].value = valueInput.value;
                        texts[idx].focus();
                    }
                    else {
                        // Checks if the name is valid
                        var clone = value.cloneNode(false);
                        clone.setAttribute(name, '');

                        if (idx >= 0) {
                            names.splice(idx, 1);
                            texts.splice(idx, 1);
                        }

                        names.push(name);
                        var text = form.addTextarea(name + ':', valueInput.value, 2);
                        text.style.width = '100%';
                        texts.push(text);
                        addRemoveButton(text, name);

                        text.focus();
                    }

                    applyBtn.innerHTML = mxResources.get('apply');

                    nameInput.value = '';
                    valueInput.value = '';
                }
                catch (e) {
                    //mxUtils.alert(e);
                    ui.showDialog(new tipDialogBody(ui, e), 300, null, true, true);
                }
            }
        }
        else {
            try {
                ui.hideDialog.apply(ui, arguments);

                // Clones and updates the value
                value = value.cloneNode(true);

                for (var i = 0; i < names.length; i++) {
                    if (texts[i] == null) {
                        value.removeAttribute(names[i]);
                    }
                    else {
                        value.setAttribute(names[i], texts[i].value);
                    }
                }

                // Updates the value of the cell (undoable)
                ui.editor.graph.getModel().setValue(cell, value);
            }
            catch (e) {
                //mxUtils.alert(e);
                ui.showDialog(new tipDialogBody(ui, e), 300, null, true, true);
            }
        }
    });
    applyBtn.className = 'geBtn gePrimaryBtn';

    mxEvent.addListener(nameInput, 'change', function () {
        applyBtn.innerHTML = mxResources.get((nameInput.value.length > 0) ? 'add' : 'apply');
    });

    var buttons = document.createElement('div');
    buttons.style.margin = '18px 8px';
    buttons.style.textAlign = 'right';

    if (ui.editor.cancelFirst) {
        buttons.appendChild(cancelBtn);
        buttons.appendChild(applyBtn);
    }
    else {
        buttons.appendChild(applyBtn);
        buttons.appendChild(cancelBtn);
    }

    div.appendChild(buttons);
};
mxUtils.extend(MetadataDialogBody, DialogBody);
/**
 * EndCondition
 */
var EndConditionDIv = function (ui, cell) {
    mxEventSource.call(this);
    this.ui = ui;
    this.cell = cell;
    this.init();
};
mxUtils.extend(EndConditionDIv, mxEventSource);
EndConditionDIv.prototype.init = function () {
    this.container = document.createElement('div');
    var endCondition = document.createElement('div');
    var controlForm = document.createElement('form');
    //设置默认选择方式
    var defaultValue;
    var defalutHour, defalutMinu;
    var defaultType = 'userControl';
    if(this.cell.getAttribute('controlType')){
        defaultValue = JSON.parse(this.cell.getAttribute('controlType'));
        console.log(defaultValue);
        if(defaultValue.controlType) {
            defaultType = defaultValue.controlType;
        }
        if(defaultValue.controlData && defaultValue.controlData.hh && defaultValue.controlData.mm){
            defalutHour = defaultValue.controlData.hh;
            defalutMinu = defaultValue.controlData.mm;
        }
    }
    console.log(defaultType);
    var option = [
        {name:mxResources.get('userControl'),value:'userControl'},
        {name:mxResources.get('timeControl'),value:'timeControl'},
        {name:mxResources.get('conditionControl'),value:'conditionControl'}
    ];
    this.controlRadio = this.ui.formItems.genRadioField('', 'radio', option,defaultType);
    var controlType = this.controlRadio.getElContainer();
    controlForm.appendChild(controlType);
    endCondition.appendChild(controlForm);
    this.container.appendChild(endCondition);

    //时间 div
    var timeControl = this.createTimeDiv(defalutHour, defalutMinu);
    endCondition.appendChild(timeControl);

    //条件 div
    var conditionControl = this.createConditionDiv();
    endCondition.appendChild(conditionControl);

    this.addListener('onRendered', function () {
        if(defaultType == 'userControl'){
            userControlFunc();
        }else if(defaultType == 'timeControl'){
            timeControlFunc();
        }else{
            conditionControlFunc();
        }
    });
    controlForm.onchange = mxUtils.bind(this, function () {
        if($(controlForm).serializeArray()[0].value == 'timeControl'){
            timeControlFunc();
        }else if($(controlForm).serializeArray()[0].value == 'conditionControl'){
            endCondition.removeChild(endCondition.lastChild);
            conditionControl = this.createConditionDiv();
            endCondition.appendChild(conditionControl);
            conditionControlFunc();
        }else{
            userControlFunc();
        }
    });
    var userControlFunc = function() {
        timeControl.style.display = 'none';
        conditionControl.style.display = 'none';
    };
    var timeControlFunc = function(){
        timeControl.style.display = 'block';
        conditionControl.style.display = 'none';
    };
    var conditionControlFunc = mxUtils.bind(this, function(){
        timeControl.style.display = 'none';
        conditionControl.style.display = 'block';
        this.renderConditionDiv();
    });
};
EndConditionDIv.prototype.applyTheTab = function () {
    if (this.controlRadio.submitRadio().value == 'userControl') {
        var uControl = {
            controlType: 'userControl',
            controlData: null
        };
        this.cell.setAttribute('controlType', JSON.stringify(uControl));
        console.log('6结束条件（用户控制）保存成功');
    } else if (this.controlRadio.submitRadio().value == 'timeControl') {
        var selectHour = document.getElementById('hours');
        var selectMinu = document.getElementById('minus');
        var index1 = selectHour.selectedIndex;
        var index2 = selectMinu.selectedIndex;
        var selectTime = {
            controlType: 'timeControl',
            controlData: {
                hh: selectHour.options[index1].value,
                mm: selectMinu.options[index2].value
            }
        };
        this.cell.setAttribute('controlType', JSON.stringify(selectTime));
        console.log(selectTime.controlData)
        console.log('6结束条件（时间控制）保存成功');
    } else if (this.controlRadio.submitRadio().value == 'conditionControl') {
        var data = this.getConditionData();
        var tag = true;
        if (data.rules) {
            for (i = 0; i < data.rules.length - 1; i++) {
                for (j = i + 1; j < data.rules.length; j++) {
                    if (data.rules[i].id === data.rules[j].id) {
                        tag = false;
                    }
                    else {
                        break;
                    }
                }
            }
            if (!tag) {
                var message = mxResources.get('lDuplicateSelectedConditionPleaseCheck');
                var tipDialog = new tipDialogBody(editorUi, message);
                editorUi.showDialog(tipDialog, 300, null, true, true);
            } else {
                var controlTypeData = {};
                controlTypeData.controlType = 'conditionControl';
                controlTypeData.controlData = data;
                var inputData = JSON.stringify(controlTypeData, null, 2);
                this.cell.setAttribute('controlType', inputData);
                console.log('6结束条件（条件控制）保存成功');
            }
        }
    }
};
EndConditionDIv.prototype.createTimeDiv = function (h, m) {
    var timeControl = document.createElement('div');
    timeControl.setAttribute('style','display:none;margin-left:25px;');
    var timeTip = document.createElement('div');
    var textTip1 = document.createTextNode(mxResources.get('pleaseChooseTime') + ': ');
    timeTip.appendChild(textTip1);
    var timeForm = document.createElement('form');
    timeForm.style.marginLeft = '25px';
    var hourText = document.createElement('span');
    hourText.innerHTML=mxResources.get('hour') + ': ';
    var hour = document.createElement('select');
    hour.setAttribute('style','width:50px;margin: 5px 0 0 0;');
    hour.id = 'hours';
    for(var i =0 ; i <= 10 ; i++){
        hour.add(new Option(i,i));
    }
    var minuText = document.createElement('span');
    minuText.innerHTML=mxResources.get('minute') + ': ';
    var minu = document.createElement('select');
    minu.id = 'minus';
    for(var i =0 ; i < 60 ; i++){
        minu.add(new Option(i,i));
    }
    minu.setAttribute('style','width:50px;margin: 5px 0 0 0;');
    if (h){
        hour.value = h;
    }
    if (m){
        minu.value = m;
    }
    var hourDiv = document.createElement('div');
    var minuDiv = document.createElement('div');
    hourDiv.appendChild(hourText);
    hourDiv.appendChild(hour);
    minuDiv.appendChild(minuText);
    minuDiv.appendChild(minu);
    timeForm.appendChild(hourDiv);
    timeForm.appendChild(minuDiv);
    timeControl.appendChild(timeTip);
    timeControl.appendChild(timeForm);

    return timeControl;
};
EndConditionDIv.prototype.createConditionDiv = function () {
    var conditionSelect = document.createElement('div');
    conditionSelect.style.display = 'none';
    var conSelect = document.createElement('div');
    conSelect.id = 'condition-select';
    this.noCondition = document.createElement('div');
    this.noCondition.style.display = 'none';
    var noText =  document.createTextNode(mxResources.get('noAvailableCondition'));
    this.noCondition.appendChild(noText);
    conditionSelect.appendChild(conSelect);
    conditionSelect.appendChild(this.noCondition);
    return conditionSelect;
};
//获取选择条件的数据
EndConditionDIv.prototype.getConditionData = function () {
    var result = $('#condition-select').queryBuilder('getRules');
    console.log(result);
    if(result.rules){
        //for( var i = 0; i < result.rules.length; i++) {
        //    switch(result.rules[i].value){
        //        case '0':
        //            result.rules[i].value = '未完成';
        //            break;
        //        case '1':
        //            result.rules[i].value = '完成';
        //            break;
        //        case 'A.1':
        //            result.rules[i].value = '未提交，不能判断正确与否';
        //            break;
        //        case 'B.3':
        //            result.rules[i].value = '已提交，正确';
        //            break;
        //        case 'B.4':
        //            result.rules[i].value = '已提交，不正确';
        //            break;
        //        default:
        //            break;
        //    }
        //}
    }else{
        //mxUtils.confirm('请将信息补充完整!');
        var message = mxResources.get('completeDataPlease');
        var tipDialog = new tipDialogBody(this.ui,message);
        this.ui.showDialog(tipDialog, 300, null, true, true);
    }
    var res = JSON.stringify(result, null, 2);
    var myData = JSON.parse(res, function (key, value) {
        return key.indexOf('date') >= 0 ? new Date(value) : value;
    });
    console.log(myData);
    return myData;
};
EndConditionDIv.prototype.renderConditionDiv = function () {
    //处理workbench数据，生成选项
    if(this.cell.getAttribute('workbench') && this.cell.getAttribute('workbench').length > 0){
        this.noCondition.style.display = 'none';
        var workbenchData = JSON.parse(this.cell.getAttribute('workbench'));
        var conditionData = [];
        for(var i = 0 ; i < workbenchData.length; i++ ){
            if(workbenchData[i].toolType == 'choose'){
                conditionData.push({
                    id: workbenchData[i].taskName,
                    label:workbenchData[i].taskName,
                    type: 'string',
                    validation: {
                        format: /^\S.\S$/
                    },
                    operators: [ 'equal'],
                    input: function(rule, name) {
                        var $container = rule.$el.find('.rule-value-container');
                        $container.on('change', '[name='+ name +'_1]', function(){
                            var h = '';
                            switch ($(this).val()) {
                                case 'A':
                                    h = '<option value="-1">-</option> <option value="1">不能判断正确与否</option>';
                                    break;
                                case 'B':
                                    h = '<option value="-1">-</option> <option value="3">正确</option> <option value="4">不正确</option>';
                                    break;
                            }
                            $container.find('[name='+ name +'_2]').html(h).toggle(h!='');
                        });
                        return '\
      <select name="'+ name +'_1"> \
        <option value="-1">-</option> \
        <option value="A">未提交</option> \
        <option value="B">已提交</option> \
      </select> \
      <select name="'+ name +'_2" style="display:none;"></select>';
                    },
                    valueGetter: function(rule) {
                        return rule.$el.find('.rule-value-container [name$=_1]').val()
                            +'.'+ rule.$el.find('.rule-value-container [name$=_2]').val();
                    },
                    valueSetter: function(rule, value) {
                        if (rule.operator.nb_inputs > 0) {
                            var val = value.split('.');
                            rule.$el.find('.rule-value-container [name$=_1]').val(val[0]).trigger('change');
                            rule.$el.find('.rule-value-container [name$=_2]').val(val[1]).trigger('change');
                        }
                    }
                });
            }
            else {
                conditionData.push({
                    id: workbenchData[i].taskName,
                    label: workbenchData[i].taskName,
                    type: 'integer',
                    input: 'radio',
                    values: {
                        1: '完成',
                        0: '未完成'
                    },
                    operators: ['equal']
                });
            }
        }
        console.log(conditionData.length);
        var rules_basic;
        //原始数据
        if(this.cell.getAttribute('controlType')){
            if(JSON.parse(this.cell.getAttribute('controlType')).controlType == 'conditionControl'){
                rules_basic =  JSON.parse((this.cell.getAttribute('controlType'))).controlData;
                //解析数据内容（多层级JSON格式数据不可以这样解析）
                //for( var i = 0; i < rules_basic.rules.length; i++) {
                //    console.log(rules_basic.rules[i].value);
                //    switch(rules_basic.rules[i].value){
                //        case '未完成':
                //            rules_basic.rules[i].value = '0';
                //            break;
                //        case '完成':
                //            rules_basic.rules[i].value = '1';
                //            break;
                //        case '未提交，不能判断正确与否':
                //            rules_basic.rules[i].value = 'A.1';
                //            break;
                //        case '已提交，正确':
                //            rules_basic.rules[i].value = 'B.3';
                //            break;
                //        case '已提交，不正确':
                //            rules_basic.rules[i].value = 'B.4';
                //            break;
                //        default:
                //            break;
                //    }
                //}
            }
        }else{
            rules_basic = null;
        }
        $('#condition-select').queryBuilder({
            plugins: ['bt-tooltip-errors'],
            //conditions: ['AND'],
            filters: conditionData,
            rules: rules_basic
        });
    } else {
        this.noCondition.style.display = 'block';
    }
};
EndConditionDIv.prototype.fireRenderedEvent = function () {
    this.fireEvent(new mxEventObject('onRendered'), {innerHeight: this.height});
};
EndConditionDIv.prototype.getContainer = function () {
    return this.container;
};
//原来的结束条件（20160429修改前）
EndConditionDIv.prototype.oldCode = function () {
    //结束条件
    var endConditionDiv = document.createElement('div');
    var endCondition = document.createElement('div');
    endConditionDiv.appendChild(endCondition);
    var option = [
        {name:mxResources.get('userControl'),value:'userControl'},
        {name:mxResources.get('timeControl'),value:'timeControl'},
        {name:mxResources.get('conditionControl'),value:'conditionControl'}
    ];
    var controlForm = document.createElement('form');

    //设置默认选择方式
    var defaultValue;
    if( cell.getAttribute('controlType')){
        defaultValue = JSON.parse(cell.getAttribute('controlType'));
        console.log(defaultValue);
        if(defaultValue.controlType) {
            defaultValue = defaultValue.controlType;
            if (defaultValue === 'timeControl') {

            } else if(defaultValue === 'conditionControl'){
                defaultValue = 'conditionControl';
                //conditionControlFunc();
            }
        }else{
            defaultValue = 'conditionControl';
        }
    }else{
        defaultValue = 'userControl';
    }
    console.log(defaultValue);
    var controlRadio = ui.formItems.genRadioField('', 'radio', option,defaultValue);
    var controlType = controlRadio.getElContainer();

    controlForm.appendChild(controlType);
    endCondition.appendChild(controlForm);
    //var userControlApplyBtn = mxUtils.button(mxResources.get('apply'), function () {
    //    var uControl = {
    //        controlType : 'userControl',
    //        controlData : null
    //    }
    //    cell.setAttribute('controlType',JSON.stringify(uControl));
    //    ui.editor.setModified(true);
    //    //mxUtils.confirm('保存成功!');
    //    var message = mxResources.get('saveSuccess');
    //    var tipDialog = new tipDialogBody(ui,message);
    //    ui.showDialog(tipDialog, 300, null, true, true);
    //});
    //userControlApplyBtn.className = 'geBtn gePrimaryBtn';
    //endConditionDiv.appendChild(userControlApplyBtn);
    //时间选择框
    var timeControl = document.createElement('div');
    var timeTip = document.createElement('div');
    timeControl.appendChild(timeTip);
    var textTip1 = document.createTextNode('请选择时间：');
    timeTip.appendChild(textTip1);
    if(cell.getAttribute('controlType')){
        var controlTypeTemp = JSON.parse(cell.getAttribute('controlType'));
        if(controlTypeTemp.controlType === 'timeControl'){
            var time = controlTypeTemp.controlData;
            var textTip2 = document.createTextNode('您上次选择的时间是：'+time.hh + mxResources.get('hour') + time.mm + mxResources.get('minute'));
            timeTip.appendChild(textTip2);
            if((time.hh === 0)&&(time.mm === 0)){
                timeTip.removeChild(textTip1);
            }else{
                timeTip.removeChild(textTip1);
            }
        }
    }

    var timeForm = document.createElement('form');
    timeControl.appendChild(timeForm);
    var hourText = document.createElement('span');
    hourText.innerHTML='时：';
    var hour = document.createElement('select');
    hour.id = 'hours';
    for(var h =0 ; h <= 10 ; h++){
        hour.add(new Option(h,h));
    }
    hour.setAttribute('style','width:50px;margin: 10px 0px;');
    var minu = document.createElement('select');
    minu.id = 'minus';
    for(var m =0 ; m < 60 ; m++){
        minu.add(new Option(m,m));
    }
    minu.setAttribute('style','width:50px;margin: 10px 0px;');
    var minuText = document.createElement('span');
    minuText.innerHTML=mxResources.get('minute') + ': ';
    timeForm.appendChild(hourText);
    timeForm.appendChild(hour);
    timeForm.appendChild(minuText);
    timeForm.appendChild(minu);
    timeControl.setAttribute('style','display:none;margin-left:50px;');
    endCondition.appendChild(timeControl);

    //获取选择时间值
    var selectTime ={
        controlType : 'timeControl',
        controlData:{
            hh : 0,
            mm : 0
        }
    } ;
    timeForm.onchange = mxUtils.bind(this, function () {
        var selectHour = document.getElementById('hours');
        var selectMinu = document.getElementById('minus');
        var index1 = selectHour.selectedIndex;
        var index2 = selectMinu.selectedIndex;
        selectTime = {
            controlType : 'timeControl',
            controlData: {
                hh: selectHour.options[index1].value,
                mm: selectMinu.options[index2].value
            }
        };
        console.log(selectTime);
    });

    //var timeControlApplyBtn = mxUtils.button(mxResources.get('apply'), function () {
    //    cell.setAttribute('controlType',JSON.stringify(selectTime));
    //    //mxUtils.confirm('保存成功!');
    //    var message = mxResources.get('saveSuccess');
    //    var tipDialog = new tipDialogBody(ui,message);
    //    ui.showDialog(tipDialog, 300, null, true, true);
    //});
    //timeControlApplyBtn.className = 'geBtn gePrimaryBtn';
    //timeControl.appendChild(timeControlApplyBtn);

    //条件选择框
    var conditionSelect = document.createElement('div');
    conditionSelect.style.display = 'none';
    var conSelect = document.createElement('div');
    conSelect.id = 'condition-select';
    conditionSelect.appendChild(conSelect);
    endCondition.appendChild(conditionSelect);
    var noCondition = document.createElement('div');
    var noText =  document.createTextNode(mxResources.get('noAvailableCondition'));
    noCondition.appendChild(noText);
    conditionSelect.appendChild(noCondition);
    noCondition.style.display = 'none';
    //获取选择条件的数据
    var getData = function () {
        var result = $('#condition-select').queryBuilder('getRules');
        console.log(result);
        if(result.rules){
            //for( var i = 0; i < result.rules.length; i++) {
            //    switch(result.rules[i].value){
            //        case '0':
            //            result.rules[i].value = '未完成';
            //            break;
            //        case '1':
            //            result.rules[i].value = '完成';
            //            break;
            //        case 'A.1':
            //            result.rules[i].value = '未提交，不能判断正确与否';
            //            break;
            //        case 'B.3':
            //            result.rules[i].value = '已提交，正确';
            //            break;
            //        case 'B.4':
            //            result.rules[i].value = '已提交，不正确';
            //            break;
            //        default:
            //            break;
            //    }
            //}
        }else{
            //mxUtils.confirm('请将信息补充完整!');
            var message = mxResources.get('completeDataPlease');
            var tipDialog = new tipDialogBody(this.editorUi,message);
            this.editorUi.showDialog(tipDialog, 300, null, true, true);
        }
        var res = JSON.stringify(result, null, 2);
        var myData = JSON.parse(res, function (key, value) {
            return key.indexOf('date') >= 0 ? new Date(value) : value;
        });
        console.log(myData);
        return myData;
    };

    //条件控制应用按钮
    var applyTheTab_control = function () {
        if (controlRadio.submitRadio().value == 'userControl'){
            var uControl = {
                controlType : 'userControl',
                controlData : null
            };
            cell.setAttribute('controlType',JSON.stringify(uControl));
            //ui.editor.setModified(true);
            //mxUtils.confirm('保存成功!');
            console.log('6结束条件（用户控制）保存成功');
        } else if(controlRadio.submitRadio().value == 'timeControl'){
            cell.setAttribute('controlType',JSON.stringify(selectTime));
            //mxUtils.confirm('保存成功!');
            console.log('6结束条件（时间控制）保存成功');
        } else if(controlRadio.submitRadio().value == 'conditionControl'){
            var data = getData();
            var tag = true;
            if(data.rules){
                for( i = 0 ; i < data.rules.length-1; i++){
                    for( j = i+1; j < data.rules.length ; j++){
                        if(data.rules[i].id === data.rules[j].id){
                            tag = false;
                        }
                        else{
                            break;
                        }
                    }
                }
                if(!tag){
                    //mxUtils.confirm('选择条件有重复，请检查！');
                    var message = mxResources.get('lDuplicateSelectedConditionPleaseCheck');
                    var tipDialog = new tipDialogBody(editorUi,message);
                    editorUi.showDialog(tipDialog, 300, null, true, true);
                }else{
                    var controlTypeData = {};
                    controlTypeData.controlType = 'conditionControl';
                    controlTypeData.controlData =  data;
                    var inputData = JSON.stringify(controlTypeData, null, 2);
                    cell.setAttribute('controlType',inputData);
                    //mxUtils.confirm('保存成功！');
                    console.log('6结束条件（条件控制）保存成功');
                    //var message = mxResources.get('saveSuccess');
                    //var tipDialog = new tipDialogBody(ui,message);
                    //ui.showDialog(tipDialog, 300, null, true, true);
                }
            }
        }
    };
    //var conditionControlApplyBtn = mxUtils.button(mxResources.get('apply'), function () {
    //
    //});
    //conditionControlApplyBtn.className = 'geBtn gePrimaryBtn';
    //conditionSelect.appendChild(conditionControlApplyBtn);
    //点击事件
    var userControlFunc = function() {
        timeControl.style.display = 'none';
        conditionSelect.style.display = 'none';
        //userControlApplyBtn.style.display = 'block';
    };
    var timeControlFunc = function(){
        timeControl.style.display = 'block';
        conditionSelect.style.display = 'none';
        //userControlApplyBtn.style.display = 'none';
    };
    var conditionData = [];
    var conditionControlFunc = function(){
        timeControl.style.display = 'none';
        //userControlApplyBtn.style.display = 'none';
        conditionSelect.style.display = 'block';
        if(cell.getAttribute('workbench') && cell.getAttribute('workbench').length > 0){
            //conditionControlApplyBtn.style.display='block';
            conditionSelect.style.display = 'block';
            noCondition.style.display = 'none';
            //console.log(workbenchData1);
            //console.log(workbenchData2);
            //if(!(workbenchData1 == workbenchData2)){
            var  workbenchData = JSON.parse(cell.getAttribute('workbench'));
            //}else{
            //    workbenchData = workbenchData1;
            //}
            for(i = 0 ; i < workbenchData.length; i++ ){
                if(workbenchData[i].toolType == 'choose'){
                    conditionData.push({
                        id: workbenchData[i].taskName,
                        label:workbenchData[i].taskName,
                        type: 'string',
                        validation: {
                            format: /^\S.\S$/
                        },
                        operators: [ 'equal'],
                        input: function(rule, name) {
                            var $container = rule.$el.find('.rule-value-container');
                            $container.on('change', '[name='+ name +'_1]', function(){
                                var h = '';
                                switch ($(this).val()) {
                                    case 'A':
                                        h = '<option value="-1">-</option> <option value="1">不能判断正确与否</option>';
                                        break;
                                    case 'B':
                                        h = '<option value="-1">-</option> <option value="3">正确</option> <option value="4">不正确</option>';
                                        break;
                                }
                                $container.find('[name='+ name +'_2]').html(h).toggle(h!='');
                            });
                            return '\
  <select name="'+ name +'_1"> \
    <option value="-1">-</option> \
    <option value="A">未提交</option> \
    <option value="B">已提交</option> \
  </select> \
  <select name="'+ name +'_2" style="display:none;"></select>';
                        },
                        valueGetter: function(rule) {
                            return rule.$el.find('.rule-value-container [name$=_1]').val()
                                +'.'+ rule.$el.find('.rule-value-container [name$=_2]').val();
                        },
                        valueSetter: function(rule, value) {
                            if (rule.operator.nb_inputs > 0) {
                                var val = value.split('.');

                                rule.$el.find('.rule-value-container [name$=_1]').val(val[0]).trigger('change');
                                rule.$el.find('.rule-value-container [name$=_2]').val(val[1]).trigger('change');
                            }
                        }
                    });
                }
                else {
                    conditionData.push({
                        id: workbenchData[i].taskName,
                        label: workbenchData[i].taskName,
                        type: 'integer',
                        input: 'radio',
                        values: {
                            1: '完成',
                            0: '未完成'
                        },
                        operators: ['equal']
                    });
                }
            }
            console.log(conditionData.length);
            var rules_basic;
            if(cell.getAttribute('controlType')){
                if(JSON.parse(cell.getAttribute('controlType')).controlType == 'conditionControl'){
                    rules_basic =  JSON.parse((cell.getAttribute('controlType'))).controlData;
                    //解析数据内容（多层级JSON格式数据不可以这样解析）
                    //for( var i = 0; i < rules_basic.rules.length; i++) {
                    //    console.log(rules_basic.rules[i].value);
                    //    switch(rules_basic.rules[i].value){
                    //        case '未完成':
                    //            rules_basic.rules[i].value = '0';
                    //            break;
                    //        case '完成':
                    //            rules_basic.rules[i].value = '1';
                    //            break;
                    //        case '未提交，不能判断正确与否':
                    //            rules_basic.rules[i].value = 'A.1';
                    //            break;
                    //        case '已提交，正确':
                    //            rules_basic.rules[i].value = 'B.3';
                    //            break;
                    //        case '已提交，不正确':
                    //            rules_basic.rules[i].value = 'B.4';
                    //            break;
                    //        default:
                    //            break;
                    //    }
                    //}
                }
            }else{
                rules_basic = null;
            }
            $('#condition-select').queryBuilder({
                plugins: ['bt-tooltip-errors'],
                //conditions: ['AND'],
                filters: conditionData,
                rules: rules_basic
            });
        }
        else{
            noCondition.style.display = 'block';
            //conditionControlApplyBtn.style.display='none';
        }
    };
    this.addListener('onRendered', function () {
        if(defaultValue == 'userControl'){
            userControlFunc();
        }else if(defaultValue == 'timeControl'){
            timeControlFunc();
        }else{
            conditionControlFunc();
            timeControl.style.display = 'none';
            //userControlApplyBtn.style.display = 'none';
            conditionSelect.style.display = 'block';
        }
    });

    //var initStatus = function(){
    //    if($(controlForm).serializeArray()[0].value === 'timeControl' || defaultValue == 'timeControl' ){
    //        timeControl.style.display = 'block';
    //        conditionSelect.style.display = 'none';
    //        userControlApplyBtn.style.display = 'none';
    //    } else if($(controlForm).serializeArray()[0].value === 'conditionControl'||defaultValue == 'conditionControl'){
    //        timeControl.style.display = 'none';
    //        userControlApplyBtn.style.display = 'none';
    //        conditionSelect.style.display = 'block';
    //        if(cell.getAttribute('workbench')){
    //            conditionSelect.style.display = 'block';
    //            noCondition.style.display = 'none';
    //            var conditionData = [];
    //            console.log(workbenchData1);
    //            console.log(workbenchData2);
    //            if(!(workbenchData1 == workbenchData2)){
    //                workbenchData = JSON.parse(cell.getAttribute('workbench'));
    //            console.log(workbenchData);
    //            }else{
    //                workbenchData = workbenchData1;
    //            }
    //            console.log(workbenchData.length);
    //            for( i = 0 ; i < workbenchData.length; i++ ){
    //                console.log(i);
    //                if((workbenchData[i].toolType == 'VM')||(workbenchData[i].toolType == 'textArea')) {
    //                    conditionData.push({
    //                        id: workbenchData[i].taskName,
    //                        label: workbenchData[i].taskName,
    //                        type: 'integer',
    //                        input: 'radio',
    //                        values: {
    //                            1: '完成',
    //                            0: '未完成'
    //                        },
    //                        operators: ['equal']
    //                    });
    //                }
    //                else if(workbenchData[i].toolType == 'choose'){
    //                    conditionData.push({
    //                        id: workbenchData[i].taskName,
    //                        label:workbenchData[i].taskName,
    //                        type: 'string',
    //                        validation: {
    //                            format: /^\S.\S$/
    //                        },
    //                        operators: ['equal'],
    //                        input: function(rule, name) {
    //                            var $container = rule.$el.find('.rule-value-container');
    //                            $container.on('change', '[name='+ name +'_1]', function(){
    //                                var h = '';
    //                                switch ($(this).val()) {
    //                                    case 'A':
    //                                        h = '<option value="-1">-</option> <option value="1" selected ="selected ">不能判断正确与否</option>';
    //                                        break;
    //                                    case 'B':
    //                                        h = '<option value="-1">-</option> <option value="3">正确</option> <option value="4">不正确</option>';
    //                                        break;
    //                                }
    //                                $container.find('[name='+ name +'_2]').html(h).toggle(h!='');
    //                            });
    //                            return '\
    //  <select name="'+ name +'_1"> \
    //    <option value="-1">-</option> \
    //    <option value="A">未提交</option> \
    //    <option value="B">已提交</option> \
    //  </select> \
    //  <select name="'+ name +'_2" style="display:none;"></select>';
    //                        },
    //                        valueGetter: function(rule) {
    //                            return rule.$el.find('.rule-value-container [name$=_1]').val()
    //                                +'.'+ rule.$el.find('.rule-value-container [name$=_2]').val();
    //                        },
    //                        valueSetter: function(rule, value) {
    //                            if (rule.operator.nb_inputs > 0) {
    //                                var val = value.split('.');
    //
    //                                rule.$el.find('.rule-value-container [name$=_1]').val(val[0]).trigger('change');
    //                                rule.$el.find('.rule-value-container [name$=_2]').val(val[1]).trigger('change');
    //                            }
    //                        }
    //                    });
    //                }
    //            }
    //            console.log(conditionData.length);
    //            var rules_basic;
    //            console.log(conControl);
    //            if(conControl){
    //                delete conControl.controlType;
    //                rules_basic =  JSON.parse(conControl);
    //                console.log(rules_basic.rules);
    //                for( var i = 0; i < rules_basic.rules.length; i++) {
    //                    switch(rules_basic.rules[i].value){
    //                        case '未完成':
    //                            rules_basic.rules[i].value = '0';
    //                            break;
    //                        case '完成':
    //                            rules_basic.rules[i].value = '1';
    //                            break;
    //                        case '未提交':
    //                            rules_basic.rules[i].value = 'A.1';
    //                            break;
    //                        case '已提交，正确':
    //                            rules_basic.rules[i].value = 'B.3';
    //                            break;
    //                        case '已提交，不正确':
    //                            rules_basic.rules[i].value = 'B.4';
    //                            break;
    //                        default:
    //                            break;
    //                    }
    //                }
    //            }else{
    //                rules_basic = null;
    //            }
    //            console.log(conditionData);
    //            $('#condition-select').queryBuilder({
    //                plugins: ['bt-tooltip-errors'],
    //                //conditions: ['AND'],
    //                filters: conditionData,
    //                rules: rules_basic
    //            });
    //        }
    //        else{
    //            noCondition.style.display = 'block';
    //            conditionControlApplyBtn.style.display='none';
    //        }
    //    }else {
    //        timeControl.style.display = 'none';
    //        conditionSelect.style.display = 'none';
    //        userControlApplyBtn.style.display = 'block';
    //    }
    //};

    controlForm.onchange = mxUtils.bind(this, function () {
        //  initStatus();
        if($(controlForm).serializeArray()[0].value == 'timeControl'){
            timeControlFunc();
        }else if($(controlForm).serializeArray()[0].value == 'conditionControl'){
            conditionControlFunc();
        }else{
            userControlFunc();
        }
        console.log(conditionSelect);
    });
};
/**
 * ScorePointDiv
 */
var ScorePointDiv = function (editorUi, cell) {
    this.editorUi = editorUi;
    this.cell = cell;
    this.container = document.createElement('div');
    this.container.style.padding = '5px 10px';
    this.num = 0;

    if (this.cell.getAttribute('scoreRules')) {
        var temp = JSON.parse(cell.getAttribute('scoreRules'));
        var originalData = (temp.length>0) ? temp : null;
    }

    this.isScoreNeeded = this.editorUi.formItems.msCheckbox('是否参与计分', 'isScoreNeeded', (originalData) ? true : false);
    this.isScoreNeeded.onchange = mxUtils.bind(this, function () {
        scoreListDiv.style.display = (this.isScoreNeeded.value)?'block':'none';
    });

    var scoreListDiv = document.createElement('div');
    scoreListDiv.setAttribute('style', 'margin: 10px 0;');
    scoreListDiv.style.display = (originalData) ? 'block' : 'none';

    var scoreList = document.createElement('table');
    scoreList.setAttribute('style', 'width: 95%; margin: 5px 0');
    scoreList.className = "table table-bordered";
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th style="width: 10%">序号</th><th style="">评分点</th><th style="width: 15%">分值</th><th style="width: 40%">评分标准</th><th style="width: 5%"></th></tr>';
    var tbody = document.createElement('tbody');
    if (originalData){
        for (var i = 0; i < originalData.length; i++){
            tbody.appendChild(this.addRow(++this.num, originalData[i]));
        }
    }
    scoreList.appendChild(thead);
    scoreList.appendChild(tbody);

    var toolDiv = document.createElement('div');
    var addBtn = document.createElement('span');
    addBtn.innerHTML = '增加评分点';
    addBtn.setAttribute('style', 'border: 1px solid #c8c8c8;border-radius: 10px 0 0;padding: 3px 5px;cursor: pointer;color: #333;font-size: 12px;');
    addBtn.onclick = mxUtils.bind(this, function () {
        tbody.appendChild(this.addRow(++this.num));
    });
    addBtn.onmouseover = function () {
        addBtn.style.borderColor = '#000';
    };
    addBtn.onmouseout = function () {
        addBtn.style.borderColor = '#c8c8c8';
    };
    toolDiv.appendChild(addBtn);

    this.container.appendChild(this.isScoreNeeded);
    scoreListDiv.appendChild(toolDiv);
    scoreListDiv.appendChild(scoreList);
    this.container.appendChild(scoreListDiv);
};
ScorePointDiv.prototype.addRow = function (num, oriData) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    var numSpan = document.createElement('span');
    numSpan.innerHTML = num;
    td1.appendChild(numSpan);

    var options = [
        {text:'作业是否已提交', value: 'isSubmited'},
        {text:'试卷得分', value: 'examScore'},
        {text:'教师/组员评分', value: 'peopleScore'}
    ];
    var pointSelectObj = this.editorUi.formItems.msSelect(options);
    var pointSelect = pointSelectObj.getContainer();
    pointSelect.id = 'sp-select-' + num;
    (oriData)? (pointSelect.value = oriData.point) : 1;
    pointSelect.onchange = function () {
        var point = pointSelectObj.getSelectedOption().value;
        if (point === 'isSubmited' || point === 'examScore'){
            direTextarea.disabled = true;
            if (direTextarea.value){
                direTextarea.tmpValue = direTextarea.value;
                direTextarea.value = null;
            }
        } else {
            direTextarea.disabled = false;
            if (direTextarea.tmpValue) {
                direTextarea.value = direTextarea.tmpValue;
                direTextarea.tmpValue = null;
            }
        }
    };
    //td2.appendChild(pointSelect);

    var nameInput = this.editorUi.formItems.msInput('','80%');
    (oriData)? (nameInput.value = oriData.name) : 1;
    nameInput.id = 'sp-name-input-' + num;
    td2.appendChild(nameInput);

    var scoreInput = this.editorUi.formItems.msNumInput({
        "value": (oriData) ? oriData.score : 5,
        "min": 1,
        "max": 100,
        "id": 'sp-num-input-' + num
    });
    td3.appendChild(scoreInput);

    var direTextarea = this.editorUi.formItems.msTextarea('60px', '98%', '#c8c8c8');
    direTextarea.id = 'sp-textarea-' + num;
    direTextarea.disabled =false/* (oriData && oriData.direction) ? false : true*/;
    (oriData)? (direTextarea.value = oriData.direction) : 1;
    td4.appendChild(direTextarea);

    var delSpan = document.createElement('span');
    delSpan.innerHTML = 'X';
    delSpan.style.cursor = 'pointer';
    delSpan.title = '删除';
    delSpan.onclick = function () {
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    };
    td5.appendChild(delSpan);
    return tr;
};
ScorePointDiv.prototype.applyTheTab = function () {
    var scoreRuleArr = [];
    if (this.isScoreNeeded.value){
        for (var i = 1; i <= this.num; i++){
            //var selectDom = $('#sp-select-' + i);
            var nameInputDom = $('#sp-name-input-' + i);
            if (nameInputDom[0]){
                var numInputDom = $('#sp-num-input-' + i);
                var textareaDom = $('#sp-textarea-' + i);
                scoreRuleArr.push({
                    id: (scoreRuleArr.length+1),
                    name: nameInputDom[0].value,
                    type: "peopleScore"/*selectDom[0].value*/,
                    score: numInputDom[0].value,
                    direction: textareaDom[0].value
                })
            }
        }
    }
    this.cell.setAttribute('scoreRules', JSON.stringify(scoreRuleArr));
    console.log('7评分点保存成功');
};
ScorePointDiv.prototype.getContainer = function () {
    return this.container;
};
ScoreSummaryDialogBody = function (editorUi) {
    DialogBody.call(this, '评分点总表');
    this.editorUi = editorUi;
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    div.style.height = 'inherit';
    this.num = 0;
    this.sumScore = 0;
    var tableDiv = this.initTable();
    var sumScoreDiv = document.createElement('div');
    sumScoreDiv.setAttribute('style', 'margin:10px');
    sumScoreDiv.innerHTML = '总分：<span>' + this.sumScore + '</span>分';
    div.appendChild(sumScoreDiv);
    div.appendChild(tableDiv);
};
mxUtils.extend(ScoreSummaryDialogBody, DialogBody);
ScoreSummaryDialogBody.prototype.initTable = function () {
    var scoreListTable = document.createElement('table');
    scoreListTable.setAttribute('style', 'width: 95%; margin: 5px 0');
    scoreListTable.className = "table table-bordered";
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th style="width: 10%">序号</th><th style="width: 25%">活动名</th><th style="width: 25%">评分点</th><th style="width: 10%">分值</th><th style="width: 30%">评分标准</th></tr>';
    var tbody = document.createElement('tbody');
    var scoreList = this.getScoreList();
    if (scoreList){
        for (var i = 0; i < scoreList.length; i++){
            tbody.appendChild(this.addRow(++this.num, scoreList[i]));
        }
    }
    scoreListTable.appendChild(thead);
    scoreListTable.appendChild(tbody);
    return scoreListTable;
};
ScoreSummaryDialogBody.prototype.getScoreList = function () {
    var scoreList = [];
    var cellArray = this.editorUi.editor.graph.findAllCellsUndParent();
    for (var i = 0; i < cellArray.length; i++){
        if (cellArray[i].value && (cellArray[i].getAttribute('type')=="bpmn.task.user") && cellArray[i].getAttribute('scoreRules')) {
            var temp = JSON.parse(cellArray[i].getAttribute('scoreRules'));
            if(temp.length>0){
                for (var j = 0; j < temp.length; j++){
                    scoreList.push({
                        taskName: cellArray[i].getAttribute('label'),
                        name: temp[j].name,
                        type: temp[j].point,
                        score: temp[j].score,
                        direction: temp[j].direction
                    });
                    this.sumScore += parseInt(temp[j].score);
                }
            }

        }
    }
    return scoreList;
};
ScoreSummaryDialogBody.prototype.addRow = function (num, oriData) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    var numSpan = document.createElement('span');
    numSpan.innerHTML = num;
    td1.appendChild(numSpan);
    var taskNameSpan = document.createElement('span');
    taskNameSpan.innerHTML = oriData.taskName;
    td2.appendChild(taskNameSpan);

    var options = [
        {text:'作业是否已提交', value: 'isSubmited'},
        {text:'试卷得分', value: 'examScore'},
        {text:'教师/组员评分', value: 'peopleScore'}
    ];
    var pointSelectObj = this.editorUi.formItems.msSelect(options);
    var pointSelect = pointSelectObj.getContainer();
    pointSelect.id = 'sp-select-' + num;
    (oriData)? (pointSelect.value = oriData.point) : 1;
    pointSelect.onchange = function () {
        var point = pointSelectObj.getSelectedOption().value;
        if (point === 'isSubmited' || point === 'examScore'){
            direTextarea.disabled = true;
            if (direTextarea.value){
                direTextarea.tmpValue = direTextarea.value;
                direTextarea.value = null;
            }
        } else {
            direTextarea.disabled = false;
            if (direTextarea.tmpValue) {
                direTextarea.value = direTextarea.tmpValue;
                direTextarea.tmpValue = null;
            }
        }
    };
    pointSelect.disabled = true;
    //td3.appendChild(pointSelect);
    var nameInput = document.createElement('span');
    nameInput.innerHTML = oriData.name;
    td3.appendChild(nameInput);

    var scoreInput = this.editorUi.formItems.msNumInput({
        "value": (oriData) ? oriData.score : 5,
        "min": 1,
        "max": 100,
        "id": 'sp-num-input-' + num
    });
    scoreInput.disabled = true;
    td4.appendChild(scoreInput);

    var direTextarea = this.editorUi.formItems.msTextarea('60px', '98%', '#c8c8c8');
    direTextarea.id = 'sp-textarea-' + num;
    direTextarea.disabled = true;
    (oriData)? (direTextarea.value = oriData.direction) : 1;
    td5.appendChild(direTextarea);

    return tr;
};
/**
 * BasicInfoDIv
 */
var BasicInfoDIv = function (editorUi, cell) {
    this.editorUi = editorUi;
    this.cell = cell;
    this.tagList = [
        {name:'学习目标', id: 'goal', descrpt:'简述学员当前活动的学习目标，其具体内容应该是课程总体描述中“学习目标”里一部分的具体描述'},
        {name:'学习内容', id: 'content', height:'50px', descrpt:'简述学员当前活动所需掌握的学习内容，其具体内容应该是课程总体描述中“学习内容”里一部分的具体描述'},
        {name:'引导问题', id: 'guideQuestion', height:'50px', descrpt:'以问题的形式引导学员思考完成当前活动须了解的知识与技能，其答案在相关知识及学习过程中可得到'},
        {name:'教学重难点', id: 'teachingDifficulty'},
        {name:'工作要求', id: 'workRequirement', height:'50px', descrpt:'简述完成当前活动所需遵守的工作要求'},
        {name:'单元考核标准', id: 'teachingCheck'}
    ];
    var originalData = {};
    if (this.cell.getAttribute('basicInfo')){
        originalData = JSON.parse(cell.getAttribute('basicInfo'));
    }
    if (!(this.cell.getAttribute('basicInfo')) && this.cell.getAttribute('description')){
        originalData['content'] = cell.getAttribute('description').replace(/<[^>]+>/g,"");
    }
    this.init(originalData);
};
BasicInfoDIv.prototype.init = function (originalData) {
    var me = this;
    var formBox = document.createElement('div');
    formBox.setAttribute('style', 'padding: 5px 15px;');
    for (var i = 0; i < this.tagList.length; i++){
        var height = (this.tagList[i].height) ? this.tagList[i].height : '30px';
        var content = (originalData)?originalData[this.tagList[i].id]:null;
        formBox.appendChild(this.createFormDiv(this.tagList[i].name, height, content, this.tagList[i].descrpt));
    }
    //var basicInfoApplyBtn = mxUtils.button(mxResources.get('apply'), function (evt) {
    //    var formDom = document.getElementsByName('basicInfos');
    //    var basicInfoData = {
    //        "goal": formDom[0].value,
    //        "content": formDom[1].value,
    //        "workRequirement": formDom[2].value,
    //        "guideQuestion": formDom[3].value,
    //        "toolAndMedia": formDom[4].value,
    //        "tips": formDom[5].value
    //    };
    //    me.cell.setAttribute('basicInfo', JSON.stringify(basicInfoData));
    //    if (me.cell.getAttribute('description')){
    //        me.cell.removeAttribute('description');
    //    }
    //    me.editorUi.editor.setModified(true);
    //    alert('success');
    //});
    //basicInfoApplyBtn.className = 'geBtn gePrimaryBtn';
    this.container = document.createElement('div');
    this.container.appendChild(formBox);
    //this.container.appendChild(basicInfoApplyBtn);
};
BasicInfoDIv.prototype.createFormDiv = function (title, minHeight, content, placeHolder) {
    var taskDescBox = document.createElement('div');
    var text = document.createElement('span');
    text.innerHTML = title + '：';
    text.className = 'explanationText';
    text.style.display = 'block';
    taskDescBox.style.padding = '5px 0';
    taskDescBox.appendChild(text);
    //var taskDesc = document.createElement('textArea');
    var taskDesc = this.editorUi.formItems.msTextarea('', '98%');
    taskDesc.name = 'basicInfos';
    if (placeHolder){
        taskDesc.placeholder = placeHolder;
    }
    taskDesc.style.minHeight= ((minHeight) ? minHeight : '50px');
    //taskDesc.style.width= '600px';
    if (content) {
        taskDesc.value = content;
    }
    taskDescBox.appendChild(taskDesc);
    return taskDescBox;
};
BasicInfoDIv.prototype.getContainer = function () {
    return this.container;
};
BasicInfoDIv.prototype.applyTheTab = function () {
    var formDom = document.getElementsByName('basicInfos');
    var basicInfoData = {};
    for (var i = 0; i < this.tagList.length; i++){
        basicInfoData[this.tagList[i].id] = formDom[i].value
    }
    this.cell.setAttribute('basicInfo', JSON.stringify(basicInfoData));
    if (this.cell.getAttribute('description')){
        this.cell.removeAttribute('description');
    }
    console.log('1基本信息保存成功');
    //this.editorUi.editor.setModified(true);
};

/**
 * WorkbenchDiv
 */
var WorkbenchDiv = function (editorUi, cell,opleLevel) {
    mxEventSource.call(this);
    this.editorUi = editorUi;
    this.cell = cell;
    var VMTypes = [{name:'-',value:''}];
    this.options = [
        {
            name:mxResources.get('textAreaEditor'),
            value:'textArea',
            input:[
                {name:mxResources.get('blank'),value:'init'},
                //{name:mxResources.get('importedFile'),value:'previous'},
                {name:mxResources.get('fromDB'),value:'DB'},
                {name:mxResources.get('upload/edit'),value:'upload'},
                {name:mxResources.get('fromActionOutput'),value:'actionOutput'}
            ]
        },{
            name:mxResources.get('virtualMachine'),
            value:'VM',
            input:VMTypes
        },{
            name:mxResources.get('mindMap'),
            value:'mindMap',
            input: [
                {name:mxResources.get('blank'),value:'init'},
                {name:mxResources.get('fromActionOutput'),value:'actionOutput'}
            ]
        },{
            name:mxResources.get('form'),
            value:'form',
            input: [
                {name:mxResources.get('chooseAnOption'),value:''},
                {name:mxResources.get('fromDB'),value:'DB'}
            ]
        },{
            name:mxResources.get('dynamicForm'),
            value:'dynamicForm',
            input: [
                {name:mxResources.get('chooseAnOption'),value:''},
                {name:mxResources.get('fromDB'),value:'DB'}
            ]
        },
        //试题暂时去掉,170628恢复试题使用
        {
            name:mxResources.get('kpExam'),
            value:'choose',
            input:[{name:'-',value:''}]
        },
        /*画板没法用，先去掉
        {
            name:mxResources.get('drawingBoard'),
            value:'board',
            input: [{name:'-',value:''}]
        }*//*,{
            name:mxResources.get('sendEmail'),
            value:'email',
            input: [
                {name:mxResources.get('blank'),value:'init'},
                {name:mxResources.get('importedFile'),value:'previous'},
                {name:mxResources.get('fromDB'),value:'DB'},
                {name:mxResources.get('upload/edit'),value:'upload'}
            ]
        },*/{
            name:'word',
            value:'word',
            input: [
                {name:mxResources.get('blank'),value:'init'},
                {name:mxResources.get('editOnline'),value:'editOnline'},
                {name:mxResources.get('fromDB'),value:'DB'},
                {name:mxResources.get('fromActionOutput'),value:'actionOutput'}
            ]
        },{
            name:'excel',
            value:'excel',
            input: [
                {name:mxResources.get('blank'),value:'init'},
                {name:mxResources.get('editOnline'),value:'editOnline'},
                {name:mxResources.get('fromDB'),value:'DB'},
                {name:mxResources.get('fromActionOutput'),value:'actionOutput'}
            ]
        },{
            name:'ppt',
            value:'ppt',
            input: [
                {name:mxResources.get('blank'),value:'init'},
                {name:mxResources.get('editOnline'),value:'editOnline'},
                {name:mxResources.get('fromDB'),value:'DB'},
                {name:mxResources.get('fromActionOutput'),value:'actionOutput'}
            ]
        },{
            name:'互评',
            value:'comment',
            input: [{name:'-',value:''}]
        }
    ];
    if (this.cell.getAttribute('workbench')){
        var originalData = JSON.parse(cell.getAttribute('workbench'));
    }else if((opleLevel === 'first') && this.cell.getAttribute('opleCourseInfo') && JSON.parse(this.cell.getAttribute('opleCourseInfo')).opleFirstLevelInfo.taskInfo){
        var originalData = JSON.parse(this.cell.getAttribute('opleCourseInfo')).opleFirstLevelInfo.taskInfo;
    }else if((opleLevel === 'second') && this.cell.getAttribute('opleCourseInfo') && JSON.parse(this.cell.getAttribute('opleCourseInfo')).opleSecondLevelInfo.taskInfo) {
        var originalData = JSON.parse(this.cell.getAttribute('opleCourseInfo')).opleSecondLevelInfo.taskInfo;
    }
    this.init(originalData,editorUi);
};
mxUtils.extend(WorkbenchDiv, mxEventSource);
WorkbenchDiv.prototype.init = function (originalData,ui) {
    this.container = document.createElement('div');
    this.workbenchContainer = document.createElement('div');
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('style', 'text-align: right;padding:5px;');
    var addBtn = document.createElement('button');
    var fileType = ui.editor.getFileType();
    if((fileType === 'ople_design') || fileType === 'ople2_design'){
        addBtn.innerHTML = mxResources.get('addTask');
    }else{
        addBtn.innerHTML=(mxUi === 'subject_design')?mxResources.get('addLearningActivity'):mxResources.get('addAction');
    }
    addBtn.className = 'geBtn gePrimaryBtn';
    //btnDiv.appendChild(addBtn);
    var hiddenTag = document.createElement('a');
    hiddenTag.id = 'hiddenTag';
    btnDiv.appendChild(hiddenTag);
    this.container.appendChild(this.workbenchContainer);
    this.container.appendChild(btnDiv);

    var me = this;
    this.indexOrder = [];//记录“事情”顺序；记录所有task的id
    this.questionId = {};//记录所有选择题id
    this.template = {};//记录所有富文本模板、office文件的信息
    this.taskRoleCmbBoxs = {};//放置所有选择角色的combobox（对象）
    if (originalData && ((originalData.length==undefined)||(originalData.length>0))) {
        //this.waitForVMType(mxUtils.bind(this, function () {
        //    for (var i = 0; i < originalData.length; i++){
                //this.indexOrder.push(originalData[i].taskId);
                if (originalData.length){
                    //兼容旧版本workbench data 为数组的情况
                    this.addDropDownBar(originalData[0].taskId, originalData[0],fileType,ui);
                } else {
                    this.addDropDownBar(originalData.taskId, originalData,fileType,ui);
                }
                ////已有任务的富文本化（由于有个等待vm type 的过程，所以当对话框rendered时，add drop down bar的操作还没有执行）
                //me.fireRenderedEvent();
            //}
        //}));
    } else {
        var uuid = me.editorUi.genTimeRandId();
        me.addDropDownBar(uuid,null,fileType,ui);
        //新建一个任务时的富文本化
        me.fireRenderedEvent();
    };
};
WorkbenchDiv.prototype.waitForVMType = function (next) {
    var count = 0;
    var loopQuery = setInterval(mxUtils.bind(this, function () {
        if (this.options[1].input[0].value) {
            console.log('get VM type success');
            next();
            clearInterval(loopQuery);
        } else {
            count++;
            if (count==5){
                console.log('fail to get VMType in ' + count + '*50ms');
                next();
                clearInterval(loopQuery);
            }
        }
    }), 50);
};
WorkbenchDiv.prototype.applyTheTab = function () {
    //由于行动改为叶子节点，工作台数据由数组改为单个json fz161118
    var wbToolDataArr = {};
    var isSavable = true;
    //for (var i = 0; i < this.indexOrder.length; i++) {
        var taskId = this.indexOrder[0];
        var wbToolData;
        if (mxUi === "subject_design") {
            wbToolData = this.formatKPData(taskId)
        } else if (mxUi === 'process_design') {
            if(this.editorUi.editor.getFileType() === 'ople_design'){
                console.log('taskId='+taskId);
                wbToolData = this.formatOPLETaskData(taskId);
            }else{
                wbToolData = this.formatWBToolData(taskId);
            }
        }
        if (wbToolData) {
            if (wbToolData == 'deleted'){
                //continue;
            } else {
                //wbToolDataArr.push(wbToolData);
                wbToolDataArr=wbToolData;
            }
        } else {
            isSavable = false;
            //break;
        }
    //}
    if (isSavable){
        this.cell.setAttribute('workbench', JSON.stringify(wbToolDataArr));
        this.cell.setAttribute('label', wbToolDataArr.taskName);
        //update该活动图形上的label
        this.editorUi.editor.graph.cellLabelChanged(this.cell, wbToolDataArr.taskName);
        //this.editorUi.editor.setModified(true);
        console.log('5工作台有效数据保存成功');
    } else {
        console.log('5工作台保存【失败】！');
    }
};
//返回任务信息数据
 WorkbenchDiv.prototype.getTaskInfo = function(){
    var wbToolDataArr = [];
    for (var i = 0; i < this.indexOrder.length; i++) {
        var taskId = this.indexOrder[i];
        var wbToolData;
        if (mxUi === "subject_design") {
            wbToolData = this.formatKPData(taskId)
        } else if (mxUi === 'process_design') {
            if(this.editorUi.editor.getFileType() === 'ople_design' || this.editorUi.editor.getFileType() === 'ople2_design'){
                console.log('taskId='+taskId);
                wbToolData = this.formatOPLETaskData(taskId);
            }else{
                wbToolData = this.formatWBToolData(taskId);
            }
        }
        if (wbToolData) {
            wbToolDataArr.push(wbToolData);
        }
    }
    return wbToolDataArr;
};
//format OPLE task data
WorkbenchDiv.prototype.formatOPLETaskData = function(taskId){
    var taskContentDiv = document.getElementById('content'+taskId);
    var taskTipDiv = document.getElementById('tip'+taskId);
    //var marked = new marked();
    var OPLETaskContent = {};
    OPLETaskContent.taskId = taskId;
    OPLETaskContent.content = marked(taskContentDiv.value);
    OPLETaskContent.tip = marked(taskTipDiv.value);
    return OPLETaskContent;
};
WorkbenchDiv.prototype.formatWBToolData = function (taskId) {
    var me = this;
    var wbToolData = {};
    var inputDom = document.getElementsByName('input' + taskId);
    var selectDom = document.getElementsByName('select' + taskId);
    var radioDom = document.getElementsByName('radio' + taskId);
    var radio2Dom = document.getElementsByName('radio2' + taskId);
    var role;
    if (this.taskRoleCmbBoxs[taskId]) {
        role = this.taskRoleCmbBoxs[taskId].getInputField();
    } else {
        //if (this.cell.parent.id == 1){
        role = [];
        //    this.editorUi.showDialog(new tipDialogBody(this.editorUi, '事情' + (this.indexOrder.indexOf(taskId)+1) + '错误：未检测到上层泳道。是否未将任务放至泳道/泳池中。'), 300, null, true, true);
        //} else {
        //    role = [{"name":this.cell.parent.getAttribute('label'),"id":this.cell.parent.getAttribute('label')}]
        //}
    }
    if (role && inputDom.length > 0){
        wbToolData = {
            "taskId" : taskId,
            "taskName" : inputDom[0].value,
            "taskDescription" : inputDom[1].value,
            //"taskDescription" : this.getInputValue(),
            "materialSource": {
                "actionId": selectDom[0].value,
                "materialMaker": radioDom[0].checked?radioDom[0].value:radioDom[1].value
            },
            "toolType": selectDom[1].value,
            "role": role,
            "input": {
                "inputWay": (selectDom[1].value === 'textArea' || selectDom[1].value === 'mindMap' || selectDom[1].value === 'form' || selectDom[1].value === 'dynamicForm' || selectDom[1].value === 'email'|| selectDom[1].value === 'word'|| selectDom[1].value === 'excel'|| selectDom[1].value === 'ppt') ? selectDom[2].value : null,
                //"inputFileInfo": {
                //    "inputName": (selectDom[2].value === 'previous') ? selectDom[3].name : null,
                //    "inputFileId": (selectDom[2].value === 'previous') ? selectDom[3].value : null
                //},
                "optType": 'private', // or cooperation
                "template": this.template[taskId],
                "materialSource": {
                    "actionId": (selectDom[2].value === 'actionOutput') ? selectDom[4].value : (((selectDom[1]).value === 'dynamicForm') ? selectDom[5].value : null),
                    "materialMaker": ((selectDom[1]).value === 'dynamicForm')?'self':(radio2Dom[0]?(radio2Dom[0].checked?radio2Dom[0].value:radio2Dom[1].value):null)
                },
                "VMId": (selectDom[1].value === 'VM') ? selectDom[2].value : null,
                "questionId": this.questionId[taskId]
            },
            "output": {
                "type": (selectDom[1].value=='comment')?'string':((selectDom[1].value=='choose')?'question':(((selectDom[1].value=='form')||(selectDom[1].value=='dynamicForm'))?'formAttr':'file')),
                "name": this.checkSuffix(selectDom[1].value, (inputDom[2].value || (!this.template[taskId]))?(inputDom[2].value):this.template[taskId].name),
                "requirement":(inputDom[3].checked) ? true : false
            }
        };
        //console.log(wbToolData);
        var checkResult = this.checkWBToolData(wbToolData);
        if(checkResult.suc){
            if((wbToolData.toolType==='form') || (wbToolData.toolType==='dynamicForm')){
                //表单绑定
                $.post(MATERIAL_FORM_URL + '/saveFormBind', {
                    formId : this.template[taskId].id,
                    formName : this.template[taskId].name,
                    courseId : me.editorUi.editor.getFileId(),
                    courseName : me.editorUi.editor.getFilename()
                }, function (res) {
                    if (res == 'error'){
                        console.log('绑定表单出错');
                    }
                });
                //表单绑定end
            }
            return wbToolData;
        } else {
            var msg = mxResources.get('workbenchFailToSave') +'<br><br>';
            var num = this.indexOrder.indexOf(taskId);
            msg += mxResources.get('position') + ': ' + mxResources.get('action') + (++num) + '<br>';
            if (checkResult.msg) {
                msg += mxResources.get('reason') + ': ' + checkResult.msg;
            }
            this.editorUi.showDialog(new tipDialogBody(this.editorUi, msg, 'left'), 300, null, true, true);
        }
    } else {
        return 'deleted';
    }
};
WorkbenchDiv.prototype.checkSuffix = function (toolType, name) {
    var temp = name.split('.');
    var formatSuffix = function (suffix) {
        if (temp.length > 1 && temp[temp.length-1]==suffix){
            return name;
        } else {
            return name + '.' + suffix;
        }
    }
    if (toolType=='textArea' || toolType=='email') return formatSuffix('html');
    if (toolType=='mindMap') return formatSuffix('jm');
    if ((toolType=='form') || (toolType=='dynamicForm')) return name;
    if (toolType=='word') return formatSuffix('doc');
    if (toolType=='excel') return formatSuffix('xls');
    if (toolType=='ppt') return formatSuffix('ppt');
};
WorkbenchDiv.prototype.checkWBToolData = function (wbToolData) {
    var w;
    var me = this;
    w = wbToolData;
    if(!w.taskId && (this.editorUi.editor.getFileType() === 'process_design')){
        var url = "/temp/addWBTaskId?fileId="+this.editorUi.editor.getFileId();
        var message = '您的数据不兼容，请点击<a href='+url+' target="_blank"><button>更新</button></a>进行数据更新，更新完成后，在本页面 <b>保存当前文件 </b>并 <b>刷新</b> 页面';
        return {"suc":false,"msg": message};
    } else if (!w.taskName){
        return {"suc":false,"msg":mxResources.get('missingThingsName')};
    } else if (!w.toolType){
        return {"suc":false,"msg":mxResources.get('missingTool')};
    } else if (!w.role) {
        return {"suc":false,"msg":mxResources.get('missingRole')};
    } else if (w.materialSource && w.materialSource.actionId){
        //check: 1. if taskId valid; 2.task index < current index; 3.if task's output exsit
        for (var i = 0; i < this.indexOrder.length; i++){
            if (this.indexOrder[i] === w.materialSource.actionId){
                if (document.getElementsByName('input' + w.materialSource.actionId).length && (!document.getElementsByName('input' + w.materialSource.actionId)[2].value)){
                    return {"suc":false,"msg":mxResources.get('taskHaveNoOutput')};
                }
                break;
            }else if (this.indexOrder[i] === w.taskId){
                //todo
                //return {"suc":false,"msg":mxResources.get('wrongMaterialOrder')};
            }else if (i === (this.indexOrder.length-1)){
                return {"suc":false,"msg":mxResources.get('invalidMaterialTaskId')};
            }
        }
    } else if (w.toolType === 'textArea' || w.toolType === 'email' || w.toolType === 'form' || w.toolType === 'dynamicForm'){
        if (!w.input) {
            return {"suc":false,"msg":mxResources.get('missingPreviousContent')};
        } else if (!w.output){
            return {"suc":false,"msg":mxResources.get('missingOutputLearningOutcomes') + mxResources.get('or') + mxResources.get('missingIsOutputNecessary')};
        } else if(!w.input.inputWay){
            return {"suc":false,"msg":mxResources.get('missingInputWay')};
        } else {
            if (w.input.inputWay === 'init'){

            } else if (w.input.inputWay === 'DB' || w.input.inputWay === 'upload'){
                if (!w.input.template){
                    return {"suc":false,"msg":mxResources.get('missingFileInPreviousContent')};
                }
                if ((w.toolType === 'dynamicForm') &&(!w.input.materialSource.actionId)){
                    return {"suc":false,"msg":'“变量值来源”所选活动无效，请重新选择'};
                }
            } else if (w.input.inputWay === 'previous'){
                if (!w.input.inputFileInfo || !w.input.inputFileInfo.inputName || !w.input.inputFileInfo.inputFileId){
                    return {"suc":false,"msg":mxResources.get('missingFileInInputFile')};
                }
            }
        }
    } else if (w.toolType === 'VM'){
        if(!w.input.VMId) {
            return {"suc":false,"msg":mxResources.get('missingVMType')};
        }
    } else if (w.toolType === 'choose'){
        if(!w.input.questionId) {
            return {"suc":false,"msg":mxResources.get('missingExam')};
        }
    } else if (w.toolType === 'board'){

    } else if (w.toolType==='word' ||w.toolType==='ppt' ||w.toolType==='excel'){
        if (w.input.inputWay==='editOnline' && w.input.template && (!w.input.template.filePath)){
            console.log('5工作台保存【失败】！');
            var filePath,
                isGotten = false;
            me.getOfficeFilePath(w.input.template.id, function (res) {
                isGotten = true;
                filePath = res;
            })
            var count = 0;
            var loopQuery = setInterval( function () {
                if (isGotten){
                    if (filePath){
                        console.log('get office uuid success');
                        me.template[w.taskId].filePath = filePath;
                        me.applyTheTab();
                    } else {
                        var msg = '获取文件失败，若确认文件已保存，请稍后重试。';
                        me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('workbenchFailToSave') + '<br><br>' + mxResources.get('reason') + ': ' + msg, 'left'), 300, null, true, true);
                    }
                    clearInterval(loopQuery);
                } else {
                    count++;
                    if (count==5){
                        console.log('fail to get response in ' + count + '*500ms');
                        var msg = '获取office文件失败，无响应，请稍后重试';
                        me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('workbenchFailToSave') + '<br><br>' + mxResources.get('reason') + ': ' + msg, 'left'), 300, null, true, true);
                        clearInterval(loopQuery);
                    }
                }
            }, 1000);
            /* v2.1_170306
            var count = 0;
            var loopQuery = setInterval( function () {
                //检查是否上传
                $.get('/office/getSavedFileId?uuid=' + w.input.template.uuid, function (res) {
                    if (res.success){
                        console.log('get office uuid success');
                        me.template[w.taskId].id = res.data;
                        delete me.template[w.taskId].uuid;
                        me.applyTheTab();
                        clearInterval(loopQuery);
                    } else {
                        count++;
                        if (count==5){
                            console.log('fail to get office uuid in ' + count + '*500ms, maybe not saved');
                            var msg = '获取office文件失败，请稍后重试';
                            me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('workbenchFailToSave') + '<br><br>' + mxResources.get('reason') + ': ' + msg, 'left'), 300, null, true, true);
                            clearInterval(loopQuery);
                        }
                    }
                });
            }, 1000);*/
        }
    } else {
        return {"suc":true};
    }
    return {"suc":true};
};
WorkbenchDiv.prototype.addDropDownBar = function (uuid, wbToolData,fileType,ui) {
    this.indexOrder.push(uuid);
    var taskName,oneToolDiv;
    if(fileType === 'ople_design' || fileType === 'ople2_design'){
        oneToolDiv = this.addOPLETask(uuid,wbToolData,ui);
        taskName = mxResources.get('task');
    }else{
        if (mxUi === 'subject_design'){
            oneToolDiv = this.addKnowledgePoint(uuid, wbToolData);
            taskName = mxResources.get('knowledgPoint');
        }else {
            oneToolDiv = this.addWorkbenchTool(uuid, wbToolData);
            taskName = mxResources.get('action');
        }
    }

    //var count = this.indexOrder.length;
    //var oneToolContainer = this.editorUi.formItems.genDropDownBar(taskName+count, '100', '', oneToolDiv,false);
    //oneToolContainer.createButton('↓','0',mxResources.get('moveDown'),this.moveDown(this.indexOrder,uuid,this.swap));
    //oneToolContainer.createButton('↑','1',mxResources.get('moveUp'),this.moveUp(this.indexOrder,uuid,this.swap));
    this.workbenchContainer.appendChild(oneToolDiv);
};
WorkbenchDiv.prototype.refreshDropDownBar = function (uuid, wbToolData,fileType,ui) {
    this.indexOrder = [];
    this.questionId = {};
    this.template = {};
    this.taskRoleCmbBoxs = {};
    while (this.workbenchContainer.firstChild){
        this.workbenchContainer.removeChild(this.workbenchContainer.firstChild);
    }
    this.addDropDownBar(uuid, wbToolData,fileType,ui);
};
WorkbenchDiv.prototype.swap = function (array,var1,var2) {
    var t1,t2;
    t1 = array.indexOf(var1);
    t2 = array.indexOf(var2);
    array[t1] = var2;
    array[t2] = var1 ;
    return array;
};

//获取cell数据
WorkbenchDiv.prototype.getCellData = function(){
    var me = this;
    var root = this.editorUi.editor.graph.model.getCell(1);
    var cells = this.editorUi.editor.graph.findAllCellsUndParent(root);
    var rootCells = [];
    for(var i = 0; i < cells.length;i++){
        var arrow = this.editorUi.editor.graph.model.getIncomingEdges(cells[i]);
        if( (arrow.length < 1) &&  (cells[i].getAttribute('type') === 'bpmn.task')){
            var cell = {
                'value': cells[i].id,
                'name':cells[i].getAttribute('label'),
                'child': me.getCellsChild(cells[i].id)
            };
            rootCells.push(cell);
        }
    }
    return rootCells;
};

WorkbenchDiv.prototype.getCellsChild = function(cellId) {
    var cell = this.editorUi.editor.graph.model.getCell(cellId);
    var arrow = this.editorUi.editor.graph.model.getOutgoingEdges(cell);
    var childCells = [];
    if(arrow.length > 0){

        for(var i = 0; i < arrow.length; i++){
            var childCell = {
                'value':arrow[i].target.id,
                'name':arrow[i].target.getAttribute('label'),
                'child': this.getCellsChild(arrow[i].target.id)
            };
            childCells.push(childCell);
        }
    }else{
        return null;
    }
    return childCells;
};

WorkbenchDiv.prototype.formatKPData = function (taskId) {
    var knowledgePointData = {};
    var kpNameDom = document.getElementsByName('input' + taskId);
    var kpDom = document.getElementsByName('select' + taskId);
    var kpDescDom = document.getElementsByName('description' + taskId);
    var t = kpDom.length - 1;
    if (kpNameDom.length > 0) {
        knowledgePointData = {
            "kpId": taskId,
            "kpName": kpNameDom[0].value,
            "kpDescription": kpDescDom[0].value,
            "questionId": this.questionId[taskId],
            "relatedKPId": kpDom[t].value
        };
    }
    return knowledgePointData;
};
//todo make a containter for ople basic info
var OpleBasicInfoContainer = function(ui,cell){
    var me = this;
    me.OPLEBasicInfo = document.createElement('div');
    me.OPLEBasicInfo.setAttribute('style','border:1px solid #ccc;margin:5px;');
    me.OPLEBasicInfoToolbar = document.createElement('div');
    me.OPLEBasicInfoToolbar.innerHTML = '一.'+ mxResources.get('basicInfo');
    me.OPLEBasicInfoToolbar.setAttribute('style','padding:10px 0 10px 10px;border:1px solid #ccc;font-weight:bold;cursor:pointer');
    me.OPLEBasicInfo.appendChild(me.OPLEBasicInfoToolbar);
    me.courseInfoBox = document.createElement('div');
    me.courseTitleBox = document.createElement('div');
    me.courseTitleBox.setAttribute('style','margin:20px 0 10px 10px');
    me.courseTitleText = document.createElement('div');
    me.courseTitleText.setAttribute('style','margin:10px 0 10px');
    me.courseTitleText.innerHTML = mxResources.get('courseTitle')+'：';
    me.courseTitleInput = document.createElement('input');
    me.courseTitleInput.placeholder = '本课程的概括';
    me.courseTitleInput.setAttribute('style','padding-left:5px;width: 98%;height:25px;line-height: 1.42857143;border: 1px solid #ccc;box-shadow: inset 0 1px 1px rgba(0,0,0,.075)');
    me.courseTitleBox.appendChild(me.courseTitleText);
    me.courseTitleBox.appendChild(me.courseTitleInput);
    me.courseContentBox = document.createElement('div');
    me.courseContentBox.setAttribute('style','margin:20px 0 10px 10px');
    me.courseContentText = document.createElement('div');
    me.courseContentText.setAttribute('style','margin:10px 0 10px');
    me.courseContentText.innerHTML = '详细描述：';
    me.courseContentTextarea = document.createElement('div');
    me.courseContentObj = new showdownContainer(ui,me.courseContentTextarea,'对该课程的详细介绍');
    me.courseContent = me.courseContentObj.getContainer();
    me.courseContentBox.appendChild(me.courseContentText);
    me.courseContentBox.appendChild(me.courseContent);

    me.projectModelZip = document.createElement('div');
    me.projectModelZip.setAttribute('style','margin:20px 0 10px 10px');
    me.projectModelZipText = document.createElement('span');
    me.projectModelZipText.innerHTML = '练习项目：';
    me.projectModelZipNameInput = document.createElement('span');
    me.projectModelZipNameInput.innerHTML = '课程开发者上传用于学习的项目压缩文件';
    me.projectModelZipNameInput.setAttribute('style','color:#8e8e8e');
    me.deleteModelZip = document.createElement('span');  //delete uploaded zip files tag
    me.deleteModelZip.innerHTML = 'X 删除';
    me.deleteModelZip.setAttribute('style','margin-left:30px;cursor:pointer');
    me.deleteModelZip.onclick = function(){
        // todo delete files on server
        var queryObj = {
            id : me.projectModelZipNameInput.id
        };
        ui.communication.deleteUploadFile(queryObj,mxUtils.bind(this,function(message){
            if(message){
                var childNodes = this.projectModelZip.childNodes;
                while(childNodes.length > 3){
                    me.projectModelZip.removeChild(me.projectModelZip.lastChild);
                }
                me.projectModelZipNameInput.innerHTML = '课程开发者上传用于学习的项目压缩文件';
                console.log('delete zip success');
            }
        }));
    };
    me.tutorialZip = null;
    me.resultZip = null;
    me.uploadProjectModelZipBtn = mxUtils.button(mxResources.get('upload'),function(evt){
        ui.showDialog(new UploadModelFileDialogBody(ui, mxResources.get('uploadFile'),null,function(data){
            if(data){
                me.tutorialZip = data;
                me.projectModelZipNameInput.innerHTML = data.fileName;
                me.projectModelZipNameInput.id = data.materialsId;
                me.projectModelZipNameInput.setAttribute('style','color:#0f0f0f;margin:10px auto');
                me.projectModelZip.appendChild(me.deleteModelZip);
            }
        }),500,null,null,true);
        console.log('upload zip file success');
    });
    me.uploadProjectModelZipBtn.setAttribute('style','margin:0 10px 10px 10px');
    me.projectModelZip.appendChild(me.projectModelZipText);
    me.projectModelZip.appendChild(me.uploadProjectModelZipBtn);
    me.projectModelZip.appendChild(me.projectModelZipNameInput);

    me.projectResultZip = document.createElement('div');
    me.projectResultZip.setAttribute('style','margin:20px 0 10px 10px');
    me.projectResultZipText = document.createElement('span');
    me.projectResultZipText.innerHTML = '目标参考答案：';
    me.uploadProjectResultZipInput = document.createElement('span');
    me.uploadProjectResultZipInput.innerHTML = '课程开发者上传该活动的标准答案';
    me.uploadProjectResultZipInput.setAttribute('style','color:#8e8e8e');
    me.deleteResultZip = document.createElement('span');  //delete uploaded zip files tag
    me.deleteResultZip.innerHTML = 'X';
    me.deleteResultZip.setAttribute('style','margin-left:30px;cursor:pointer');
    me.deleteResultZip.onclick = function(){
        // todo delete files on server
        var queryObj = {
            id : me.uploadProjectResultZipInput.id
        };
        ui.communication.deleteUploadFile(queryObj,mxUtils.bind(this,function(message){
            if(message){
                var childNodes = me.projectResultZip.childNodes;
                while(childNodes.length > 3){
                    me.projectResultZip.removeChild(me.projectResultZip.lastChild);
                }
                me.uploadProjectResultZipInput.innerHTML = '课程开发者上传该活动的标准答案';
                console.log('delete zip success');
            }
        }));
    };
    me.uploadProjectResultZipBtn = mxUtils.button(mxResources.get('upload'),function(evt){
        ui.showDialog(new UploadModelFileDialogBody(ui,mxResources.get('uploadFile'),null,function(data){
            console.log(data);
            if(data){
                me.resultZip = data;
                me.uploadProjectResultZipInput.innerHTML = data.fileName;
                me.uploadProjectResultZipInput.id = data.materialsId;
                me.uploadProjectResultZipInput.setAttribute('style','color:#0f0f0f');
                me.projectResultZip.appendChild(me.deleteResultZip);
            }
        }),500,null,null,true);
        console.log('upload zip file success');
    });
    me.uploadProjectResultZipBtn.setAttribute('style','margin:0 10px 10px 10px');
    me.projectResultZip.appendChild(me.projectResultZipText);
    me.projectResultZip.appendChild(me.uploadProjectResultZipBtn);
    me.projectResultZip.appendChild(me.uploadProjectResultZipInput);
    me.courseInfoBox.appendChild(me.courseTitleBox);
    me.courseInfoBox.appendChild(me.courseContentBox);
    me.courseInfoBox.appendChild(me.projectModelZip);
    me.courseInfoBox.appendChild(me.projectResultZip);
    me.OPLEBasicInfo.appendChild(me.courseInfoBox);

    //todo apply OPLE meta-info data
    me.OPLEDetailDescDiv = me.courseContentObj.getEditTextarea();
    me.OPLEBasicInfoToolbar.onclick = mxUtils.bind(this,function(){
        if(me.courseInfoBox.style.display === 'block'){
            me.courseInfoBox.style.display = 'none'
        }else{
            me.courseInfoBox.style.display = 'block';
        }
    });

};
//获取课程标题
OpleBasicInfoContainer.prototype.getCourseTitleInput = function(){
  return this.courseTitleInput;
};
//获取课程详细描述
OpleBasicInfoContainer.prototype.getCouurseDetailDesc = function(){
  return this.courseContentObj.getEditTextarea();
};
//获取上传的压缩文件（学习文件）
OpleBasicInfoContainer.prototype.getProjectModelZip = function(){
    return this.tutorialZip;
};
OpleBasicInfoContainer.prototype.getProjectModelZipNameInput = function(){
    return this.projectModelZipNameInput;
};
//获取上传的压缩文件(结果文件)
OpleBasicInfoContainer.prototype.getProjectResultZip = function(){
    return this.resultZip;
};
OpleBasicInfoContainer.prototype.getProjectResultZipInput = function(){
    return this.uploadProjectResultZipInput;
};
//获取课程基本信息的DIV
OpleBasicInfoContainer.prototype.getOPLEBasicInfo = function(){
    return this.OPLEBasicInfo;
};
//获取两个难度层级的OPLE课程编辑面板（包括基本信息和任务描述）
OpleBasicInfoContainer.prototype.getOPLEEditPanel = function(ui,cell,opleLevel){
    // todo opleLevel basicInfo tab
    var me = this;
    me.workbench = new WorkbenchDiv(ui, cell, opleLevel);
    me.OPLEEditPanelDiv = document.createElement('div');
    me.opleBasicInfoBox = document.createElement('div');
    me.opleBasicInfoContainer = document.createElement('div');
    me.opleBasicInfoContainer.appendChild(me.getOPLEBasicInfo());
    me.opleBasicInfoBox.appendChild(me.opleBasicInfoContainer);

    // todo opleLevel learningGuide tab
    me.OPLELearningGuideBox = document.createElement('div');
    me.OPLELearningGuideBox.setAttribute('style','padding:5px;border:1px solid #ccc');
    me.OPLELearningGuideToobar = document.createElement('div');
    me.OPLELearningGuideToobar.innerHTML = '二.' + mxResources.get('learningGuide');
    me.OPLELearningGuideToobar.setAttribute('style','padding:10px 0 10px 10px;border:1px solid #ccc;font-weight:bold;cursor:pointer');
    me.OPLELearningGuideLevel = me.workbench.getContainer();
    me.OPLELearningGuideLevel.setAttribute('style','border:1px solid #ccc;min-height:100px;overflow:auto');
    me.OPLELearningGuideBox.appendChild(me.OPLELearningGuideToobar);
    me.OPLELearningGuideBox.appendChild(me.OPLELearningGuideLevel);
    me.OPLEEditPanelDiv.appendChild(me.opleBasicInfoBox);
    me.OPLEEditPanelDiv.appendChild(me.OPLELearningGuideBox);
    me.OPLELearningGuideToobar.onclick = mxUtils.bind(this,function(){
        if(me.OPLELearningGuideLevel.style.display === 'block'){
            me.OPLELearningGuideLevel.style.display = 'none';
        }else{
            me.OPLELearningGuideLevel.style.display = 'block';
        }
    });
    return me.OPLEEditPanelDiv;
};
//OpleBasicInfoContainer.prototype.getOpleBasicInfoBox = function(){
//    return this.opleBasicInfoBox;
//};
//获取学习任务引导的DIV
OpleBasicInfoContainer.prototype.getOPLELearningGuideBox = function(){
    return this.OPLELearningGuideBox;
};
//获取编辑的课程数据
OpleBasicInfoContainer.prototype.getAllCourseInfo = function(){
    var opleLevelInfo = {
        courseTitle : this.getCourseTitleInput().value,
        courseDetailDesc : this.getCouurseDetailDesc().value,
        tutorialZip : this.getProjectModelZip(),
        resultZip : this.getProjectResultZip(),
        taskInfo : this.workbench.getTaskInfo()
    };
    return opleLevelInfo;
};
//todo add OPLE task content
WorkbenchDiv.prototype.addOPLETask = function (uuid,taskData,ui) {
    var me = this;
    me.oneToolDiv = document.createElement('div');
    me.oneToolDiv.setAttribute('style', 'padding: 5px 20px;');
    //task content
    var taskBox = document.createElement('div');
    var taskContentBox = this.addItemToTool(mxResources.get('contentOfTask'));
    var taskContent = document.createElement('div');
    var taskContentObj = new showdownContainer(ui,taskContent,mxResources.get('detailsOfTask'));
    taskContent = taskContentObj.getContainer();
    var taskContentEdit = taskContentObj.getEditTextarea();
    taskContentEdit.id = 'content' + uuid;
    taskBox.appendChild(taskContentBox);
    taskContentBox.appendChild(taskContent);
    //task tip
    var taskTipBox = this.addItemToTool(mxResources.get('tooltips'));
    var taskTip = document.createElement('div');
    var taskTipObj = new showdownContainer(ui,taskTip,mxResources.get('tipsOfTheTask'));
    taskTip = taskTipObj.getContainer();
    var taskTipEdit = taskTipObj.getEditTextarea();
    taskTipEdit.id = 'tip' + uuid;
    taskBox.appendChild(taskTipBox);
    taskTipBox.appendChild(taskTip);
    me.oneToolDiv.appendChild(taskBox);

    //OPLE guideline 数据回显
    if(taskData){
        taskContentEdit.value = taskData.content;
        taskTipEdit.value = taskData.tip;
    }
    return this.oneToolDiv;
};
// 增加知识点
WorkbenchDiv.prototype.addKnowledgePoint = function (uuid, wbToolData) {
    var me = this;
    this.oneToolDiv = document.createElement('div');
    this.oneToolDiv.setAttribute('style', 'padding: 5px 20px;');
    //知识点名称kpName
    var kpNameBox = this.addItemToTool(mxResources.get('knowledgPoint'));
    var kpName = document.createElement('input');
    kpName.name = 'input' + uuid;
    kpName.style.width = '500px';
    kpNameBox.appendChild(kpName);
    //描述 kpDesc
    var kpDescBox = this.addItemToTool(mxResources.get('description'));
    var kpDesc = document.createElement('textArea');
    kpDesc.name = 'description' + uuid;
    kpDesc.style.width = '500px';
    kpDescBox.appendChild(kpDesc);
    //kpDesc.style.height = '100px';
    //kpDesc.id = uuid;
    //this.addListener('onRendered', mxUtils.bind(this, function (message) {
    //    var thisInputField = this;
    //    tinymce.init({
    //        theme: 'modern',
    //        skin: 'light',
    //        selector: '#' + kpDesc.id,
    //        language: 'zh_CN',
    //        content_css: "styles/grapheditor.css",
    //        theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
    //        font_size_style_values: "10px,12px,13px,14px,16px,18px,20px",
    //        fontsize_formats: "8px 10px 12px 13px 14px 16px 18px 20px 24px 36px",
    //        plugins: [
    //            "advlist autolink lists link image charmap print preview anchor",
    //            "searchreplace visualblocks code fullscreen",
    //            "insertdatetime media table contextmenu paste"
    //        ],
    //        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | fontsizeselect",
    //        setup: function (editor) {
    //            editor.on('init', function (e) {
    //                console.log('show event', e);
    //                /*if(wbToolData){
    //                 thisInputField.setInputValue(wbToolData.taskDescription);
    //                 console.log(wbToolData.taskDescription);
    //                 } else {*/
    //                thisInputField.setInputValue(thisInputField.getCellAttrValue(me.cell, "kpDescription"));
    //                //}
    //
    //            });
    //        }
    //    });
    //}));
    //this.getInputValue = function () {
    //    return tinymce.activeEditor.getContent();
    //};
    //this.setInputValue = function (value) {
    //    tinyMCE.activeEditor.setContent(value);
    //};
    //this.getInputFieldId = function () {
    //    return taskDesc.id;
    //};
    //this.getCellAttrValue = function (cell, valueName) {
    //    var isObjectValue = (typeof cell.value === 'object') ? true : false;
    //    if (isObjectValue) {
    //        return cell.getAttribute(valueName, '');
    //    } else {
    //        return cell.value;
    //    }
    //};
    //相关知识点 relatedKP 下拉框
    var relatedKpBox = document.createElement('div');
    relatedKpBox.setAttribute('style', 'display:inline-flex');
    // 相关知识点
    var toolTypeBox = this.addItemToTool(mxResources.get('relatedKnowledgPoint'), true, true);
    relatedKpBox.appendChild(toolTypeBox);
    this.oneToolDiv.appendChild(relatedKpBox);

    var createComboBox = function (option) {
        var relatedKpBox1 = me.addItemToTool('', true, true);
        me.relatedKpCmb = document.createElement('select');
        me.relatedKpCmb.name = 'select' + uuid;
        for (var i = 0; i < option.length; i++) {
            $(me.relatedKpCmb).append("<option value = " + option[i].value + ">" + option[i].name + "</option>");
        }
        //me.relatedKpCmb.value =  option[1].value;
        relatedKpBox1.appendChild(me.relatedKpCmb);
        relatedKpBox.appendChild(relatedKpBox1);

        me.relatedKpCmb.onchange = function () {
            if (this.parentNode.nextSibling) {
                //改变下个select的option
                if (this.getAttribute('option')) {
                    option = JSON.parse(this.getAttribute('option'));
                }
                for (var i = 0; i < option.length; i++) {
                    if (this.value === option[i].value) {
                        if (option[i].child) {
                            var childOption = option[i].child;

                            $(this.parentNode.nextSibling.childNodes[1]).empty().append("<option value = " + childOption[0].value + ">" + childOption[0].name + "</option>");
                            for (var j = 1; j < childOption.length; j++) {
                                $(this.parentNode.nextSibling.childNodes[1]).append("<option value = " + childOption[j].value + ">" + childOption[j].name + "</option>")
                            }
                            this.parentNode.nextSibling.childNodes[1].setAttribute('option', JSON.stringify(childOption));
                        } else {
                            while (this.parentNode.nextSibling) {
                                this.parentNode.parentNode.removeChild(this.parentNode.nextSibling);
                            }
                        }
                    }
                }
                //去掉下一个select后的所有select
                while (this.parentNode.nextSibling && this.parentNode.nextSibling.nextSibling) {
                    this.parentNode.parentNode.removeChild(this.parentNode.nextSibling.nextSibling);
                }

            } else {
                //建下个select
                if (this.getAttribute('option')) {
                    option = JSON.parse(this.getAttribute('option'));
                }
                for (var i = 0; i < option.length; i++) {
                    if (this.value === option[i].value) {
                        if (option[i].child) {
                            var childOption = option[i].child;
                            createComboBox(childOption);
                        }
                    }
                }
            }
        };
    };

    var arr = this.getCellData();
    //var arr = [{
    //    "value": "2",
    //    "name": "第一章",
    //    "child": [{
    //        "value": "7",
    //        "name": "1.1第一节",
    //        "child": [{
    //            "value": "22",
    //            "name": "1.1.1第一小节",
    //            "child": null
    //        }, {
    //            "value": "20",
    //            "name": "1.1.2第二小节",
    //            "child": null
    //        }]
    //    }, {
    //        "value": "9",
    //        "name": "1.2第二节",
    //        "child": null
    //    }, {
    //        "value": "11",
    //        "name": "1.3第三节",
    //        "child": null
    //    }]
    //}, {
    //    "value": "5",
    //    "name": "第二章",
    //    "child": [{
    //        "value": "17", "name": "2.1第一节", "child": null
    //    }, {
    //        "value": "15",
    //        "name": "2.2第二节",
    //        "child": null
    //    }, {
    //        "value": "13", "name": "2.3第三节", "child": null
    //    }]
    //},{
    //    "value" : "19",
    //    "name" : "第三章",
    //    "child" : null
    //}];

    createComboBox(arr);

    //测试题 kpExam 按钮“编辑”
    var kpExam = this.addItemToTool(mxResources.get('kpExam'), true);
    var editBtn = document.createElement('button');
    editBtn.innerHTML = mxResources.get('edit');
    editBtn.setAttribute('style', 'height:18px;width:50px;text-align:center;cursor:pointer;');
    //编辑按钮
    mxEvent.addListener(editBtn, 'click', mxUtils.bind(this, function () {
        if (!kpName.value){
            me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('missingThingsName'), 'left'), 300, null, true, true);
        } else {
            var questionName = me.editorUi.editor.getFilename() + '_' +  kpName.value;
            me.editorUi.showDialog(new editQuestionDialogBody('create', me.editorUi, questionName, function (id) {
                me.questionId[uuid] = id;
                if(!me.filePreviewLink) {
                    me.filePreviewLink = document.createElement('span');
                    me.filePreviewLink.innerHTML = mxResources.get('previewExam');
                    me.filePreviewLink.className = 'filePreview';
                    kpExam.appendChild(me.filePreviewLink);
                    me.editExamLink = document.createElement('span');
                    me.editExamLink.innerHTML = mxResources.get('editExam');
                    me.editExamLink.className = 'filePreview';
                    me.editExamLink.style.display = 'none';
                    kpExam.appendChild(me.editExamLink);
                }
                mxEvent.addListener(me.filePreviewLink, 'click', mxUtils.bind(this, function () {
                    //var url = "/exam/enterExam?examId=" + me.questionId[uuid] + "&examType=preShow";
                    //window.open(url);
                    me.editorUi.showDialog(new editQuestionDialogBody('view', me.editorUi, me.questionId[uuid]), 1000, 600, true, true);
                }));
                mxEvent.addListener(me.editExamLink, 'click', mxUtils.bind(this, function () {
                    //var url = "/exam/editExam?examId=" + me.questionId[uuid];
                    //window.open(url);
                    me.editorUi.showDialog(new editQuestionDialogBody('edit', me.editorUi, me.questionId[uuid]), 1000, 600, true, true);
                }));
            }), 1000, 600, true, true);
        }
    }));
    kpExam.appendChild(editBtn);

    //获取相关知识点的所有选择路径的value
    function getSeleRoute(arr,key){
        if(!arr || !arr.length) return;
        for(var i = 0;i<arr.length;i++){
            if(arr[i].child){
                result.push(arr[i].value);
                return getSeleRoute(arr[i].child,key);
            }else{
                result.push(arr[i].value);
                if(arr[i].value === key){
                    console.log('result',result);
                    return result;
                }else{
                    result.pop();
                }
            }
        }
        result.pop();
    }

    // 回显
    if(wbToolData) {
        // 知识点名称
        kpName.value = wbToolData.kpName;
        // 知识点描述
        if(wbToolData.kpDescription) {
            kpDesc.value = wbToolData.kpDescription;
        }
        // 相关知识点
        if(wbToolData.relatedKPId) {

        }
        // 测试题
        if(wbToolData.questionId) {
            me.questionId[uuid] = wbToolData.questionId;
            me.filePreviewLink = document.createElement('span');
            me.filePreviewLink.innerHTML = mxResources.get('preview');
            me.filePreviewLink.className = 'filePreview';
            kpExam.appendChild(me.filePreviewLink);
            mxEvent.addListener(me.filePreviewLink, 'click', mxUtils.bind(this, function () {
                var url = "/getAnswerQuestionPanel?type=preShow&id=" + me.questionId[uuid];
                window.open(url);
            }));
        }
    }

    return this.oneToolDiv;
};

WorkbenchDiv.prototype.fireRenderedEvent = function () {
    this.fireEvent(new mxEventObject('onRendered'), {innerHeight: this.height});
};
WorkbenchDiv.prototype.addWorkbenchTool = function (uuid, wbToolData) {
    var me = this;
    this.oneToolDiv = document.createElement('div');
    this.oneToolDiv.setAttribute('style', 'padding: 10px;');
    var basicInfoTag = document.createElement('div');
    basicInfoTag.setAttribute('style', 'background-color: #ECECEC;padding: 5px;color: #424242;font-weight: bold;margin: 0 0 10px 0;font-size: 13px;');
    basicInfoTag.innerHTML = '基础信息';
    this.oneToolDiv.appendChild(basicInfoTag);
    //子任务名input
    var taskNameBox = this.addItemToTool(mxResources.get('actionName'));
    taskNameBox.setAttribute('style','/*float:left;*/margin-left: 10px;');
    var taskName = this.editorUi.formItems.msInput(null, '500px');
    taskName.name = 'input'+uuid;
    taskName.value = this.cell.getAttribute('label');
    //taskName.style.width= '550px';
    taskNameBox.appendChild(taskName);
    //子任务名input
    var taskNameBox2 = this.addItemToTool('行动类型');
    taskNameBox2.setAttribute('style','margin-left:595px;height:45px;');
    var toolName2 = document.createElement('select');
    toolName2.name = 'select6' + uuid;
    var optionHTML2;
    var map = {
        'xbg':{
            name:'写报告',
            workbenchData:{
                "taskId":'mb',
                "taskName":"写报告",
                "taskDescription":"",
                "materialSource":{"actionId":"","materialMaker":"self"},
                "toolType":"textArea",
                "role":[],
                "input":{
                    "inputWay":"actionOutput",
                    "inputFileInfo":{"inputName":null,"inputFileId":null},
                    "materialSource":{"actionId":"573nvofr3dv2g","materialMaker":"self"},
                    "VMId":null
                },
                "output":{"name":"报告","requirement":true}}
        }
    }
    var option2 =  [
        {name:'自定义', value:'1', workbenchData:null},
        {name:'写报告', value:'xbg'},
        {name:'评论', value:'3'},
    /*
        {name:'讲课', value:'1'},
        {name:'小组讨论', value:'2'},
        {name:'头脑风暴', value:'3'},
        {name:'每人分别写报告', value:'4'},
        {name:'小组合作写报告', value:'31'},
        {name:'评论', value:'32'},
        {name:'实践', value:'33'}*/
    ]
    for (var i = 0; i < option2.length; i++){
        optionHTML2 += '<option value = ' + option2[i].value + '>' + option2[i].name + '</option>'
    }
    toolName2.innerHTML =optionHTML2;
    toolName2.onchange = function () {
        me.refreshDropDownBar(uuid, map[this.value].workbenchData, 'process_design', me.editorUi);
        me.fireRenderedEvent();
    };
    //去掉行动类型，缪总
    taskNameBox2.style.display='none';
    taskNameBox2.appendChild(toolName2);
    //引导文input
    var taskDescBox = this.addItemToTool(mxResources.get('guideTxt'));
    //var taskDesc = document.createElement('textArea');
    //taskDesc.name = 'input'+uuid;
    //taskDesc.style.width= '500px';
    //taskDesc.style.minHeight= '75px';
    //taskDesc.verticalAlign = 'top';
    //160411fz新富文本编辑器
    var taskDesc = document.createElement('textArea');
    taskDesc.name = 'input'+uuid;
    taskDesc.className = 'workbenchDesc';
    //0202fz插入资料
    //var resourceBtn = document.createElement('button');
    //resourceBtn.innerHTML = mxResources.get('insertMaterial');
    //resourceBtn.onclick = function () {
    //    me.editorUi.showAllLearningResource('learningResSearch', '', '', false, '10011', function (arr) {
    //        if (arr){
    //            for (var i = 0; i < arr.length; i++){
    //                var insertText = '#['+ arr[i].materialsId + ';' + arr[i].fileType + ']' + arr[i].fileName + '#';
    //                if (document.selection) {
    //                    var sel = document.selection.createRange();
    //                    sel.text = insertText;
    //                } else if (typeof taskDesc.selectionStart === 'number' && typeof taskDesc.selectionEnd === 'number') {
    //                    var startPos = taskDesc.selectionStart,
    //                        endPos = taskDesc.selectionEnd,
    //                        cursorPos = startPos,
    //                        tmpStr = taskDesc.value;
    //                    taskDesc.value = tmpStr.substring(0, startPos) + insertText + tmpStr.substring(endPos, tmpStr.length);
    //                    cursorPos += insertText.length;
    //                    taskDesc.selectionStart = taskDesc.selectionEnd = cursorPos;
    //                } else {
    //                    taskDesc.value += insertText;
    //                }
    //            }
    //        }
    //    });
    //};
    taskDescBox.appendChild(taskDesc);
    this.addListener('onRendered', function () {
        $('.workbenchDesc').summernote({height: '130px'});
    });

    //角色select
    var rolePool = this.getRolePool();
    if (rolePool) {
        var userData = [];
        userData = rolePool;
        var originalRole;
        if (wbToolData && wbToolData.role) {
            originalRole = JSON.stringify(wbToolData.role);
        }
        this.taskRoleCmbBoxs[uuid] = this.editorUi.formItems.genComboBox('', 'member', this.cell, userData, '100', null, originalRole);
        var taskRoleBox = this.addItemToTool(mxResources.get('performRole'), true);
        taskRoleBox.style.display = 'inline-flex';
        taskRoleBox.appendChild(this.taskRoleCmbBoxs[uuid].getElContainer());
    }

    var inputTag = document.createElement('div');
    inputTag.setAttribute('style', 'background-color: #ECECEC;padding: 5px;color: #424242;font-weight: bold;margin: 10px 0;font-size: 13px;');
    inputTag.innerHTML = '输入';
    this.oneToolDiv.appendChild(inputTag);

    //阅读材料
    var materialBox = this.addItemToTool(mxResources.get('readingMaterial'), true);
    materialBox.style.display='none';
    var materialDivs = this.makeMaterialBox(wbToolData?wbToolData:null, uuid, 'radio');
    materialBox.appendChild(materialDivs.materialSelectDiv);
    materialBox.appendChild(materialDivs.sourceRange);

    //工具select
    var toolTypeBox = this.addItemToTool(mxResources.get('theToolUsed'), true, false/*true*/);
    var options=[];
    for (var i = 0; i < this.options.length; i++){
        options.push({text: this.options[i].name, value: this.options[i].value});
    }
    var toolNameSelect = this.editorUi.formItems.msSelect(options);
    var toolName = toolNameSelect.getContainer();
    toolName.name = 'select' + uuid;
    toolTypeBox.appendChild(toolName);

    //工具预设内容相关
    var taskToolBox = document.createElement('div');
    taskToolBox.setAttribute('style', 'display: inline-flex;margin-left:10px;padding: 5px 0;');

    //预设内容select
    var presetInputBox = this.addItemToTool(mxResources.get('previousContent'), true, true);
    presetInputBox.style.marginLeft = '0px';
    var options=[];
    for (var i = 0; i < this.options[0].input.length; i++) {
        options.push({text: this.options[0].input[i].name, value: this.options[0].input[i].value});
    }
    var presetInputSelect = this.editorUi.formItems.msSelect(options);
    var presetInputCmb = presetInputSelect.getContainer();
    presetInputCmb.name = 'select' + uuid;
    presetInputBox.appendChild(presetInputCmb);

    //“输入文件”对应的选项--数据对象
    var dataObjChooseBox = this.addItemToTool(mxResources.get('importedFile'), true, true);
    var cellLabel = document.createElement('select');
    cellLabel.name = 'select' + uuid;
    var labelObj = [];
    j = 0;
    var cellArray = this.editorUi.editor.graph.findAllCellsUndParent();
    for ( i = 0; i < cellArray.length; i++){
        if (cellArray[i].target && cellArray[i].target.id === this.cell.id && cellArray[i].source.getAttribute('label')) {
            labelObj[j] = {
                "name": cellArray[i].source.getAttribute('label'),
                "value": cellArray[i].source.id
            };
            j++;
        }
    }
    for ( i = 0; i < labelObj.length; i++) {
        $(cellLabel).append("<option value=" + labelObj[i].value + ">" + labelObj[i].name + "</option>");
    }
    dataObjChooseBox.setAttribute('style','margin-left:20px;display:none');
    dataObjChooseBox.appendChild(cellLabel);

    //“此前行动输出文件”对应的选项--行动选择
    var actionChooseBox = this.addItemToTool(mxResources.get('chooseAction'), true, true);
    actionChooseBox.style.display = 'none';
    actionChooseBox.style.marginLeft = '20px';
    var materialDivs = this.makeMaterialBox(wbToolData?wbToolData.input:null, uuid, 'radio2');
    actionChooseBox.appendChild(materialDivs.materialSelectDiv);
    actionChooseBox.appendChild(materialDivs.sourceRange);

    //“表单（含变量）”对应的select2--行动选择
    var variableChooseBox = this.addItemToTool('变量值来源', true, true);
    variableChooseBox.style.display = 'none';
    variableChooseBox.style.marginLeft = '20px';
    var options = this.getOutputMaterials(wbToolData?wbToolData.input:null);
    var variableSelect = this.editorUi.formItems.msSelect(options);
    var variableSelectDiv = variableSelect.getContainer();
    variableSelectDiv.name = 'select' + uuid;
    variableChooseBox.appendChild(variableSelectDiv);

    //taskToolBox.appendChild(toolTypeBox);
    taskToolBox.appendChild(presetInputBox);
    taskToolBox.appendChild(dataObjChooseBox);
    taskToolBox.appendChild(actionChooseBox);
    taskToolBox.appendChild(variableChooseBox);
    this.oneToolDiv.appendChild(taskToolBox);

    var outputTag = document.createElement('div');
    outputTag.setAttribute('style', 'background-color: #ECECEC;padding: 5px;color: #424242;font-weight: bold;margin: 10px 0;font-size: 13px;');
    outputTag.innerHTML = '输出';
    this.oneToolDiv.appendChild(outputTag);

    //输出文件名
    var taskOutputBox = this.addItemToTool(mxResources.get('outputLearningOutcomes'), true);
    var taskOutput = this.editorUi.formItems.msInput(null, '500px');
    taskOutput.name = 'input' + uuid;
    //taskOutput.style.width= '500px';
    taskOutputBox.appendChild(taskOutput);

    //输出是否公开
    var outputIsEssentialBox = this.addItemToTool(mxResources.get('isOutputNecessary'), true);
    var outputCheckBox = document.createElement('input');
    outputCheckBox.name = 'input' + uuid;
    outputCheckBox.type = 'checkbox';
    outputIsEssentialBox.appendChild(outputCheckBox);

    //triggers
    toolName.onchange = function () {
        while(this.parentNode.childNodes.length > 2) {
            this.parentNode.removeChild(this.parentNode.lastChild);
        }
        console.log(toolName.value);
        var children = toolTypeBox.parentNode.childNodes;
        if (children){
            for(var i = 0; i < children.length; i++){
                if (children[i].id === 'chooseQuestionFilePreview'){
                    toolTypeBox.parentNode.removeChild(children[i]);
                }
            }
        }
        while(presetInputBox.childElementCount > 2){
            presetInputBox.removeChild(presetInputBox.lastChild);
        }
        for (var k = 0; k < me.options.length; k++) {
            if (toolName.value === me.options[k].value) {
                $(presetInputCmb).empty().append("<option value=" + me.options[k].input[0].value + ">" + me.options[k].input[0].name + "</option>");
                for (var i = 1; i < me.options[k].input.length; i++) {
                    $(presetInputCmb).append("<option value=" + me.options[k].input[i].value + ">" + me.options[k].input[i].name + "</option>");
                }
                variableChooseBox.style.display = 'none';
                if(toolName.value === 'textArea') {
                    presetInputBox.style.display = 'block';
                    taskOutput.removeAttribute('disabled');
                } else if(toolName.value === 'VM'){
                    if (!me.options[1].input[0].value) {
                        presetInputCmb.parentNode.appendChild(me.editorUi.errorMsg('error_VM',mxResources.get('lFailToGetVMTypeChooseOtherToolTemporarily')));
                        presetInputCmb.className = 'waitVM';
                    }
                    presetInputBox.style.display = 'block';
                    taskOutput.setAttribute('disabled','disabled');
                } else if(toolName.value === 'choose') {
                    presetInputBox.style.display = 'none';
                    taskOutput.setAttribute('disabled','disabled');
                    if (!taskName.value){
                        me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('missingThingsName'), 'left'), 300, null, true, true);
                    } else {
                        var questionName = me.editorUi.editor.getFilename() + '_' +  taskName.value;
                        me.editorUi.showDialog(new editQuestionDialogBody('create', me.editorUi, questionName, function (id) {
                            me.questionId[uuid] = id;
                            var filePreviewLink = document.createElement('span');
                            filePreviewLink.innerHTML = mxResources.get('previewExam');
                            filePreviewLink.id = 'chooseQuestionFilePreview';
                            filePreviewLink.className = 'filePreview';
                            mxEvent.addListener(filePreviewLink,'click',mxUtils.bind(this,function(){
                                //var url = "/exam/enterExam?examId=" + me.questionId[uuid] + "&examType=preShow";
                                //window.open(url);
                                me.editorUi.showDialog(new editQuestionDialogBody('view', me.editorUi, me.questionId[uuid]), 1000, 600, true, true);
                            }));
                            toolTypeBox.appendChild(filePreviewLink);

                            var editExamLink = document.createElement('span');
                            editExamLink.innerHTML = mxResources.get('editExam');
                            editExamLink.id = 'chooseQuestionFilePreview';
                            editExamLink.className = 'filePreview';
                            editExamLink.style.display = 'none';
                            mxEvent.addListener(editExamLink,'click',mxUtils.bind(this,function(){
                                //var url = "/exam/editExam?examId=" + me.questionId[uuid];
                                //window.open(url);
                                me.editorUi.showDialog(new editQuestionDialogBody('edit', me.editorUi, me.questionId[uuid]), 1000, 600, true, true);
                            }));
                            toolTypeBox.appendChild(editExamLink);
                        }), 1000, 600, true, true);
                    }
                } else if(toolName.value === /*'board'*/'mindMap'){
                    presetInputBox.style.display = 'block';
                    taskOutput.removeAttribute('disabled');
                } else if(toolName.value === 'form'){
                    presetInputBox.style.display = 'block';
                    taskOutput.removeAttribute('disabled');
                } else if(toolName.value === 'dynamicForm'){
                    presetInputBox.style.display = 'block';
                    variableChooseBox.style.display = 'block';
                    taskOutput.removeAttribute('disabled');
                } else if(toolName.value === 'email'){
                    presetInputBox.style.display = 'block';
                    taskOutput.removeAttribute('disabled');
                } else if(toolName.value==='word' || toolName.value==='ppt' || toolName.value==='excel'){
                    presetInputBox.style.display = 'block';
                    taskOutput.removeAttribute('disabled');
                } else if(toolName.value==='comment'){
                    presetInputBox.style.display = 'none';
                    taskOutput.removeAttribute('disabled');
                }
                dataObjChooseBox.style.display = 'none';
                actionChooseBox.style.display = 'none';
            }
        }
    };
    presetInputCmb.onchange = function () {
        while(this.parentNode.childNodes.length > 2) {
            this.parentNode.removeChild(this.parentNode.lastChild);
        }
        //输入文件
        if (presetInputCmb.value === 'previous') {
            if(labelObj.length == 0){
                //alert(mxResources.get("noAvailableObject")) ;
                me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get("noAvailableObject")), 300, null, true, true);
            }else{
                dataObjChooseBox.style.display = 'block';
            }
        } else {
            dataObjChooseBox.style.display = 'none';
            actionChooseBox.style.display = 'none';
            if (presetInputCmb.value === 'DB') {
                //从数据库取
                var title = (toolName.value == 'textArea')?'manageRichTextsModel':(((toolName.value == 'form')||(toolName.value == 'dynamicForm'))?'form':'learningResSearch'),
                    lockType = (toolName.value == 'textArea' || toolName.value == 'board')?'00001':(((toolName.value == 'form')||(toolName.value == 'dynamicForm'))?'000001':'00011');
                me.editorUi.showAllLearningResource(title, '', '', false, lockType, mxUtils.bind(this, function (data) {
                    if (data){
                        var filePreviewLink = document.createElement('span');
                        filePreviewLink.innerHTML = data[0].fileName;
                        filePreviewLink.className = 'filePreview';
                        this.parentNode.appendChild(filePreviewLink);
                        //if(me.template[uuid]){
                        //    me.editorUi.communication.linkResource(false,me.template[uuid]);
                        //}
                        if((toolName.value == 'form')||(toolName.value == 'dynamicForm')){
                            //预览
                            filePreviewLink.onclick = function(){
                                this.style.color = '#551A8B';
                                var formEditDialogBody = new FormEditDialogBody(me.editorUi, data[0].fileName, data[0].formId, data[0].ownerId);
                                me.editorUi.showDialog(formEditDialogBody, 880, 650, true, true);
                            };
                            me.template[uuid] = {
                                id: data[0].formId,
                                name: data[0].fileName,
                                fileType: data[0].fileType,
                                ownerId: data[0].ownerId
                            };
                        } else {
                            PreviewFuc(me.editorUi,filePreviewLink,data[0]);
                            me.template[uuid] = {
                                id: data[0].materialsId,
                                name: data[0].fileName,
                                filePath: data[0].filePath,
                                fileType: data[0].fileType,
                                ownerId: data[0].ownerId
                            };
                            //标记资源引用
                            me.editorUi.communication.linkResource(true,data[0].materialsId);
                        }
                    } else {
                        presetInputCmb.value = 'init';
                    }
                }));
            } else if (presetInputCmb.value === 'upload') {//上传\编辑
                me.editorUi.editLearningResource('learningResEdit','','','richText', mxUtils.bind(this, function (data) {
                    if (data) {
                        var filePreviewLink = document.createElement('span');
                        filePreviewLink.innerHTML = data.fileName;
                        filePreviewLink.className = 'filePreview';
                        PreviewFuc(me.editorUi,filePreviewLink,data);
                        this.parentNode.appendChild(filePreviewLink);
                        //if(me.template[uuid]){
                        //    me.editorUi.communication.linkResource(false,me.template[uuid]);
                        //}
                        me.template[uuid]={
                            id: data.materialsId,
                            name: data.fileName,
                            filePath: data.filePath,
                            fileType: data.fileType,
                            ownerId: data.ownerId
                        };
                        ////标记资源引用
                        //me.editorUi.communication.linkResource(true,data.materialsId);
                    } else {
                        presetInputCmb.value = 'init';
                    }
                }));
            } else if (presetInputCmb.value === 'editOnline'){
                var fileNameInput = document.createElement('input');
                fileNameInput.style.marginLeft = '10px';
                fileNameInput.style.width = '100px';
                fileNameInput.placeholder= '输入文件名';
                //fileNameInput.id = 'fileNameBegin';
                var fileNameBegin = document.createElement('button');
                fileNameBegin.style.float = 'right';
                fileNameBegin.innerHTML = '生成';
                this.parentNode.appendChild(fileNameBegin);
                this.parentNode.appendChild(fileNameInput);
                fileNameBegin.onclick = function(){
                    if (toolName.value === 'word'){
                        var type = 'doc';
                        var fileSuffix = '.doc';
                    } else if (toolName.value === 'excel'){
                        var type = 'xls';
                        var fileSuffix = '.xls';
                    } else if (toolName.value === 'ppt'){
                        var type = 'ppt';
                        var fileSuffix = '.ppt';
                    }
                    var fileName = fileNameInput.value + fileSuffix;
                    //check if 安装了 page office
                    /*if(!me.PO_checkPageOffice()) {
                        var poCheck = "<span style='font-size:12px;color:red;'>请先安装<a href=\"http://newengine.xuezuowang.com/NKTOForMyDemo/MyNTKODemo/posetup.exe\" style=\"border:solid 1px #0473b3; color:#0473b3; padding:1px;\">你的浏览器没安装PageOffice客户端，请下载安装</a></span>";
                        me.editorUi.showDialog(new tipDialogBody(me.editorUi, poCheck), 300, null, true, true);
                    }*/
                    //创建

                    /*
                    var url = 'http://' + pageOfficeHost + '/NKTOForMyDemo/MyNTKODemo/CreateWord.jsp';
                    var officeId = me.editorUi.genTimeRandId();
                    var fileUrl = MATERIAL_URL.substring(7) + '/fileUpload?userId=' + userId + '&fileName=' + fileName + '&fileId=' + officeId + '&createType=own&ignoreme=';
                    fileUrl = escape(fileUrl);
                    //var path = localHost + '/office/' + userName + '/' + officeId + '/';
                    var hiddenTag = document.getElementById('hiddenTag');
                    hiddenTag.href = "PageOffice://|" + url + "?path=" + fileUrl + "&fileName=" + fileName + "&type=" + type + "&userName=" + userName;
                    */
                    var filePath = '', officeId = '';
                    $.ajax({
                        url: '/yn-engine/fileManager/fileCreate',
                        data:{userId : userId, targetName : fileName, createType : 'own'},
                        cache: false,
                        async:false,
                        type: 'POST',
                        success : function(result){
                            if(result){
                                result = JSON.parse(result);
                                console.log(result);
                                filePath = result.filePath;
                                officeId = result.fileId;
                            }
                        }
                    });
                    var url = 'http://' + pageOfficeHost + '/yn-engine/pageOffice/editFile.jsp';
                    //var officeId = me.editorUi.genTimeRandId();
                    var hiddenTag = document.getElementById('hiddenTag');
                    hiddenTag.href = "PageOffice://|" + url + "?filePath=" + filePath + "&fileName=" + fileName + "&type=" + type + "&userName=" + userName;
                    hiddenTag.click();

                    //预览 todo 测试
                    var filePreviewLink = document.createElement('a');
                    filePreviewLink.innerHTML = '点击预览文件';
                    this.parentNode.removeChild(this.parentNode.lastChild);
                    this.parentNode.appendChild(filePreviewLink);
                    this.parentNode.removeChild(this);
                    me.template[uuid]= {
                        id: officeId,
                        name: fileName,
                        filePath: null,
                        fileType: type,
                        ownerId: userId
                    };
                    me.getOfficeFilePath(me.template[uuid].id, function (res) {
                        if (res) me.template[uuid].filePath = res;
                    });
                    filePreviewLink.onclick = function () {
                        var filePath = me.template[uuid].filePath;
                        if (filePath){
                            me.template[uuid].filePath = filePath;
                            me.editorUi.showDialog(new LRShowDialogBody(me.editorUi, me.template[uuid].name, me.template[uuid].id, me.template[uuid].filePath, me.template[uuid].fileType, me.template[uuid].ownerId), 880, 650, true, true);
                        } else {
                            var isGotten = false;
                            me.getOfficeFilePath(me.template[uuid].id, function (res) {
                                isGotten = true;
                                filePath = res;
                            })
                            var count = 0;
                            var loopQuery = setInterval( function () {
                                if (isGotten){
                                    if (filePath) {
                                        me.template[uuid].filePath = filePath;
                                        me.editorUi.showDialog(new LRShowDialogBody(me.editorUi, me.template[uuid].name, me.template[uuid].id, me.template[uuid].filePath, me.template[uuid].fileType, me.template[uuid].ownerId), 880, 650, true, true);
                                    } else {
                                        me.editorUi.showDialog(new tipDialogBody(me.editorUi, '获取文件失败，若确认文件已保存，请稍后重试。'), 300, null, true, true);
                                    }
                                    clearInterval(loopQuery);
                                } else {
                                    count++;
                                    if (count==5){
                                        console.log('fail to get response in ' + count + '*500ms');
                                        var msg = '获取office文件失败，无响应，请稍后重试';
                                        me.editorUi.showDialog(new tipDialogBody(me.editorUi, msg), 300, null, true, true);
                                        clearInterval(loopQuery);
                                    }
                                }
                            }, 1000);
                        }
                        /* v2.1_170305 之前是在易编的map中检测有没有保存过，后改为向龙龙文件服务发请求检测，并获取filePath
                        if (!me.template[uuid].id){
                            var count = 0;
                            var loopQuery = setInterval(mxUtils.bind(this, function () {
                                //检查是否上传
                                $.get('/office/getSavedFileId?uuid=' + officeId, function (res) {
                                    if (res.success){
                                        console.log('get office uuid success');
                                        me.template[uuid]= {
                                            id: res.data,
                                            sourceF: '/' + fileName,
                                            ownerId: userName,
                                            name: fileName
                                        };
                                        if (filePreviewLink){
                                            filePreviewLink.innerHTML = '点击预览文件';
                                            var url = 'http://' + pageOfficeHost + '/NKTOForMyDemo/MyNTKODemo/MyFirstWordEditor.jsp';
                                            var path = localHost + '/load/loadPdfFile?source=pgofc&ownerId=' + userName + '/&path=/';
                                            path = escape(path);
                                            var permission = 'r';
                                            var hiddenTag = document.getElementById('hiddenTag');
                                            hiddenTag.href = "PageOffice://|" + url + "?path=" + path + "&fileName=" + fileName + "&permission=" + permission + "&userName=" + userName;
                                            hiddenTag.click();
                                        }

                                        clearInterval(loopQuery);
                                    } else {
                                        count++;
                                        if (count==5){
                                            console.log('fail to get office uuid in ' + count + '*500ms, maybe not saved');
                                            if (filePreviewLink){
                                                filePreviewLink.innerHTML = '点击预览文件';
                                                me.editorUi.showDialog(new tipDialogBody(me.editorUi, '获取文件失败，请保存文件后重试。'), 300, null, true, true);
                                            }
                                            clearInterval(loopQuery);
                                        }
                                    }
                                });
                            }), 1000);
                        } else {
                            filePreviewLink.innerHTML = '点击预览文件';
                            filePreviewLink.onclick = function(){
                                var url = 'http://' + pageOfficeHost + '/NKTOForMyDemo/MyNTKODemo/MyFirstWordEditor.jsp';
                                var path = localHost + '/load/loadPdfFile?source=pgofc&ownerId=' + userName + '/&path=/';
                                path = escape(path);
                                var permission = 'r';
                                var hiddenTag = document.getElementById('hiddenTag');
                                hiddenTag.href = "PageOffice://|" + url + "?path=" + path + "&fileName=" + fileName + "&permission=" + permission + "&userName=" + userName;
                                hiddenTag.click();
                            }
                        }*/
                    }
                }
            } else if (presetInputCmb.value === 'actionOutput'){
                actionChooseBox.style.display = 'block';
            }
        }
    };
    //===originalData==================
    if (wbToolData && (me.editorUi.editor.getFileType() === 'process_design') ) {
        var checkResult = this.checkWBToolData(wbToolData);
        if (!checkResult.suc) {
            var msg = '数据格式有误。请处理。<br>错误数据位置：<b>工作台</b>第<b>' + (this.indexOrder.indexOf(uuid) + 1) + '</b>个事情。';
            if (checkResult.msg) {
                msg += '<br>错误原因：' + checkResult.msg;
            }
            this.editorUi.showDialog(new tipDialogBody(this.editorUi, msg, 'left'), 300, null, true, true);
        }
        //taskName.value = wbToolData.taskName;//子任务name
        //子任务描述
        if (wbToolData.taskDescription) {
            taskDesc.value = wbToolData.taskDescription;
        }
        //工具名字
        toolName.value = wbToolData.toolType;
        if (toolName.value === 'choose') {
            if (wbToolData.input.questionId) {
                me.questionId[uuid] = wbToolData.input.questionId;
                var filePreviewLink = document.createElement('span');
                filePreviewLink.innerHTML = mxResources.get('previewExam');
                filePreviewLink.className = 'filePreview';
                mxEvent.addListener(filePreviewLink,'click',mxUtils.bind(this,function(){
                    //var url = "/exam/enterExam?examId=" + me.questionId[uuid] + "&examType=preShow";
                    //window.open(url);
                    me.editorUi.showDialog(new editQuestionDialogBody('view', me.editorUi, me.questionId[uuid]), 1000, 600, true, true);
                }));
                toolTypeBox.appendChild(filePreviewLink);
                var editExamLink = document.createElement('span');
                editExamLink.innerHTML = mxResources.get('editExam');
                editExamLink.className = 'filePreview';
                editExamLink.style.display = 'none';
                mxEvent.addListener(editExamLink,'click',mxUtils.bind(this,function(){
                    //var url = "/exam/editExam?examId=" + me.questionId[uuid];
                    //window.open(url);
                    me.editorUi.showDialog(new editQuestionDialogBody('edit', me.editorUi, me.questionId[uuid]), 1000, 600, true, true);
                }));
                toolTypeBox.appendChild(editExamLink);
            } else {
                toolName.value = null;
            }
        }
        //预设内容
        if (wbToolData && wbToolData.input) {
            for (var k = 0; k < this.options.length; k++) {
                if (this.options[k].value === wbToolData.toolType) {
                    $(presetInputCmb).empty().append("<option value=" + this.options[k].input[0].value + ">" + this.options[k].input[0].name + "</option>");
                    for (var j = 1; j < this.options[k].input.length; j++) {
                        $(presetInputCmb).append("<option value=" + this.options[k].input[j].value + ">" + this.options[k].input[j].name + "</option>");
                    }
                    if (wbToolData.toolType === 'textArea' || wbToolData.toolType === 'mindMap' || wbToolData.toolType === 'form' || wbToolData.toolType === 'dynamicForm' || wbToolData.toolType === 'email') {
                        presetInputCmb.value = wbToolData.input.inputWay;
                        if (wbToolData.input.inputWay === 'previous') {
                            dataObjChooseBox.style.display = 'block';
                            cellLabel.value = wbToolData.input.inputFileInfo.inputFileId;
                        } else if (wbToolData.input.inputWay === 'DB' || wbToolData.input.inputWay === 'upload') {
                            if (wbToolData.input.template) {
                                me.template[uuid] = wbToolData.input.template;
                                var filePreviewLink = document.createElement('span');
                                filePreviewLink.className = 'filePreview';
                                if ((wbToolData.toolType === 'form') || (wbToolData.toolType === 'dynamicForm')){
                                    filePreviewLink.innerHTML = mxResources.get('editSelectedTemplate');
                                    filePreviewLink.onclick = function(){
                                        this.style.color = '#551A8B';
                                        var formEditDialogBody = new FormEditDialogBody(me.editorUi, me.template[uuid].name, me.template[uuid].id, me.template[uuid].ownerId);
                                        me.editorUi.showDialog(formEditDialogBody, 880, 650, true, true);
                                    };
                                } else {
                                    filePreviewLink.innerHTML = mxResources.get('selectedTemplate');
                                    PreviewFuc(me.editorUi, filePreviewLink, {
                                        id: me.template[uuid].id,
                                        name: me.template[uuid].name,
                                        filePath: me.template[uuid].filePath,
                                        fileType: me.template[uuid].fileType,
                                        ownerId: me.template[uuid].ownerId
                                    });
                                }
                                presetInputCmb.parentNode.appendChild(filePreviewLink);
                            } else {
                                presetInputCmb.value = 'init';
                            }
                        } else if (wbToolData.input.inputWay === 'actionOutput') {
                            actionChooseBox.style.display = 'block';
                        }
                        if (wbToolData.toolType === 'dynamicForm'){
                            variableChooseBox.style.display = 'block';
                        }
                    } else if (wbToolData.toolType === 'VM') {
                        if (!this.options[1].input[0].value) {
                            presetInputCmb.parentNode.appendChild(this.editorUi.errorMsg('error_VM',mxResources.get('lFailToGetVMTypeChooseOtherToolTemporarily')));
                            presetInputCmb.className = 'waitVM';
                            presetInputCmb.VMId = wbToolData.input.VMId;
                        }
                        presetInputCmb.value = wbToolData.input.VMId;
                    } else if (wbToolData.toolType === 'word' || wbToolData.toolType === 'excel' || wbToolData.toolType === 'ppt'){
                        presetInputCmb.value = wbToolData.input.inputWay;
                        if(wbToolData.input.inputWay === 'editOnline' || wbToolData.input.inputWay === 'DB'){
                            if (wbToolData.input.template) {
                                me.template[uuid] = wbToolData.input.template;
                                //预览
                                var filePreviewLink = document.createElement('a');
                                //filePreviewLink.href = '';
                                filePreviewLink.innerHTML = '预览文件';
                                PreviewFuc(me.editorUi,filePreviewLink,me.template[uuid]);
                                /*filePreviewLink.onclick = function(){
                                    var url = 'http://' + pageOfficeHost + '/NKTOForMyDemo/MyNTKODemo/MyFirstWordEditor.jsp';
                                    var path = localHost + '/load/loadPdfFile?source=pgofc&ownerId=' + me.template.ownerId + '/&path=/';
                                    path = escape(path);
                                    var fileName = me.template[uuid].name;
                                    var permission = 'r';
                                    var hiddenTag = document.getElementById('hiddenTag');
                                    hiddenTag.href = "PageOffice://|" + url + "?path=" + path + "&fileName=" + fileName + "&permission=" + permission + "&userName=" + userName;
                                    hiddenTag.click();
                                };*/
                                presetInputCmb.parentNode.appendChild(filePreviewLink);
                            } else {
                                presetInputCmb.value = 'init';
                            }
                        } else if (wbToolData.input.inputWay === 'actionOutput') {
                            presetInputCmb.value = wbToolData.input.inputWay;
                            actionChooseBox.style.display = 'block';
                        }else if (wbToolData.input.inputWay === 'DB') {
                            if (wbToolData.input.template) {
                                me.template[uuid] = wbToolData.input.template;
                            } else {
                                presetInputCmb.value = 'init';
                            }
                        }
                    }else {
                        presetInputBox.style.display = 'none';
                    }
                }
            }
        }
        //输出文件的命名
        if (wbToolData.output.name) {
            taskOutput.value = wbToolData.output.name;
        }
        if (wbToolData.toolType === 'VM' || wbToolData.toolType === 'choose') {
            taskOutput.setAttribute('disabled', 'disabled');
        }
        //输出是否公开
        if (wbToolData.output && wbToolData.output.requirement) {
            outputCheckBox.checked = true;
        }
        //角色的回显在ui处

        //this.fireEvent(new mxEventObject('onRendered'), {innerHeight: this.height});
    }
    return this.oneToolDiv;
};
WorkbenchDiv.prototype.getOfficeFilePath = function (id, next) {
    var paramObj = {
        fileId: id
    };
    this.editorUi.communication.getOfficeFilePath(paramObj, function(resData){
        if (resData) {
            next(resData.filePath);
        } else {
            next(0);
        }
    })
};
WorkbenchDiv.prototype.getRolePool = function () {
    var roleLabel;
    if(this.cell.parent.getAttribute('type')=='bpmn.participant.pool') {
        roleLabel = this.cell.parent.getAttribute('label');
    } else if (this.cell.parent.getAttribute('type')=="bpmn.subprocess.ectask"){
        if (this.cell.parent.parent.getAttribute('type')=='bpmn.participant.pool'){
            roleLabel = this.cell.parent.parent.getAttribute('label');
        } else {
            return;
        }
    } else {
        return;
    }
    var rolePool = roleLabel.split('+');
    if (rolePool.length > 1){
        for (var i =0; i<rolePool.length; i++){
            rolePool[i]={id:rolePool[i], name:rolePool[i]};
        }
        return rolePool;
    } else {}
};
WorkbenchDiv.prototype.getOutputMaterials = function (wbToolData) {
    var options = [{text:'请选择', value: ''}];//即使是写null，option会变成字符串null
    var cellArray = this.editorUi.editor.graph.findAllCellsUndParent();
    for (var i = 0; i < cellArray.length; i++){
        if (cellArray[i].value && (cellArray[i].getAttribute('type')=="bpmn.task.user") && cellArray[i].getAttribute('workbench')) {
            var workbenchData = JSON.parse(cellArray[i].getAttribute('workbench'));
            if (workbenchData && workbenchData.output && workbenchData.output.requirement){
                var option = {
                    "value": cellArray[i].id/*workbenchData.taskId*/,
                    "text": cellArray[i].getAttribute('label')
                };
                if (wbToolData && wbToolData.materialSource && wbToolData.materialSource.actionId === cellArray[i].id/*workbenchData.taskId*/){
                    option['selected'] = true;
                }
                options.push(option);
            }
        }
    }
    return options;
};
WorkbenchDiv.prototype.makeMaterialBox = function (wbToolData, uuid, radioName) {
    var me = this;
    var options = this.getOutputMaterials(wbToolData);
    /*for (var i = 0; i < this.indexOrder.length; i++){
        if (this.indexOrder[i] === uuid){
            //得到了i
            for (var j = 0; j < i; j++){
                var option = {"value": this.indexOrder[j]};
                if(wbToolData){
                    option['text'] = this.originalData[j].taskName;
                    if (wbToolData.materialSource && wbToolData.materialSource.actionId === this.indexOrder[j]){
                        option['selected'] = true;
                    }
                } else if (document.getElementsByName('input' + this.indexOrder[j]).length){
                    option['text'] = document.getElementsByName('input' + this.indexOrder[j])[0].value;
                } else {
                    //该index对应task已删除
                    continue;
                }
                options.push(option);
            }
            break;
        }
    }*/
    var materialSelect = this.editorUi.formItems.msSelect(options);
    var materialSelectDiv = materialSelect.getContainer();
    materialSelectDiv.name = 'select' + uuid;
    /*materialSelectDiv.onclick = function () {
        var currentValue = this.value;
        var currentIndex = me.indexOrder.indexOf(uuid);
        this.options.length = 1;
        for (var j = 0; j < currentIndex; j++ ){
            if (document.getElementsByName('input' + me.indexOrder[j]).length){
                var option = new Option();
                option.text = document.getElementsByName('input' + me.indexOrder[j])[0].value;
                option.value = me.indexOrder[j];
                this.add(option);
            }
        }
        this.value = currentValue;
    };*/

    //阅读材料来源范围（来源于自己的行动输出还是小组的）
    var sourceRange = this.addItemToTool('', true);
    sourceRange.setAttribute('style','display: inline-flex;line-height: 20px;vertical-align: middle;margin: -10px 0;');
    var options = [{name:'自己',value:'self'},{name:'小组',value:'group'}];
    var defaultValue = 'self';
    if (wbToolData && wbToolData.materialSource && wbToolData.materialSource.materialMaker){
        defaultValue = wbToolData.materialSource.materialMaker;
    }
    var sourceRangeForm = document.createElement('form');
    var sourceRangeRadio = this.editorUi.formItems.genRadioField('', radioName + uuid, options,defaultValue);
    var sourceRangeBox = sourceRangeRadio.getElContainer();
    sourceRangeForm.appendChild(sourceRangeBox);
    sourceRange.appendChild(sourceRangeForm);
    sourceRange.removeChild(sourceRange.firstChild);

    return {materialSelectDiv:materialSelectDiv,sourceRange:sourceRange};
};
WorkbenchDiv.prototype.addItemToTool = function (title, isInline, isSubItem, itemType) {
    var itemBox = document.createElement('div');
    itemBox.style.marginLeft = '10px';
    if (!isSubItem) {
        itemBox.style.padding = '5px 0';
    }
    var text = document.createElement('span');
    text.innerHTML = title + '：';
    text.className = 'explanationText';
    if (!isInline) {
        text.style.display = 'block';
    }
    itemBox.appendChild(text);
    if (!isSubItem){
        this.oneToolDiv.appendChild(itemBox);
    }
    return itemBox;
};
WorkbenchDiv.prototype.PO_checkPageOffice = function(){
    var bodyHtml = document.body.innerHTML;
    if (bodyHtml.indexOf("EC852C85-C2FC-4c86-8D6B-E4E97C92F821") < 0) {
        var poObjectStr = "";
        var explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            poObjectStr = "<div style=\"background-color:green;width:1px; height:1px;\">" + "\r\n"
                + "<object id=\"PageOfficeCtrl1\" height=\"100%\" width=\"100%\" classid=\"clsid:EC852C85-C2FC-4c86-8D6B-E4E97C92F821\">"
                + "</object></div>"
        }
        else {
            poObjectStr = "<div style=\"background-color:green;width:1px; height:1px;\">" + "\r\n"
                + "<object id=\"PageOfficeCtrl1\" height=\"100%\" width=\"100%\" type=\"application/x-pageoffice-plugin\" clsid=\"{EC852C85-C2FC-4c86-8D6B-E4E97C92F821}\">"
                + "</object></div>"
        }

        $(document.body).append(poObjectStr);
    }

    try {
        var sCap = document.getElementById("PageOfficeCtrl1").id;
        if (sCap == null) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (e) { return false; }
}
WorkbenchDiv.prototype.moveUp = function(index,taskId,swap){
    var me = this;
    return function(evt){
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
        if(this.parentNode.parentNode.previousSibling===null){
            me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('unableToMoveUp')), 300, null, true, true);
        }else{
            this.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode,this.parentNode.parentNode.previousSibling);
            var count = index.indexOf(taskId);
            index = swap(index,taskId, index[count-1]);
        }
    };
};
WorkbenchDiv.prototype.moveDown = function(index,taskId,swap){
    var me = this;
    return function(evt){
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
        if(this.parentNode.parentNode.nextSibling===null){
            me.editorUi.showDialog(new tipDialogBody(me.editorUi, mxResources.get('unableToMoveDown')), 300, null, true, true);
        }else{
            this.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode.nextSibling,this.parentNode.parentNode);
            var count = index.indexOf(taskId);
            index = swap(index,taskId,index[count+1]);
        }
    };
};
WorkbenchDiv.prototype.getContainer = function () {
    return this.container;
};
var PropertyDialogBody = function (ui, cell, title, userData, extData) {
    this.id = extData.id;
    if (cell.getAttribute('type')=='bpmn.subprocess.ectask'){
        cell.tag = 'sub_task';
    }
    var me = this;
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','padding: 0px;');
    var inputFieldCmpLink = ui.formItems.genLinkInputFile(this,mxResources.get('link'), 'link', cell, '100%');
    if (cell.tag ==='sub_task'){
        //基本信息
        var basicInfo = new BasicInfoDIv(ui, cell);
        var basicInfoDIv = basicInfo.getContainer();
        // end 基本信息
        //相关知识 fanmiaomiao todo
        var relatedInfoDiv = this.makeKnowledgeBox(ui, cell);
        //end 相关知识
        //相关技能
        var skillDiv = this.makeSkillBox(ui, cell);
        //end相关技能
        // 学习情景 begin
        var originalSitu;
        if(cell.getAttribute('studySituation')){
            originalSitu = cell.getAttribute('studySituation');
        }
        var learningEnvir = new LearningEnvir(ui,cell,'learningResSearch',originalSitu);
        var learningDiv = learningEnvir.getContainer();
        //学习情景 end
    } else {
        // workbench
        var workbenchDiv = this.makeWorkbenchBox(ui, cell);
        //end workbench
        //结束条件
        var endCondition = new EndConditionDIv(ui, cell);
        var endConditionDiv = endCondition.getContainer();
        //end结束条件
        //评分
        var scorePoint = new ScorePointDiv(ui, cell);
        var scorePointDiv = scorePoint.getContainer();
        //end评分
    }
    if (fileType === 'ople_design' || fileType === 'ople2_design'){
        // todo OPLE basicInfo tab
        var OPLEBasicInfo = document.createElement('div');
        var courseTitleBox = document.createElement('div');
        courseTitleBox.setAttribute('style','margin:20px 0 10px 10px');
        var courseTitleText = document.createElement('div');
        courseTitleText.setAttribute('style','margin:10px 0 10px');
        courseTitleText.innerHTML = mxResources.get('courseTitle')+'：';
        var courseTitleInput = document.createElement('input');
        courseTitleInput.placeholder = '本课程的概括';
        courseTitleInput.setAttribute('style','padding-left:5px;width: 98%;height:25px;line-height: 1.42857143;border: 1px solid #ccc;box-shadow: inset 0 1px 1px rgba(0,0,0,.075)');
        courseTitleBox.appendChild(courseTitleText);
        courseTitleBox.appendChild(courseTitleInput);
        var courseContentBox = document.createElement('div');
        courseContentBox.setAttribute('style','margin:20px 0 10px 10px');
        var courseContentText = document.createElement('div');
        courseContentText.setAttribute('style','margin:10px 0 10px');
        courseContentText.innerHTML = '详细描述：';
        //todo showdown textarea
        var courseContentTextarea = document.createElement('div');
        var courseContentObj = new showdownContainer(ui,courseContentTextarea,'对该课程的详细介绍');
        var courseContent = courseContentObj.getContainer();
        courseContentBox.appendChild(courseContentText);
        courseContentBox.appendChild(courseContent);

        var projectModelZip = document.createElement('div');
        projectModelZip.setAttribute('style','margin:20px 0 10px 10px');
        var projectModelZipText = document.createElement('span');
        projectModelZipText.innerHTML = '练习项目：';
        var projectModelZipNameInput = document.createElement('span');
        projectModelZipNameInput.innerHTML = '课程开发者上传用于学习的项目压缩文件';
        projectModelZipNameInput.setAttribute('style','color:#8e8e8e');
        var deleteModelZip = document.createElement('span');  //delete uploaded zip files tag
        deleteModelZip.innerHTML = 'X';
        deleteModelZip.setAttribute('style','margin-left:30px;cursor:pointer');
        deleteModelZip.onclick = function(){
            // todo delete files on server
            var queryObj = {
                id : projectModelZipNameInput.id
            };
            ui.communication.deleteUploadFile(queryObj,mxUtils.bind(this,function(message){
                if(message){
                    var childNodes = projectModelZip.childNodes;
                    while(childNodes.length > 3){
                        projectModelZip.removeChild(projectModelZip.lastChild);
                    }
                    projectModelZipNameInput.innerHTML = '课程开发者上传用于学习的项目压缩文件';
                    console.log('delete zip success');
                }
            }));
        };
        var tutorialZip = null,resultZip = null;
        var uploadProjectModelZipBtn = mxUtils.button(mxResources.get('upload'),function(evt){
            ui.showDialog(new UploadModelFileDialogBody(ui, mxResources.get('uploadFile'),null,function(data){
                tutorialZip = data;
                projectModelZipNameInput.innerHTML = data.fileName;
                projectModelZipNameInput.id = data.materialsId;
                projectModelZipNameInput.setAttribute('style','color:#0f0f0f;margin:10px auto');
                projectModelZip.appendChild(deleteModelZip);
            }),500,null,null,true);
            console.log('upload zip file success');
        });
        uploadProjectModelZipBtn.setAttribute('style','margin:0 10px 10px 10px');
        projectModelZip.appendChild(projectModelZipText);
        projectModelZip.appendChild(uploadProjectModelZipBtn);
        projectModelZip.appendChild(projectModelZipNameInput);

        var projectResultZip = document.createElement('div');
        projectResultZip.setAttribute('style','margin:20px 0 10px 10px');
        var projectResultZipText = document.createElement('span');
        projectResultZipText.innerHTML = '目标参考答案：';
        var uploadProjectResultZipInput = document.createElement('span');
        uploadProjectResultZipInput.innerHTML = '课程开发者上传该活动的标准答案';
        uploadProjectResultZipInput.setAttribute('style','color:#8e8e8e');
        var deleteResultZip = document.createElement('span');  //delete uploaded zip files tag
        deleteResultZip.innerHTML = 'X';
        deleteResultZip.setAttribute('style','margin-left:30px;cursor:pointer');
        deleteResultZip.onclick = function(){
            // todo delete files on server
            var queryObj = {
                id : uploadProjectResultZipInput.id
            };
            ui.communication.deleteUploadFile(queryObj,mxUtils.bind(this,function(message){
                if(message){
                    var childNodes = projectResultZip.childNodes;
                    while(childNodes.length > 3){
                        projectResultZip.removeChild(projectResultZip.lastChild);
                    }
                    uploadProjectResultZipInput.innerHTML = '课程开发者上传该活动的标准答案';
                    console.log('delete zip success');
                }
            }));
        };
        var uploadProjectResultZipBtn = mxUtils.button(mxResources.get('upload'),function(evt){
            ui.showDialog(new UploadModelFileDialogBody(ui,mxResources.get('uploadFile'),null,function(data){
                console.log(data);
                resultZip = data;
                uploadProjectResultZipInput.innerHTML = data.fileName;
                uploadProjectResultZipInput.id = data.materialsId;
                uploadProjectResultZipInput.setAttribute('style','color:#0f0f0f');
                projectResultZip.appendChild(deleteResultZip);
            }),500,null,null,true);
            console.log('upload zip file success');
        });
        uploadProjectResultZipBtn.setAttribute('style','margin:0 10px 10px 10px');
        projectResultZip.appendChild(projectResultZipText);
        projectResultZip.appendChild(uploadProjectResultZipBtn);
        projectResultZip.appendChild(uploadProjectResultZipInput);
        OPLEBasicInfo.appendChild(courseTitleBox);
        OPLEBasicInfo.appendChild(courseContentBox);
        OPLEBasicInfo.appendChild(projectModelZip);
        OPLEBasicInfo.appendChild(projectResultZip);

        //todo apply OPLE meta-info data
        var OPLEDetailDescDiv = courseContentObj.getEditTextarea();
        var applyTheTab_OPLEMetaInfo = mxUtils.bind(this, function () {
            var processTitle = courseTitleInput.value;
            var processDetailDesc = OPLEDetailDescDiv.value;
            if((tutorialZip === null || tutorialZip === '')&&(cell.getAttribute('tutorialZip'))){
                tutorialZip = JSON.parse(cell.getAttribute('tutorialZip'));
            }
            if((resultZip === null || resultZip === '')&&(cell.getAttribute('resultZip'))){
                resultZip = JSON.parse(cell.getAttribute('resultZip'));
            }
            if((processTitle === null) && (processTitle === '') && (processDetailDesc === null ) && (processDetailDesc === '') && (tutorialZip === null) && (resultZip === null)){

            }else {
                //var marked = new marked();
                var html = marked(processDetailDesc);
                processDetailDesc = html;
                cell.setAttribute('processTitle', processTitle);
                cell.setAttribute('processDetailDesc', processDetailDesc);
                cell.setAttribute('tutorialZip', JSON.stringify(tutorialZip));
                cell.setAttribute('resultZip', JSON.stringify(resultZip));
                console.log('save ople meta-info success');
            }
        });
        //OPLE meta-info 数据回显
        //if (cell.getAttribute('processTitle')) {
        courseTitleInput.value = cell.getAttribute('processTitle')?cell.getAttribute('processTitle'):'';
        OPLEDetailDescDiv.value = cell.getAttribute('processDetailDesc')?cell.getAttribute('processDetailDesc'):'';
        projectModelZipNameInput.innerHTML = ((cell.getAttribute('tutorialZip')!= null)&&((cell.getAttribute('tutorialZip') != 'null')))?JSON.parse(cell.getAttribute('tutorialZip')).fileName:'课程开发者上传用于学习的项目压缩文件';
        uploadProjectResultZipInput.innerHTML = ((cell.getAttribute('resultZip') != null)&&((cell.getAttribute('resultZip') != 'null')))?JSON.parse(cell.getAttribute('resultZip')).fileName:'课程开发者上传该活动的标准答案';
        //}
        //ople guiline tab

        var opleFirstLevelContainter = new OpleBasicInfoContainer(ui,cell);
        var opleSecondLevelContainter = new OpleBasicInfoContainer(ui,cell);
        var opleFirstLevel = (opleFirstLevelContainter).getOPLEEditPanel(ui,cell,'first'); //难度层级一
        var opleSecondLevel = (opleSecondLevelContainter).getOPLEEditPanel(ui,cell,'second'); //难度层级二
        //ople课程信息数据回显
        if (cell.getAttribute('opleCourseInfo')) {
            var opleCourseInfo = JSON.parse(cell.getAttribute('opleCourseInfo'));
            //难度层级一
            opleFirstLevelContainter.getCourseTitleInput().value = opleCourseInfo.opleFirstLevelInfo.courseTitle?opleCourseInfo.opleFirstLevelInfo.courseTitle:'';
            opleFirstLevelContainter.getCouurseDetailDesc().value = opleCourseInfo.opleFirstLevelInfo.courseDetailDesc?opleCourseInfo.opleFirstLevelInfo.courseDetailDesc:'';
            opleFirstLevelContainter.getProjectModelZipNameInput().innerHTML = opleCourseInfo.opleFirstLevelInfo.tutorialZip?opleCourseInfo.opleFirstLevelInfo.tutorialZip.fileName:'';
            opleFirstLevelContainter.getProjectResultZipInput().innerHTML = opleCourseInfo.opleFirstLevelInfo.resultZip?opleCourseInfo.opleFirstLevelInfo.resultZip.fileName:'';
            //难度层级二
            opleSecondLevelContainter.getCourseTitleInput().value = opleCourseInfo.opleSecondLevelInfo.courseTitle?opleCourseInfo.opleSecondLevelInfo.courseTitle:'';
            opleSecondLevelContainter.getCourseTitleInput().value = opleCourseInfo.opleSecondLevelInfo.courseDetailDesc? opleCourseInfo.opleSecondLevelInfo.courseDetailDesc:'';
            opleSecondLevelContainter.getProjectModelZipNameInput.innerHTML = opleCourseInfo.opleSecondLevelInfo.tutorialZip?opleCourseInfo.opleSecondLevelInfo.tutorialZip.fileName:'';
            opleSecondLevelContainter.getProjectResultZipInput.innerHTML = opleCourseInfo.opleSecondLevelInfo.resultZip?opleCourseInfo.opleSecondLevelInfo.resultZip.fileName:'';
        }

    }

    var tabInfos = [];
    var knowledgPoint = document.createElement('div');
    var fileType = ui.editor.getFileType();
    if(mxUi === 'subject_design'){
        tabInfos = [{
            tab: mxResources.get('chapterDescr'),
            contentDiv: basicInfoDIv,
            panel:[{type:'div', div:basicInfoDIv}]
        },{
            tab:mxResources.get('knowledgPoint'),
            panel:[{type:'div', div:workbenchDiv}]
        }];
    } else {
        //todo OPLE tabs
        if(fileType === 'ople_design'){
            tabInfos = [{
                tab: mxResources.get('basicInfo'),
                contentDiv: OPLEBasicInfo,
                panel:[{type:'div', div:OPLEBasicInfo}]
            },{
                tab:mxResources.get('learningGuide'),
                panel:[{type:'div', div:workbenchDiv}]
            }];
        }else if(fileType === 'ople2_design'){
            tabInfos = [{
                    tab: '难度级别一',
                    contentDiv: opleFirstLevel,
                    panel:[{type:'div', div:opleFirstLevel}]
                },{
                    tab: '难度级别二',
                    panel:[{type:'div', div:opleSecondLevel}]
                }];
        }else{
            if (cell.tag ==='sub_task'){
                tabInfos =[
                    {
                        tab: mxResources.get('basicInfo'),
                        contentDiv: basicInfoDIv,
                        panel:[{type:'div', div:basicInfoDIv}]
                    }, {
                        tab:mxResources.get('relatedInfo'),//相关知识 -> 理论知识
                        contentDiv: relatedInfoDiv,
                        panel:[{type:'div', div:relatedInfoDiv}]
                    },{
                        tab:mxResources.get('relatedSkill'),//相关技能 -> 实践技能
                        contentDiv: skillDiv,
                        panel:[{type:'div', div:skillDiv}]
                    },{
                        tab:mxResources.get('learningEnvir'),//学习情境 -> 学习场景
                        contentDiv: learningDiv,
                        panel:[{type:'div', div:learningDiv}]
                    }
                ];
            } else {
                tabInfos =[
                    {
                        tab:mxResources.get('workbench'),//工作台 -> 行动设计
                        contentDiv: workbenchDiv,
                        panel:[{type:'div', div:workbenchDiv}]
                    },{
                        tab:mxResources.get('endCondition'),
                        contentDiv: endConditionDiv,
                        panel:[{type:'div', div:endConditionDiv}]
                    },{
                        tab:'设置评分点',
                        contentDiv: scorePointDiv,
                        panel:[{type:'div', div:scorePointDiv}]
                    }
                ];
            }

        }
    }
    var tabPage = ui.formItems.genTabPage(tabInfos, 1);
    form.appendChild(tabPage.getElContainer());

    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    cancelBtn.style.float = 'right';
    var applyBtn = mxUtils.button(mxResources.get('apply'), function (evt) {
        if(ui.editor.getFileType() === 'ople_design'){
            applyTheTab_OPLEMetaInfo();
            me.workbench.applyTheTab();
            ui.editor.setModified(true);
            console.log('save all infos success');
        }else if(ui.editor.getFileType() === 'ople2_design'){
            console.log('todo save ople2_design');
            var opleCourseInfo = {
                opleFirstLevelInfo : opleFirstLevelContainter.getAllCourseInfo(),
                opleSecondLevelInfo : opleSecondLevelContainter.getAllCourseInfo()
            };

            cell.setAttribute('opleCourseInfo',JSON.stringify(opleCourseInfo));

        }else{
            if (cell.tag ==='sub_task'){
                basicInfo.applyTheTab();
                me.applyTheTab_knowledge(null);
                me.applyTheTab_skill(null);
                learningEnvir.applyTheTab();
                //applyTheTab_control();
            }else {
                me.workbench.applyTheTab();
                endCondition.applyTheTab();
                scorePoint.applyTheTab();
            }
            msgLine.appendChild(ui.tipMsg('tips_success',mxResources.get('saveLearningActivitySuccessfully'),true));
            ui.editor.setModified(true);
        }
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    applyBtn.id = 'propertyApplyBtn';
    var msgLine = document.createElement('div');
    msgLine.setAttribute('style', 'width: 500px; text-align: left; line-height: 29px;');
    var btnsArea = document.createElement('div');
    btnsArea.className = 'btnsArea';
    btnsArea.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5; overflow: auto;');
    btnsArea.appendChild(cancelBtn);
    btnsArea.appendChild(applyBtn);
    btnsArea.appendChild(msgLine);
    div.appendChild(form);
    div.appendChild(btnsArea);
    this.addListener('onRendered', function () {
        if (cell.tag !=='sub_task'){
            me.workbench.fireRenderedEvent();
            endCondition.fireRenderedEvent();
        }
    })
};
mxUtils.extend(PropertyDialogBody, DialogBody);
PropertyDialogBody.prototype.makeKnowledgeBox = function (ui, cell) {
    var me = this;
    me.relatedKnowledgeDiv = [];
    var relatedKnowledgeContainer = document.createElement('div');
    var originalKnowleg;
    if(cell.getAttribute('knowledge')) {
        originalKnowleg = cell.getAttribute('knowledge');
    }
    var relatedKnowledge = new RelatedKnowledge(ui, cell, 'learningResSearch', originalKnowleg);
    me.relatedKnowledgeDiv = relatedKnowledge.getContainer();
    relatedKnowledgeContainer.appendChild(me.relatedKnowledgeDiv);
    var relatedInfoDiv = document.createElement('div');
    relatedInfoDiv.appendChild(relatedKnowledgeContainer);
    this.applyTheTab_knowledge = function (evt) {
        ui.formItems.updateCell(evt, ui.editor.graph, cell, 'knowledge', resources, function (resources) {
            var applyData = {};
            var applyDatas = [];

            for(var i = 0;i< relatedKnowledge.knowledgeName.length; i++){
                if(relatedKnowledge.knowledgeName[i]!== null){
                    var linkArr = [];
                    if (resources['resourceList'+i]) {
                        for (var j=0; j<resources['resourceList'+i].length; j++) {
                            linkArr[j] = resources['resourceList'+i][j] ;
                        }
                    }
                    var role;
                    if (relatedKnowledge.setRole[i]) {
                        role = relatedKnowledge.setRole[i].getInputField();
                    } else {
                        //if (cell.parent.id == 1){
                        //    ui.showDialog(new tipDialogBody(ui, '错误：未检测到上层泳道。是否未将任务放至泳道/泳池中。'), 300, null, true, true);
                        //} else {
                        //    role = [{"name":cell.parent.getAttribute('label'),"id":cell.parent.getAttribute('label')}]
                        //}
                    }
                    applyData = {
                        "topic": relatedKnowledge.knowledgeName[i],
                        "role": role,
                        "link": linkArr
                    };
                    applyDatas.push(applyData);
                }
            }
            cell.setAttribute('knowledge', JSON.stringify(applyDatas));
            //发送del
            ui.communication.handleLinkResourceList();
            //ui.editor.setModified(true);
            console.log('2相关知识保存成功');
        });
    };
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:0px;');
    relatedInfoDiv.appendChild(buttons);
    return relatedInfoDiv;
};
PropertyDialogBody.prototype.makeSkillBox = function (ui, cell) {
    var me = this;
    me.relatedSkillDiv = [];
    var relatedSkillContainer = document.createElement('div');
    var originalSkill;
    if(cell.getAttribute('skill')){
        originalSkill = cell.getAttribute('skill');
    };
    var relateSkill = new RelateSkill(ui, cell, 'learningResSearch',originalSkill);
    me.relatedSkillDiv = relateSkill.getContainer();
    relatedSkillContainer.appendChild(me.relatedSkillDiv);
    var skillDiv = document.createElement('div');
    skillDiv.appendChild(relatedSkillContainer);
    this.applyTheTab_skill = function (evt) {
        ui.formItems.updateCell(evt, ui.editor.graph, cell, 'skill', resources2, function (resources2) {
            //console.log(resources2);
            var applyData = {};
            var applyDatas = [];
            for(var i = 0;i< relateSkill.skillName.length; i++){
                if(relateSkill.skillName[i]!== null) {
                    var linkArr = [];
                    if (resources2['resourceList' + i]) {
                        for (var j = 0; j < resources2['resourceList' + i].length; j++) {
                            linkArr[j] = resources2['resourceList' + i][j];
                        }
                    }
                    var sKillRole;
                    if (relateSkill.setRole[i]) {
                        sKillRole = relateSkill.setRole[i].getInputField();
                    } else {
                        //if (cell.parent.id == 1){
                        //    ui.showDialog(new tipDialogBody(ui, '错误：未检测到上层泳道。是否未将任务放至泳道/泳池中。'), 300, null, true, true);
                        //} else {
                        //    sKillRole = [{"name":cell.parent.getAttribute('label'),"id":cell.parent.getAttribute('label')}]
                        //}
                    }
                    applyData = {
                        "topic": relateSkill.skillName[i],
                        "role": sKillRole,
                        "link": linkArr
                    };
                    applyDatas.push(applyData);
                }
            }
            cell.setAttribute('skill', JSON.stringify(applyDatas));
            //发送del
            ui.communication.handleLinkResourceList();
            //ui.editor.setModified(true);
            console.log('3相关技能保存成功');
        });
    };
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:0px;');
    skillDiv.appendChild(buttons);
    return skillDiv;
};
PropertyDialogBody.prototype.makeWorkbenchBox = function (ui, cell) {
    this.workbench = new WorkbenchDiv(ui, cell);
    var workbenchDiv = this.workbench.getContainer();
    //get name and value of VMInput from TongKui
    ui.communication.getVMTypes(mxUtils.bind(this, function (VMDatas) {
        if(VMDatas){
            for (var i = 0; i < VMDatas.length; i++){
                //var VMData = {
                //    name: VMDatas[i].value.$value,
                //    value: VMDatas[i].key
                //};
                //VMTypes[i] = VMData;
                this.workbench.options[1].input[i] = VMDatas[i];
            }
            var waitVMDoms = document.getElementsByClassName('waitVM');
            for (var i =0; i< waitVMDoms.length;i++){
                waitVMDoms[i].parentNode.removeChild(waitVMDoms[i].parentNode.lastChild);
                $(waitVMDoms[i]).empty().append("<option value=" + this.workbench.options[1].input[0].value + ">" + this.workbench.options[1].input[0].name + "</option>");
                for (var j = 1; j < this.workbench.options[1].input.length; j++) {
                    $(waitVMDoms[i]).append("<option value=" + this.workbench.options[1].input[j].value + ">" + this.workbench.options[1].input[j].name + "</option>");
                }
                waitVMDoms[i].value = waitVMDoms[i].VMId;
            }
        } else {
            //alert(mxResources.get('workbenchFailToGetVMType'));
            ui.showDialog(new tipDialogBody(ui, mxResources.get('workbenchFailToGetVMType')), 300, null, true, true);
        }
    }));
    return workbenchDiv;
};
/*
 return a div for simple edit
 */
var showdownContainer = function (ui,boxDiv,string) {
    var me = this;
    boxDiv.setAttribute('style','margin-top:10px;width:98%;border: 2px solid #ddd;');
    var editDiv = document.createElement('div');
    editDiv.setAttribute('style','width:100%;height:200px;border: 2px solid #ddd;');
    var editToolbar = document.createElement('div');
    editToolbar.setAttribute('style', 'width:inherit;height:30px;background-color:#f5f5f5');
    var header3Span = document.createElement('span');
    header3Span.innerHTML = 'h3';
    header3Span.title = '三级标题';
    header3Span.setAttribute('style','margin-left:15px;cursor:pointer;height:13px');
    var header4Span = document.createElement('span');
    header4Span.innerHTML = 'h4';
    header4Span.title = '四级标题';
    header4Span.setAttribute('style','margin-left:15px;cursor:pointer;height:13px');
    var boldSpan = document.createElement('img');
    boldSpan.src = 'images/editTool/bold.png';
    boldSpan.title = '加粗';
    boldSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:20px');
    var italicSpan = document.createElement('img');
    italicSpan.src = 'images/editTool/italic.png';
    italicSpan.title = '斜体';
    italicSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:20px');
    var quoteSpan = document.createElement('img');
    quoteSpan.src = 'images/editTool/quote.png';
    quoteSpan.title = '引用';
    quoteSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:20px');
    var codeSpan = document.createElement('span');
    codeSpan.innerHTML = '<>';
    codeSpan.title = '代码';
    codeSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:13px');
    var linkSpan = document.createElement('img');
    linkSpan.src = 'images/editTool/link.jpg';
    linkSpan.title = '链接';
    linkSpan.setAttribute('style','margin-left:15px;;cursor:pointer;height:13px');
    var orderListSpan = document.createElement('img');
    orderListSpan.src = 'images/editTool/order.png';
    orderListSpan.title = '有序列表';
    orderListSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:20px');
    var unorderListSpan = document.createElement('img');
    unorderListSpan.src = 'images/editTool/unorder.png';
    unorderListSpan.title = '无序列表';
    unorderListSpan.setAttribute('style','margin:5px 10px auto;cursor:pointer;height:20px');
    var underlineSpan = document.createElement('img');
    underlineSpan.src = 'images/editTool/underline.png';
    underlineSpan.title = '下划线';
    underlineSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:20px');
    var imgSpan = document.createElement('img');
    imgSpan.src = 'images/editTool/img.png';
    imgSpan.title = '图片';
    imgSpan.multiple = 'multiple';
    imgSpan.setAttribute('style','margin-left:15px;cursor:pointer;height:20px');
    editToolbar.appendChild(header3Span);
    editToolbar.appendChild(header4Span);
    editToolbar.appendChild(boldSpan);
    editToolbar.appendChild(italicSpan);
    editToolbar.appendChild(quoteSpan);
    editToolbar.appendChild(codeSpan);
    editToolbar.appendChild(linkSpan);
    editToolbar.appendChild(orderListSpan);
    editToolbar.appendChild(unorderListSpan);
    editToolbar.appendChild(underlineSpan);
    editToolbar.appendChild(imgSpan);
    editDiv.appendChild(editToolbar);
    this.editTextarea = document.createElement('textarea');
    this.editTextarea.id = 'editTextarea';
    this.editTextarea.placeholder = string;
    this.editTextarea.setAttribute('style', 'resize:none;font-size:1.2em；resize:none;padding-left:10px;width:98%;height:80%;line-height: 1.42857143;border: 1px solid #cccbox-shadow: inset 0 1px 1px rgba(0,0,0,.075)');
    editDiv.appendChild(this.editTextarea);
    var previewDiv = document.createElement('div');
    previewDiv.id = 'preview';
    previewDiv.setAttribute('style', 'width:100%;height:200px;border: 1px solid #ddd;overflow:auto');
    var tabs = document.createElement('div');
    tabs.setAttribute('style','margin-top:7px');
    var spans = document.createElement('div');
    spans.setAttribute('style','width:inherit;height:22px');
    var editSpan = document.createElement('label');
    editSpan.innerHTML = '编辑';
    editSpan.setAttribute('style','color: #428bca;font-size:1.2em;cursor: pointer;color: #42454a; background-color: #dedbde; border: 1px solid #c9c3ba; border-bottom: none; padding: 0.3em; text-decoration: none;');
    var previewSpan = document.createElement('label');
    previewSpan.innerHTML = '预览';
    previewSpan.setAttribute('style','font-size:1.2em;color: #555;cursor: pointer;color: #42454a; background-color: #F5F5F5; border: 1px solid #c9c3ba; border-bottom: none; padding: 0.3em; text-decoration: none;');
    spans.appendChild(editSpan);
    spans.appendChild(previewSpan);
    tabs.appendChild(spans);
    boxDiv.appendChild(tabs);
    tabs.appendChild(editDiv);

    this.initEditTag();
    function getScroll(editTextarea){
        var t, l, w, h;
        if (me.editTextarea && $(me.editTextarea).scrollTop()) {
            t = editTextarea.scrollTop;
            l = editTextarea.scrollLeft;
            w = editTextarea.scrollWidth;
            h = editTextarea.scrollHeight;
        }
        return { t: t, l: l, w: w, h: h };
    }
    function setScroll(position,element){
        element.scrollTop = position.t;
        element.scrollLeft = position.l;
        element.scrollWidth = position.w;
        element.scrollHeight = position.h;
    }
    var cursorPostion = 0;
    $(me.editTextarea).on('propertyChange input',function(){
        cursorPostion = $(me.editTextarea).iGetFieldPos();
        //textareaValue = me.editTextarea.value;
    });
    // onclick 事件
    var scrollEditPosition = {
        t : 0,
        l : 0,
        w : 0,
        h : 0
    };
    var scrollPreviewPosition = {
        t : 0,
        l : 0,
        w : 0,
        h : 0
    };
    $(me.editTextarea).scroll( function() {
        scrollEditPosition = getScroll(me.editTextarea);
        scrollPreviewPosition = getScroll(me.editTextarea);
    });
    previewSpan.onclick = mxUtils.bind(this,function(){
        editSpan.style.backgroundColor = '#f5f5f5';
        previewSpan.style.backgroundColor = '#dedbde';
        var tabsChildsNodes = tabs.childNodes;
        while(tabsChildsNodes.length > 1){
            tabs.removeChild(tabs.lastChild);
            tabsChildsNodes = tabs.childNodes;
        }
        tabs.appendChild(previewDiv);
        //var marked = new marked();
        var html = marked(this.editTextarea.value);
        previewDiv.innerHTML = html;
        setScroll(scrollPreviewPosition,previewDiv);
        cursorPostion = $(me.editTextarea).iGetFieldPos();
    });
    editSpan.onclick = mxUtils.bind(this,function(){
        editSpan.style.backgroundColor = '#dedbde';
        previewSpan.style.backgroundColor = '#f5f5f5';
        var tabsChildsNodes = tabs.childNodes;
        while(tabsChildsNodes.length > 1){
            tabs.removeChild(tabs.lastChild);
            tabsChildsNodes = tabs.childNodes;
        }
        tabs.appendChild(editDiv);
        setScroll(scrollEditPosition,me.editTextarea);
        $(me.editTextarea).iSelectField(cursorPostion?cursorPostion:$(me.editTextarea).val.length);
    });

    header3Span.onclick = mxUtils.bind(this,function(){
        var currentCursorPostion = $(me.editTextarea).iGetFieldPos();
        if(currentCursorPostion === cursorPostion){
            me.tagArr.header3EditTag = !me.tagArr.header3EditTag;
        }
        this.clickEventToggle(this.tagArr.header3EditTag,this.editTextarea,'###三级标题',3,7);
        cursorPostion = currentCursorPostion;
    });
    header4Span.onclick = mxUtils.bind(this,function(){
        this.tagArr.header4EditTag = !this.tagArr.header4EditTag;
        this.clickEventToggle(this.tagArr.header4EditTag,this.editTextarea,'####四级标题',4,8);

    });
    boldSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.boldEditTag,this.editTextarea,'**加粗文字**',2,6);
        if( this.tagArr.boldEditTag === false){
            $(this.editTextarea).iDelField(-2);
        }
        this.tagArr.boldEditTag = !this.tagArr.boldEditTag;
    });
    italicSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.italicEditTag,this.editTextarea,'_斜体文字_',1,5);
        if( this.tagArr.italicEditTag === false){
            $(this.editTextarea).iDelField(-1);
        }
        this.tagArr.italicEditTag = !this.tagArr.italicEditTag;
    });
    quoteSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.quoteEditTag,this.editTextarea,'>引用',1,3);
        this.tagArr.quoteEditTag = !this.tagArr.quoteEditTag;
    });
    codeSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.codeEditTag,this.editTextarea,'<pre><code>代码段</code></pre>',11,14);
        if( this.tagArr.codeEditTag === false){
            $(this.editTextarea).iDelField(-13);
        }
        this.tagArr.codeEditTag = !this.tagArr.codeEditTag;
    });
    linkSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.linkEditTag,this.editTextarea,'[连接文字](url)',1,5);
        if( this.tagArr.linkEditTag === false){
            $(this.editTextarea).iDelField(-6);
        }
        this.tagArr.linkEditTag = !this.tagArr.linkEditTag;
    });
    orderListSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.orderListEditTag,this.editTextarea,'1.'+' '+'有序列表一',3,8);
        this.tagArr.orderListEditTag = !this.tagArr.orderListEditTag;
    });
    unorderListSpan.onclick = mxUtils.bind(this,function(){
        this.tagArr.unorderListEditTag = !this.tagArr.unorderListEditTag;
        this.clickEventToggle(this.tagArr.unorderListEditTag,this.editTextarea,'-'+' '+'无序列表一',2,7);
    });
    underlineSpan.onclick = mxUtils.bind(this,function(){
        this.clickEventToggle(this.tagArr.underlineEditTag,this.editTextarea,'<u>下划线</u>',3,6);
        if( this.tagArr.underlineEditTag === false){
            $(this.editTextarea).iDelField(-4);
        }
        this.tagArr.underlineEditTag = !this.tagArr.underlineEditTag;
    });
    imgSpan.onclick = mxUtils.bind(this,function(){
        ui.showDialog(new uploadImgDialogbody(ui,mxResources.get('uploadImage'),mxUtils.bind(this,function(data){
            if(data){
                var imgSrc = imageServerHost + data.sourceF;
                me.clickEventToggle(me.tagArr.imageEditTag,me.editTextarea,'![插入图片描述]('+imgSrc+')',2,8);
            }
        })),500,null,null,true);
    });
    this.container = boxDiv;
    //enter keycode
    //document.onkeydown = mxUtils.bind(this,function(e){
    //    var keycode = document.all?event.keyCode:e.which;
    //    if(keycode == 13){
    //        this.setCursorPosition(this.editTextarea,'<br>',4);
    //    }
    //});
};
/**
 * 返回编辑器的div
 * @returns {*}
 */
showdownContainer.prototype.getContainer = function(){
    return this.container;
};
/**
 * 返回文本域对象
 * @returns {Element|*}
 */
showdownContainer.prototype.getEditTextarea = function(){
    return this.editTextarea;
};
/**
 * 初始化点击事件的标签值
 */
showdownContainer.prototype.initEditTag = function(){
    this.tagArr = {
        header3EditTag:true,
        header4EditTag:true,
        boldEditTag:true,
        italicEditTag:true,
        quoteEditTag:true,
        codeEditTag:true,
        linkEditTag:true,
        orderListEditTag:true,
        unorderListEditTag:true,
        underlineEditTag:true,
        imageEditTag : true
    };
};
/**
 * 点击事件
 * @param editTag
 * @param textareaObj
 * @param insertStr
 * @param posStart
 * @param posEnd
 */
showdownContainer.prototype.clickEventToggle = function(editTag,textareaObj,insertStr,posStart,posEnd){
    if(textareaObj.value === '' || textareaObj.value.trim() === ''){
     this.initEditTag();
        editTag = true;
    }
    var pos = $(textareaObj).iGetFieldPos();
    if(editTag){
        $(textareaObj).iAddField(insertStr);
        $(textareaObj).iSelectField(pos+posStart,pos+posEnd);
    }else{
        $(textareaObj).iDelField(posStart-posEnd);
        $(textareaObj).iDelField(posStart);
    }
};
/**
 * upload images for users
 * @param ui
 * @param title
 * @param callback
 */
var uploadImgDialogbody = function(ui,title,callback){
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','height: 100%; padding: 15px;');

    //var imgSizeDiv = document.createElement('div');
    //imgSizeDiv.setAttribute('style','margin:10px 0');
    //var imgSizeText = document.createElement('span');
    //imgSizeText.innerHTML = '图片尺寸：';
    //var imgSizeInput = document.createElement('input');
    //imgSizeInput.setAttribute('style','width:350px;height:25px;padding-left:10px');
    //imgSizeInput.type = 'text';
    //imgSizeInput.placeholder = '图片裁剪尺寸属性：宽m高(例如125m125)';
    //imgSizeDiv.appendChild(imgSizeText);
    //imgSizeDiv.appendChild(imgSizeInput);

    var chooseImgForm = document.createElement('form');
    chooseImgForm.enctype = 'multipart/form-data';
    chooseImgForm.method = 'post';
    var chooseImgText = document.createElement('span');
    chooseImgText.innerHTML = '上传图片：';
    var chooseImgInput = document.createElement('input');
    chooseImgInput.type = 'file';
    chooseImgInput.accept = 'image/*';
    chooseImgForm.appendChild(chooseImgText);
    chooseImgForm.appendChild(chooseImgInput);
    var uploadTip = document.createElement('div');
    uploadTip.setAttribute('style','margin:15px 0;color:#7f7f7f');
    uploadTip.innerHTML = '注：1.图片大小不能超过5M；2.支持上传格式：jpg、png、gif、bmp。';
    var previewImgDiv = document.createElement('div');//预览图片div
    previewImgDiv.setAttribute('style','max-width:500px;max-height:500px;overflow:auto');
    var imgDiv = document.createElement('img');
    previewImgDiv.appendChild(imgDiv);
    //form.appendChild(imgSizeDiv);
    form.appendChild(chooseImgForm);
    form.appendChild(uploadTip);
    form.appendChild(previewImgDiv);

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
        if (callback) {
            callback();
        }
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = document.createElement('button');
    applyBtn.className = 'geBtn gePrimaryBtn';
    applyBtn.disabled = true;
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);
    applyBtn.innerHTML=mxResources.get('ok');

    mxEvent.addListener(chooseImgInput, 'change', mxUtils.bind(this, function () {
        var files = chooseImgInput.files;
        if(files.length > 0){
            var fileName = files[0].name;
            var is = fileName.lastIndexOf('.');
            if(is == -1) {
                //alert(mxResources.get('incorrectMaterialFormat'));
                ui.showDialog(new tipDialogBody(ui, mxResources.get('incorrectMaterialFormat')), 300, null, true, true);
                return false;
            }else{
                //过滤文件类型
                var testFileType = fileName.substring(is+1);
                if((testFileType === 'png') || (testFileType === 'jpg') || (testFileType === 'gif') || (testFileType === 'bmp')) {
                    //chooseImgInput.value = fileName;
                    var files = chooseImgInput.files;
                    if(files.length > 0) {
                        var imgObj = files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(imgObj);
                        reader.onload = function () {
                            imgDiv.src = this.result;
                            imgDiv.setAttribute('style', 'max-width:500px;max-height:500px;overflow:auto');
                        };
                        applyBtn.disabled = false;
                    }else{
                        alert(' no image');
                    }
                    applyBtn.disabled = false;
                }else{
                    alert('抱歉，系统暂不支持'+testFileType+'格式的资料，您可以转换为其他格式再上传~');
                    return false;
                }
            }
        }else{
            applyBtn.disabled = true;
        }
    }));

    applyBtn.onclick = mxUtils.bind(this,function(){
        var files = chooseImgInput.files;
        var formData = new FormData();
        var resultFile = {};
        if(files.length > 0){
            var imgObj = files[0];
            formData.append('imageSizes','125m125');
            formData.append('file1',imgObj);
            var xhr = new XMLHttpRequest();
            xhr.open('post',imageServerHost+'ImageHandler',true);
            var result;
            xhr.onload = function(e){
                if(this.status == 200){
                    result = this.response;
                    if(result === 'error'){
                        ui.showDialog(new tipDialogBody(ui, 'edit error'), 300, null, true, true);
                    }
                    var  res = JSON.parse(result);
                    res.originalName = imgObj.name;
                    res.fileType = res.fileType;
                    //resultFile = {
                    //    materialsId :   res.materialsId,
                    //    filePath : res.sourceF
                    //};
                    //ui.communication.saveUploadFile(res, mxUtils.bind(this, function (message) {
                    //    ui.showDialog(new tipDialogBody(ui, mxResources.get('editSuccessfully')), 300, null, true, true);
                    //    ui.hideDialog();
                    //    console.log(message);
                    //}));
                    callback(res);
                }
                ui.hideDialog();
            };
            xhr.send(formData);
        }else{
            alert('未选择图片！');
        }
    });
};

mxUtils.extend(uploadImgDialogbody, DialogBody);
/**
 * constructs a new dialog for choosing true or false
 */
var trueOrFalseDialogBody = function (editorUi, message, next) {
    DialogBody.call(this, '');
    var container = this.getBodyContainer();
    var options = [
        {name:mxResources.get('true'), value:true},
        {name:mxResources.get('false'), value:false}
    ];
    var trueOrFalseRadio = editorUi.formItems.genRadioField(message,'radio',options);
    var trueOrFalseRadioBody = trueOrFalseRadio.getElContainer();
    trueOrFalseRadioBody.style.margin = '20px 80px';
    container.appendChild(trueOrFalseRadioBody);
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('align', 'right');
    btnDiv.setAttribute('style', 'margin: 5px 10px; overflow: hidden;');

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    var applyBtn = mxUtils.button(mxResources.get('ok'), function (evt) {
        editorUi.hideDialog();
        var handler = editorUi.formItems.submitForm(evt, editorUi.editor.graph, 'radio', options);
        next(handler.value);
    });
    applyBtn.className = 'geBtn gePrimaryBtn';

    btnDiv.appendChild(cancelBtn);
    btnDiv.appendChild(applyBtn);
    container.appendChild(btnDiv);
    this.container = container;
};
mxUtils.extend(trueOrFalseDialogBody, DialogBody);
/**
 * constructs a new dialog for choosing condition
 */
//var conditionDiv = function (editorUi,cell,div){
//
//};
var ConditionDialogBody = function(editorUi,cell,title) {

    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    // div.setAttribute('style','height: 500px; width:355px;');
    //conditionDiv(editorUi,cell,div);
    var form = document.createElement('div');
    //form.setAttribute('style','height: 500px; width:355px;');
    var basic = document.createElement('div');
    basic.id = 'builder-basic';
    div.appendChild(form);
    form.appendChild(basic);
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('align', 'right');
    btnDiv.setAttribute('style', 'margin: 5px 10px; overflow: hidden;');

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        var data = getJsonData();
        cell['condition'] = data;
        console.log(cell.condition);
        if (cell.condition == undefined) {
            //mxUtils.confirm(mxResources.get('pleaseChooseCondition'));
            var message = mxResources.get('pleaseChooseCondition');
            var tipDialog = new tipDialogBody(editorUi,message);
            editorUi.showDialog(tipDialog, 300, null, true, true);
        }
        else{
            editorUi.hideDialog();
        }
    });
    okBtn.className = 'geBtn gePrimaryBtn';
    btnDiv.appendChild(cancelBtn);
    btnDiv.appendChild(okBtn);
    form.appendChild(btnDiv);
    this.div = div;

    /*this.addListener('onRendered',mxUtils.bind(this,function(){

     initData();
     }));*/
    this.addListener('onRendered', mxUtils.bind(this, function () {
        //console.log(cell.source.edges);
        var connections = cell.source.edges;
        var incommingConnection;
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].condition === undefined) {
                incommingConnection = connections[i];
                break;
            }
        }
        //console.log(incommingConnection);
        var lastCellAttributes = incommingConnection.source.value.attributes;
        initData(lastCellAttributes);
    }));

    var initData = function (lastCellAttributes) {
        var fileId = editorUi.editor.getFileId();
        console.log(fileId);
        var condition = [];
        editorUi.communication.getAllLane(fileId, function (data) {
            data.splice(0, 0, '--');
            console.log(data);

            if (lastCellAttributes.type.value === 'bpmn.gateway.general.start') {
                condition=[];
                condition.push({
                    id: 'role',
                    label: 'Role',
                    type: 'integer',
                    input: 'select',
                    values: data,
                    operators: ['equal']
                });
            }
            $('#builder-basic').queryBuilder({
                plugins: ['bt-tooltip-errors'],
                conditions: ['AND'],
                filters: condition
                //rules: rules_basic
            });
        });
        if(lastCellAttributes.workbench){
            //console.log(lastCellAttributes);
            var workbench=JSON.parse(lastCellAttributes.workbench.value);
            //console.log(workbench);
            for(var i=0;i<workbench.length;i++){
                var output=workbench[i].output;
                if(output.value){
                    var temp={
                        //id: output.value,
                        id:'workbench['+i+'].output.value',
                        label: workbench[i].taskName,
                        type: 'string',
                        operators: ['equal']
                    };
                }

                condition.push(temp);
            }
            //return inputData;
        };
        //设置初始值
        /*var rules_basic = {
         // condition: 'AND',
         /!*rules: [{
         id: 'role',
         operator: 'equal',
         value: '1'
         }]*!/
         };*/
        if (lastCellAttributes.type.value === 'bpmn.gateway.general.start') {

        } else {
            $('#builder-basic').queryBuilder({
                plugins: ['bt-tooltip-errors'],
                conditions: ['AND'],
                filters: condition
                //rules: rules_basic
            });
        }

    };
    var getJsonData = function () {
        var result = $('#builder-basic').queryBuilder('getRules');
        var fileId = editorUi.editor.getFileId();
        editorUi.communication.getAllLane(fileId, function (data) {
            for( var i = 0; i < result.rules.length; i++) {
                for( var j = 0; j < data.length; j++) {
                    if (result.rules[i].value == j) {
                        result.rules[i].value = data[j];
                    }else {
                        break;
                    }
                }
            }

        });

        var res = JSON.stringify(result, null, 2);
        var myData = JSON.parse(res, function (key, value) {
            return key.indexOf('date') >= 0 ? new Date(value) : value;
        });
        //console.log(myData);
        if (!$.isEmptyObject(result)) {
            var inputData = JSON.stringify(result, null, 2);
            // console.log(inputData);
        }
        return inputData;
    };

};
mxUtils.extend(ConditionDialogBody, DialogBody);

/**
 * Constructs a new link dialog.
 */
var LinkDialog = function (editorUi, initialValue, btnLabel, fn) {
    DialogBody.call(this,'');
    var div = this.getBodyContainer();;
    mxUtils.write(div, mxResources.get('editLink') + ':');

    var inner = document.createElement('div');
    inner.className = 'geTitle';
    inner.style.backgroundColor = 'transparent';
    inner.style.borderColor = 'transparent';
    inner.style.whiteSpace = 'nowrap';
    inner.style.textOverflow = 'clip';
    inner.style.cursor = 'default';

    if (!mxClient.IS_VML) {
        inner.style.paddingRight = '20px';
    }

    var linkInput = document.createElement('input');
    linkInput.setAttribute('value', initialValue);
    linkInput.setAttribute('placeholder', 'http://www.example.com/');
    linkInput.setAttribute('type', 'text');
    linkInput.style.marginTop = '6px';
    linkInput.style.width = '300px';
    linkInput.style.backgroundImage = 'url(' + IMAGE_PATH + '/clear.gif)';
    linkInput.style.backgroundRepeat = 'no-repeat';
    linkInput.style.backgroundPosition = '100% 50%';
    linkInput.style.paddingRight = '14px';

    var cross = document.createElement('div');
    cross.setAttribute('title', mxResources.get('reset'));
    cross.style.position = 'relative';
    cross.style.left = '-16px';
    cross.style.width = '12px';
    cross.style.height = '14px';
    cross.style.cursor = 'pointer';

    // Workaround for inline-block not supported in IE
    cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
    cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';

    // Needed to block event transparency in IE
    cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

    mxEvent.addListener(cross, 'click', function () {
        linkInput.value = '';
        linkInput.focus();
    });

    inner.appendChild(linkInput);
    inner.appendChild(cross);
    div.appendChild(inner);

    this.init = function () {
        linkInput.focus();

        if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS) {
            linkInput.select();
        }
        else {
            document.execCommand('selectAll', false, null);
        }
    };

    var btns = document.createElement('div');
    btns.style.marginTop = '18px';
    btns.style.textAlign = 'right';

    mxEvent.addListener(linkInput, 'keypress', function (e) {
        if (e.keyCode == 13) {
            editorUi.hideDialog();
            fn(linkInput.value);
        }
    });

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst) {
        btns.appendChild(cancelBtn);
    }

    var mainBtn = mxUtils.button(btnLabel, function () {
        editorUi.hideDialog();
        fn(linkInput.value);
    });
    mainBtn.className = 'geBtn gePrimaryBtn';
    btns.appendChild(mainBtn);

    if (!editorUi.editor.cancelFirst) {
        btns.appendChild(cancelBtn);
    }

    div.appendChild(btns);
};
mxUtils.extend(LinkDialog, DialogBody);
/**
 *  描述学习过程  by fannmiaomiao
 */

var DescribeEditDialogBody = function(ui, cell, title){
    DialogBody.call(this,title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');

    var inputFieldCmpDescription = ui.formItems.genTextareaInputFieldPro(this, mxResources.get('description'), 'description', cell, '102%');
    form.appendChild(inputFieldCmpDescription.getElContainer());

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';

    var applyBtn = mxUtils.button(mxResources.get('apply'), function (evt) {
        ui.formItems.updateCell(evt, ui.editor.graph, cell, 'description', inputFieldCmpDescription.getInputValue());
        ui.editor.setModified(true);
        ui.hideDialog.apply(ui, arguments);
    });

    applyBtn.className = 'geBtn gePrimaryBtn';
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    div.appendChild(form);
    div.appendChild(buttons);

};
mxUtils.extend(DescribeEditDialogBody, DialogBody);

/**
 *
 */
var OutlineWindow = function (editorUi, x, y, w, h) {
    var graph = editorUi.editor.graph;

    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.border = '1px solid whiteSmoke';
    div.style.overflow = 'hidden';

    this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
    this.window.destroyOnClose = false;
    this.window.setMaximizable(false);
    this.window.setResizable(true);
    this.window.setClosable(true);
    this.window.setVisible(true);

    this.window.setLocation = function (x, y) {
        x = Math.max(0, x);
        y = Math.max(0, y);
        mxWindow.prototype.setLocation.apply(this, arguments);
    };

    mxEvent.addListener(window, 'resize', mxUtils.bind(this, function () {
        var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var x = this.window.getX();
        var y = this.window.getY();

        if (x + this.window.table.clientWidth > iw) {
            x = Math.max(0, iw - this.window.table.clientWidth);
        }

        if (y + this.window.table.clientHeight > ih) {
            y = Math.max(0, ih - this.window.table.clientHeight);
        }

        if (this.window.getX() != x || this.window.getY() != y) {
            this.window.setLocation(x, y);
        }
    }));

    var outline = editorUi.createOutline(this.window);

    this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, function () {
        outline.update(false);
        outline.outline.sizeDidChange();
    }));

    this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function () {
        outline.suspended = false;
        outline.outline.refresh();
        outline.update();
    }));

    this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function () {
        outline.suspended = true;
    }));

    this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function () {
        outline.suspended = false;
        outline.update();
    }));

    this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function () {
        outline.suspended = true;
    }));

    var outlineCreateGraph = outline.createGraph;
    outline.createGraph = function (container) {
        var g = outlineCreateGraph.apply(this, arguments);
        g.gridEnabled = false;
        g.pageScale = graph.pageScale;
        g.pageFormat = graph.pageFormat;
        g.background = graph.background;
        g.pageVisible = graph.pageVisible;

        var current = mxUtils.getCurrentStyle(graph.container);
        div.style.backgroundColor = current.backgroundColor;

        return g;
    };

    function update() {
        outline.outline.pageScale = graph.pageScale;
        outline.outline.pageFormat = graph.pageFormat;
        outline.outline.pageVisible = graph.pageVisible;
        outline.outline.background = graph.background;

        var current = mxUtils.getCurrentStyle(graph.container);
        div.style.backgroundColor = current.backgroundColor;

        if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null) {
            outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
        }

        outline.outline.refresh();
    };

    outline.init(div);

    editorUi.editor.addListener('resetGraphView', update);
    editorUi.addListener('pageFormatChanged', update);
    editorUi.addListener('backgroundColorChanged', update);
    editorUi.addListener('backgroundImageChanged', update);
    editorUi.addListener('pageViewChanged', function () {
        update();
        outline.update(true);
    });

    if (outline.outline.dialect == mxConstants.DIALECT_SVG) {
        var zoomInAction = editorUi.actions.get('zoomIn');
        var zoomOutAction = editorUi.actions.get('zoomOut');

        mxEvent.addMouseWheelListener(function (evt, up) {
            var outlineWheel = false;
            var source = mxEvent.getSource(evt);

            while (source != null) {
                if (source == outline.outline.view.canvas.ownerSVGElement) {
                    outlineWheel = true;
                    break;
                }

                source = source.parentNode;
            }

            if (outlineWheel) {
                if (up) {
                    zoomInAction.funct();
                }
                else {
                    zoomOutAction.funct();
                }

                mxEvent.consume(evt);
            }
        });
    }
};


/**
 *
 */
var LayersWindow = function (editorUi, x, y, w, h) {
    var graph = editorUi.editor.graph;

    var div = document.createElement('div');
    div.style.background = 'whiteSmoke';
    div.style.border = '1px solid whiteSmoke';
    div.style.height = '100%';
    div.style.marginBottom = '10px';
    div.style.overflow = 'auto';

    function refresh() {
        var layerCount = graph.model.getChildCount(graph.model.root);
        var selectionLayer = null;
        div.innerHTML = '';

        function addLayer(index, label, child, defaultParent) {
            var ldiv = document.createElement('div');

            ldiv.style.overflow = 'hidden';
            ldiv.style.position = 'relative';
            ldiv.style.padding = '4px';
            ldiv.style.height = '22px';
            ldiv.style.display = 'block';
            ldiv.style.cursor = 'pointer';
            ldiv.style.backgroundColor = '#e5e5e5';
            ldiv.style.borderWidth = '0px 0px 1px 0px';
            ldiv.style.borderColor = '#c3c3c3';
            ldiv.style.borderStyle = 'solid';
            ldiv.style.whiteSpace = 'nowrap';

            var left = document.createElement('div');
            left.style.display = 'inline-block';
            left.style.overflow = 'hidden';

            var inp = document.createElement('input');
            inp.setAttribute('type', 'checkbox');
            inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
            inp.style.marginRight = '4px';
            inp.style.marginTop = '4px';
            left.appendChild(inp);

            inp.value = graph.model.isVisible(child);

            if (graph.model.isVisible(child)) {
                inp.setAttribute('checked', 'checked');
                inp.defaultChecked = true;
            }
            else {
                ldiv.style.color = 'gray';
            }

            if (mxClient.IS_SVG) {
                mxEvent.addListener(inp, 'change', function (evt) {
                    if (graph.isEnabled()) {
                        graph.model.setVisible(child, !graph.model.isVisible(child));
                    }
                });

                if (!mxClient.IS_FF) {
                    mxEvent.addListener(inp, 'click', function (evt) {
                        mxEvent.consume(evt);
                    });
                }
            }
            else {
                mxEvent.addListener(inp, 'click', function (evt) {
                    if (graph.isEnabled()) {
                        graph.model.setVisible(child, !graph.model.isVisible(child));
                    }
                });
            }

            mxUtils.write(left, label);
            ldiv.appendChild(left);

            var right = document.createElement('div');
            right.style.display = 'inline-block';
            right.style.textAlign = 'right';
            right.style.whiteSpace = 'nowrap';

            if (mxClient.IS_QUIRKS) {
                ldiv.style.height = '34px';
            }

            ldiv.className = (mxClient.IS_QUIRKS) ? '' : 'geToolbarContainer';
            ;
            right.style.position = 'absolute';
            right.style.right = '6px';
            right.style.top = '6px';

            // Poor man's change layer order
            if (index > 1) {
                var img2 = document.createElement('a');

                img2.setAttribute('title', mxResources.get('toBack'));

                img2.className = 'geButton';
                img2.style.cssFloat = 'none';
                img2.innerHTML = '&#9650;';
                img2.style.width = '14px';
                img2.style.height = '14px';
                img2.style.fontSize = '14px';
                img2.style.margin = '0px';
                img2.style.marginTop = '-1px';
                right.appendChild(img2);

                mxEvent.addListener(img2, 'click', function (evt) {
                    if (graph.isEnabled()) {
                        graph.addCell(child, graph.model.root, index - 1);
                    }

                    mxEvent.consume(evt);
                });
            }

            if (index > 0 && index < layerCount - 1) {
                var img1 = document.createElement('a');

                img1.setAttribute('title', mxResources.get('toFront'));

                img1.className = 'geButton';
                img1.style.cssFloat = 'none';
                img1.innerHTML = '&#9660;';
                img1.style.width = '14px';
                img1.style.height = '14px';
                img1.style.fontSize = '14px';
                img1.style.margin = '0px';
                img1.style.marginTop = '-1px';
                right.appendChild(img1);

                mxEvent.addListener(img1, 'click', function (evt) {
                    if (graph.isEnabled()) {
                        graph.addCell(child, graph.model.root, index + 1);
                    }

                    mxEvent.consume(evt);
                });
            }

            if (index > 0) {
                var img = document.createElement('a');
                img.className = 'geButton';
                img.style.cssFloat = 'none';
                img.innerHTML = 'X';
                img.setAttribute('title', mxResources.get('delete'));
                img.style.margin = '0px';
                img.style.marginTop = '-2px';
                img.style.width = '14px';
                img.style.height = '14px';
                img.style.fontSize = '14px';
                right.appendChild(img);

                mxEvent.addListener(img, 'click', function (evt) {
                    if (graph.isEnabled()) {
                        editorUi.confirm(mxResources.get('removeIt', [child.value]) + '?', function () {
                            graph.model.beginUpdate();

                            try {
                                graph.removeCells([child]);
                                graph.setDefaultParent(null);
                            }
                            finally {
                                graph.model.endUpdate();
                            }
                        });
                    }

                    mxEvent.consume(evt);
                });
            }

            ldiv.appendChild(right);
            div.appendChild(ldiv);

            mxEvent.addListener(ldiv, 'dblclick', function (evt) {
                if (graph.isEnabled()) {
                    var dlg = new FilenameDialogBody2(editorUi, child.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function (newValue) {
                        if (newValue != null) {
                            graph.getModel().setValue(child, newValue);
                        }
                    }), mxResources.get('enterName'));
                    editorUi.showDialog(dlg, 300, 80, true, true);
                    dlg.init();
                }

                mxEvent.consume(evt);
            });

            if (graph.getDefaultParent() == child) {
                ldiv.style.background = '#e6eff8';
                selectionLayer = child;
            }
            else {
                mxEvent.addListener(ldiv, 'click', function (evt) {
                    if (graph.isEnabled()) {
                        graph.setDefaultParent(defaultParent);
                        graph.view.setCurrentRoot(null);
                        refresh();
                    }
                });
            }
        };

        // Cannot be moved or deleted
        var defaultLayer = graph.model.getChildAt(graph.model.root, 0);
        addLayer(0, defaultLayer.value || mxResources.get('background'), defaultLayer, null);

        for (var i = 1; i < layerCount; i++) {
            (mxUtils.bind(this, function (child) {
                addLayer(i, child.value, child, child);
            }))(graph.model.getChildAt(graph.model.root, i));
        }

        if (selectionLayer != null) {
            var ldiv = document.createElement('div');

            ldiv.className = (mxClient.IS_QUIRKS) ? '' : 'geToolbarContainer';
            ldiv.style.display = 'block';
            ldiv.style.position = 'relative';
            ldiv.style.overflow = 'hidden';
            ldiv.style.paddingTop = '7px';
            ldiv.style.display = 'block';
            ldiv.style.whiteSpace = 'nowrap';

            if (mxClient.IS_QUIRKS) {
                ldiv.style.filter = 'none';
            }

            var link = document.createElement('a');
            mxUtils.write(link, mxResources.get('moveSelectionTo', [selectionLayer.value || mxResources.get('background')]));
            link.style.marginTop = '-2px';
            link.className = 'geLabel';
            link.style.cursor = 'pointer';

            mxEvent.addListener(link, 'click', function (evt) {
                if (graph.isEnabled()) {
                    graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer);
                }

                mxEvent.consume(evt);
            });

            ldiv.appendChild(link);
            div.appendChild(ldiv);
        }

        var ldiv = document.createElement('div');

        ldiv.className = (mxClient.IS_QUIRKS) ? '' : 'geToolbarContainer';
        ldiv.style.display = 'block';
        ldiv.style.position = 'relative';
        ldiv.style.overflow = 'hidden';
        ldiv.style.paddingTop = '7px';
        ldiv.style.display = 'block';
        ldiv.style.whiteSpace = 'nowrap';

        var link = document.createElement('a');
        mxUtils.write(link, mxResources.get('addLayer'));
        link.style.marginTop = '-2px';
        link.className = 'geLabel';
        link.style.cursor = 'pointer';

        mxEvent.addListener(link, 'click', function (evt) {
            if (graph.isEnabled()) {
                var dlg = new FilenameDialogBody2(editorUi, mxResources.get('layer') + ' ' + layerCount, mxResources.get('create'), mxUtils.bind(this, function (newValue) {
                    if (newValue != null && newValue.length > 0) {
                        graph.model.beginUpdate();

                        try {
                            var cell = graph.addCell(new mxCell(newValue), graph.model.root);
                            graph.setDefaultParent(cell);
                        }
                        finally {
                            graph.model.endUpdate();
                        }
                    }
                }), mxResources.get('enterName'));
                editorUi.showDialog(dlg, 300, 80, true, true);
                dlg.init();
            }

            mxEvent.consume(evt);
        });

        ldiv.appendChild(link);
        div.appendChild(ldiv);
    };

    refresh();
    graph.model.addListener(mxEvent.CHANGE, function () {
        refresh();
    });

    this.window = new mxWindow(mxResources.get('layers'), div, x, y, w, h, true, true);
    this.window.destroyOnClose = false;
    this.window.setMaximizable(false);
    this.window.setResizable(true);
    this.window.setClosable(true);
    this.window.setVisible(true);

    this.window.setLocation = function (x, y) {
        x = Math.max(0, x);
        y = Math.max(0, y);
        mxWindow.prototype.setLocation.apply(this, arguments);
    };

    mxEvent.addListener(window, 'resize', mxUtils.bind(this, function () {
        var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var x = this.window.getX();
        var y = this.window.getY();

        if (x + this.window.table.clientWidth > iw) {
            x = Math.max(0, iw - this.window.table.clientWidth);
        }

        if (y + this.window.table.clientHeight > ih) {
            y = Math.max(0, ih - this.window.table.clientHeight);
        }

        if (this.window.getX() != x || this.window.getY() != y) {
            this.window.setLocation(x, y);
        }
    }));
};

/**
 * TimeRangeDialogBody for selected time
 * @param editorUi
 * @param handleFile
 * @constructor
 */

var TimeRangeDialogBody = function (editorUi,handleFile) {
    DialogBody.call(this, mxResources.get('timeRange'));
    var div = this.getBodyContainer();

    //startTime
    var stext = document.createTextNode(mxResources.get('startTime')+': ');
    var startForm = document.createElement('form');
    startForm.name='form1';
    var syear_select = document.createElement('select');
    var smonth_select = document.createElement('select');
    var sday_select = document.createElement('select');
    syear_select.name='YYYY';
    syear_select.onchange='YYYYDD(this.value)';
    smonth_select.name='MM';
    smonth_select.onchange='MMDD(this.value)';
    sday_select.name='DD';

    var syear_opt=document.createElement('option');
    var year_text = document.createTextNode(mxResources.get('years'));
    syear_opt.appendChild(year_text);
    syear_opt.value="";
    syear_opt.selected;

    var smonth_opt=document.createElement('option');
    var month_text = document.createTextNode(mxResources.get('months'));
    smonth_opt.appendChild(month_text);
    smonth_opt.value="";
    smonth_opt.selected;
    var sday_opt=document.createElement('option');
    var day_text = document.createTextNode(mxResources.get('days'));
    sday_opt.appendChild(day_text);
    sday_opt.value="";
    sday_opt.selected;

    syear_select.appendChild(syear_opt);
    smonth_select.appendChild(smonth_opt);
    sday_select.appendChild(sday_opt);

    startForm.appendChild(stext);
    startForm.appendChild(syear_select);
    startForm.appendChild(smonth_select);
    startForm.appendChild(sday_select);

    startForm.setAttribute('style','margin:15px;');

    //endtime
    var etext = document.createTextNode(mxResources.get('endTime')+': ');
    var endForm = document.createElement('form');
    endForm.name='form2';
    var eyear_select = document.createElement('select');
    var emonth_select = document.createElement('select');
    var eday_select = document.createElement('select');
    eyear_select.name='YYYY';
    eyear_select.onchange='YYYYDD(this.value)';
    emonth_select.name='MM';
    emonth_select.onchange='MMDD(this.value)';
    eday_select.name='DD';

    var eyear_opt=document.createElement('option');
    var year_text = document.createTextNode(mxResources.get('years'));
    eyear_opt.appendChild(year_text);
    eyear_opt.value="";
    eyear_opt.selected;

    var emonth_opt=document.createElement('option');
    var month_text = document.createTextNode(mxResources.get('months'));
    emonth_opt.appendChild(month_text);
    emonth_opt.value="";
    emonth_opt.selected;
    var eday_opt=document.createElement('option');
    var day_text = document.createTextNode(mxResources.get('days'));
    eday_opt.appendChild(day_text);
    eday_opt.value="";
    eday_opt.selected;

    eyear_select.appendChild(eyear_opt);
    emonth_select.appendChild(emonth_opt);
    eday_select.appendChild(eday_opt);

    endForm.appendChild(etext);
    endForm.appendChild(eyear_select);
    endForm.appendChild(emonth_select);
    endForm.appendChild(eday_select);

    endForm.setAttribute('style','margin:15px;');

    var btnContainer = document.createElement('div');
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('class','butnDiv');

    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        var startTime =
            new Date(document.form1.YYYY.value,document.form1.MM.value-1,document.form1.DD.value);
        var endTime =
            new Date(document.form2.YYYY.value,document.form2.MM.value-1,parseInt(document.form2.DD.value)+1);
        if(startTime >= endTime){
            //mxUtils.confirm(mxResources.get('startTimeCanNotBeGreaterThanEndTime'));
            var message = mxResources.get('startTimeCanNotBeGreaterThanEndTime');
            var tipDialog = new tipDialogBody(editorUi,message);
            editorUi.showDialog(tipDialog, 300, null, true, true);
            //alert('开始时间不能大于结束时间，请重新选择！');
            editorUi.showDialog(TimeRangeDialogBody,null,null,true,false);
        }
        console.log('startTime:'+startTime);
        console.log('endTime:'+endTime);
        //console.log(document.form2.YYYY.value,document.form2.MM.value-1,parseInt(document.form2.DD.value)+1);
        handleFile(startTime,endTime);
        editorUi.hideDialog();
    });
    okBtn.className = 'geBtn';
    //okBtn.setAttribute('style', 'float:right; margin: 5px');
    okBtn.className = 'geBtn gePrimaryBtn';
    btnContainer.appendChild(btnDiv);

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    cancelBtn.setAttribute('style', 'float:right');
    //btnContainer.appendChild(cancelBtn);

    btnDiv.appendChild(okBtn);
    btnDiv.appendChild(cancelBtn);

    div.appendChild(startForm);
    div.appendChild(endForm);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(TimeRangeDialogBody, DialogBody);

//日期下拉框级联算法
function YYYYMMDDstart()
{
    console.log('YYYYMMDDstart');
    MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //先给年下拉框赋内容
    var y   = new Date().getFullYear();
    for (var i = (y-30); i < (y+30); i++){ //以今年为准，前30年，后30年
        document.form1.YYYY.options.add(new Option(" "+ i +" " + mxResources.get('years'), i));
        document.form2.YYYY.options.add(new Option(" "+ i +" " + mxResources.get('years'), i));
    }
    //赋月份的下拉框
    for (var i = 1; i < 13; i++){
        document.form1.MM.options.add(new Option(" " + i + " " + mxResources.get('months'), i));
        document.form2.MM.options.add(new Option(" " + i + " " + mxResources.get('months'), i));
    }
    document.form1.YYYY.value = y;
    document.form2.YYYY.value = y;
    document.form1.MM.value = new Date().getMonth() + 1;
    document.form2.MM.value = new Date().getMonth() + 1;

    var n = MonHead[new Date().getMonth()];
    if (new Date().getMonth() ==1 && IsPinYear(YYYYvalue)) n++;
    writeDay(n); //赋日期下拉框
    document.form1.DD.value = new Date().getDate();
    document.form2.DD.value = new Date().getDate();
}

function YYYYDD(str) //年发生变化时日期发生变化(主要是判断闰平年)
{
    //console.log('YYYYMMDD');
    var MMvalue = document.form1.MM.options[document.form1.MM.selectedIndex].value;
    //var MMvalue_2 = document.form2.MM.options[document.form2.MM.selectedIndex].value;
    if (MMvalue == ""){ var e = document.form1.DD; optionsClear(e); return;}
    //if (MMvalue_2 == ""){ var e = document.form2.DD; optionsClear(e); return;}
    var n = MonHead[MMvalue - 1];
    if (MMvalue ==2 && IsPinYear(str)) n++;
    writeDay(n);
}

function MMDD(str)  //月发生变化时日期联动
{
    //console.log('MMDD');
    var YYYYvalue = document.form1.YYYY.options[document.form1.YYYY.selectedIndex].value;
    //var YYYYvalue_2 = document.form2.YYYY.options[document.form2.YYYY.selectedIndex].value;
    if (YYYYvalue == ""){ var e = document.form1.DD; optionsClear(e); return;}
    var n = MonHead[str - 1];
    if (str ==2 && IsPinYear(YYYYvalue)) n++;
    writeDay(n);
}

function writeDay(n)  //据条件写日期的下拉框
{
    console.log('writeDay');
    var e = document.form1.DD; optionsClear(e);
    var e2 = document.form2.DD; optionsClear(e);
    for (var i=1; i<(n+1); i++){
        e.options.add(new Option(" "+ i + " " + mxResources.get('day'), i));
        e2.options.add(new Option(" "+ i + " " + mxResources.get('day'), i));
    }
}

function IsPinYear(year)//判断是否闰平年
{
    console.log('ISPinYear');
    return(0 == year%4 && (year%100 !=0 || year%400 == 0));
}

function optionsClear(e)
{
    console.log('optionsClear');
    e.options.length = 1;
}



/**
 * ConfirmDialogBody for confirm something
 * @param editorUi
 * @param message
 * @param data
 * @param handleFile
 */
var confirmDialogBody = function (editorUi, message, data, handleFile) {
    DialogBody.call(this, mxResources.get('tooltips'));
    var div = this.getBodyContainer();
    var text = document.createElement('div');
    text.innerHTML = message;
    var btnContainer = document.createElement('div');
    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        handleFile(data);
        editorUi.hideDialog();
    });
    okBtn.className = 'geBtn';
    text.setAttribute('style', 'text-align: center; margin: 20px;');
    okBtn.setAttribute('style', 'float:right; margin: 5px; background: red; color:white');
    btnContainer.appendChild(okBtn);
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    cancelBtn.setAttribute('style', 'float:right; margin: 5px;');
    btnContainer.appendChild(cancelBtn);
    div.appendChild(text);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(confirmDialogBody, DialogBody);

/*
* publish a course or a instance
**/
var publishDialogBody = function (editorUi, title, message, next) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    //deside if necessary to set permission
    if (mxUi === 'course_design'){
        //radio
        var options = [
            {name:'专业课', value:3},
            {name:'学校公开课', value:2},
            {name:'社会公开课', value:1}
        ];
        var permissionRadio = editorUi.formItems.genRadioField('设置该课程的公开程度：','radio', options);
        var permissionRadioDiv = permissionRadio.getElContainer();
        permissionRadioDiv.style.margin = '20px';
        /*
        permissionRadioDiv.onchange = function () {
            if (permissionRadio.submitRadio().value === 'limit'){
                selectArea.style.display = 'block';
            } else {
                selectArea.style.display = 'none';
            }
        };
        //select
        var selectArea = document.createElement('div');
        selectArea.setAttribute('style', 'margin: 0 20px 20px 30px;display:none');
        var selectOptions = [
            {text:'组织1', value:'zz1', option:[
                {text: '所有人', value:'jg0'},
                {text: '机构1', value:'jg1'},
                {text: '机构2', value:'jg2'}
            ]},
            {selected: true, text:'zz2', value:'limit', option:[
                {text: '所有人', value:'jg0'},
                {text: '机构3', value:'jg1'},
                {text: '机构4', value:'jg2'}
            ]}
        ];
        var select_1 = editorUi.formItems.msSelect(selectOptions);
        var selectDiv_1 = select_1.getContainer();
        var select_2 = editorUi.formItems.msSelect(selectOptions[selectDiv_1.selectedIndex].option);
        selectDiv_1.onchange = function () {
            select_2.setOption(selectOptions[selectDiv_1.selectedIndex].option);
        };
        var selectSpan_1 = document.createElement('span');
        selectSpan_1.innerHTML = '组织：';
        var selectSpan_2 = document.createElement('span');
        selectSpan_2.innerHTML = '机构：';
        selectSpan_2.style.marginLeft = '10px';
        selectArea.appendChild(selectSpan_1);
        selectArea.appendChild(selectDiv_1);
        selectArea.appendChild(selectSpan_2);
        selectArea.appendChild(select_2.getContainer());
        */
        div.appendChild(permissionRadioDiv);
        //div.appendChild(selectArea);
    } else {
        var text = document.createElement('div');
        text.innerHTML = message;
        text.setAttribute('style', 'text-align: center; margin: 20px 20px 10px 20px;');
        div.appendChild(text);
    }
    //btns
    var btnContainer = document.createElement('div');
    btnContainer.setAttribute('style', 'margin: 5px;overflow: auto;');
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    cancelBtn.setAttribute('style', 'float:right;');
    btnContainer.appendChild(cancelBtn);
    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        if (permissionRadioDiv){
            var permission = {};
            permission.type = permissionRadio.submitRadio().value;
            //if (permission === 'limit'){
            //    permission = {
            //        'org_1': select_1.getSelectedOption().value,
            //        'org_2': select_2.getSelectedOption().value
            //    }
            //}
            //next(JSON.stringify(permission));
            if (permission.type != 1){
                $.get('http://mx2.ec.edu/org/Ajax_userDep_V2?userId=KHLF8NNT', function (data) {
                //var data = {'success':true,'data':[{'orgId':'111','deptId':'222'},{'orgId':'','deptID':'222'}]}
                    if(data.success){
                        permission.orgList = data.data;
                    }
                })
            }
            next(JSON.stringify(permission));
        } else {
            next();
        }
        editorUi.hideDialog();
    });
    okBtn.className = 'geBtn gePrimaryBtn';
    btnContainer.appendChild(okBtn);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(publishDialogBody, DialogBody);

var confirmDialogBody_Blue = function (editorUi, title, message, next) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    var btnContainer = document.createElement('div');
    btnContainer.setAttribute('style', 'margin: 5px;overflow: auto;');
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    cancelBtn.setAttribute('style', 'float:right;');
    btnContainer.appendChild(cancelBtn);
    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        next();
        editorUi.hideDialog();
    });
    okBtn.className = 'geBtn gePrimaryBtn';
    var text = document.createElement('div');
    text.innerHTML = message;
    text.setAttribute('style', 'text-align: center; margin: 20px;');
    btnContainer.appendChild(okBtn);
    div.appendChild(text);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(confirmDialogBody_Blue, DialogBody);
/*
 弹出只有确定的对话框  by chenwenyan   /BY Adamm
 */
var okDialogBody = function (editorUi, message) {
    DialogBody.call(this, mxResources.get('tooltips'));
    var div = this.getBodyContainer();
    var text = document.createElement('div');
    text.innerHTML = message;
    var btnContainer = document.createElement('div');

    var btnDiv = document.createElement('div');

    var okBtn = mxUtils.button(mxResources.get('ok'), function () {

        window.location = '/';
        editorUi.hideDialog();
    });
    okBtn.className = 'geBtn';
    btnDiv.appendChild(okBtn);
    btnDiv.setAttribute('class','butnDiv');
    // text.setAttribute('style', 'text-align: center; margin: 20px;');
    text.setAttribute('class','txt');
    // okBtn.setAttribute('style', 'float:right; margin: 5px;');
    okBtn.setAttribute('class','geBtn gePrimaryBtn');

    //btnContainer.setAttribute('style', 'text-align:right');
    btnDiv.setAttribute('style', 'text-align:right');
    btnContainer.appendChild(btnDiv);
    btnDiv.appendChild(okBtn);
    div.appendChild(text);
    //div.appendChild(btnDiv);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(okDialogBody, DialogBody);
/**
 * Constructs a dedicate message dialog for showing simple messages   //by Adamm
 */
var messageDialogBody = function (editorUi, message, resHandler) {
    DialogBody.call(this, mxResources.get('tooltips'));
    var div = this.getBodyContainer();
    var text = document.createElement('div');
    text.innerHTML = message;
    var btnContainer = document.createElement('div');
    var btnDiv = document.createElement('div');

    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        if (resHandler) {
            resHandler();
        }
        editorUi.hideDialog();
    });
    okBtn.className = 'geBtn';
    okBtn.setAttribute('class','geBtn3');
    text.setAttribute('class','txt');
    // text.setAttribute('style', 'text-align: center; margin: 20px;');
    // okBtn.setAttribute('style', 'float:right; margin: 5px;');
    // okBtn.setAttribute('class','geBtn gePrimaryBtn');
    btnContainer.setAttribute('style','text-align:right;');
    btnDiv.setAttribute('style','text-align:right;');

    btnContainer.appendChild(btnDiv);
    btnDiv.appendChild(okBtn);
    //btnContainer.appendChild(okBtn);
    div.appendChild(text);
    div.appendChild(btnContainer);
    div.appendChild(btnDiv);

    this.container = div;
};
mxUtils.extend(messageDialogBody, DialogBody);

/**
 * Constructs a sub process dialog for choose reuse or create
 */
var SubProcessDialogBody = function (editorUi, next) {
    DialogBody.call(this, mxResources.get('editSubProcess'));
    var container = this.getBodyContainer();
    var options = [
        {name:mxResources.get('createNewFile'), value:'create'},
        {name:mxResources.get('reuseExistFile'), value:'reuse'},
        {name:mxResources.get('copyExistFile'), value:'copy'}
    ];
    var trueOrFalseRadio = editorUi.formItems.genRadioField('','radio',options, null, true);
    var trueOrFalseRadioBody = trueOrFalseRadio.getElContainer();
    trueOrFalseRadioBody.style.margin = '10px 20px';
    container.appendChild(trueOrFalseRadioBody);
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('align', 'right');
    btnDiv.setAttribute('style', 'margin: 5px 10px; overflow: hidden;');
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('ok'), function (evt) {
        editorUi.hideDialog();
        var subProHandler= editorUi.formItems.submitForm(evt, editorUi.editor.graph, 'radio', options);
        next(subProHandler.value);
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    btnDiv.appendChild(cancelBtn);
    btnDiv.appendChild(applyBtn);
    container.appendChild(btnDiv);
    this.container = container;
};
mxUtils.extend(SubProcessDialogBody, DialogBody);
/**
 * create instance in the top process
 * @param editorUi
 * @param next
 */
var createInsDialogBody = function(editorUi,isCreate,instanceFile, next) {
    if(isCreate){
        var title = mxResources.get ('createInstance');
        var btnText = mxResources.get('create');
        //var detailDescOrgData = 'No description';
    }else {
        var title = mxResources.get ('editInstance');
        var btnText = mxResources.get('save');
        if (instanceFile.groupRange){
            var oldGroupRange = JSON.parse(instanceFile.groupRange);
        }
        var detailDescOrgData =  (instanceFile.detailDes && instanceFile.detailDes[0]==='{') ? (JSON.parse(instanceFile.detailDes)) : null;
        if ((!instanceFile.detailDes) && instanceFile.detailDesc){
            var detailDescOrgData = {};
            detailDescOrgData.content = instanceFile.detailDesc.replace(/<[^>]+>/g,"");
        }
        if(instanceFile.isCooperation){
            var isCooperation = instanceFile.isCooperation;
        }
        var tagList = [
            {name:'学习情境描述', id: 'workSituation', descrpt:'描述该课程中学习任务执行的具体工作情境'},
            {name:'学习任务', id: 'workTask', height:'50px', descrpt:'学习任务是用于学习的工作任务，学习的内容是工作和通过工作完成的学习任务。确定和设计学习任务时，应对学习目标和主要学习内容有基本的设想，清楚所采用的学习资源、途径和完成任务的操作程序与步骤，并对学习方式(独立或组合)、学生与教师的角色分配有大体的安排。'},
            {name:'学习目标', id: 'goal', height:'45px', descrpt:'有效的学习目标应能说明以下问题：1.学习该课程的主要意图是什么? 2.完成规定工作需要什么条件? 3.能达到什么样的质量标准? 4.学生要达到这个要求必须做到什么? 5.怎么知道何时学生的行为已经达到了要求? 6.能完成什么工作? '},
            {name:'学习内容', id: 'content', height:'50px', descrpt:'先按照学习目标确定学习内容，再根据学生的具体情况加以调整或补充。“学习内容”包括工作对象工具材料、工作方法、劳动组织方式和工作要求。这里既包含知识、技能成分，也包含态度和价值观成分。'},
            {name:'重难点', id: 'difficulty'},
            {name:'教学组织形式与教学方法', id: 'organizationForm'},
            {name:'考核标准', id: 'assessmentStandards'},
            {name:'教学条件', id: 'teachingCondition'},
            {name:'教学时间安排', id: 'schedule', descrpt:'该课程预计的教学时'},
            {name:'工作对象', id: 'target', height:'45px', descrpt:'“工作对象”描述的是指工作人员在具体工作情境和工作过程中行动的内容，它不仅要说明工作对象的事物本身(如机床)，而且要说明其在工作过程中的功能(如操作机床或维修机床)，也就是在工作中要做的具体事情。'},
            {name:'工作与教学用具', id: 'tool', descrpt:'完成工作任务时需用到的工具'},
            {name:'工作要求', id: 'workRequirement', descrpt:'工作要求一般按工作对象的顺序提出，不仅有企业的，还有社会的和个人的，即从不同侧面和角度对工作过程和工作对象提出要求，反映了不同利益团体矛盾和要求的博弈。'}
        ];
    }
    DialogBody.call(this, title);
    var container = this.getBodyContainer();
    container.style.backgroundColor = '#FAFAFA';
    this.editorUi = editorUi;
    var instanceNameDiv = document.createElement('div');
    mxUtils.write(instanceNameDiv, mxResources.get('instanceName') + ': ');
    var instanceNameInput = editorUi.formItems.msInput();
    if(isCreate && !instanceNameInput.value){
        instanceNameInput.value = editorUi.editor.getFilename();
    }
    instanceNameDiv.appendChild(instanceNameInput);
    var star = editorUi.formItems.msStar();
    instanceNameDiv.appendChild(star);
    instanceNameDiv.setAttribute('style', 'padding: 10px 15px; ');
    var courseIconForm = document.createElement('form');
    courseIconForm.setAttribute('style','padding: 10px 15px;');
    courseIconForm.enctype = 'multipart/form-data';
    courseIconForm.method = 'post';
    mxUtils.write(courseIconForm,'课程图标：');
    var chooseImgInput = document.createElement('input');
    chooseImgInput.type = 'file';
    chooseImgInput.accept = 'image/*';

    var courseIconUploadBtn = document.createElement('input');
    courseIconUploadBtn.setAttribute('style','margin-top:10px');
    courseIconUploadBtn.type = 'button';
    courseIconUploadBtn.value = '上传';
    var courseIconName = document.createElement('span');
    courseIconName.setAttribute('style','margin-top:10px;cursor:pointer;color:#3A5FCD;text-decoration:underline');
    courseIconUploadBtn.setAttribute('style','margin-right:50px;');
    var previewImgEditSpan = document.createElement('span');
    previewImgEditSpan.setAttribute('style','cursor:pointer;margin:10px;border:1px solid #ccc;padding:5px');
    previewImgEditSpan.innerHTML = '重新上传';
    var previewImgDeleteSpan = document.createElement('span');
    previewImgDeleteSpan.setAttribute('style','cursor:pointer;margin:10px;border:1px solid #ccc;padding:5px');
    previewImgDeleteSpan.innerHTML = '删除';
    var previewImgDiv = document.createElement('img');
    previewImgDiv.setAttribute('style','overflow:auto;margin:5px 20px');
    //var instanceDesDiv  = document.createElement('div');
    //mxUtils.write(instanceDesDiv, mxResources.get('instanceDescription') + ': ');
    //var instanceDesArea = document.createElement('textarea');
    //instanceDesArea.style.width = '500px';
    //instanceDesDiv.appendChild(instanceDesArea);
    //instanceDesDiv.setAttribute('style', 'margin: 10px; padding-left: 5px; vertical-align: top;');

    if(!isCreate){
        instanceNameInput.value = instanceFile.name;
        instanceNameInput.disabled = true;
        if(instanceFile.fileIcon && (instanceFile.fileIcon != "null")&& (instanceFile.fileIcon != "undefined")){
            courseIconForm.appendChild(courseIconName);
            courseIconForm.appendChild(previewImgEditSpan);
            courseIconForm.appendChild(previewImgDeleteSpan);
            courseIconName.innerHTML = JSON.parse(instanceFile.fileIcon).originalName;
            previewImgDiv.src = JSON.parse(instanceFile.fileIcon).sourceF;
        }else{
            courseIconForm.appendChild(chooseImgInput);
            //courseIconForm.appendChild(courseIconUploadBtn);
        }
        //instanceDesArea.value = instanceFile.description;
    }else{
        courseIconForm.appendChild(chooseImgInput);
    }
    //上传课程图标
    mxEvent.addListener(chooseImgInput, 'change', mxUtils.bind(this, function () {
        var files = chooseImgInput.files;
        if(files.length > 0){
            var fileName = files[0].name;
            var fileSize = files[0].size;
            var is = fileName.lastIndexOf('.');
            if(is == -1) {
                editorUi.showDialog(new tipDialogBody(editorUi, mxResources.get('incorrectMaterialFormat')), 300, null, true, true);
                return false;
            }else{
                //过滤文件类型
                var testFileType = fileName.substring(is+1);
                if((testFileType === 'png') || (testFileType === 'jpg') || (testFileType === 'gif') || (testFileType === 'bmp')) {
                    if(fileSize < 5*1024*1024){
                        courseIconForm.appendChild(courseIconUploadBtn);
                        //courseIconForm.appendChild(courseIconPreviewSpan);
                    }else {
                        alert('抱歉，课程图标大小不可超过5MB');
                    }
                }else{
                    alert('抱歉，系统暂不支持'+testFileType+'格式的资料，您可以转换为其他格式再上传~');
                    return false;
                }
            }
        }else{

        }
    }));
    var resultFile;
    courseIconUploadBtn.onclick = function(){
        var files = chooseImgInput.files;
        var formData = new FormData();
        if(files.length > 0){
            var imgObj = files[0];
            formData.append('imageSizes','125m125');//默认图片裁剪大小
            formData.append('file1',imgObj);
            var xhr = new XMLHttpRequest();
            xhr.open('post',imageServerHost+'ImageHandler',true);
            var result;
            xhr.onload = function(e){
                if(this.status == 200){
                    result = this.response;
                    if(result === 'error'){
                        editorUi.showDialog(new tipDialogBody(editorUi, 'edit error'), 300, null, true, true);
                    }
                    var  res = JSON.parse(result);
                    res.originalName = imgObj.name;
                    resultFile = res;
                    courseIconForm.removeChild(chooseImgInput);
                    courseIconForm.removeChild(courseIconUploadBtn);
                    //courseIconForm.removeChild(courseIconPreviewSpan);
                    courseIconForm.appendChild(courseIconName);
                    courseIconForm.appendChild(previewImgEditSpan);
                    courseIconForm.appendChild(previewImgDeleteSpan);
                    courseIconName.innerHTML = res.originalName;
                }
            };
            xhr.send(formData);
        }else{
            alert('未选择图片！');
        }
    };
    this.previewImg = true;
    courseIconName.onclick = mxUtils.bind(this, function(){
        if(this.previewImg){
            if((courseIconForm.children ||courseIconForm.childNodes).length === 3){
                courseIconForm.appendChild(previewImgDiv);
            }
            previewImgDiv.src = resultFile.sourceF?(imageServerHost + resultFile.sourceF): JSON.parse(instanceFile.fileIcon).sourceF;
            previewImgDiv.onload = function(data){
                //console.log(data);
            };
            previewImgDiv.onerror = function(error){
                alert('获取图片内容出错了');
                //console.log(error);
            };
            previewImgDiv.style.width = '400px';
            previewImgDiv.style.height = '300px';
            previewImgDiv.style.display = 'block';
        }else{
            if((courseIconForm.children ||courseIconForm.childNodes).length === 4)
                courseIconForm.removeChild(previewImgDiv);
        }
        this.previewImg = !this.previewImg;
    });
    //重新选择课程图标
    previewImgEditSpan.onclick = function(){
        courseIconForm.removeChild(previewImgDeleteSpan);
        courseIconForm.removeChild(previewImgEditSpan);
        courseIconForm.removeChild(courseIconName);
        courseIconForm.appendChild(chooseImgInput);
        //chooseImgInput.createTextRange().execCommand('delete');
        chooseImgInput.outHTML = chooseImgInput.outHTML;
        resultFile = null;
    };
    //删除已选课程图标
    previewImgDeleteSpan.onclick = function(){
        courseIconForm.removeChild(previewImgDeleteSpan);
        courseIconForm.removeChild(previewImgEditSpan);
        courseIconForm.removeChild(courseIconName);
        courseIconForm.appendChild(chooseImgInput);
        //chooseImgInput.createTextRange().execCommand('delete');
        chooseImgInput.outHTML = chooseImgInput.outHTML;
        resultFile = null;
    };
    container.appendChild(instanceNameDiv);
    container.appendChild(courseIconForm);
    //container.appendChild(instanceDesDiv);
    //160810fz 临时分组
    var groupArea= document.createElement('div');
    groupArea.setAttribute('style', 'padding: 10px 15px 20px 15px');
    //161227删除小组个数范围设置
    /*var groupNumDiv= document.createElement('div');
    groupNumDiv.style.marginBottom = '5px';
    var groupNumTitle = document.createElement('span');
    groupNumTitle.innerHTML = '小组个数：';
    var groupNumMinInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.minGroup) : 1,
        "min": 0,
        "max": 99,
        "id": 'group-min'
    });
    var groupNumAndSpan = document.createElement('span');
    groupNumAndSpan.innerHTML = ' 至 ';
    var groupNumMaxInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.maxGroup) : 1,
        "min": 1,
        "max": 99,
        "id": 'group-max'
    });
    groupNumMinInput.oninput = function () {
        groupNumMaxInput.min = groupNumMinInput.value;
        if (groupNumMaxInput.value < groupNumMinInput.value){
            groupNumMaxInput.value = groupNumMinInput.value;
        }
    };
    groupNumDiv.appendChild(groupNumTitle);
    groupNumDiv.appendChild(groupNumMinInput);
    groupNumDiv.appendChild(groupNumAndSpan);
    groupNumDiv.appendChild(groupNumMaxInput);
    groupArea.appendChild(groupNumDiv);*/

    var memberNumDiv= document.createElement('div');
    memberNumDiv.style.marginBottom = '5px';
    var memberNumTitle = document.createElement('span');
    memberNumTitle.innerHTML = '每组人数：';
    var memberNumMinInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.minMember) : 1,
        "min": 0,
        "max": 99,
        "id": 'member-min'
    });
    var memberNumAndSpan = document.createElement('span');
    memberNumAndSpan.innerHTML = ' 至 ';
    var memberNumMaxInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.maxMember) : 5,
        "min": 1,
        "max": 99,
        "id": 'member-max'
    });
    memberNumMinInput.oninput = function () {
        memberNumMaxInput.min = memberNumMinInput.value;
        if (memberNumMaxInput.value < memberNumMinInput.value){
            memberNumMaxInput.value = memberNumMinInput.value;
        }
    }
    memberNumDiv.appendChild(memberNumTitle);
    memberNumDiv.appendChild(memberNumMinInput);
    memberNumDiv.appendChild(memberNumAndSpan);
    memberNumDiv.appendChild(memberNumMaxInput);
    groupArea.appendChild(memberNumDiv);
    var roleMemberDiv= document.createElement('div');
    var roleMemberTitle = document.createElement('span');
    roleMemberTitle.innerHTML = '每个角色人数：';
    var roleMemberMinInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.minRole) : 1,
        "min": 1,
        "max": 99,
        "id": 'role-min'
    });
    var roleMemberAndSpan = document.createElement('span');
    roleMemberAndSpan.innerHTML = ' 至 ';
    var roleMemberMaxInput = editorUi.formItems.msNumInput({
        "value": (oldGroupRange) ? (oldGroupRange.maxRole) : 5,
        "min": 1,
        "max": 99,
        "id": 'role-max'
    });
    roleMemberMinInput.oninput = function () {
        roleMemberMaxInput.min = roleMemberMinInput.value;
        if (roleMemberMaxInput.value < roleMemberMinInput.value){
            roleMemberMaxInput.value = roleMemberMinInput.value;
        }
    };
    roleMemberDiv.appendChild(roleMemberTitle);
    roleMemberDiv.appendChild(roleMemberMinInput);
    roleMemberDiv.appendChild(roleMemberAndSpan);
    roleMemberDiv.appendChild(roleMemberMaxInput);
    groupArea.appendChild(roleMemberDiv);
    ////是否独立完成课程
    //var isCooperationDiv = document.createElement('div');
    //isCooperationDiv.style.margin = '5px 0';
    //var isCprshCheckbox = document.createElement('input');
    //isCprshCheckbox.type = 'checkbox';
    //isCprshCheckbox.checked = (isCooperation)?isCooperation:true;//todo
    //isCprshCheckbox.id = 'checkbox-isCprsh';
    //isCprshCheckbox.name = '是否独立完成课程';
    //isCprshCheckbox.setAttribute('style', 'cursor:pointer;vertical-align: middle;width: 15px;height: 15px;margin: 2px;');
    //var isCprshLabel = document.createElement('label');
    //isCprshLabel.setAttribute('style', 'vertical-align: middle;margin-left: 5px;cursor:pointer;');
    //isCprshLabel.setAttribute('for', isCprshCheckbox.id);
    //isCprshLabel.innerHTML = isCprshCheckbox.name;
    //isCooperationDiv.appendChild(isCprshCheckbox);
    //isCooperationDiv.appendChild(isCprshLabel);
    //groupArea.appendChild(isCooperationDiv);

    if (!isCreate){
        var detailDescDiv = document.createElement('div');
        detailDescDiv.setAttribute('style', 'overflow: auto;height: 400px;border-top: 1px solid #b5b5b5');
        var detailDescTag = document.createElement('div');
        detailDescTag.innerHTML = mxResources.get('detailDescription') + ': ';
        detailDescTag.setAttribute('style','margin: 10px; padding-left: 5px; vertical-align: top;');
        //var detailDescArea = editorUi.formItems.genTextareaInputFieldPro(this, mxResources.get('description'), 'description', detailDesc, '102%');
        //detailDescDiv.appendChild(detailDescTag);
        //detailDescDiv.appendChild(detailDescArea.getElContainer());
        detailDescDiv.appendChild(this.detailDescArea(tagList, detailDescOrgData));
        container.appendChild(groupArea);
        container.appendChild(detailDescDiv);
    }
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('align', 'right');
    btnDiv.setAttribute('style', 'padding: 15px 5px 5px 0; background-color: #E5E5E5');
    var cancelBtn = mxUtils.button(mxResources.get('close'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(btnText, function (evt) {
        var pattern=/^[ ]+$/gi;
        if(instanceNameInput.value && !pattern.test(instanceNameInput.value)) {
            if (!isCreate){
                var formDom = document.getElementsByName('detailDes');
                var detailDesData = {};
                for (var i = 0; i < tagList.length; i++){
                    detailDesData[tagList[i].id] = formDom[i].value
                }
                //var resHandle = {
                //    instanceName: instanceNameInput.value,
                //    instanceDes: instanceDesArea.value,
                //    detailDesc:detailDescArea.getInputValue()
                //};
                var resHandle = {
                    instanceName: instanceNameInput.value,
                    detailDes: JSON.stringify(detailDesData),
                    groupRange: JSON.stringify({
                        //"minGroup": $('#group-min').val(),
                        //"maxGroup": $('#group-max').val(),
                        "minMember": $('#member-min').val(),
                        "maxMember": $('#member-max').val(),
                        "minRole": $('#role-min').val(),
                        "maxRole": $('#role-max').val()
                    })
                };
                //1.role范围包括1 2.泳道中角色只有一个。则isCooperation=false
                if(($('#role-min').val()<2) && ($('#role-max').val()>1) && (editorUi.getRolePool().length === 1)){
                    resHandle['isCooperation'] = false;
                } else {
                    resHandle['isCooperation'] = true;
                }
            } else {
                var resHandle = {
                    instanceName: instanceNameInput.value
                };
            }
            if(resultFile){
                var fileIconObj = {
                    materialsId : resultFile.materialsId,
                    sourceF : imageServerHost + resultFile.sourceF,
                    originalName : resultFile.originalName
                };
                resHandle['fileIcon'] = JSON.stringify(fileIconObj);
            }
            editorUi.hideDialog();
            next(resHandle);
        }
        else {
            //alert(mxResources.get('nullInstanceName'));
            editorUi.showDialog(new tipDialogBody(editorUi, mxResources.get('nullInstanceName')), 300, null, true, true);
        }
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    btnDiv.appendChild(cancelBtn);
    btnDiv.appendChild(applyBtn);
    container.appendChild(btnDiv);
};
mxUtils.extend(createInsDialogBody, DialogBody);
createInsDialogBody.prototype.detailDescArea = function (tagList, originalData) {
    var formBox = document.createElement('div');
    formBox.setAttribute('style', 'padding: 5px 15px;');
    for (var i = 0; i < tagList.length; i++){
        var height = (tagList[i].height) ? tagList[i].height : '30px';
        var content = (originalData)?originalData[tagList[i].id]:null;
        formBox.appendChild(this.createFormDiv(tagList[i].name, height, content, tagList[i].descrpt));
    }
    return formBox;
};

createInsDialogBody.prototype.createFormDiv = function (title, minHeight, content, placeHolder) {
    var formBox = document.createElement('div');
    var text = document.createElement('span');
    text.innerHTML = title + '：';
    text.className = 'explanationText';
    text.style.display = 'block';
    formBox.style.padding = '5px 0';
    formBox.appendChild(text);
    //var formInput = document.createElement('textArea');
    var formInput = this.editorUi.formItems.msTextarea('', '98%');
    formInput.name = 'detailDes';
    if (placeHolder){
        formInput.placeholder = placeHolder;
    }
    formInput.style.minHeight= ((minHeight) ? minHeight : '50px');
    //formInput.style.width= '600px';
    if (content) {
        formInput.value = content;
    }
    formBox.appendChild(formInput);
    return formBox;
};

var  assignRoleDialog = function(editorUi, roleData, cell, idData, isSaveNew, next) {
    DialogBody.call(this, mxResources.get ('assignRole'));
    var container = this.getBodyContainer();
    var roleContainer = document.createElement('div');
    roleContainer.setAttribute('style', 'padding:5px;min-height:250px');
    var role = [];
    for(var i = 0; i < roleData.length; i++) {
        role[i] = editorUi.formItems.genComboBox(roleData[i], 'member', cell, [], '100', idData.instanceId);
        roleContainer.appendChild(role[i].getElContainer());
    }
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('align', 'right');
    btnDiv.setAttribute('style', 'margin: 5px 10px;');
    var cancelBtn = mxUtils.button(mxResources.get('assignLater'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = mxUtils.button(mxResources.get('ok'), function (evt) {
        editorUi.hideDialog();
        var roleUsers = [];
        for(var i = 0; i < roleData.length; i++) {
            roleUsers[i] = {
                roleId: roleData[i],
                roleName: roleData[i],
                participants: JSON.stringify(role[i].getInputField()),
                fileId: idData.fileId,
                instanceId: idData.instanceId
            };
            console.log(role[i].getInputField());
        }
        var paramObj = {
            roleUsers: JSON.stringify(roleUsers),
            isSaveNew: isSaveNew
        };
        editorUi.communication.persistInsRoleUser(paramObj, function (resData) {
            console.log(resData);
            next();
        });
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    btnDiv.appendChild(cancelBtn);
    btnDiv.appendChild(applyBtn);
    container.appendChild(roleContainer);
    container.appendChild(btnDiv);
};
mxUtils.extend(assignRoleDialog, DialogBody);

var EditVideoDialogBody = function(editorUi,file, next) {
    DialogBody.call(this, mxResources.get ('videoEdit'));
    var container = this.getBodyContainer();
    var videoEdit = document.createElement('div');
    videoEdit.setAttribute('align', 'right');
    container.setAttribute('style', 'overflow-y: auto; height: inherit;');
    container.appendChild(videoEdit);
    var fE = file.videoRes?file.videoRes.data[0]:file;
    var cell = editorUi.editor.graph.getSelectionCell();
    if (cell) {
        var userData = [];
        if (cell.parent.id !== '1'){
            var label = cell.parent.getAttribute('label').split('+');
            for (var i = 0; i < label.length; i++) {
                userData.push({id: label[i], name: label[i]});
            }
        } else {
            userData.push({id: '', name: '-'});
        }
        //if (label.length > 0) {
        //var userData = [];
        //for (var i = 0; i < label.length; i++) {
        //    userData.push({id: label[i], name: label[i]});
        //}
        //get workbench's sub-tasks
        if(cell.getAttribute('workbench')){
            var workBenchTasks = JSON.parse(cell.getAttribute('workbench')).slice();
        }
        this.addListener("onRendered",mxUtils.bind(this,function(){
            var inVideo = {};
            var parts = [];
            //var parts = [
            //    {"title":"aaa","des":"aaa1","startTime":0,"duration":0,'role':[]},
            //    {"title":"bbb","des":"bbb1","startTime":60,"duration":0,'role':[]},
            //    {"title":"ccc","des":"ccc1","startTime":120,"duration":0,'role':[]}
            //];
            if(file.parts&&file.parts.data.length){
                parts = file.parts.data[0].segments;
            }
            inVideo.editorUi = editorUi;
            inVideo.workBenchTasks = workBenchTasks;
            inVideo.id = fE.materialsId;
            inVideo.sourceF = fE.sourceF;
            inVideo.name = fE.fileName;
            inVideo.description = fE.description;
            inVideo.segments = parts;
            inVideo.user = userData;

            video.init($(videoEdit),inVideo,"edit", function (resData) {
                var situation = {
                    "situationName":"会议",
                    "presentationType": "video",
                    "content":resData
                };
                var segmentToXml = [];
                for(var i=0; i<resData.segments.length; i++) {
                    segmentToXml[i] = {};
                    segmentToXml[i] =resData.segments[i];
                    segmentToXml[i].segNum= i+1;
                }
                var situationToXml = {
                    "resourceId": resData.id,
                    "resourceName": resData.name,
                    "segments":segmentToXml
                };
                console.log('saved to xml');
                console.log(situationToXml);
                var saveQuery = {
                    resData: JSON.stringify(resData),
                    isNew : true
                };
                if(parts.length){
                    saveQuery.isNew = false;
                }
                editorUi.communication.saveVideoRes([saveQuery], function () {
                    console.log('saved to database');
                    editorUi.hideDialog();
                    next(situationToXml);
                });
            });
        }))
        //}
        //else {
        //    editorUi.hideDialog();
        //    editorUi.showDialog(new tipDialogBody(editorUi, '未检测到泳道/泳池'), 300, null, true, true);
        //}
    }

};
mxUtils.extend(EditVideoDialogBody, DialogBody);

/*
 * fangzhou 总文件管理器
 * lockType:五位二进制数字，依次对应“多选，课程模型，实例，资料，富文本”的权限。1表示可点开，0表示上锁
 * */
var FileManagerDialogBodyPro = function (editorUi, title, processId, isOpenNewWindow, graph, lockType, mxUi,callback) {
    var queryObj = appUtils.convertQueryStrToJSON();
    //var mxUi = queryObj.ui;
    DialogBody.call(this, title, editorUi);
    this.isOpenNewWindow = isOpenNewWindow;
    this.graph = graph;
    this.processId = processId;
    this.callback = callback;
    this.lockType = lockType;
    var defaultTabPos = 1;
    if (processId) {
        if (processId == 'learningResSearch') {
            defaultTabPos = 2;
        } else if (processId == 'manageRichTextsModel') {
            defaultTabPos = 3;
        } else if (processId == 'form') {
            defaultTabPos = 4;
        } else {
            defaultTabPos = 1;
        }
    }
    var tabInfos = {};
    if(mxUi === 'task_design') {
        tabInfos = [
            {
                tab:mxResources.get('typicalWorkTask'),
                isTabLocked:(lockType && lockType[1] && lockType[1] === '0'),
                panel:[
                    {type:'tool',tool:['trash'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},  //you can set isMultiLocked true to lock multiple button
                    {type:'entity', entity:'task_design'}
                ]
            },
            {
                tab:mxResources.get('boardIParticipated'),
                //isTabLocked:(lockType && lockType[5] &&lockType[5] == '0'),
                isTabLocked:false,
                panel:[
                    {type:'tool'},
                    {type:'entity',entity:'userBoard'}
                ]
            }
        ];
    } else if(mxUi === 'process_design') {
        tabInfos = [
            {
                tab:mxResources.get('courseModel'),
                isTabLocked:(lockType && lockType[2] && lockType[2] === '0'),
                panel:[
                    {type:'tool',tool:['trash'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},  //you can set isMultiLocked true to lock multiple button
                    {type:'entity', entity:'sub_course'}
                ]
            },/*
            {
                tab:mxResources.get('instanceFile'),
                isTabLocked:(lockType && lockType[2] && lockType[2] == '0'),
                panel:[
                    {type:'tool', tool:['trash']},
                    {type:'entity',entity:'instance'}
                ]
            }*/
            {
                tab:mxResources.get('materialFile'),
                isTabLocked:(lockType && lockType[3] && lockType[3] == '0'),
                panel:[
                    {type:'tool', tool:['preview','uploadMaterials'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},
                    {type:'filter'},
                    {type:'entity',entity:'resource'}
                ]
            },
            {
                tab:mxResources.get('textAreaTemplate'),
                isTabLocked:(lockType && lockType[4] &&lockType[4] == '0'),
                panel:[
                    {type:'tool',tool:['preview'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},
                    {type:'entity',entity:'textArea'}
                ]
            },
            {
                tab:mxResources.get('form'),
                isTabLocked:(lockType && lockType[5] &&lockType[5] == '0'),
                panel:[
                    {type:'tool',tool:['preview','manageForm'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},
                    {type:'entity',entity:'form'}
                ]
            }
        ];
    }else if(mxUi === 'subject_design'){
        tabInfos = [
            {
                tab:mxResources.get('courseModel'),
                isTabLocked:(lockType && lockType[1] && lockType[1] === '0'),
                panel:[
                    {type:'tool',tool:['trash'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},  //you can set isMultiLocked true to lock multiple button
                    {type:'entity', entity:'subject_design'}
                ]
            }
        ]
    }else if(mxUi === 'course_design'){
        tabInfos = [
            {
                tab:mxResources.get('course_design'),
                isTabLocked:(lockType && lockType[1] && lockType[1] === '0'),
                panel:[
                    {type:'tool',tool:['trash'],isMultiLocked:(lockType && lockType[0] && lockType[0] === '0')},
                    {type:'entity', entity:'parent_course'}
                ]
            }
        ]
    }
    var tabPage = editorUi.formItems.genTabPage(tabInfos, defaultTabPos,this);
    this.allContainer = this.getBodyContainer();
    this.allContainer.appendChild(tabPage.getTabsArea());
    this.allContainer.appendChild(tabPage.getPanelsArea());
    //资源管理的选择和搜索
    //var resourceActionDiv = document.createElement('div');
    //resourceActionDiv.setAttribute('class', 'dialogHeadDiv');
    //var LRShow = document.createElement('span');
    //LRShow.setAttribute('class', 'geBtn');
    //LRShow.innerHTML = mxResources.get('showLR');
    //var options = [{name:'全部',value:0},{name:'新手',value:1},{name:'生手',value:2},{name:'熟手',value:3},{name:'能手',value:4},{name:'高手',value:5}];
    //var testRadio = editorUi.formItems.genRadioField('适用用户:', 'toUser', options);
    //var radioDOM = testRadio.getElContainer();
    //
    //var searchResource = document.createElement('form');
    //searchResource.setAttribute('class', 'searchForm');
    //var inputResource = document.createElement('input');
    //inputResource.setAttribute('name', 'fileName');
    //inputResource.setAttribute('id', 'fileName');
    //this.resourceSearch = document.createElement('span');
    //this.resourceSearch.innerHTML = mxResources.get('search');
    //this.resourceSearch.setAttribute('class', 'geButn');
    //searchResource.appendChild(inputResource);
    //searchResource.appendChild(this.resourceSearch);
    //radioDOM.appendChild(searchResource);
    //
    //resourceActionDiv.appendChild(LRShow);
    //resourceActionDiv.appendChild(radioDOM);
    //mxEvent.addListener(this.resourceSearch, 'click', mxUtils.bind(this, function () {
    //        var query = {};
    //        var strDOM = document.getElementById('fileName');
    //        query.fileName = strDOM.value;
    //
    //        var radioDOM = document.getElementsByName('toUser');
    //        for(var i=0; i<radioDOM.length;i++){
    //            if(radioDOM[i].checked)
    //                query.toUser = radioDOM[i].value;
    //        }
    //
    //        this.removeAllFileEntityBoxes();
    //        editorUi.communication.searchLearningRes(query,mxUtils.bind(this, function (message) {
    //            var fileEntities = message.data;
    //            if (this.validateFileEntities(fileEntities)) {
    //                this.buildFileEntityBoxList(fileEntities, this.viewType);
    //                this.sortFileByTime();
    //                this.showFileEntityBox();
    //            }
    //
    //        }));
    //}));
};
mxUtils.extend(FileManagerDialogBodyPro, DialogBody);

FileManagerDialogBodyPro.prototype.NAME = 'FileManagerDialogBodyPro';

var QPropertyDialogBody = function (ui, cell, title) {
    DialogBody.call(this, title);
    var div = this.getBodyContainer();
    div.style.overflow = 'auto';
    var form = document.createElement('div');
    form.setAttribute('style','height: 530px; padding: 15px;');

    var uploadDiv = document.createElement('div');
    var uploadSpan = document.createElement('span');
    var uploadInput = document.createElement('input');

    var titleDiv = document.createElement('div');
    var titleSpan = document.createElement('span');
    var titleInput = document.createElement('input');

    titleDiv.setAttribute('style', 'margin-top:5px; margin-bottom:5px;');

    form.appendChild(uploadDiv);
    uploadDiv.appendChild(uploadSpan);
    uploadSpan.innerHTML = mxResources.get('uploadMaterial') + ': ';
    uploadDiv.appendChild(uploadInput);
    uploadInput.setAttribute('type', 'file');
    uploadInput.setAttribute('name', 'file');
    uploadInput.setAttribute('id', 'myfile');

    form.appendChild(titleDiv);
    titleDiv.appendChild(titleSpan);
    titleSpan.innerHTML = mxResources.get('materialsName') +': ';
    titleDiv.appendChild(titleInput);
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'LRTitle');

    var textAreaDiv = document.createElement('div');
    var textAreaSpan = document.createElement('span');
    textAreaDiv.setAttribute('style', 'border:1px;');
    form.appendChild(textAreaDiv);
    textAreaDiv.appendChild(textAreaSpan);
    //textAreaDiv.appendChild(textAreaInput);

    textAreaSpan.innerHTML = mxResources.get('description') +':';

    var inputFieldCmpDescription = ui.formItems.genTextareaInputFieldPro(this, mxResources.get('description'), 'description', cell, '100%');
    //var inputFieldCmpLink = ui.formItems.genLinkInputFile(this,mxResources.get('link'), 'link', cell, '100%');
    //var inputFieldCmpMember = ui.formItems.genComboBox(mxResources.get('member'), 'member', cell, userData, '100');
    var options = [{name:mxResources.get('beginner'),value:1},{name:mxResources.get('primaryUser'),value:2},{name:mxResources.get('skilledUser'),value:3},{name:mxResources.get('expert'),value:4},{name:mxResources.get('master'),value:5}];
    var testRadio = ui.formItems.genRadioField(mxResources.get('applicableUsers') +':', 'toUser', options);
    textAreaDiv.appendChild(inputFieldCmpDescription.getElContainer());

    //form.appendChild(inputFieldCmpLink.getElContainer());

    //form.appendChild(inputFieldCmpMember.getElContainer());
    form.appendChild(testRadio.getElContainer());

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        ui.hideDialog.apply(ui, arguments);
    });
    cancelBtn.className = 'geBtn';
    var applyBtn = document.createElement('button');
    /*
     var applyBtn = mxUtils.button(mxResources.get('apply'), function (evt) {
     ui.formItems.updateCell(evt, ui.editor.graph, cell, 'description', inputFieldCmpDescription.getInputValue());
     //ui.formItems.updateCell(evt, ui.editor.graph, cell, 'link', inputFieldCmpLink.getInputValue());
     //ui.formItems.updateCell(evt, ui.editor.graph, cell, 'member', inputFieldCmpMember.getInputField());
     ui.formItems.updateCell(evt, ui.editor.graph, cell, 'toUser', options);
     ui.editor.setModified(true);
     ui.hideDialog.apply(ui, arguments);
     });
     */
    applyBtn.className = 'geBtn gePrimaryBtn';
    /*
     var messageSpan = document.createElement('span');
     messageSpan.setAttribute('style','display:none;');
     messageSpan.setAttribute('id','messageId');
     messageSpan.innerHTML = '正在编辑...';
     */
    var buttons = document.createElement('div');
    buttons.setAttribute('style',' text-align: right; padding:5px; background-color: #F5F5F5;');
    buttons.appendChild(applyBtn);
    buttons.appendChild(cancelBtn);
    //buttons.appendChild(messageSpan);

    div.appendChild(form);
    div.appendChild(buttons);
    applyBtn.innerHTML=mxResources.get('ok');


    mxEvent.addListener(applyBtn, 'click', mxUtils.bind(this, function () {
        /*
         var messageSpan = document.getElementById('messageId');
         messageSpan.setAttribute('style', 'display:block');
         */

        var learningResObj = {isDeleted: '0'};

        var radioDOM = document.getElementsByName('toUser');
        for(var i=0; i<radioDOM.length;i++){
            if(radioDOM[i].checked)
                learningResObj.toUser = radioDOM[i].value;
        }

        var richText = inputFieldCmpDescription.getInputValue();
        //var textAreaDOM = document.getElementById('textAreaDesId');
        learningResObj.description = richText;

        var titleDOM = document.getElementById('LRTitle');

        var formData = new FormData();

        var fileInput = document.getElementById('myfile');
        var files = fileInput.files;
        var file = files[0];

        formData.append("fileName",titleDOM.value);
        formData.append("file",file);


        var xhr = new XMLHttpRequest();
        //var path = 'http://218.106.119.150:8088/OfficeTransfer/OfficeHandler';

        xhr.open('post', resourceServerHost+'OfficeHandler', true);

        xhr.onload = function(e){
            if(this.status == 200){
                var result = JSON.parse(this.response);
                learningResObj.sourceF = result.sourceF;
                learningResObj.fileName = result.sourceF.substr(7);
                learningResObj.transformF = result.transformF;
                learningResObj.fileType = result.fileType;
                learningResObj.materialsId = result.materialsId;
                learningResObj.size = result.fileSize;
                ui.communication.saveLearningRes(learningResObj, mxUtils.bind(this, function (message) {
                    //alert(mxResources.get('editSuccessfully'));
                    ui.showDialog(new tipDialogBody(ui, mxResources.get('editSuccessfully')), 300, null, true, true);
                    ui.hideDialog.apply(ui, arguments);
                    ui.editLearningResource('learningResEdit');
                    //ui.isTrashSelected = false;

                }));
            }
        }
        xhr.send(formData);
    }));

};
mxUtils.extend(QPropertyDialogBody, DialogBody);
// a preview of file function

var PreviewFuc = function(editorUi,filePreviewLink,objData){
    if(objData.fileName){
        var fileName = objData.fileName;
    }else{
        var fileName = objData.name;
    }
    if (objData.materialsId){
        var fileId = objData.materialsId;
    }else {
        var fileId = objData.id;
    }
    filePreviewLink.onclick = function(){
        filePreviewLink.style.color = '#551A8B';
        var dbSourcePath;
        if (objData.filePath) {
            dbSourcePath = objData.filePath;
        }else if (objData.transformF) {
            dbSourcePath = objData.transformF;
        }else if(objData.sourceF){
            dbSourcePath = objData.sourceF;
        }else if(editorUi.isOffice(objData.type) || objData.type == 'pdf' || objData.type == 'txt'){
            dbSourcePath = 'transfer/'+ objData.id + '.pdf';
        }else {
            dbSourcePath = 'upload/'+objData.id + '.'+ objData.type;
        }
        var ownerId;
        if(objData.ownerId){
            ownerId =  objData.ownerId;
        }
        var DBRShowDialogBody = new LRShowDialogBody(editorUi, fileName, fileId, dbSourcePath, objData.fileType, ownerId);
        editorUi.showDialog(DBRShowDialogBody, 880, 650, true, true);
    };
};
/*PreviewFuc.prototype.getdiv = function () {
 return this.filePreviewLink;
 }*/

var editObjectDialogBody = function(editorUi, cell, next) {
    DialogBody.call(this, mxResources.get ('editObjectData'));
    var container = this.getBodyContainer();
    //judge if it's a output file or not
    var isOutputDataObj = false;
    var cellArray = editorUi.editor.graph.findAllCellsUndParent();
    for (var i = 0; i < cellArray.length; i++){
        if (cellArray[i].target && cellArray[i].target.id === cell.id) {
            isOutputDataObj = true;
        }
    }
    var objectResource = {};
    var objectInfoDiv = document.createElement('div');
    objectInfoDiv.setAttribute('style', 'text-align: left');
    var objectName = document.createElement('input');
    objectName.setAttribute('style', 'width: 200px; margin: 30px 0 0 10px;');
    objectName.setAttribute('placeholder', mxResources.get('dataName'));
    var objectDescription = document.createElement('textArea');
    objectDescription.setAttribute('style', 'margin: 20px 0 10px 10px; width: 500px; height: 250px;');
    objectDescription.setAttribute('placeholder', mxResources.get('dataDescription'));
    var originalData = document.createElement('div');
    var resourceContainer = document.createElement('div');
    var uploadBtn = document.createElement('button');
    uploadBtn.innerHTML = mxResources.get('uploadMaterial');
    uploadBtn.setAttribute('style', 'margin: 10px 0 10px 10px;');
    originalData.setAttribute('style', 'margin: 10px 0 10px 10px;');
    var filePreviewLink = document.createElement('span');
    //var filePreLink =  document.createElement('span');
    uploadBtn.onclick = function () {
        editorUi.editLearningResource(mxResources.get('uploadMaterial'),'','','uploadResource', mxUtils.bind(this, function (data) {
            if(data) {
                objectResource = {
                    id : data.materialsId,
                    name : data.fileName,
                    type : data.fileType
                };
                editorUi.hideDialog();
                originalData.innerHTML =mxResources.get("selected") + ":";
            }
            filePreviewLink.innerHTML = data.fileName;
            filePreviewLink.className = 'filePreview';
            originalData.appendChild(filePreviewLink);
            PreviewFuc(editorUi,filePreviewLink,data);
            //若原来已有文件，则首先解除该文件的链接
            var uploadedRes = cell.getAttribute('uploadResource');
            if(uploadedRes){
                editorUi.communication.linkResource(false,uploadedRes.id);
            }
            //标记资源引用
            editorUi.communication.linkResource(true,data.materialsId);
        }))
    };
    objectInfoDiv.appendChild(objectName);
    objectInfoDiv.appendChild(objectDescription);
    if (!isOutputDataObj) {
        objectInfoDiv.appendChild(resourceContainer);
        resourceContainer.appendChild(uploadBtn);
        resourceContainer.appendChild(originalData);
    }
    var btnGroup = document.createElement('div');
    if (cell.getAttribute('label')) {
        objectName.value = cell.getAttribute('label');
    }
    if (cell.getAttribute('description')) {
        objectDescription.value = cell.getAttribute('description');
    }
    if (cell.getAttribute('uploadResource')) {
        originalData.innerHTML = mxResources.get("selected") + ":";
        var nameLink = document.createElement('span');
        nameLink.innerHTML = JSON.parse(cell.getAttribute('uploadResource')).name;
        nameLink.className = 'filePreview';
        originalData.appendChild(nameLink);
        objectResource = cell.getAttribute('uploadResource');
        PreviewFuc(editorUi,nameLink,JSON.parse(objectResource));
    }
    btnGroup.setAttribute('style','text-align: right; padding:5px; background-color: #F5F5F5;');
    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        var objectData = {
            "name":objectName.value,
            "description":objectDescription.value,
            "resourceType":objectResource.type
        };
        if (!isOutputDataObj) {
            if (!objectResource.id) {
                // alert('没有上传资源文件！');
                objectData.resourceType = 'text';
                //console.log(objectData);
            }else {
                objectData['uploadResource'] = objectResource;
                console.log(objectData);
                next(objectData);
            }
            editorUi.hideDialog();
            editorUi.editor.graph.refresh();
        } else {
            console.log(objectData);
            editorUi.hideDialog();
            next(objectData);
        }
    });
    okBtn.className = "geBtn gePrimaryBtn";
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function () {
        editorUi.hideDialog();
    });
    cancelBtn.className = "geBtn";
    btnGroup.appendChild(okBtn);
    btnGroup.appendChild(cancelBtn);
    container.appendChild(objectInfoDiv);
    container.appendChild(btnGroup);
};
mxUtils.extend(editObjectDialogBody, DialogBody);
/*
* type: 'create'/'edit'/'view'
* */
var editQuestionDialogBody = function(type, editorUi, questionInfo, next) {
    if(type === 'view'){
        title = mxResources.get ('previewExam');
    }else {
        title = mxResources.get ('editExam');
    }
    DialogBody.call(this, title);
    var container = this.getBodyContainer();
    container.setAttribute('style', 'height: inherit;');
    var frameContainer = document.createElement('iframe');
    frameContainer.setAttribute('style', 'height: inherit;');
    frameContainer.width = '100%';
    if (type === 'edit'){
        var questionId = questionInfo;
        frameContainer.setAttribute('src', examUrl + '/exam/editExam_V2?examID=' + questionId);
        if(next){
            next();
        }
    }else if(type === 'view'){
        var questionId = questionInfo;
        frameContainer.setAttribute('src', examUrl + '/exam/view?examID=' + questionId);
        if(next){
            next();
        }
    } else{
        var questionName = escape(questionInfo);
        //make a int uuid eg.: "1690693609022053"
        var uuid = parseInt((Date.now() - 1300000000000).toString() + Math.random().toString().slice(15));
        frameContainer.setAttribute('src', examUrl + '/exam/editExam_V2?examID=' + uuid + '&name=' + questionName);
        next(uuid);
    }
    /*160720换为新试题系统
    var linkDiv = document.createElement('input');
    linkDiv.setAttribute('style', 'display: none');
    linkDiv.setAttribute('id', 'linkId');
    frameContainer.setAttribute('name','frameName');
    frameContainer.setAttribute('src','/exam/toEditExam_course?type=fromCourse');
    frameContainer.onload= function(){
        var frameHtml = frameContainer.contentWindow.document;
        var getId = frameHtml.getElementsByClassName('childSubBut');//数组，共3个按钮，均需要监控
        for (var i = 0; i < getId.length; i++){
            getId[i].onclick = function () {
                frameName.window.createExam();
                var linkValue = linkDiv.value;
                var loopQuery = setInterval(function () {
                    if (linkDiv.value!=='') {
                        next(linkDiv.value);
                        console.log('get question id success');
                        clearInterval(loopQuery);
                    }
                }, 50);
            };
        }

    };
    //linkDiv.oninput = function () {
    //    console.log(linkDiv.value);
    //    next(linkDiv.value);
    //};
    container.appendChild(linkDiv);
    */
    container.appendChild(frameContainer);
};
mxUtils.extend(editQuestionDialogBody, DialogBody);
/**
 * a dialog for choosing which member to share with
 */
var ManageBoardUsers = function (editorUi, boardId, next) {
    DialogBody.call(this, mxResources.get('shareBoardManager'));
    this.editorUi = editorUi;
    this.boardId = boardId;
    this.container = this.getBodyContainer();
    this.changeTypeList=[];
    this.init();
};
mxUtils.extend(ManageBoardUsers,DialogBody);

ManageBoardUsers.prototype.init = function () {
    var showBoardUser = document.createElement('div');
    showBoardUser.setAttribute('style', 'padding:20px 10px;');
    var showUserTitle = document.createElement('div');
    showUserTitle.innerHTML = '<b>' + mxResources.get('participant') + '</b>';
    var showUserContainer = document.createElement('div');
    showUserContainer.setAttribute('style', 'border-top:2px solid #C5C5C5;max-height: 250px;overflow: auto;');
    showBoardUser.appendChild(showUserTitle);
    showBoardUser.appendChild(showUserContainer);
    //===
    var comboBoxContainer = document.createElement('div');
    comboBoxContainer.setAttribute('style', 'background-color: #f5f5f5;padding: 20px 10px 40px 10px;;margin: 0 10px;');
    comboBoxContainer.style.padding = '20px 10px 40px 10px;';
    var comboBox = this.editorUi.formItems.genComboBox(mxResources.get('invite'),'member', null, [], '100');
    comboBox.getElContainer().style.float = 'left';
    comboBox.getElContainer().style.width = '85%';
    comboBoxContainer.appendChild(comboBox.getElContainer());
    var userTypeDiv = document.createElement('div');
    userTypeDiv.setAttribute('style', 'margin-top: 17px;');
    var selectUserType = document.createElement('select');
    selectUserType.setAttribute('style', 'height: 25px;');
    selectUserType.innerHTML =
        '<option value = "owner">主人</option>' +
        '<option value = "edit" selected>编辑</option>' +
        '<option value = "read">只读</option>';
    userTypeDiv.appendChild(selectUserType);
    comboBoxContainer.appendChild(userTypeDiv);
    //====
    var btnGroup = document.createElement('div');
    btnGroup.setAttribute('style','margin: 60px 5px 5px 0;overflow: auto;');
    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'geBtn gePrimaryBtn';
    cancelBtn.innerHTML = mxResources.get('cancelSharing');
    var applyBtn = document.createElement('button');
    applyBtn.className = 'geBtn gePrimaryBtn';
    applyBtn.innerHTML = mxResources.get('ok');
    btnGroup.appendChild(applyBtn);
    btnGroup.appendChild(cancelBtn);
    this.container.appendChild(showBoardUser);
    this.container.appendChild(comboBoxContainer);
    this.container.appendChild(btnGroup);
    var me = this;
    //===取消分享
    cancelBtn.onclick = function () {
        me.editorUi.showDialog(new messageDialogBody(me.editorUi, mxResources.get('okToCancelSharing'), function () {
            me.editorUi.communication.removeAllUserOfBoard({'boardId': me.boardId}, function () {
                me.editorUi.hideDialog();
            })
        }), 300, null, true, true);
    };
    var queryObj = {
        "boardId":this.boardId
    };
    this.editorUi.communication.loadAllUserOfBoard(queryObj, function (originalBoardUser) {
        if (originalBoardUser.length === 0) {
            showUserContainer.insertBefore(me.addUserDiv({name:userName,id:userId},'owner',false), showUserContainer.firstChild);
        } else {
            for(var i = 0; i < originalBoardUser.length; i++) {
                if (originalBoardUser[i].userData.id === userId) {
                    showUserContainer.appendChild(me.addUserDiv(originalBoardUser[i].userData, originalBoardUser[i].userType, false));
                }else {
                    showUserContainer.appendChild(me.addUserDiv(originalBoardUser[i].userData, originalBoardUser[i].userType,true));
                }
            }
        }
        applyBtn.onclick = function () {
            var count = 0;
            //save new user
            var newBoardUser = comboBox.getInputField();
            var newUserType = selectUserType.value;
            if (newBoardUser && newBoardUser.length > 0) {
                count++;
                var isMember = false;
                for (var i = 0; (i < newBoardUser.length) && (!isMember); i++){
                    for (var j = 0; j < originalBoardUser.length; j++) {
                        if (newBoardUser[i].id === originalBoardUser[j].userData.id) {
                            //db中已有
                            isMember = true;
                            me.editorUi.showDialog(new messageDialogBody(me.editorUi, newBoardUser[i].name + mxResources.get('isAlreadyBoardMember')), 300, null, true, true);
                            break;
                        }
                    }
                }
                if (!isMember) {
                    //保存新邀请
                    var queryObj = {
                        "boardId": me.boardId,
                        "userData": JSON.stringify(newBoardUser),
                        "userType": newUserType
                    };
                    //me.editorUi.communication.loadAllUsers(mxUtils.bind(this,function(message){
                    //  console.log(message);
                    //   this.usersNotice = message;
                    //    for(var i = 0; i < message.length; i++){
                    //        usersNotice[message[message[i].userId]] = 0;
                    //        console.log(usersNotice[message[message[i].userId]]);
                    //    }
                    //
                    //}));
                    me.saveBoardUsers(queryObj, function (data) {
                        console.log('save new users successfully');
                        //var newNotice = userName +'shares a new file for you!';
                        var obj = {
                            fromMe:{
                                userId:userId,
                                userName:userName
                            },
                            toOthers: JSON.parse(queryObj.userData),
                            noticeType : 'shareFile',
                            content:{
                                gFileId: me.editorUi.editor.getFileId(),
                                gFileName: me.editorUi.editor.getFilename()
                            }
                        };
                        app_socket.emit('newNotice',obj);
                        for(var i = 0; i < data.length; i++) {
                            showUserContainer.appendChild(me.addUserDiv(data[i].userData, data[i].userType, true));
                        }
                        if (originalBoardUser.length === 0) {
                            var ownerObj = {
                                "boardId": me.boardId,
                                "userData": JSON.stringify([{'name':userName, 'id':userId}]),
                                "userType": 'owner'
                            };
                            me.saveBoardUsers(ownerObj, function () {
                                console.log('save owner successfully');
                            });
                        }
                        count--;
                        if (count === 0) {
                            me.refresh();
                        }
                    });
                }
            }
            //change userType
            if (me.changeTypeList && me.changeTypeList.length > 0) {
                count++;
                var changeObj = {
                    "boardId": me.boardId,
                    "changes":JSON.stringify(me.changeTypeList)
                };
                me.editorUi.communication.changeBoardUserType(changeObj, function () {
                    console.log('changed successfully');
                    me.changeTypeList = [];
                    count--;
                    if (count === 0) {
                        me.refresh();
                    }
                })
            }
        }
    });
};
//ManageBoardUsers.prototype.getUsersNoticeNum = function(){
//    return this.usersNotice;
//}
ManageBoardUsers.prototype.refresh = function () {
    while (this.container.firstChild){
        this.container.removeChild(this.container.firstChild);
    }
    this.init();
}
ManageBoardUsers.prototype.saveBoardUsers = function (queryObj,next) {
    this.editorUi.communication.saveBoardUsers(queryObj, function (resData) {
        if (next) {
            next(resData);
        }
    });
};
/**
 * userDate格式：{name:xx, id:xx};
 * userType: 'owner'/'edit'/'read'
 */
ManageBoardUsers.prototype.addUserDiv = function (userData, userType, isDeletable) {
    var me = this;
    var boardUserBox = document.createElement('div');
    boardUserBox.setAttribute('style', 'height: 30px; border-bottom: 1px solid #C5C5C5; line-height: 30px; padding: 0 10px;');
    boardUserBox.setAttribute('userId', userData.id);
    var userName = document.createElement('span');
    userName.innerHTML = userData.name;
    //===
    boardUserBox.appendChild(userName);
    if(isDeletable) {
        var removeIcon = document.createElement('span');
        removeIcon.setAttribute('style', 'float: right; cursor: pointer;width:10px;');
        removeIcon.innerHTML = 'X';
        removeIcon.onclick = function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
            //delete a user
            var delObj = {
                "boardId": me.boardId,
                "userIds": JSON.stringify([this.parentNode.getAttribute('userId')])
            };
            me.editorUi.communication.deleteBoardUsers(delObj, function () {
                console.log('delete successfully');
                me.refresh();
            });
        };
        boardUserBox.appendChild(removeIcon);
    }
    var editUserType = document.createElement('span');
    editUserType.setAttribute('style', 'margin-right: 180px;float: right;');
    if (!isDeletable) {
        editUserType.style.marginRight = '190px';
    }
    var editUserTypeSelect = document.createElement('select');
    editUserTypeSelect.innerHTML =
        '<option value = "owner">主人</option>' +
        '<option value = "edit" selected>编辑</option>' +
        '<option value = "read">只读</option>';
    editUserTypeSelect.value = userType;
    editUserType.appendChild(editUserTypeSelect);
    editUserTypeSelect.onchange = function () {
        me.changeTypeList.push({'userId': this.parentNode.parentNode.getAttribute('userId'), 'newType':this.value});
    };
    boardUserBox.appendChild(editUserType);
    return boardUserBox;
};
/**
 * comment dialog (comment and show comments)
 */
var TaskCommentsDialogBody = function (editorUi, cell, next) {
    DialogBody.call(this, mxResources.get('comment'));
    var container = this.getBodyContainer();
    container.style.maxHeight = '550px';
    container.style.overflowY = 'auto';
    var commentDiv = document.createElement('div');
    commentDiv.setAttribute('style', 'background-color: #f5f5f5; padding-top: 5px;border-bottom: 1px solid #C5C5C5;padding-bottom: 10px;');
    //评论
    var commentBox = document.createElement('div');
    commentBox.setAttribute('style', 'background-color: #fff; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,.23);margin: 5px;');
    var commentBoxInput = document.createElement('textarea');
    commentBoxInput.setAttribute('style', 'border: 0;min-height: 75px; padding: 9px 11px 0; width: 500px; resize: none; transition: background 85ms ease-in,border-color 85ms ease-in; overflow: hidden; word-wrap: break-word;');
    commentBoxInput.onfocus = function () {
        this.style.outline = 'none';
    };
    commentBox.appendChild(commentBoxInput);
    //提交按钮
    var submitDiv = document.createElement('div');
    submitDiv.setAttribute('style', 'padding-left: 5px;margin-bottom: 5px');
    var submitBtn = document.createElement('button');
    submitBtn.className = 'geBtn gePrimaryBtn';
    submitBtn.innerHTML = mxResources.get('submit');
    submitBtn.style.float = 'none';
    submitBtn.style.marginLeft = '0px';
    submitDiv.appendChild(submitBtn);

    //事件
    submitBtn.onclick = mxUtils.bind(this, function () {
        showCommentDiv.insertBefore(this.createCommentShow(editorUi,userName,null, mxResources.get('justNow'),commentBoxInput.value,null),showCommentDiv.firstChild);
        var queryObj = {
            content: commentBoxInput.value,
            taskId: cell.id,
            fileId: editorUi.editor.getFileId()
        };
        editorUi.communication.saveTaskComment(queryObj, mxUtils.bind(this, function (commentData) {
            commentBoxInput.value = null;
            showCommentDiv.replaceChild(this.createCommentShow(editorUi, commentData.userData.userName,userId, new Date(commentData.time).toLocaleString(), commentData.content,commentData.id, commentData.userData.userId), showCommentDiv.firstChild);
        }));
        var obj = {
            boardId : editorUi.editor.getFileId()
        };
        editorUi.communication.loadAllUserOfBoard(obj,mxUtils.bind(this,function(resData){
            console.log(resData);
            var others = [];
            for(var i = 0; i < resData.length; i++){
                others[i] = {
                    id : resData[i].userData.id,
                    name : resData[i].userData.name
                };
            }
            var msgObj = {
                fromMe:{
                    userId : userId,
                    userName: userName
                },
                toOthers: others,
                noticeType : 'newComment',
                content:{
                    gFileId: editorUi.editor.getFileId(),
                    gFileName: editorUi.editor.getFilename(),
                    content: queryObj.comment
                }
            };
            app_socket.emit('newNotice',msgObj);
        }));

    });
    commentDiv.appendChild(commentBox);
    commentDiv.appendChild(submitDiv);
    container.appendChild(commentDiv);
    //已有评论
    var showCommentDiv = document.createElement('div');
    showCommentDiv.setAttribute('style', 'margin-bottom: 20px;');
    container.appendChild(showCommentDiv);
    var queryObj = {
        taskId: cell.id,
        fileId: editorUi.editor.getFileId()
    };
    editorUi.communication.loadTaskComment(queryObj, mxUtils.bind(this, function (taskCommentDatas) {
        for (var i =0; i<taskCommentDatas.length; i++) {
            showCommentDiv.insertBefore(this.createCommentShow(editorUi,taskCommentDatas[i].userData.userName,userId, new Date(taskCommentDatas[i].time).toLocaleString(), taskCommentDatas[i].content,taskCommentDatas[i].id,taskCommentDatas[i].userData.userId),showCommentDiv.firstChild);
        }
    }));
};
mxUtils.extend(TaskCommentsDialogBody,DialogBody);
TaskCommentsDialogBody.prototype.createCommentShow = function (editorUi,userName,userId, time, comment,commentId,commentUserId) {
    var oldCommentDiv = document.createElement('div');
    var oldCommentUser = document.createElement('div');
    var userSpan = document.createElement('span');
    userSpan.innerHTML = userName;
    userSpan.setAttribute('style', 'font-weight: bold;');
    var timeSpan = document.createElement('span');
    timeSpan.innerHTML = time;
    timeSpan.setAttribute('style', 'font-size: smaller; color: #707070; margin-left: 20px;');
    //删除评论按钮
    var delCommentBtn = document.createElement('button');
    //delCommentBtn.className = 'geBtn';
    delCommentBtn.innerHTML = mxResources.get('delete');
    oldCommentUser.appendChild(userSpan);
    oldCommentUser.appendChild(timeSpan);
    oldCommentUser.appendChild(delCommentBtn);
    delCommentBtn.setAttribute('style','float:right;');
    oldCommentUser.setAttribute('style', 'padding: 5px; margin: 5px 0 0 5px;');
    var oldCommentContent = document.createElement('div');
    oldCommentContent.innerHTML = comment;
    oldCommentContent.setAttribute('style', 'background-color: #f5f5f5; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,.23); margin: 0 5px 5px 10px; padding: 5px; word-wrap: break-word; color: #707070;');
    oldCommentDiv.appendChild(oldCommentUser);
    oldCommentDiv.appendChild(oldCommentContent);
    //已有评论的删除
    delCommentBtn.onclick = mxUtils.bind(this, function () {
        if(userId ===  commentUserId){
            var obj = {
                id : commentId
            };
            //editorUi.communication.loadAllTaskType('FE6AD795',function(data){
            //    console.log(data);
            //    var chooseTaskDialog = new chooseTaskDialogBody(editorUi,data);
            //    editorUi.showDialog(chooseTaskDialog, 400, 200, true, true);
            //});
            editorUi.communication.removeTaskComment(obj, function () {
                oldCommentDiv.parentNode.removeChild(oldCommentDiv);
                //mxUtils.confirm('delete success!');
                var message = mxResources.get('DeleteSuccess');
                var tipDialog = new tipDialogBody(editorUi,message);
                editorUi.showDialog(tipDialog, 300, null, true, true);
            });
            var obj = {
                boardId : editorUi.editor.getFileId()
            };
            editorUi.communication.loadAllUserOfBoard(obj,mxUtils.bind(this,function(resData) {
                var others = [];
                for(var i = 0; i < resData.length; i++){
                    others[i] = {
                        id : resData[i].userData.id,
                        name : resData[i].userData.name
                    };
                }
                var obj = {
                    fromMe: {
                        userId: userId,
                        userName: userName
                    },
                    toOthers: others,
                    noticeType: 'deleteComment',
                    content: {
                        gFileId: editorUi.editor.getFileId(),
                        gFileName: editorUi.editor.getFilename(),
                        comment:comment
                    }
                };
                app_socket.emit('newNotice', obj);
            }));
        }else{
            //mxUtils.confirm('Sorry,you can not delete other\'s comment!');
            var message = mxResources.get('SorryYouCan\'tDeleteOther\'sComment');
            var tipDialog = new tipDialogBody(editorUi,message);
            editorUi.showDialog(tipDialog, 300, null, true, true);
        }

    });

    return oldCommentDiv;
};
//sort by position
function positionAscSort(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++)
        arr[i] = array[i];
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].position < pivot.position) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return positionAscSort(left).concat([pivot], positionAscSort(right));
}
var chooseTaskDialogBody = function (editorUi,taskData, next) {
    DialogBody.call(this, mxResources.get('chooseAnOption') +': ');
    var div = this.getBodyContainer();
    var chooseDiv = document.createElement('div');
    var contextDiv = document.createElement('div');
    var taskGroupTag = document.createElement('span');
    taskGroupTag.innerHTML = mxResources.get('taskGroup') +': ';
    var taskGroup = document.createElement('select');
    //var taskGroupNum = 'select'+count1;
    chooseDiv.setAttribute('style','height:160px;margin:center');
    contextDiv.setAttribute('style','text-align: center;line-height: 60px');
    var taskNameTag = document.createElement('span');
    taskNameTag.innerHTML = '   ' + mxResources.get('task') +': ';
    var taskName = document.createElement('select');
    //var taskNameNum = 'select'+count2;
    contextDiv.appendChild(taskGroupTag);
    contextDiv.appendChild(taskGroup);
    contextDiv.appendChild(taskNameTag);
    contextDiv.appendChild(taskName);

    for(var i = 0 ; i < taskData.length; i++){
        console.log(taskData[0].taskGroup.mxCell.mxGeometry.$.x);
        var x =  taskData[i].taskGroup.mxCell.mxGeometry.$.x;
        var y =  taskData[i].taskGroup.mxCell.mxGeometry.$.y;
        taskData[i].location = y * 10000 + x;
    }
    var groupName = [];
    for (var i = 0; i < taskData.length; i++) {
        var subTasks = [];
        for (var j = 0; j < taskData[i].subTask.length; j++) {
            var subTask = {
                name : taskData[i].subTask[j].$.label,
                id : taskData[i].subTask[j].$.id
            };
            subTasks[j] = subTask;
        }
        //var subTasksArr = nameAscSort(subTasks);
        var x = parseInt( taskData[i].taskGroup.mxCell.mxGeometry.$.x );
        var y = parseInt( taskData[i].taskGroup.mxCell.mxGeometry.$.y );
        //y = -y;
        var position = ( y+100000) + x;
        groupName[i] = {
            name : taskData[i].taskGroup.$.label,
            position : position,
            id : taskData[i].taskGroup.$.id,
            subTask : subTasks
        };
        //console.log(groupName);
    }


    var groupNameRes = positionAscSort(groupName);
    for (var i = 0; i < groupNameRes.length; i++) {
        $(taskGroup).append("<option value='" + groupNameRes[i].id + "'>" + groupNameRes[i].name + "</option>");
    }
    for (var j = 0; j < groupNameRes[0].subTask.length; j++) {
        var str = JSON.stringify(groupNameRes[0].subTask[j]);
        str = str.replace(/ /g, '&nbsp;');//空格换为html形式
        $(taskName).append("<option value='" + str + "'>" + groupNameRes[0].subTask[j].name + "</option>");
    }
    taskGroup.onchange = function(){
        for(var i = 0 ;i < groupNameRes.length; i++){
            if(taskGroup.value === groupNameRes[i].id){
                //$(taskName).empty().append("<option value=" + taskNames1[i].value + ">" + taskNames1[i].name + "</option>");
                $(taskName).empty();
                for(var j = 0 ; j < groupNameRes[i].subTask.length; j++){
                    var str = JSON.stringify(groupNameRes[i].subTask[j]);
                    str = str.replace(/ /g, '&nbsp;');//空格换为html形式
                    $(taskName).append("<option value='" + str + "'>" + groupNameRes[i].subTask[j].name + "</option>");
                }
            }
        }
    };
    var btnContainer = document.createElement('div');
    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        editorUi.hideDialog();
        if (next) {
            next(taskName.value);
        }
    });
    okBtn.setAttribute('class','geBtn gePrimaryBtn');
    btnContainer.setAttribute('style', 'height:35px;width:100%;border-bottom:solid 1px #e8e9e;background-color:#EEEEEE');
    div.appendChild(chooseDiv);
    chooseDiv.appendChild(contextDiv);
    btnContainer.appendChild(okBtn);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(chooseTaskDialogBody, DialogBody);

//提示对话框
var tipDialogBody = function (editorUi, message, arrange, next) {
    DialogBody.call(this, mxResources.get('tooltips'));
    this.isTipsDlg = true;
    var div = this.getBodyContainer();
    var text = document.createElement('div');
    text.innerHTML = message;
    var btnContainer = document.createElement('div');
    var btnDiv = document.createElement('div');
    btnDiv.setAttribute('class','butnDiv');
    btnDiv.setAttribute('style', 'text-align:right;padding: 5px;');
    var okBtn = mxUtils.button(mxResources.get('ok'), function () {
        editorUi.hideDialog(true);
        if (next) {
            next();
        }
    });
    okBtn.className = 'geBtn';
    this.addListener('onRendered', function(){
        okBtn.focus();
    });
    text.setAttribute('class','txt');
    if (arrange && (arrange === 'left' || arrange === 'center' || arrange === 'right')){
        text.style.textAlign = arrange;
    }
    okBtn.setAttribute('class','geBtn gePrimaryBtn');
    btnDiv.appendChild(okBtn);
    btnContainer.appendChild(btnDiv);
    div.appendChild(text);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(tipDialogBody, DialogBody);
//when user disconnect the socket, alert a dialog for saving the file which has chat information
var logoutTipDialogBody = function (editorUi, message) {
    DialogBody.call(this, mxResources.get('tooltips'));
    var div = this.getBodyContainer();
    var text = document.createElement('div');
    text.innerHTML = message;
    var btnContainer = document.createElement('div');
    var okBtn = mxUtils.button(mxResources.get('true'), function () {
        editorUi.hideDialog();
        editorUi.saveModelFile(true,mxUtils.bind(this,function(){
            var query = {
                'name':userName,
                'id':userId
            };
            appSocket.emit('logout',query);
            window.location = '/logout?apiKey='+apiKey;
        }));
    });
    okBtn.className = 'geBtn gePrimaryBtn';
    text.setAttribute('style', 'text-align: center; margin: 20px;');
    okBtn.setAttribute('style', 'float:right; margin: 5px;');
    btnContainer.appendChild(okBtn);
    var cancelBtn = mxUtils.button(mxResources.get('false'), function () {
        var query = {
            'name':userName,
            'id':userId
        };
        appSocket.emit('logout',query);
        window.location = '/logout?apiKey='+apiKey;
    });
    cancelBtn.className = 'geBtn';
    cancelBtn.setAttribute('style', 'float:right; margin: 5px;');
    btnContainer.appendChild(cancelBtn);
    div.appendChild(text);
    div.appendChild(btnContainer);
    this.container = div;
};
mxUtils.extend(logoutTipDialogBody, DialogBody);
