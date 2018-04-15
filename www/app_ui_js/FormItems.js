/**
 * Created by DISI on 22.06.2015.
 */
var FormItems = function (editorUi) {
    this.editorUi = editorUi;
    this.editor = editorUi.editor;
    this.graph = this.editor.graph;
    this.communication = editorUi.communication;
};
FormItems.prototype.genShowTextField = function (labelText, valueName, cell) {
    var rootContainer = document.createElement('div');
    rootContainer.setAttribute('style', 'padding: 10px 5px; border-top: 1px dashed #B8B8B8;');
    mxUtils.write(rootContainer, labelText + ':');
    var showTextDiv = document.createElement('div');
    showTextDiv.setAttribute('style', ' padding: 5px 10px; font-size: 14px;');
    showTextDiv.style.whiteSpace = 'normal';
    var isObjectValue = (typeof cell.value === 'object');
    var getValue = function () {
        if (isObjectValue) {
            if (valueName === 'member' && (cell.getAttribute('member'))) {
                var memberString = cell.getAttribute('member');
                var memberJson = JSON.parse(memberString);
                var valueArrs = [];
                for (var i = 0; i < memberJson.length; i++) {
                    valueArrs[i] = memberJson[i].name;
                }
                return valueArrs;
            } else if (valueName === 'creator' && (cell.getAttribute('creator'))) {
                var creatorString = cell.getAttribute('creator');
                var creatorJson = JSON.parse(creatorString);
                return creatorJson.userName;
            }
            return cell.getAttribute(valueName, '');
        } else {
            return cell.value;
        }
    };
    showTextDiv.innerHTML = (getValue());
    rootContainer.appendChild(showTextDiv);
    var cmp = {
        rootContainer: rootContainer
    };
    return cmp;
};
FormItems.prototype.genRadioField = function (message, valueName, options, defaultValue, isList) {
    this.radioBody = new RadioInputField(this.editorUi, message, valueName, options, defaultValue, isList);
    return this.radioBody;
};
FormItems.prototype.genLinkInputFile = function (dialogBody, abelText, valueName, cell, width) {
    this.LinkInputField = new genTextInputField(this.editorUi, dialogBody, abelText, valueName, cell, width);
    return this.LinkInputField;
};
FormItems.prototype.genTextareaInputField = function (labelText, valueName, cell, width) {
    var me = this;
    var graph = this.graph;
    var defaultWidth = '100px';
    var rootContainer = document.createElement('div');
    mxUtils.write(rootContainer, labelText + ':');

    var level1InnerContainer = document.createElement('div');
    level1InnerContainer.style.backgroundColor = 'transparent';
    level1InnerContainer.style.borderColor = 'transparent';
    level1InnerContainer.style.whiteSpace = 'nowrap';
    level1InnerContainer.style.textOverflow = 'clip';
    level1InnerContainer.style.cursor = 'default';

    if (!mxClient.IS_VML) {
        level1InnerContainer.style.paddingRight = '20px';
    }

    var isObjectValue = (typeof cell.value === 'object') ? true : false;
    var getValue = function () {
        if (isObjectValue) {
            return cell.getAttribute(valueName, '');
        } else {
            return cell.value;
        }
    };

    var textarea = document.createElement('textarea');
    textarea.style.resize = 'none';
    textarea.style.width = width;
    textarea.style.height = '100px';
    textarea.style.backgroundImage = 'url(' + IMAGE_PATH + '/clear.gif)';
    textarea.style.backgroundRepeat = 'no-repeat';
    textarea.style.backgroundPosition = '100% 97%';
    textarea.value = getValue();


    var cross = document.createElement('div');
    cross.setAttribute('title', mxResources.get('reset'));
    cross.style.position = 'relative';
    cross.style.left = '-16px';
    cross.style.width = '12px';
    cross.style.height = '14px';
    cross.style.cursor = 'pointer';

    // Workaround for inline-block not supported in IE
    cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
    cross.style.top = ((mxClient.IS_VML) ? 0 : -3) + 'px';

    // Needed to block event transparency in IE
    cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

    level1InnerContainer.appendChild(textarea);
    level1InnerContainer.appendChild(cross);
    rootContainer.appendChild(level1InnerContainer);

    //mxEvent.addListener(textarea, 'change', function (evt) {
    //    // alternative keypress
    //    me.updateCell(evt, graph, cell, valueName, textarea);
    //});

    var cmp = {
        rootContainer: rootContainer,
        inputField: textarea
    };

    return cmp;
};

FormItems.prototype.genTextareaInputFieldPro = function (dialogBody, labelText, valueName, cell, width) {
    //if(this.richTextareaInputField){
    //
    //}else{
    this.richTextareaInputField = new RichTextareaInputField(this.editorUi, this.communication, dialogBody, labelText, valueName, cell, width);
    //}
    return this.richTextareaInputField;

};
FormItems.prototype.updateCell = function (evt, graph, cell, valueName, field, callback) {
    graph.getModel().beginUpdate();
    try {
        if (typeof cell.value === 'object') {

            if (valueName === 'link') {
                var link = mxUtils.trim(field);
                graph.setLinkForCell(cell, (link.length > 0) ? link : null);
            } else if (valueName === 'member') {
                var memberIdList = JSON.stringify(field);
                cell.setAttribute('member4', memberIdList);
            } else if (valueName === 'radio') {
                var checkedRadio = this.radioBody.submitRadio(field);
                if (callback) {
                    callback(checkedRadio);
                }
            } else if (valueName === 'description') {
                //console.log(field);
                cell.setAttribute('description', field);
                //graph.getModel().execute(new mxCellAttributeChange(cell, valueName, field));

            }else if (valueName === 'knowledge') {
                //cell.setAttribute('knowledge', field);
                if(callback){
                    callback(field);
                }
            }else if (valueName === 'skill') {
                //cell.setAttribute('knowledge', field);
                if(callback){
                    callback(field);
                }
            }else if(valueName === 'testSitu'){
                if(callback){
                    callback(field);
                }
            }

        } else {
            graph.getModel().execute(new mxValueChange(graph.getModel(), cell, field.value));
        }
    } finally {
        graph.getModel().endUpdate();
    }
};

FormItems.prototype.updateContext = function(evt,graph,cell,valueName,field){
    graph.getModel().beginUpdate();
    try{

    }finally{

    }

};

/**
 * update a file but not a cell
 * @param evt
 * @param graph
 * @param valueName
 * @param field
 */
FormItems.prototype.submitForm = function (evt, graph, valueName, field) {
    graph.getModel().beginUpdate();
    try {
        if (valueName === 'radio') {
            var checkedRadio = this.radioBody.submitRadio(field);
            return (checkedRadio);
        }
    } finally {
        graph.getModel().endUpdate();
    }
};
FormItems.prototype.genComboBox = function (labelText, valueName, cell, userData, width, instanceId, originalData) {
    var cmp = new ComboBoxBody(this.editorUi, labelText, valueName, cell, userData, width, instanceId, originalData);
    if (userData.length < 1) {
        this.editorUi.communication.loadAllUsers(mxUtils.bind(this, function (userData) {
            cmp.userData = userData;
        }));
    }
    return cmp;
};
FormItems.prototype.genDropDownBar = function (title, widthPercent, height, dropContent, isDropHide,callback) {
    var dropDownBar = new DropDownBar(title, widthPercent, height, dropContent, isDropHide,callback);
    return dropDownBar;
};
FormItems.prototype.genTabPage = function (tabInfos,defaultTabPos,managerDialogBd) {
    //var tabPage = new TabPage(tabInfos,defaultTabPos);
    var tabPage = new EcTabPanelGroup(tabInfos,defaultTabPos, managerDialogBd);
    //var tabPanel = tabPage.createTabPanel({tab:'1',panel:[]});
    return tabPage;
};
FormItems.prototype.msInput = function (height, width) {
    var msInput = document.createElement('input');
    msInput.className = 'msInput';
    msInput.setAttribute('style', 'border: 1px solid #c8c8c8;-webkit-appearance: none;border-radius: 0;font-size: 14px;padding: 1px 10px;outline: 0')
    msInput.style.width = (width) ? width : '50%';
    msInput.style.height = (height) ? height : '22px';
    msInput.style.lineHeight = (height) ? height : '22px';
    msInput.onfocus = function () {
        msInput.style.borderColor = '#006ac1'
    };
    msInput.onblur = function () {
        msInput.style.borderColor = '#c8c8c8'
    };
    return msInput;
};
FormItems.prototype.msTextarea = function (height, width, borderColor) {
    var msTextarea = document.createElement('textarea');
    msTextarea.className = 'msTextarea';
    msTextarea.setAttribute('style', 'border: 1px solid #707070;-webkit-appearance: none;border-radius: 0;outline: 0;resize:vertical')
    msTextarea.style.width = (width) ? width : '100%';
    msTextarea.style.height = (height) ? height : '';
    msTextarea.style.borderColor = (borderColor) ? borderColor : '#707070';
    msTextarea.onfocus = function () {
        msTextarea.style.borderColor = '#006ac1'
    };
    msTextarea.onblur = function () {
        msTextarea.style.borderColor = (borderColor) ? borderColor :'#707070';
    };
    return msTextarea;
};
FormItems.prototype.msStar = function (fontSize) {
    var star = document.createElement('span');
    star.innerHTML = '*';
    star.setAttribute('style', 'color: red;font-weight: bold;margin: 10px;');
    star.style.fontSize = (fontSize) ? fontSize : '17px';
    return star;
};
/*
option: json
 max	number	规定允许的最大值。
 min	number	规定允许的最小值。
 step	number	规定合法数字间隔（如果 step="3"，则合法的数字是 -3,0,3,6, 以此类推）
 value	number	规定默认值
 */
FormItems.prototype.msNumInput = function (option) {
    var msNumInput = this.msInput('', '50px');
    msNumInput.style.paddingRight = '0px';
    for (var key in option){
        msNumInput.setAttribute(key, option[key]);
    }
    msNumInput.setAttribute('type', 'number');
        msNumInput.onchange = function(){
            var value = msNumInput.value;
            if (typeof(value)=='string'){
                value = parseInt(value);
            }
            if (option.max){
                var max = (typeof(option.max)=='string') ? parseInt(option.max) : option.max;
                if (value > max){
                    msNumInput.value = option.max;
                }
            }
            if (option.min){
                var min = (typeof(option.min)=='string') ? parseInt(option.min) : option.min;
                if (value < min){
                    msNumInput.value = option.min;
                }
            }
        };
    return msNumInput;
};
FormItems.prototype.msCheckbox = function (text, id, isChecked) {
    var box = document.createElement('div');
    box.style.margin = '5px 0';
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = (isChecked)?isChecked:false;
    input.id = 'checkbox-' + id;
    input.name = text;
    input.setAttribute('style', 'cursor:pointer;vertical-align: middle;width: 15px;height: 15px;padding: 2px;');
    input.onchange = function () {
        box.value = (input.checked);
    };
    box.value = (input.checked);
    var label = document.createElement('label');
    label.setAttribute('style', 'vertical-align: middle;padding-left: 5px;cursor:pointer;');
    label.setAttribute('for', input.id);
    label.innerHTML = input.name;
    box.appendChild(input);
    box.appendChild(label);
    return box;
};
FormItems.prototype.msSelect = function (option) {
    return new MsSelect(option);
};
var MsSelect = function (option) {
    this.msSelect = document.createElement('select');
    this.msSelect.style.height = '26px';
    this.msSelect.style.border = '1px solid #c8c8c8';
    this.msSelect.style.outline = '0px';
    this.msSelect.onfocus = mxUtils.bind(this, function () {
        this.msSelect.style.borderColor = '#006ac1';
    });
    this.msSelect.onblur = mxUtils.bind(this, function () {
        this.msSelect.style.borderColor = '#c8c8c8';
    });
    if (option){
        this.setOption(option);
    }
};
MsSelect.prototype.getContainer = function () {
    return this.msSelect;
};
MsSelect.prototype.getSelectedOption = function () {
    return this.msSelect.options[this.msSelect.selectedIndex];
};
MsSelect.prototype.setOption = function (option) {
    this.msSelect.options.length = 0;
    for (var i = 0; i< option.length; i++){
        this.msSelect.add(this.makeOption(option[i].text, option[i].value, option[i].selected));
    }
};
MsSelect.prototype.makeOption = function (text, value, isSelect) {
    var option = new Option();
    option.text = text;
    option.value = value;
    option.selected = isSelect;
    return option;
};
FormItems.prototype.msLinkageSelect = function (optionTree) {
    return new MsLinkageSelect(this.editorUi, optionTree);
};
//多层级联下拉框
var MsLinkageSelect= function (editorUi, optionTree) {
    this.editorUi = editorUi;
    this.selectList = [];
    this.container = document.createElement('div');
    this.init(optionTree);
};
MsLinkageSelect.prototype.getSelectedOption = function () {
    var select = this.selectList[this.selectList.length-1];
    return select.msSelect.options[select.msSelect.selectedIndex];
};
MsLinkageSelect.prototype.getContainer = function (optionTree) {
    return this.container;
};
MsLinkageSelect.prototype.init = function (optionTree) {
    this.makeSelect(0, optionTree);

};
MsLinkageSelect.prototype.makeSelect = function (num, optionTree) {
    this.selectList[num] = this.editorUi.formItems.msSelect(optionTree);
    var selectDiv = this.selectList[num].getContainer();
    selectDiv.setAttribute('num', num);
    this.container.appendChild(selectDiv);
    var selectedIndex = (this.selectList[num].msSelect.selectedIndex) ? (this.selectList[num].msSelect.selectedIndex) : 0;
    var me = this;
    selectDiv.onchange = function () {
        while (selectDiv.nextSibling){
            me.container.removeChild(selectDiv.nextSibling);
            me.selectList.pop();
        }
        if(optionTree[this.selectedIndex].child && optionTree[this.selectedIndex].child.length > 0){
                me.makeSelect(num+1, optionTree[this.selectedIndex].child);
        }
    };
    if (optionTree[selectedIndex].child && optionTree[selectedIndex].child.length > 0){
         this.makeSelect(num + 1, optionTree[selectedIndex].child);
    }
};
var InputField = function (editorUi) {
    this.editorUi = editorUi;
    this.editor = editorUi.editor;
    this.graph = this.editor.graph;
    this.communication = editorUi.communication;
    this.rootContainer = document.createElement('div');
    this.rootContainer.setAttribute('style', 'overflow: hidden;');
};
InputField.prototype.getElContainer = function () {
    return this.rootContainer;
};
InputField.prototype.getCellAttrValue = function (cell, valueName) {
    var isObjectValue = (typeof cell.value === 'object') ? true : false;
    if (isObjectValue) {
        return cell.getAttribute(valueName, '');
    }
    else {
            return cell.value;
    }
};
InputField.prototype.getInputValue = function () {
    // this is a interface
};
InputField.prototype.setInputValue = function (value) {
    // this is a interface
};
InputField.prototype.getInputFieldId = function () {
    // this is a interface
};
var RadioInputField = function (editorUi, message, valueName, options, defaultValue, isList) {
    InputField.call(this, editorUi);
    this.options = options;
    this.checkedRadio = this.options[0];
    var titleMessage = document.createElement('div');
    titleMessage.innerHTML = message;
    titleMessage.setAttribute('style', 'float: left;margin:10px 0px;');
    this.chooseAreaDiv = document.createElement('div');
    this.chooseAreaDiv.setAttribute('style', 'float: left; margin: 10px 0px 10px 0px;');
    this.radio = [];
    for (var i = 0; i < this.options.length; i++) {
        this.radio[i] = document.createElement('input');
        var textSpan = document.createElement('label');
        if (isList){
            var itemBox = document.createElement('div');
            itemBox.style.margin = '5px';
            this.chooseAreaDiv.appendChild(itemBox);
            itemBox.appendChild(this.radio[i]);
            itemBox.appendChild(textSpan);
        }else {
            this.chooseAreaDiv.appendChild(this.radio[i]);
            this.chooseAreaDiv.appendChild(textSpan);
        }
        textSpan.innerHTML = this.options[i].name;
        textSpan.setAttribute('style', 'cursor: pointer;');
        textSpan.setAttribute('for', valueName+this.options[i].value);
        this.radio[i].setAttribute('name', valueName);
        this.radio[i].setAttribute('type', 'radio');
        this.radio[i].setAttribute('id', valueName+this.options[i].value);
        this.radio[i].setAttribute('value', this.options[i].value);
        this.radio[i].style.marginLeft = '10px';
        if(defaultValue) {
            if (this.options[i].value === defaultValue){
                this.radio[i].setAttribute('checked', 'checked');
            }
        } else if (i === 0) {
            this.radio[i].setAttribute('checked', 'checked');
        }
    }
    this.rootContainer.appendChild(titleMessage);
    this.rootContainer.appendChild(this.chooseAreaDiv);
};
mxUtils.extend(RadioInputField, InputField);
RadioInputField.prototype.submitRadio = function () {
    for (var i = 0; i < this.options.length; i++) {
        if (this.radio[i].checked) {
            this.checkedRadio = this.options[i];
            return this.checkedRadio;
        }
    }
};
RadioInputField.prototype.getRadioArea = function () {
    return this.chooseAreaDiv;
}

var genTextInputField = function (editorUi, dialogBody, labelText, valueName, cell, width) {
    InputField.call(this, editorUi);

    mxUtils.write(this.rootContainer, labelText + ':');
    var defaultWidth = '100px';
    var level1InnerContainer = document.createElement('div');
    //inner.className = 'geTitle';
    level1InnerContainer.style.backgroundColor = 'transparent';
    level1InnerContainer.style.borderColor = 'transparent';
    level1InnerContainer.style.whiteSpace = 'nowrap';
    level1InnerContainer.style.textOverflow = 'clip';
    level1InnerContainer.style.cursor = 'default';

    if (!mxClient.IS_VML) {
        level1InnerContainer.style.paddingRight = '20px';
    }

    var inputField = document.createElement('input');
    inputField.id = 'inputField_1';
    inputField.setAttribute('placeholder', '');
    inputField.setAttribute('type', 'text');
    inputField.style.width = width ? width : defaultWidth;
    inputField.style.backgroundImage = 'url(' + IMAGE_PATH + '/clear.gif)';
    inputField.style.backgroundRepeat = 'no-repeat';
    inputField.style.backgroundPosition = '100% 50%';
    //inputField.setAttribute('value', getValue());
    inputField.setAttribute('name', valueName);
    inputField.style.marginTop = '4px';
    inputField.style.marginBottom = '8px';
    inputField.style.padding = '2px';

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

    level1InnerContainer.appendChild(inputField);
    level1InnerContainer.appendChild(cross);
    this.rootContainer.appendChild(level1InnerContainer);

    mxEvent.addListener(cross, 'click', function (evt) {
        inputField.value = '';
        inputField.focus();
        //me.updateCell(evt, graph, cell, valueName, inputField);
    });

    dialogBody.addListener('onRendered', mxUtils.bind(this, function (message) {
        this.setInputValue(this.getCellAttrValue(cell, valueName)); //获取原有数据
    }));

    this.getInputValue = function () {
        return inputField.value;
    };
    this.setInputValue = function (value_1) {
        inputField.setAttribute('value', value_1);
    };
};
mxUtils.extend(genTextInputField, InputField);

//富文本编辑器
var RichTextareaInputField = function (editorUi, communiction, dialogBody, labelText, valueName, cell, width) {
    InputField.call(this, editorUi);

    //mxUtils.write(this.rootContainer, labelText);
    var level1InnerContainer = document.createElement('div');
    level1InnerContainer.style.backgroundColor = 'transparent';
    level1InnerContainer.style.borderColor = 'transparent';
    level1InnerContainer.style.whiteSpace = 'nowrap';
    level1InnerContainer.style.textOverflow = 'clip';
    level1InnerContainer.style.cursor = 'default';

    //if (!mxClient.IS_VML) {  // if the browser doesn't support VML.
    //    level1InnerContainer.style.paddingRight = '12px';
    //}

    var textarea = document.createElement('textarea');
    textarea.id = 'richTextareaInputField_' + (new Date()).getMilliseconds();

    textarea.style.width = width;
    textarea.style.height = '300px';

    level1InnerContainer.appendChild(textarea);
    this.rootContainer.appendChild(level1InnerContainer);

    dialogBody.addListener('onRendered', mxUtils.bind(this, function (message) {
        var thisInputField = this;
        tinymce.init({
            theme : 'modern',
            skin: 'light',
            selector:'#'+textarea.id,
            language : 'zh_CN',
            content_css : "styles/grapheditor.css",
            theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
            font_size_style_values : "10px,12px,13px,14px,16px,18px,20px",
            fontsize_formats: "8px 10px 12px 13px 14px 16px 18px 20px 24px 36px",
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | fontsizeselect",
            setup: function(editor) {
                editor.on('init', function(e) {
                    console.log('show event', e);
                   if ((typeof cell) === 'string') {
                       thisInputField.setInputValue(cell);
                   }else{
                       thisInputField.setInputValue(thisInputField.getCellAttrValue(cell, valueName));
                   }
                });
            }
        });
    }));


    this.getInputValue = function () {
        return tinymce.activeEditor.getContent();
    };

    this.setInputValue = function (value) {
        tinyMCE.activeEditor.setContent(value);
    };
    this.getInputFieldId = function () {
        return textarea.id;
    };
};
mxUtils.extend(RichTextareaInputField, InputField);
/**
 * userData：
 * case '[]':load from database later
 * case 'noMember':no member in its parant
 * case dataObjectArray like [{id:'test', name:'test'}]: show the data
 * @param editorUi
 * @param labelText
 * @param valueName
 * @param cell
 * @param userData
 * @param widthPercent
 * @constructor
 */
var ComboBoxBody = function (editorUi, labelText, valueName, cell, userData, widthPercent, instanceId, originalData) {

    InputField.call(this, editorUi);

    this.editorUi = editorUi;
    this.userData = userData;
    this.cell = cell;
    var defaultWidth = '200px';
    // chosen options' data
    this.checkedOptionList = [];
    // related options according to the search
    this.optionDataList = [];
    this.optionBoxList = [];
    if (this.cell && this.cell.getAttribute('member')) {
        var originalString = this.cell.getAttribute('member');
        this.getOriginalCheckedList(originalString);
    }
    this.rootContainer.setAttribute('style', 'overflow: visible; position: relative;');
    if (instanceId){
        var paramObj = {
            instanceId: instanceId,
            roleId:labelText
        };
        this.editorUi.communication.loadInstanceUser(paramObj, mxUtils.bind(this, function (resData) {
            if (resData && resData != []) {
                originalData = resData;
            }
            if (originalData) {
                this.getOriginalCheckedList(originalData);
            }
            //== need confirm todo fz
            mxUtils.write(this.rootContainer, labelText);
            var level1InnerContainer = document.createElement('div');
            level1InnerContainer.setAttribute('style', ' backgroundColor: transparent; borderColor: transparent; whiteSpace: nowrap; textOverflow: clip; cursor: default;');
            if (!mxClient.IS_VML) {
                level1InnerContainer.style.paddingRight = '20px';
            }
            this.inputFiledContainer = document.createElement('div');
            this.inputFiledContainer.setAttribute('style', 'border-style: inset; border-width: 2px; border-color: rgb(238, 238, 238); padding:2px;');
            this.inputFiledContainer.style.width = widthPercent ? widthPercent + '%' : defaultWidth;
            this.inputField = document.createElement('input');
            this.inputField.setAttribute('placeholder', '');
            this.inputField.setAttribute('type', 'text');
            this.inputField.setAttribute('name', valueName);
            //inputField.setAttribute('value', checkedValues);
            this.inputField.setAttribute('style', 'border-style: none; border-color:#fff;background-color: inherit;');
            this.inputField.style.width = '50px';
            this.showTagButton();
            //dropdown
            this.dropDiv = document.createElement('div');
            var dropUl = document.createElement('ul');
            this.dropDiv.className = 'combobox_dropDiv';
            this.dropDiv.setAttribute('style', 'display:none;border:1px solid;position:absolute;z-index:2;background-color: #F5F5F5;');
            //this.dropDiv.style.width = widthPercent ? 0.9 * widthPercent + '%' : defaultWidth;
            dropUl.setAttribute('style', 'padding: 5px;margin: 0px;list-style-type: none;overflow-y:auto;height:120px;');
            level1InnerContainer.onclick = function (evt) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }
            };

            this.inputFiledContainer.onclick = mxUtils.bind(this, function (evt) {
                this.inputField.focus();
            });
            this.inputField.oninput = mxUtils.bind(this, function (evt) {
                console.log('input: ' + this.inputField.value);
                var inputData = this.inputField.value;
                this.optionDataList = [];
                this.searchOption(inputData, this.userData);
                this.refreshOptionBox(dropUl);
                //question: what's the difference between transmitting "dropUl" and set it as quanju variable
            });
            this.inputField.onfocus = mxUtils.bind(this, function (evt) {
                this.inputField.style.borderStyle = 'none';
                this.inputField.style.outline = 'none';
                if (this.userData[0] === 'noMember') {
                    this.editorUi.showDialog(new messageDialogBody(this.editorUi, 'no members in its parent'), 300, null, true, true);
                } else {
                    this.dropDiv.style.display = 'block';
                    this.optionDataList = [];
                    this.searchOption('', this.userData);
                    this.refreshOptionBox(dropUl);
                }
            });
            var isClickDropDiv = false;
            this.dropDiv.onmouseover = mxUtils.bind(this, function (evt) {
                isClickDropDiv = true;
            });
            this.dropDiv.onclick = mxUtils.bind(this, function (evt) {
                this.inputField.focus();
            });
            this.dropDiv.onmouseout = function (evt) {
                isClickDropDiv = false;
            };
            this.inputField.onblur = mxUtils.bind(this, function (evt) {
                if (isClickDropDiv) {
                    return false;
                }
                this.dropDiv.style.display = 'none';
            });
            this.dropDiv.appendChild(dropUl);
            level1InnerContainer.appendChild(this.inputFiledContainer);
            this.inputFiledContainer.appendChild(this.inputField);
            this.rootContainer.appendChild(level1InnerContainer);
            this.rootContainer.appendChild(this.dropDiv);
        }))
    } else {
        if (originalData) {
            this.getOriginalCheckedList(originalData);
        }
        //== need confirm todo fz
        mxUtils.write(this.rootContainer, labelText);
        var level1InnerContainer = document.createElement('div');
        level1InnerContainer.setAttribute('style', ' backgroundColor: transparent; borderColor: transparent; whiteSpace: nowrap; textOverflow: clip; cursor: default;');
        if (!mxClient.IS_VML) {
            level1InnerContainer.style.paddingRight = '20px';
        }
        this.inputFiledContainer = document.createElement('div');
        this.inputFiledContainer.setAttribute('style', 'border-style: inset; border-width: 2px; border-color: rgb(238, 238, 238); padding:2px;');
        this.inputFiledContainer.style.width = widthPercent ? widthPercent + '%' : defaultWidth;
        this.inputField = document.createElement('input');
        this.inputField.setAttribute('placeholder', '');
        this.inputField.setAttribute('type', 'text');
        this.inputField.setAttribute('name', valueName);
        //inputField.setAttribute('value', checkedValues);
        this.inputField.setAttribute('style', 'border-style: none; border-color:#fff;background-color: inherit;');
        this.inputField.style.width = '50px';
        this.showTagButton();
        //dropdown
        this.dropDiv = document.createElement('div');
        var dropUl = document.createElement('ul');
        this.dropDiv.className = 'combobox_dropDiv';
        this.dropDiv.setAttribute('style', 'display:none;border:1px solid;position:absolute;z-index:2;background-color: #F5F5F5;width:150px');
        //this.dropDiv.style.width = widthPercent ? 0.9 * widthPercent + '%' : defaultWidth;
        dropUl.setAttribute('style', 'padding: 5px;margin: 0px;list-style-type: none;overflow-y:auto;height:120px;');
        level1InnerContainer.onclick = function (evt) {
            if (evt.stopPropagation) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        };

        this.inputFiledContainer.onclick = mxUtils.bind(this, function (evt) {
            this.inputField.focus();
        });
        this.inputField.oninput = mxUtils.bind(this, function (evt) {
            console.log('input: ' + this.inputField.value);
            var inputData = this.inputField.value;
            this.optionDataList = [];
            this.searchOption(inputData, this.userData);
            this.refreshOptionBox(dropUl);
            //question: what's the difference between transmitting "dropUl" and set it as quanju variable
        });
        this.inputField.onfocus = mxUtils.bind(this, function (evt) {
            this.inputField.style.borderStyle = 'none';
            this.inputField.style.outline = 'none';
            if (this.userData[0] === 'noMember') {
                this.editorUi.showDialog(new messageDialogBody(this.editorUi, 'no members in its parent'), 300, null, true, true);
            } else {
                this.dropDiv.style.display = 'block';
                this.optionDataList = [];
                this.searchOption('', this.userData);
                this.refreshOptionBox(dropUl);
            }
        });
        var isClickDropDiv = false;
        this.dropDiv.onmouseover = mxUtils.bind(this, function (evt) {
            isClickDropDiv = true;
        });
        this.dropDiv.onclick = mxUtils.bind(this, function (evt) {
            this.inputField.focus();
        });
        this.dropDiv.onmouseout = function (evt) {
            isClickDropDiv = false;
        };
        this.inputField.onblur = mxUtils.bind(this, function (evt) {
            if (isClickDropDiv) {
                return false;
            }
            this.dropDiv.style.display = 'none';
        });
        this.dropDiv.appendChild(dropUl);
        level1InnerContainer.appendChild(this.inputFiledContainer);
        this.inputFiledContainer.appendChild(this.inputField);
        this.rootContainer.appendChild(level1InnerContainer);
        this.rootContainer.appendChild(this.dropDiv);
    }
};
ComboBoxBody.prototype.setDropDivHide = function () {
    this.dropDiv.style.display = 'none';
};
ComboBoxBody.prototype.getInputField = function () {
    return this.checkedOptionList;
};
ComboBoxBody.prototype.getElContainer = function () {
    return this.rootContainer;
};
/**
 * get the graph's checked members to the beginning
 */
ComboBoxBody.prototype.getOriginalCheckedList = function (memberString) {
    var memberJson = JSON.parse(memberString);
    for (var i = 0; i < memberJson.length; i++) {
        this.checkedOptionList.push(memberJson[i]);
    }
};
/**
 * search input data among all data, and then get data needed in the option list
 */
ComboBoxBody.prototype.searchOption = function (inputData, allDatas) {
    var relateData = new RegExp("^.*" + inputData + ".*$");
    for (var i = 0; i < allDatas.length; i++) {
        if (allDatas[i].name.match(relateData)) {
            this.optionDataList.push(allDatas[i]);
        }
    }
};
/**
 * new option entity
 * @param dropBoxData
 * @returns {optionEntityBox}
 */
ComboBoxBody.prototype.showOptionBox = function (dropBoxData) {
    var dropOptionLi = new optionEntityBox(this, dropBoxData);
    this.optionBoxList.push(dropOptionLi);
    return dropOptionLi;
};
/**
 * build the option boxes in the dropBox (rebuild included)
 * 读input内容，搜索，更新数组，新建li，[拿到check的值]
 * @param dropUl
 */
ComboBoxBody.prototype.refreshOptionBox = function (dropUl) {
    //clear all dropOptionLi, optionBoxList
    while (dropUl.firstChild) {
        dropUl.removeChild(dropUl.lastChild);
    }
    this.optionBoxList = [];
    //new option box
    this.optionDataList.forEach(mxUtils.bind(this, function (dropBoxData) {
        var dropOptionLi = this.showOptionBox(dropBoxData);
        dropUl.appendChild(dropOptionLi.dropOptionLi);
    }));
};
/**
 * show tag
 */
ComboBoxBody.prototype.showTagButton = function () {
    while (this.inputField.previousSibling) {
        this.inputFiledContainer.removeChild(this.inputField.previousSibling);
    }
    if (this.checkedOptionList.length > 0) {
        this.checkedOptionList.forEach(mxUtils.bind(this, function (dropBoxData) {
            var optionTagButton = new optionEntityBox(this, dropBoxData);
            var tagButton = optionTagButton.tagButton;
            this.inputFiledContainer.insertBefore(tagButton, this.inputFiledContainer.lastChild);
        }));
    }
};
/**
 * get options checked in the checkbox each time click on the drop div
 */
ComboBoxBody.prototype.getCheckedOption = function (dropOptionLi) {
    if (dropOptionLi.isChecked) {
        var optionData = {
            name: dropOptionLi.name,
            id: dropOptionLi.id
        };
        this.checkedOptionList.push(optionData);
    } else {
        this.removeCheckedOption(dropOptionLi.id);
    }
};
/**
 * remove members have been checked.
 * @param memberId
 * @param next
 */
ComboBoxBody.prototype.removeCheckedOption = function (memberId, next) {
    if (this.cell && this.cell.children) {
        for (var i = 0; i < this.cell.children.length; i++) {
            if (this.cell.children[i].getAttribute('member')) {
                var memberString = this.cell.children[i].getAttribute('member');
                var memberJson = JSON.parse(memberString);
                console.log(memberJson);
                for (var j = 0; j < memberJson.length; j++) {
                    if (memberJson[j].id === memberId) {
                        this.editorUi.showDialog(new messageDialogBody(this.editorUi, 'Faild! The member is being used in its child process'), 300, null, true, true);
                        return;
                    }
                }
            } else {
                continue;
            }
        }
    }
    for (var i = 0; i < this.checkedOptionList.length; i++) {
        if (memberId === this.checkedOptionList[i].id) {
            for (var j = i; j < this.checkedOptionList.length - 1; j++) {
                this.checkedOptionList[j] = this.checkedOptionList[j + 1];
            }
            this.checkedOptionList.pop();
            if (next) {
                next();
            }
        }
    }

};

var optionEntityBox = function (comboBoxBody, optionEntity) {
    this.name = optionEntity.name;
    this.id = optionEntity.id;
    this.comboBoxBody = comboBoxBody;
    this.dropOptionLi = this.createOptionInfoLi(optionEntity);
    this.tagButton = this.createTagButton(optionEntity);
    this.isChecked = this.checkbox.checked;
};
/**
 * create a li
 * */
optionEntityBox.prototype.createOptionInfoLi = function (optionEntity) {
    var dropOptionLi = document.createElement('li');
    dropOptionLi.setAttribute('style', 'margin:3px; cursor: pointer;border: 1px solid rgb(245, 245, 245)');
    var checkboxSpan = document.createElement('span');
    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.id = optionEntity.id;
    this.checkbox.name = optionEntity.name;
    this.checkbox.style.cursor = 'pointer';
    this.checkbox.style.verticalAlign = 'middle';
    var liSpan = document.createElement('span');
    liSpan.setAttribute('style', 'vertical-align: middle;');
    liSpan.innerHTML = this.checkbox.name;
    checkboxSpan.appendChild(this.checkbox);
    dropOptionLi.appendChild(checkboxSpan);
    dropOptionLi.appendChild(liSpan);
    if (this.comboBoxBody.checkedOptionList.length > 0) {
        for (var i = 0; i < this.comboBoxBody.checkedOptionList.length; i++) {
            if (this.id === this.comboBoxBody.checkedOptionList[i].id) {
                this.checkbox.checked = true;
                this.isChecked = true;
            }
        }
    }
    dropOptionLi.onclick = mxUtils.bind(this, function (evt) {
        this.checkbox.checked = !this.checkbox.checked;
        this.isChecked = this.checkbox.checked;
        this.comboBoxBody.getCheckedOption(this);
        this.comboBoxBody.showTagButton();
    });
    checkboxSpan.onclick = mxUtils.bind(this, function (evt) {
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
        this.isChecked = this.checkbox.checked;
        this.comboBoxBody.getCheckedOption(this);
        this.comboBoxBody.showTagButton();
    });
    dropOptionLi.onmouseover = mxUtils.bind(this, function (evt) {
        dropOptionLi.style.border = '1px solid #70c0e7';
        dropOptionLi.style.backgroundColor = '#e5f3fb';
    });
    dropOptionLi.onmouseout = mxUtils.bind(this, function (evt) {
        dropOptionLi.style.border = '1px solid rgb(245, 245, 245)';
        dropOptionLi.style.backgroundColor = 'rgb(245, 245, 245)';
    });
    return dropOptionLi;
};
/**
 * create a tag
 * @param optionEntity
 * @returns {Element}
 */
optionEntityBox.prototype.createTagButton = function (optionEntity) {
    var tagButton = document.createElement('button');
    tagButton.setAttribute('class', 'getBtn');
    tagButton.setAttribute('title', mxResources.get('clickToDelete'));
    tagButton.setAttribute('style', 'margin-right: 2px;');
    tagButton.innerHTML = optionEntity.name;
    tagButton.onclick = mxUtils.bind(this, function (evt) {
        this.comboBoxBody.removeCheckedOption(this.id, mxUtils.bind(this, function () {
            //this.checkbox.checked = false;
            this.comboBoxBody.showTagButton();
        }));
    });
    return tagButton;
};
var DropDownBar = function (title, widthPercent, height, dropContent, isDropHide,callback) {
    this.isDropHide = isDropHide;
    this.rootContainer = document.createElement('div');
    this.rootContainer.setAttribute('style', '');
    this.rootContainer.style.width = widthPercent + '%';
    this.titleBar = document.createElement('div');
    this.titleBar.setAttribute('style', 'border: 1px solid #C5C5C5; background-color: #F5F5F5;padding: 2px; margin: 0 0 0 0; border-radius: 0px; cursor: pointer;');
    this.titleSpan = document.createElement('span');
    this.titleSpan.innerHTML = title;
    this.titleSpan.setAttribute('style','line-height:21px');
    this.dropFlag = document.createElement('span');
    this.dropFlag.innerHTML = this.isDropHide ? 'v' : '^';
    this.dropFlag.setAttribute('style', 'float: right; margin-right: 3px;');
    this.titleBar.appendChild(this.titleSpan);
    this.titleBar.appendChild(this.dropFlag);

    this.createButton('x','0','delete',this.removeMe(callback));
    this.rootContainer.appendChild(this.titleBar);
    this.createDropContainer(height, dropContent, isDropHide);
    this.titleBar.onclick = mxUtils.bind(this, function () {
        if (this.isDropHide) {
            this.dropContainer.style.display = 'block';
        } else {
            this.dropContainer.style.display = 'none';
        }
        this.isDropHide = !this.isDropHide;
        this.dropFlag.innerHTML = this.isDropHide ? 'v' : '^';
    });
};

DropDownBar.prototype.createButton =  function(text,btcount,title,callback) {
    this.btcount = document.createElement('button');
    this.btcount.innerHTML = text;
    this.btcount.setAttribute('style', 'cursor: pointer;float:right;margin-right:5px;');
    this.btcount.title = title;
    this.titleBar.appendChild(this.btcount);
    this.btcount.onclick = callback;
};

DropDownBar.prototype.removeMe =  function(callback){
    return function(){
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            if(callback){
                callback();
            }
    }
};

DropDownBar.prototype.createDropContainer = function (height, dropContent, isDropHide) {
    this.dropContainer = document.createElement('div');
    this.dropContainer.setAttribute('style', 'padding: 0px; background-color: #f9f9f9;margin:0px 0px 0px 0px; min-height:50px;');
    if (height) {
        this.dropContainer.style.height = height;
    }
    this.dropContainer.style.display = (isDropHide === true) ? 'none' : 'block';
    this.dropContainer.appendChild(dropContent);
    this.rootContainer.appendChild(this.dropContainer);
};
DropDownBar.prototype.getElContainer = function () {
    return this.rootContainer;
};

var EcButton = function (type, tab) {
    if (type === 'tab'){
        this.tabDiv = document.createElement('label');
        this.tabDiv.innerHTML = tab.tabName;
        this.tabDiv.setAttribute('style', 'border:solid #C5C5C5; border-width: 1px 1px 0 1px ; margin: 5px; padding: 5px; background-color: #F5F5F5; cursor: pointer;');
        if(tab.isLocked) {
            this.isLocked = tab.isLocked;
        }
        if(tab.callback) {
            this.callback = tab.callback;
        }
    }
};
EcButton.prototype.getTabDiv = function () {
    return this.tabDiv;
};
EcButton.prototype.regOnClickEvent = function (func) {
    this.tabDiv.onclick = func;
};
EcButton.prototype.setTabColor = function (isChecked) {
    if (isChecked) {
        this.tabDiv.style.backgroundColor = '#c5c5c5';
    } else {
        this.tabDiv.style.backgroundColor = '#F5F5F5';
    }
};
EcButton.prototype.setTabLocked = function () {
    this.tabDiv.onclick = function () {};
    this.tabDiv.style.color = '#7F7F7F';
    this.tabDiv.style.cursor = 'default';
    return this.tabDiv;
};
//tool buttons
var SpButton = function (type, text,next) {
    if (type === 'toolBtn') {
        this.toolSpan = document.createElement('span');
        this.toolSpan.setAttribute('class', 'geBtn');
        this.toolSpan.innerHTML = text;
    } else if (type === 'toolBtn-blue') {
        this.toolSpan = document.createElement('span');
        this.toolSpan.setAttribute('class', 'geBtn2');
        this.toolSpan.innerHTML = text;
    }
    if(next){
            this.toolSpan.onclick = next;
    }
};
SpButton.prototype.getSpan = function () {
    return this.toolSpan;
};
//回收站
var SpTrashBtn = function (panelObj) {
    this.deletedFileView = new SpButton('toolBtn', mxResources.get('deletedFile'),mxUtils.bind(this, function () {
        this.ecEntityPanel = panelObj.ecEntityPanel;
        this.fileDeleted();
        var queryObj = appUtils.convertQueryStrToJSON();
        var paramObj = {
            isDeleted : this.ecEntityPanel.isTrashSelected,
            fileType : queryObj.ui
        };
        this.ecEntityPanel.editorUi.communication.loadAllModelFiles(paramObj,mxUtils.bind(this, function (message) {
            var fileEntities = message.data;
            this.ecEntityPanel.showFile(fileEntities);
        }));
    })).getSpan();
};
SpTrashBtn.prototype.getBtn = function () {
    return this.deletedFileView;
};
SpTrashBtn.prototype.fileDeleted = function () {
    if(this.ecEntityPanel.trashConfig.back ){
        this.deletedFileView.innerHTML = mxResources.get('return1');
        this.ecEntityPanel.isTrashSelected=true;
        this.ecEntityPanel.dialogFootOk.setAttribute('disabled',false);
        // this.okButtonClick();
    }else{
        this.deletedFileView.innerHTML = mxResources.get('deletedFile');
        //this.fileEntityBoxList = loadDeletedFile(this.fileEntityBoxList);
        this.ecEntityPanel.isTrashSelected=false;
    }
    this.ecEntityPanel.fileDeleted();
};
//预览
var SpLRShowBtn = function (panelObj) {
    this.LRShow = new SpButton('toolBtn', mxResources.get('showLR'),mxUtils.bind(this, function () {
        this.ecEntityPanel = panelObj.ecEntityPanel;
            var selectedFileList = this.ecEntityPanel.getSelectedFile();
            if(selectedFileList=== undefined) {
                //alert(mxResources.get('pleaseChooseAMaterial'));
                this.ecEntityPanel.editorUi.showDialog(new tipDialogBody(this.ecEntityPanel.editorUi, mxResources.get('pleaseChooseAMaterial')), 300, null, true, true);
            } else {
                if(selectedFileList.length > 0){
                    if (selectedFileList[0].fileType === 'form'){
                        var formPreviewDialogBody = new FormPreviewDialogBody(this.ecEntityPanel.editorUi, selectedFileList[0].fileName, selectedFileList[0].formId);
                        this.ecEntityPanel.editorUi.showDialog(formPreviewDialogBody, 880, 650, true, true);
                    } else {
                        var showPath;
                        if (selectedFileList[0].filePath) {
                            showPath = selectedFileList[0].filePath;
                        }if (selectedFileList[0].transformF) {
                            showPath = selectedFileList[0].transformF;
                        }else {
                            showPath = selectedFileList[0].sourceF;
                        }
                        var ownerId = selectedFileList[0].ownerId;
                        var lRShowDialogBody = new LRShowDialogBody(this.ecEntityPanel.editorUi, selectedFileList[0].fileName,selectedFileList[0].materialsId, showPath,selectedFileList[0].fileType, ownerId);
                        this.ecEntityPanel.editorUi.showDialog(lRShowDialogBody, 880, 650, true, true);
                    }
                } else {
                    //alert(mxResources.get('pleaseChooseAMaterial'));
                    this.ecEntityPanel.editorUi.showDialog(new tipDialogBody(this.ecEntityPanel.editorUi, mxResources.get('pleaseChooseAMaterial')), 300, null, true, true);
                }
            }
    })).getSpan();
};
SpLRShowBtn.prototype.getBtn = function () {
    return this.LRShow;
};
// 上传资料
var UpLoadMaterial = function(panelObj){
    this.upLoadMaterial = new SpButton('toolBtn', mxResources.get('uploadMaterials'),mxUtils.bind(this, function () {
        this.ecEntityPanel = panelObj.ecEntityPanel;
        this.ecEntityPanel.editorUi.editLearningResource('learningResEdit', null, null, null, mxUtils.bind(this, function () {
            this.ecEntityPanel.editorUi.hideDialog();
            var mD = this.ecEntityPanel.managerDialogBd;
            this.ecEntityPanel.editorUi.showAllLearningResource('learningResSearch', mD.isOpenNewWindow, mD.graph, mD.isCloseRichEditor, mD.lockType, mD.callback);
        }));
        this.ecEntityPanel.editorUi.flag = false;
    })).getSpan();
};
UpLoadMaterial.prototype.getBtn = function(){
  return this.upLoadMaterial;
};
// 新建表单-->改为管理表单
var CreateForm = function(panelObj){
    this.createForm = new SpButton('toolBtn', mxResources.get('manageForm'),mxUtils.bind(this, function () {
        this.ecEntityPanel = panelObj.ecEntityPanel;
        //var formEditDialogBody = new FormEditDialogBody(this.ecEntityPanel.editorUi, mxResources.get('createForm'), null, userId);
        //由于可能有复用表单操作，故改为指向龙龙的表单管理页面
        var formEditDialogBody = new FormManageDialogBody(this.ecEntityPanel.editorUi, userId, mxUtils.bind(this, function () {
            this.ecEntityPanel.editorUi.communication.loadAllForm(mxUtils.bind(this, function (materialLists) {
                var fileEntities = materialLists.slice();
                console.log(fileEntities);
                this.ecEntityPanel.showFile(fileEntities);
            }));
        }));
        this.ecEntityPanel.editorUi.showDialog(formEditDialogBody, 880, 650, true, true);
        this.ecEntityPanel.editorUi.flag = false;
    })).getSpan();
};
CreateForm.prototype.getBtn = function(){
  return this.createForm;
};


// 多选
var SpMultipleBtn = function (panelObj, isMultiLocked) {
    if (isMultiLocked) {
        var btnHtml = '<del>'+mxResources.get('multiple')+'<del>';
    } else {
        var btnHtml = mxResources.get('multiple');
    }
    this.multiple = new SpButton('toolBtn-blue', btnHtml,mxUtils.bind(this, function () {
        if (!isMultiLocked) {
            this.ecEntityPanel = panelObj.ecEntityPanel;
            if (this.ecEntityPanel.isMultiSelect) {
                this.ecEntityPanel.isMultiSelect = !this.ecEntityPanel.isMultiSelect;
                this.ecEntityPanel.unSelectAllFileEntity();
                this.multiple.setAttribute('style', '');
                this.ecEntityPanel.dialogFootOk.setAttribute('disabled', true);
            } else {
                this.ecEntityPanel.unSelectAllFileEntity();
                this.ecEntityPanel.isMultiSelect = !this.ecEntityPanel.isMultiSelect;
                this.multiple.setAttribute('style', 'background-color:#498AF3; color:#fff;');
                this.ecEntityPanel.dialogFootOk.setAttribute('disabled', true);
            }
        }
    })).getSpan();
    if (isMultiLocked) {
        this.multiple.style.cursor = 'default';
    }
};
SpMultipleBtn.prototype.getBtn = function () {
    return this.multiple;
};
// 按 modify time 排序
var SpSortByTimeBtn = function (panelObj) {
    this.sortByTime = new SpButton('toolBtn', mxResources.get('timeDesc'),mxUtils.bind(this, function () {
            this.ecEntityPanel = panelObj.ecEntityPanel;
            this.sortFileByTime();
            this.ecEntityPanel.removeAllFileEntityBoxes();
            this.ecEntityPanel.showFileEntityBox();
        })).getSpan();

};
SpSortByTimeBtn.prototype.getBtn = function () {
    return this.sortByTime;
};
SpSortByTimeBtn.prototype.sortFileByTime = function () {
    if (this.ecEntityPanel.sortConfig.timeAsc) {
        this.sortByTime.innerHTML = mxResources.get('timeDesc');
        this.ecEntityPanel.sortFileByTimeAsc(false);
    } else {
        this.sortByTime.innerHTML = mxResources.get('timeAsc');
        this.ecEntityPanel.sortFileByTimeAsc(true);
    }
};
// 文件名排序
var SpSortByNameBtn = function (panelObj) {
    this.sortByName = new SpButton('toolBtn', mxResources.get('fileNameAsc'),mxUtils.bind(this, function () {
            this.ecEntityPanel = panelObj.ecEntityPanel;
            this.sortFileByName();
            this.ecEntityPanel.removeAllFileEntityBoxes();
            this.ecEntityPanel.showFileEntityBox();
        })).getSpan();

};
SpSortByNameBtn.prototype.getBtn = function () {
    return this.sortByName;
};
SpSortByNameBtn.prototype.sortFileByName = function () {
    if (this.ecEntityPanel.sortConfig.nameAsc) {
        this.sortByName.innerHTML = mxResources.get('fileNameDesc');
        this.ecEntityPanel.sortFileByNameAsc(false);
    } else {
        this.sortByName.innerHTML = mxResources.get('fileNameAsc');
        this.ecEntityPanel.sortFileByNameAsc(true);
    }
};
// view type
var SpViewTypeBtn = function (panelObj) {
    this.viewType = new SpButton('toolBtn', mxResources.get('tilesView'),mxUtils.bind(this, function () {
            this.ecEntityPanel = panelObj.ecEntityPanel;
            this.fileView();
            this.ecEntityPanel.removeAllFileEntityBoxes();
            this.ecEntityPanel.showFileEntityBox();
        })).getSpan();

};
SpViewTypeBtn.prototype.getBtn = function () {
    return this.viewType;
};
SpViewTypeBtn.prototype.fileView = function () {
    if (!this.ecEntityPanel.sortConfigFromCookie.titlesView) {
        this.viewType.innerHTML = mxResources.get('tilesView');
        this.ecEntityPanel.fileView(true);
    } else {
        this.viewType.innerHTML = mxResources.get('detailsView');
        this.ecEntityPanel.fileView(false);
    }
};
// 文件时间范围
var SpTimeRangeBtn = function (panelObj) {
    this.timeRange = new SpButton('toolBtn', mxResources.get('timeRange'),mxUtils.bind(this, function () {
            this.ecEntityPanel = panelObj.ecEntityPanel;
            var timeRangeDialogBody = new TimeRangeDialogBody(this.ecEntityPanel.editorUi, mxUtils.bind(this, function (startTime, endTime) {
                this.ecEntityPanel.findFileByTime(startTime, endTime);
                this.ecEntityPanel.removeAllFileEntityBoxes();
                this.ecEntityPanel.showFileEntityBox();
            }));
            this.ecEntityPanel.editorUi.showDialog(timeRangeDialogBody, 300, null, true, true);
            YYYYMMDDstart();
        })).getSpan();

};
SpTimeRangeBtn.prototype.getBtn = function () {
    return this.timeRange;
};

var EcFilterPanel = function(panelObj){
    this.panelObj = panelObj;
    this.resourceActionDiv = document.createElement('div');
    this.resourceActionDiv.setAttribute('class', 'dialogHeadDiv');
    //var LRShow = document.createElement('span');
    //LRShow.setAttribute('class', 'geBtn');
    //LRShow.innerHTML = mxResources.get('showLR');
    var options = [{name:mxResources.get('all'),value:0},{name:mxResources.get('beginner'),value:1},{name:mxResources.get('skilledUser'),value:2},{name:mxResources.get('skilledUser'),value:3},{name:mxResources.get('expert'),value:4},{name:mxResources.get('master'),value:5}];
    var testRadio = panelObj.managerDialogBd.editorUi.formItems.genRadioField(mxResources.get('applicableUsers') + ':', 'toUser', options);
    var radioDOM = testRadio.getElContainer();
    var searchResource = document.createElement('form');
    searchResource.setAttribute('class', 'searchForm');
    var inputResource = document.createElement('input');
    inputResource.setAttribute('name', 'fileName');
    inputResource.setAttribute('id', 'fileName');
    this.resourceSearch = document.createElement('span');
    this.resourceSearch.innerHTML = mxResources.get('search');
    this.resourceSearch.setAttribute('class', 'geButn');
    searchResource.appendChild(inputResource);
    searchResource.appendChild(this.resourceSearch);
    radioDOM.appendChild(searchResource);
    var me = this;

    //LRShow.onclick = function() {
    //    me.panelObj.ecEntityPanel.showLearningRes();
    //};

    searchResource.onsubmit = function() {
        me.panelObj.ecEntityPanel.searchLearningRes();
        return false;
    };
    this.resourceSearch.onclick = function() {
        me.panelObj.ecEntityPanel.searchLearningRes();
    };

    //this.resourceActionDiv.appendChild(LRShow);
    this.resourceActionDiv.appendChild(radioDOM);
};

EcFilterPanel.prototype.getActionDiv = function(){
    return this.resourceActionDiv;
};

//注意panelObj在entity panel 被new后才有ecEntityPanel这个字段
var EcToolPanel = function (toolOption, panelObj) {
    this.panelObj = panelObj;
    var toolTypeList = (toolOption.tool)?(toolOption.tool):[];
    this.toolPanelDiv = document.createElement('div');
    this.toolPanelDiv.setAttribute('class', 'dialogHeadDiv');
    if (toolOption.isMultiLocked) {
        this.addCommonToolBtn(true);
    } else {
        this.addCommonToolBtn();
    }
    for (var i = 0; i < toolTypeList.length; i++){
        this.addToolBtn(toolTypeList[i]);
    }
    var inputText = document.createElement('input');
    inputText.setAttribute('style', 'float: right;');
    var me = this;
    inputText.oninput = function () {
        me.panelObj.ecEntityPanel.searchLikeFileByName(this.value);
        me.panelObj.ecEntityPanel.removeAllFileEntityBoxes();
        me.panelObj.ecEntityPanel.showFileEntityBox();
    };
    panelObj.managerDialogBd.addListener("onRendered",mxUtils.bind(this,function(){
        if(!this.panelObj.ecEntityPanel.isLearningRes){
            this.toolPanelDiv.appendChild(inputText);
        }
    }));
};
EcToolPanel.prototype.addCommonToolBtn = function (isMultiLocked) {
    this.addToolBtn('multiple',isMultiLocked);
    this.addToolBtn('sortByTime');
    this.addToolBtn('sortByName');
    this.addToolBtn('viewType');
    this.addToolBtn('timeRange');
};
EcToolPanel.prototype.addToolBtn = function (toolType, isMultiLocked) {
    var toolBtn;
    if (toolType === 'trash') {
        toolBtn = new SpTrashBtn(this.panelObj);
        //this.toolPanelDiv.appendChild(deletedFileView.getBtn());
    } else if (toolType ==='preview') {
        toolBtn = new SpLRShowBtn(this.panelObj);
        //this.toolPanelDiv.appendChild(LRShow.getBtn());
    } else if (toolType === 'multiple') {
        toolBtn = new SpMultipleBtn(this.panelObj,isMultiLocked);
        //this.toolPanelDiv.appendChild(multiSelect.getBtn());
    } else if (toolType === 'sortByTime') {
        toolBtn = new SpSortByTimeBtn(this.panelObj);
    } else if (toolType === 'sortByName') {
        toolBtn = new SpSortByNameBtn(this.panelObj);
    } else if (toolType === 'viewType') {
        toolBtn = new SpViewTypeBtn(this.panelObj);
    } else if (toolType === 'timeRange') {
        toolBtn = new SpTimeRangeBtn(this.panelObj);
    }else if(toolType === 'uploadMaterials'){
        toolBtn = new UpLoadMaterial(this.panelObj);
    }else if(toolType === 'manageForm'){
        toolBtn = new CreateForm(this.panelObj);
    }

    this.toolPanelDiv.appendChild(toolBtn.getBtn());
};
EcToolPanel.prototype.getToolPanelDiv = function () {
    return this.toolPanelDiv;
};

var EcEntityPanel = function (managerDialogBd, entityType) {
    //初始数据
    this.trashConfig = {
        back: true
    };
    this.isMultiSelect = false;
    this.isTrashSelected = false;
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
    if (this.sortConfigFromCookie.titlesView) {
        this.viewType = 'titles';
    } else {
        this.viewType = 'details';
    }
    //一些定义
    this.fileEntityBoxList = [];
    this.selectedFileList = [];
    this.managerDialogBd = managerDialogBd;
    this.editorUi = this.managerDialogBd.editorUi;
    var _allFileDialogBody = this.managerDialogBd;

    //type
    this.entityType = entityType;
    if (entityType === 'instance') {
        this.isInstance = true;
    } else if (entityType === 'sub_course') {
        this.isInstance = true;
    }  else if (entityType === 'resource') {
        this.isLearningRes = true;
    } else if (entityType === 'textArea') {
        this.isRichText = true;
    } else if (entityType === 'form') {
        this.isForm = true;
    } else if (entityType === 'userBoard') {
        this.isUserBoard = true;
    } else if (entityType === 'task_design') {
        this.taskdesignFile = true;
    } else {
        this.isInstance = false;
    }
    //files' container
    this.allFileContainer = document.createElement('div');
    this.allFileContainer.setAttribute('class', 'dialogCenterDiv');
    this.allFileContainer.setAttribute('style', 'overflow: auto; height: 300px;padding:10px 5px;');
    //foot btn group
    this.dialogFootContainer = document.createElement('div');
    this.dialogFootContainer.setAttribute('class', 'dialogFootDiv');
    this.dialogFootDiv = document.createElement('div');
    this.dialogFootDiv.setAttribute('class', 'dialogFootDiv1');
    this.dialogFootOk = document.createElement('button');
    var dialogFootCancel = document.createElement('button');
    this.dialogFootOk.innerHTML = mxResources.get('ok');
    this.dialogFootOk.setAttribute('class', 'geBtn gePrimaryBtn');
    this.dialogFootOk.setAttribute('disabled', true);
    dialogFootCancel.innerHTML = mxResources.get('cancel');
    dialogFootCancel.setAttribute('class', 'geBtn');
    this.dialogFootDiv.appendChild(this.dialogFootOk);
    this.dialogFootDiv.appendChild(dialogFootCancel);
    this.dialogFootContainer.appendChild(this.dialogFootDiv);
    //event
    //var bindTaskObj;
    this.dialogFootOk.onclick = mxUtils.bind(this, function () {
        var selectedFileList = this.getSelectedFile();
        //zll//zsk
        if (this.isLearningRes || this.isRichText || this.isForm) {
            var fEL = [];
            for (var i = 0; i < selectedFileList.length; i++) {
                var f = selectedFileList[i].getFileEntity();
                fEL.push(f);
            }
            this.editorUi.hideDialog();
            if (this.managerDialogBd.callback) {
                this.managerDialogBd.callback(fEL);
            }
        } else if (mxUi === 'process_design' && selectedFileList[0].fileType === 'task_design') {
            this.bindTaskObj = selectedFileList[0];
            console.log(this.bindTaskObj);
            this.editorUi.hideDialog();
            this.managerDialogBd.callback(this.bindTaskObj);
        }
        else {
            this.openSelectedFile(selectedFileList);
        }
    });
    dialogFootCancel.onclick = mxUtils.bind(this, function () {
        this.editorUi.isTrashSelected = false;
        if (this.managerDialogBd.callback) {
            this.managerDialogBd.callback();
        }
        this.editorUi.hideDialog();
    });
    mxEvent.addListener(this.allFileContainer, 'scroll', function () {
        _allFileDialogBody.clearContextMenu();
    });
    //if (entityType === 'sub_course') {
    //    var paramObj = {
    //        isOut : !this.isTrashSelected,
    //        fileType : 'process_design'
    //    };
    //    this.editorUi.communication.loadAllModelFiles(paramObj, mxUtils.bind(this, function (message) {
    //        if(message.data){
    //            var fileEntities = message.data.slice();
    //            this.removeAllFileEntityBoxes();
    //            if (this.validateFileEntities(fileEntities)) {
    //                this.buildFileEntityBoxList(fileEntities, this.viewType);
    //                this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
    //                this.sortFileByTimeAsc(false);
    //                this.showFileEntityBox();
    //            }
    //        }
    //    }));
    //}
    if (entityType === 'sub_course') {
        var paramObj = {
            isDeleted : this.isTrashSelected,
            fileType : 'process_design'
        };
        this.editorUi.communication.loadAllModelFiles(paramObj, mxUtils.bind(this, function (message) {
            if(message.data){
                var fileEntities = message.data.slice();
                this.removeAllFileEntityBoxes();
                if (this.validateFileEntities(fileEntities)) {
                    this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                    this.sortFileByTimeAsc(false);
                    this.showFileEntityBox();
                }
                /* ople code part is hidden now because it causes bugs when clicking trashbox
                var paramObj2 = {
                    isDeleted : this.isTrashSelected,
                    fileType : 'ople_design'
                };
                this.editorUi.communication.loadAllModelFiles(paramObj2, mxUtils.bind(this, function (message) {
                    var fileEntities2 = message.data.slice();
                    this.removeAllFileEntityBoxes();
                    for(var i = 0; i < fileEntities2.length; i++){
                        fileEntities.push(fileEntities2[i]);
                    }
                    var paramObj3 = {
                        isDeleted : this.isTrashSelected,
                        fileType : 'ople2_design'
                    };
                    this.editorUi.communication.loadAllModelFiles(paramObj3,mxUtils.bind(this,function(message){
                        if(message.data){
                            var fileEntities3 = message.data.slice();
                            for(var i = 0; i < fileEntities3.length; i++){
                                fileEntities.push(fileEntities3[i]);
                            }
                            //this.removeAllFileEntityBoxes();
                            if (this.validateFileEntities(fileEntities)) {
                                this.buildFileEntityBoxList(fileEntities, this.viewType);
                                this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                                this.sortFileByTimeAsc(false);
                                this.showFileEntityBox();
                            }
                        }
                    }));
                }));*/
            }
        }));
    } else if(entityType === 'task_design') {
        var paramObj = {
            isDeleted : this.isTrashSelected,
            fileType : 'task_design'
        };
        this.editorUi.communication.loadAllModelFiles(paramObj, mxUtils.bind(this, function (message) {
            if(message.data){
                var fileEntities = message.data.slice();
                this.removeAllFileEntityBoxes();
                if (this.validateFileEntities(fileEntities)) {
                    this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                    this.sortFileByTimeAsc(false);
                    this.showFileEntityBox();
                }
            }
        }));

    } else if (entityType === 'instance'){
        var paramObj = {
            processId: this.managerDialogBd.processId,
            isOut : !this.isTrashSelected
        };
        this.editorUi.communication.loadInstanceOfProcess(paramObj, mxUtils.bind(this, function (message) {
            var fileEntities = message.data.slice();
            if (this.validateFileEntities(fileEntities)) {
                this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                this.sortFileByTimeAsc(false);
                this.showFileEntityBox();
            }
        }));
    } else if (entityType === 'resource') {
        this.editorUi.communication.loadAllLearningRes(mxUtils.bind(this,function (materialLists) {
            if(materialLists){
                var fileEntities = materialLists.slice();
                if (this.validateFileEntities(fileEntities)) {
                    this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                    this.sortFileByTimeAsc(false);
                    this.showFileEntityBox();
                }
            }

        }));
    } else if (entityType === 'textArea') {
        this.editorUi.communication.loadAllRichTextsModel(mxUtils.bind(this, function (materialLists) {
            var fileEntities = materialLists.slice();
            console.log(fileEntities);
            if (this.validateFileEntities(fileEntities)) {
                this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                this.sortFileByTimeAsc(false);
                this.showFileEntityBox();
            }
        }));
    } else if (entityType === 'form') {
        this.editorUi.communication.loadAllForm(mxUtils.bind(this, function (materialLists) {
            var fileEntities = materialLists.slice();
            console.log(fileEntities);
            if (this.validateFileEntities(fileEntities)) {
                this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                this.sortFileByTimeAsc(false);
                this.showFileEntityBox();
            }
        }));
    }else if(entityType == 'userBoard') {
        this.editorUi.communication.loadAllUserBoard(mxUtils.bind(this, function (message) {
            if(message.data){
                var fileEntities = message.data.slice();
                console.log(fileEntities);
                if (this.validateFileEntities(fileEntities)) {
                    this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                    this.sortFileByTimeAsc(false);
                    this.showFileEntityBox();
                }
            }
        }));
    }else if(entityType === 'subject_design') {
        var paramObj = {
            isDeleted : this.isTrashSelected,
            fileType : 'subject_design'
        };
        this.editorUi.communication.loadAllModelFiles(paramObj, mxUtils.bind(this, function (message) {
            if(message.data){
                var fileEntities = message.data.slice();
                this.removeAllFileEntityBoxes();
                if (this.validateFileEntities(fileEntities)) {
                    this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                    this.sortFileByTimeAsc(false);
                    this.showFileEntityBox();
                }
            }
        }));
    }else if(entityType === 'parent_course') {
        var paramObj = {
            isDeleted : this.isTrashSelected,
            fileType : 'course_design'
        };
        this.editorUi.communication.loadAllModelFiles(paramObj, mxUtils.bind(this, function (message) {
            if(message.data){
                var fileEntities = message.data.slice();
                this.removeAllFileEntityBoxes();
                if (this.validateFileEntities(fileEntities)) {
                    this.buildFileEntityBoxList(fileEntities, this.viewType, entityType);
                    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
                    this.sortFileByTimeAsc(false);
                    this.showFileEntityBox();
                }
            }
        }));
    }
};
EcEntityPanel.prototype.removeAllFileEntityBoxes = function () {
    // note: using myNode.innerHTML = '' to remove the content is much slower
    while (this.allFileContainer.firstChild) {
        this.allFileContainer.removeChild(this.allFileContainer.lastChild);
    }
};
EcEntityPanel.prototype.removeFileEntityBox = function (fileEntityBox) {
    if (this.allFileContainer) {
        this.allFileContainer.removeChild(fileEntityBox.getContainerEl());
    }
};
EcEntityPanel.prototype.validateFileEntities = function (fileEntities) {
    if (fileEntities && fileEntities.length > 0) {
        return true;
    } else {
        var fileInfoDiv = document.createElement('div');
        fileInfoDiv.innerHTML = mxResources.get('nofile');
        this.allFileContainer.appendChild(fileInfoDiv);
        this.fileEntityBoxList = [];
        return false;
    }
};
EcEntityPanel.prototype.buildFileEntityBoxList = function (fileEntities, viewType, entityType) {
    // note: for-loop is the faster iteration method in javascript
    this.fileEntityBoxList = [];
    for (var i = 0; i < fileEntities.length; i++) {
        this.addFileEntityBox(new FileEntityBox(this, fileEntities[i], viewType, entityType));
    }
};
EcEntityPanel.prototype.addFileEntityBox = function (fileEntityBox) {
    this.fileEntityBoxList.push(fileEntityBox);
    this.managerDialogBd.addMenuHandler(fileEntityBox.getContainerEl(), mxUtils.bind(this, function (menu, cell, evt) {
        this.unSelectAllFileEntity();
        fileEntityBox.setIsSelected(true);
        this.editorUi.currentSeletedFiles = [fileEntityBox];
        this.editorUi.selectFilesList = this.getSelectedFile();
        if(this.isInstance) {//实例文件
            if(!this.isTrashSelected) {
                this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'renameFile', /*'assignRole',*/ ((this.editorUi.selectFilesList[0].isPublished) ? 'unpublishTheCourse':'publishTheCourse'), '-'], null, evt);
            }else{
                this.editorUi.menus.addMenuItems(menu, ['deleteTrashFile', 'cancelDelete', '-'], null, evt);
            }
        } else if (this.isLearningRes || this.isRichText) {//资源文件
            if(!this.isTrashSelected) {
                this.editorUi.menus.addMenuItems(menu, ['deleteLearningRes', 'renameLearningRes', '-'], null, evt);
            } else{
                this.editorUi.menus.addMenuItems(menu, ['deleteLearningRes', '-'], null, evt);
            }
        } else if(this.isUserBoard){

        }else if(this.taskdesignFile) {     //添加典型工作任务文件的右键菜单
            this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'renameFile', '-'], null, evt);
        } else if (this.isRichText){//富文本模板

        } else{
            if(!this.isTrashSelected) {
                if(this.isMultiSelect){
                    this.editorUi.menus.addMenuItems(menu, ['deleteFile', '-'], null, evt);
                } else {
                    this.editorUi.menus.addMenuItems(menu, ['deleteFile', 'renameFile',(mxUi==='process_design')?'-':((userRole==='spxy')?'-':((this.editorUi.selectFilesList[0].isPublished) ? 'unpublishTheCourse':'publishTheCourse')), '-'], null, evt);
                }
            } else{
                this.editorUi.menus.addMenuItems(menu, ['deleteTrashFile', 'cancelDelete', '-'], null, evt);
            }
        }
    }));
    fileEntityBox.getContainerEl().ondblclick = mxUtils.bind(this, function () {
        //zll//fmm
        if (this.isLearningRes) {
            //window.open('http://218.106.119.150:8088/OfficeTransfer/' + fileEntityBox.transformF);
            //this.editorUi.menus.updateRecentOpenFileList(fileEntityBox.getFileEntity());
            this.selectedFileList = [];
            for (var i=0;i<this.fileEntityBoxList.length;i++) {
                if (this.fileEntityBoxList[i].isSelected === true){
                    this.selectedFileList.push(this.fileEntityBoxList[i]);
                }
            }
            if (this.selectedFileList.length>0) {
                console.log(this.selectedFileList);
                return(this.selectedFileList);
            }
        } else if (this.isRichText){
            //eamonn//fmm
            /* this.editorUi.loadEditRichTextsModel(fileEntityBox.getFileEntity(),mxUtils.bind(this, function (richTextData) {
             console.log(richTextData);
             fileEntityBox.setFileName(richTextData.name);
             }));*/
            //this.editorUi.hideDialog.call(this);
            //this.editorUi.menus.updateRecentOpenFileList(fileEntityBox.getFileEntity());
            this.selectedFileList = [];
            for (var i=0;i<this.fileEntityBoxList.length;i++) {
                if (this.fileEntityBoxList[i].isSelected === true){
                    this.selectedFileList.push(this.fileEntityBoxList[i]);
                }
            }
            if (this.selectedFileList.length>0) {
                console.log(this.selectedFileList);
                return(this.selectedFileList);
            }
        } else {
            var gFileId = fileEntityBox.getFileId();
            console.log(this.trashConfig.back);
            if(this.trashConfig.back){
                this.editorUi.hideDialog();
                this.editorUi.menus.updateRecentOpenFileList(fileEntityBox.getFileEntity());
                this.selectedFileList.push(fileEntityBox);
                this.openSelectedFile(this.selectedFileList);
            }
        }
    });
};
EcEntityPanel.prototype.unSelectAllFileEntity = function () {
    if (!this.isMultiSelect) {
        var fileEntityBoxList = this.getFileEntityBoxList();
        for (var i = 0; i < fileEntityBoxList.length; i++) {
            if (fileEntityBoxList[i].getIsSelected()) {
                fileEntityBoxList[i].setIsSelected(false);
            }
        }
    }
};
EcEntityPanel.prototype.getFileEntityBoxList = function () {
    return this.fileEntityBoxList;
};
EcEntityPanel.prototype.getSelectedFile = function () {
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
EcEntityPanel.prototype.openSelectedFile = function (selectedFileList) {
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
            // fangzhou todo: only when the selection.length > 1, open new window  (done)
            for(var i=0;i<selectedFileList.length;i++) {
                var gFileId = selectedFileList[i].getFileId();
                this.editorUi.editor.setFileType(selectedFileList[i].fileType);
                var queryObj = appUtils.convertQueryStrToJSON();
                if((selectedFileList[i].fileType === 'task_design')){
                    queryObj.ch = gFileId;
                    //if(selectedFileList[i].chatHistory){
                    //    queryObj.ch = selectedFileList[i].chatHistory.chatRoom;
                    //}
                }
                if (this.managerDialogBd.isOpenNewWindow) {
                    if (this.managerDialogBd.callback) {
                        this.managerDialogBd.callback(selectedFileList[0].getFileEntity());
                    }
                    //this.managerDialogBd.graph.setAttribute('subProcessId', gFileId);
                    //this.editorUi.editor.setModified(true);
                    //queryObj.ui = 'process_design';
                    //queryObj.gFileId = gFileId;
                    //queryObj.isInstance = this.isInstance;
                    //delete queryObj.instanceId;
                    //window.open(appUtils.convertJSONToQueryStr(queryObj, true));
                } else {
                    if (i===0) {
                        if(this.isInstance) {
                            queryObj.instanceId = gFileId;
                            delete queryObj.gFileId;
                        }else {
                            queryObj.gFileId = gFileId;
                            delete queryObj.instanceId;
                        }
                        queryObj.isInstance = this.isInstance;
                        History.pushState(queryObj, this.editorUi.communication.apis.retrieveGraphModel, appUtils.convertJSONToQueryStr(queryObj, '?'));
                        if (mxUi === 'task_design') {
                            this.editorUi.addChatDiv();
                        }
                    } else if(this.isInstance) {
                        queryObj.instanceId = gFileId;
                        queryObj.isInstance = true;
                        delete queryObj.gFileId;
                        window.open(appUtils.convertJSONToQueryStr(queryObj, true));
                    } else {
                        queryObj.gFileId = gFileId;
                        queryObj.isInstance = this.isInstance;
                        delete queryObj.instanceId;
                        window.open(appUtils.convertJSONToQueryStr(queryObj, true));
                    }
                    this.editorUi.editor.setModified(false);
                    this.editorUi.hideDialog();
                }
                this.editorUi.menus.updateRecentOpenFileList(selectedFileList[i].getFileEntity());
                if(selectedFileList[0].fileType = 'task_design' && selectedFileList[0].chatHistory){
                    var chatBox = this.editorUi.chatDiv;
                    var chatHistory = selectedFileList[0].chatHistory;
                    while(chatBox.messageDiv.hasChildNodes()){
                        chatBox.messageDiv.removeChild(chatBox.messageDiv.firstChild);
                    }
                    var msgLength = chatHistory.msgObj.length;
                    if(msgLength > 40){
                        var initLen = msgLength - 40;
                        var maxLen = 40;
                    }else{
                        var initLen = 0;
                        var maxLen = msgLength;
                    }
                    for(var i = initLen; i < maxLen;i++){
                        chatBox.addMessage(chatHistory.msgObj[i],true);
                    }
                }
            }
        }
    }
};
EcEntityPanel.prototype.showFileEntityBox = function () {
    this.removeAllFileEntityBoxes();
    var fileEntityBox;
    if(this.fileEntityBoxList.length > 0){
        for (var i = 0; i < this.fileEntityBoxList.length; i++) {
            fileEntityBox = this.fileEntityBoxList[i];
            if (fileEntityBox.getIsToShow()) {
                this.allFileContainer.appendChild(fileEntityBox.getContainerEl());
            }
        }
    } else {
        var fileInfoDiv = document.createElement('div');
        fileInfoDiv.innerHTML = mxResources.get('nofile');
        this.allFileContainer.appendChild(fileInfoDiv);
    }
};
EcEntityPanel.prototype.okButtonClick = function() {
    this.dialogFootOk.removeAttribute('disabled');
};
EcEntityPanel.prototype.extractFileEntities = function () {
    var fileEntities = [];
    for (var i = 0; i < this.fileEntityBoxList.length; i++) {
        fileEntities.push(this.fileEntityBoxList[i].getFileEntity());
    }
    return fileEntities;
};
EcEntityPanel.prototype.showFile = function (fileEntities) {
    this.removeAllFileEntityBoxes();
    if (this.validateFileEntities(fileEntities)) {
        this.buildFileEntityBoxList(fileEntities, this.viewType, this.entityType);
        this.showFileEntityBox();
    }
};
//tool's opreation
EcEntityPanel.prototype.sortFileByTimeAsc = function (isAsc) {
    if (isAsc) {
        this.fileEntityBoxList = dateAscSort(this.fileEntityBoxList);
    } else {
        this.fileEntityBoxList = dateDescSort(this.fileEntityBoxList);
    }
    this.sortConfig.timeAsc = !this.sortConfig.timeAsc;
};
EcEntityPanel.prototype.sortFileByNameAsc = function (isAsc) {
    if (isAsc) {
        this.fileEntityBoxList = nameAscSort(this.fileEntityBoxList);
    } else {
        this.fileEntityBoxList = nameDescSort(this.fileEntityBoxList);
    }
    this.sortConfig.nameAsc = !this.sortConfig.nameAsc;
};
EcEntityPanel.prototype.fileView = function (isTitles) {
    if (isTitles) {
        this.viewType = 'titles';
    } else {
        this.viewType = 'details';
    }
    this.buildFileEntityBoxList(this.extractFileEntities(), this.viewType, this.entityType);
    this.sortConfigFromCookie.titlesView = !this.sortConfigFromCookie.titlesView;
    deleteCookie('sortConfig');
    addCookie('sortConfig',JSON.stringify(this.sortConfigFromCookie),12);
};
EcEntityPanel.prototype.findFileByTime = function(startTime,endTime) {
    this.fileEntityBoxList= this.findTimeRangeFile(this.fileEntityBoxList,startTime,endTime)
};
EcEntityPanel.prototype.findTimeRangeFile = function(list,startTime,endTime){
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
};
EcEntityPanel.prototype.fileDeleted = function () {
    this.trashConfig.back =!this.trashConfig.back;
};
EcEntityPanel.prototype.searchLikeFileByName = function(str) {
    var fileEntityBoxList = this.getFileEntityBoxList();
    //var str = document.getElementById('searchFile');
    //var n = str.length - 1;
    //console.log(str[n].value);
    var likeName = str;
    searchByLikeName(likeName, fileEntityBoxList);
};
//get div
EcEntityPanel.prototype.getEntityPanelDiv = function () {
    return this.allFileContainer;
};
EcEntityPanel.prototype.getEntityFootBtn = function () {
    return this.dialogFootContainer;
};

EcEntityPanel.prototype.searchLearningRes = function(){
    var query = {};
    var strDOM = document.getElementById('fileName');
    query.fileName = strDOM.value;

    var radioDOM = document.getElementsByName('toUser');
    for(var i=0; i<radioDOM.length;i++){
        if(radioDOM[i].checked)
            query.toUser = radioDOM[i].value;
    }
    this.removeAllFileEntityBoxes();
    this.editorUi.communication.searchLearningRes(query,mxUtils.bind(this, function (message) {
        var fileEntities = message.data;
        if (this.validateFileEntities(fileEntities)) {
            this.buildFileEntityBoxList(fileEntities, this.viewType, this.entityType);
            this.sortFileByTimeAsc(false);
            this.showFileEntityBox();
        }
    }));
};

var EcPanel = function (panelInfos,managerDialogBd) {
    this.managerDialogBd = managerDialogBd;
    this.panelDiv = document.createElement('div');
    for (var i = 0; i<panelInfos.length; i++){
        if(panelInfos[i].type ==='tool') {
            var ecToolPanel = new EcToolPanel(panelInfos[i],this);
            this.panelDiv.appendChild(ecToolPanel.getToolPanelDiv());
        } else if(panelInfos[i].type === 'filter'){
            var ecFilterPanel = new EcFilterPanel(this);
            this.panelDiv.appendChild(ecFilterPanel.getActionDiv());
        } else if (panelInfos[i].type ==='entity') {
            this.ecEntityPanel = new EcEntityPanel(managerDialogBd, panelInfos[i].entity);
            this.panelDiv.appendChild(this.ecEntityPanel.getEntityPanelDiv());
            this.panelDiv.appendChild(this.ecEntityPanel.getEntityFootBtn());
        } else if (panelInfos[i].type ==='div') {
            this.panelDiv.appendChild(panelInfos[i].div);
        }
    }
};
EcPanel.prototype.getPanelDiv = function () {
    return this.panelDiv;
};
EcPanel.prototype.setPanelState = function (isTabChecked) {
    if (this.panelDiv){

        if (isTabChecked){
            this.panelDiv.style.display = 'block';
        } else {
            this.panelDiv.style.display = 'none';
        }
    }
};
var EcTabPanel = function (tabObj, panelObj) {
    this.tabObj = tabObj;
    this.panelObj = panelObj;
};
EcTabPanel.prototype.getTabDiv = function () {
    return this.tabObj.getTabDiv();
};
EcTabPanel.prototype.getPanelDiv = function () {
    return this.panelObj.getPanelDiv();
};
EcTabPanel.prototype.setTabPanelState = function (isTabChecked) {
    if (isTabChecked) {
        this.tabObj.setTabColor(true);
        this.panelObj.setPanelState(true);
    } else {
        this.tabObj.setTabColor(false);
        this.panelObj.setPanelState(false);
    }
};
EcTabPanel.prototype.addToolBtn = function () {

};
var EcTabPanelGroup = function (tabInfos,defaultTabPos,managerDialogBd) {
    this.managerDialogBd = managerDialogBd;
    this.rootContainer = document.createElement('div');
    this.tabsArea = document.createElement('div');
    this.tabsArea.className = 'tabsArea';
    this.tabsArea.setAttribute('style','border-bottom:2px solid #C5C5C5; padding:5px; margin:5px 0 0 0;');
    this.panelsArea = document.createElement('div');
    this.panelsArea.className = 'panelsArea';
    this.panelsArea.setAttribute('style','height:inherit;');
    if (!managerDialogBd){
        this.panelsArea.setAttribute('style','height:510px;overflow: auto;');
    }
    this.rootContainer.appendChild(this.tabsArea);
    this.rootContainer.appendChild(this.panelsArea);
    this.tabPanelList = [];
    for (var i = 0; i < tabInfos.length; i++) {
        this.createTabPanel(tabInfos[i],defaultTabPos);
    }
    this.setAllPanelsHide();
    if (defaultTabPos) {
        for (var j = 0; j < tabInfos.length; j++) {
            if (j === defaultTabPos-1) {
                this.tabPanelList[j].setTabPanelState(true);
                //if (tabInfos[j].callback) {
                //    tabInfos[j].callback();
                //}
            }
        }
    }
    //mxEvent.addListener(this.panelsArea, 'scroll', function () {
    //    var comboboxDropDoms = document.getElementsByClassName('combobox_dropDiv');
    //    for (var i = 0; i<comboboxDropDoms.length; i++){
    //        comboboxDropDoms[i].style.display = 'none';
    //    }
    //
    //});
};
EcTabPanelGroup.prototype.getElContainer = function () {
    return this.rootContainer;
};
EcTabPanelGroup.prototype.getTabsArea = function () {
    return this.tabsArea;
};
EcTabPanelGroup.prototype.getPanelsArea = function () {
    return this.panelsArea;
};
EcTabPanelGroup.prototype.setAllPanelsHide = function () {
    for(var i = 0; i <this.tabPanelList.length; i++){
        this.tabPanelList[i].setTabPanelState(false);
    }
};
EcTabPanelGroup.prototype.createTabPanel = function (tabInfo,defaultTabPos) {
    var tab = {
        'tabName': tabInfo.tab
    };
    if (tabInfo.isTabLocked) {
        tab['isLocked'] = tabInfo.isTabLocked;
    }
    if (tabInfo.callback) {
        tab['callback'] = tabInfo.callback;
    }
    this.tabPanel = this.addTabPanel(new EcTabPanel(new EcButton('tab', tab), new EcPanel(tabInfo.panel,this.managerDialogBd)));
    return this.tabPanel;

};
EcTabPanelGroup.prototype.addTabPanel = function (tabPanel) {
    this.tabPanelList.push(tabPanel);
    tabPanel.tabObj.regOnClickEvent(mxUtils.bind(this, function () {
        if(!this.managerDialogBd){
            //保存其他tab
            document.getElementById('propertyApplyBtn').click();
        }
        this.setAllPanelsHide();
        tabPanel.setTabPanelState(true);
        //if(tabPanel.tabObj.callback) {
        //    tabPanel.tabObj.callback();
        //}
    }));
    if(tabPanel.tabObj.isLocked) {
        tabPanel.tabObj.setTabLocked();
    }
    this.tabsArea.appendChild(tabPanel.getTabDiv());
    if(tabPanel.getPanelDiv()) {
        this.panelsArea.appendChild(tabPanel.getPanelDiv());
    }
    return tabPanel;
};