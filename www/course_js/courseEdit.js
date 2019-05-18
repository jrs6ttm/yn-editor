/**
 * Created by fangz_000 on 4/24/2017.
 */

$('li.list-group-item').click(function(){
    //左侧导航栏active状态切换
    $('li.list-group-item').removeClass('active');
    this.className += ' active';
    //panel内容切换
    var panelTitle = this.getAttribute('data-text');
    var panelLabel = this.getAttribute('data-label');
    showContent(panelTitle, panelLabel);
});

var previewBtn = $('#previewCourseBtn');
previewBtn.attr('disabled', (Course.isPublished)?false:true);
previewBtn.click(function () {
    if(Course.isPublished){
        window.open('http://' + LOGIN_HOST + '/situation#' + Course.id);
    }
});
var publishBtn = $('#publishCourseBtn');
var publishStatusSpan = $('#publishStatusSpan');
publishBtn.text((Course.isPublished)?'取消发布':'发布');
publishStatusSpan.text((Course.isPublished)?'':'（未发布）');
publishBtn[0].onclick = function () {
    $.get('/update/changePublicState?isInstance=false&fileId=' + Course.id, function (msg) {
        if (msg.success){
            Course.isPublished = !Course.isPublished;
            publishBtn.text((Course.isPublished)?'取消发布':'发布');
            publishStatusSpan.text((Course.isPublished)?'':'（未发布）');
            previewBtn.attr('disabled', (Course.isPublished)?false:true);
        }
    })
};

Course.typeTxt = '';
Course.subTypeTxt = '';
switch (Course.type){
    case 'project': Course.typeTxt = '项目式';Course.subTypeTxt='子项目';break;
    case 'situation': Course.typeTxt = '学习领域式';Course.subTypeTxt='学习情境';break;
    case 'subject': Course.typeTxt = '学科体系';Course.subTypeTxt='子课程';break;
    case 'task':
    default : Course.typeTxt = '任务引领式';Course.subTypeTxt='子任务';break;
}
var courseTypeSpan = $('span#course-type-span');
courseTypeSpan.text(courseTypeSpan.text() + Course.typeTxt);

/*var showContent = function (type, headText) {
    $.get('/show-content-' + type, function (content) {
        $('#panel-body').html(content);
        $('#panel-heading').text(headText);
    })
};*/

var makeHtmlTag = function (type, className) {
    var tag = document.createElement(type);
    tag.className = className;
    return tag;
};

var makeContent = function (panelLabel) {
    switch(panelLabel){
        case 'detailDescpt': return detailDescpt.initUi();break;
        case 'icon': return icon.initUi();break;
        case 'subCourses': return subCourses.initUi();break;
        case 'basicInfo':
        default : return basicInfo.initUi();break;
    }
};
var showContent = function (panelTitle, panelLabel) {
    var content = makeContent(panelLabel);
    if (panelLabel === 'subCourses') {
        panelTitle = subCourses.headUi();
    }
    $('#panel-body').html(content);
    $('#panel-heading').html(panelTitle);
};

var initHeadIcon = function () {
    var imgSrc = '../images/course.png';
    if (Course.icon){
        var iconInfo = JSON.parse(Course.icon);
        imgSrc = MATERIAL_URL + '/fileRead?createType=own&userId='+ iconInfo.ownerId +'&fileId=' + iconInfo.materialsId;
    }
    $('.course-manage-header img').attr('src', imgSrc);
};
var loadUserModels = function () {
    $.get('/load/loadAllModelFile?fileType=process_design&isDeleted=false&courseType=' + Course.type, function (msg) {
        if (msg.success){
            var modelBox = '';
            for (var i=0;i<msg.data.length;i++){
                var CourseName = msg.data[i].fileName;
                var CourseId = msg.data[i].gFileId;
                var CourseIntro = (msg.data[i].briefDes)?(msg.data[i].briefDes):'';
                var ClassName = (i==0)?'course-select active':'course-select';
                modelBox += '<div class="col-md-3"><div data-model="' + CourseId + '" class="' + ClassName + '"><i class="es-icon es-icon-putongkecheng"></i> ' +
                    '<div class= "course-type">' + CourseName + '</div> ' +
                    '<div class="course-intro">' + CourseIntro + '</div> ' +
                    '</div> </div> ';
            }
            $('#model-panel').css('display','none');
            $('#user-model-panel').html(modelBox);
            $('#user-model-panel').css('display','block');
            $('.course-select').click(function () {
                $('.course-select').removeClass('active');
                this.className += ' active';
            });
        }
    });
};
//ui block
//下拉框
var MsSelect = function (option) {
    this.msSelect = document.createElement('select');
    this.msSelect.style.height = '26px';
    this.msSelect.style.border = '1px solid #c8c8c8';
    this.msSelect.style.outline = '0px';
    this.msSelect.onfocus = function () {
        this.style.borderColor = '#006ac1';
    };
    this.msSelect.onblur = function () {
        this.style.borderColor = '#c8c8c8';
    };
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
//多层级联下拉框
var MsLinkageSelect= function (optionTree) {
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
    this.selectList[num] = new MsSelect(optionTree);
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
//下拉框end

var basicInfo = {
    initUi : function () {
        var title = Course.title,
            briefDes = (Course.briefDes)?(Course.briefDes):'',
            linkageSelect;
        var html = '<div class="form-horizontal"> ' +
            '<div class="form-group"> ' +
            '<label for="title-input" class="col-md-2 control-label">标题</label> ' +
            '<div class="col-md-8"> ' +
            '<input id="title-input" type="text" value="' + title + '" placeholder="输入课程标题" class="form-control"/> ' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label for="brief-des-textarea" class="col-md-2 control-label">简介</label> ' +
            '<div class="col-md-8"> ' +
            '<textarea id="brief-des-textarea" rows="3" placeholder="输入课程简介" class="form-control">' + briefDes + '</textarea> ' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label">分类</label> ' +
            '<div class="col-md-8" id="category-div"> ' +
            //'<select class="form-control"> ' +
            //'<option>1</option> ' +
            //'<option>2</option> ' +
            //'<option>3</option> ' +
            //'<option>4</option> ' +
            //'<option>5</option> ' +
            //'</select> ' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<div class="col-md-offset-2 col-md-8"> ' +
            '<button class="btn btn-primary btn-fat" onclick="basicInfo.save();">保 存</button> ' +
            '</div> ' +
            '</div> ' +
            '</div>';
        basicInfo.makeCategorySelectBox();
        return html;
    },
    makeCategorySelectBox: function () {
        //课程分类
        //courseCategoryDiv.setAttribute('style','padding: 10px 15px;display: inline-flex;');
        $.get('/getCourseCategoryTrees', function (categoryTrees) {
            var courseCategoryDiv= $('#category-div');
            if (Course.categoryId){
                var oriCategoryId = Course.categoryId;
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
            basicInfo.linkageSelect = new MsLinkageSelect(categoryTrees);
            var linkageSelectDiv = basicInfo.linkageSelect.getContainer();
            courseCategoryDiv.append(linkageSelectDiv);
        });
    },
    save: function () {
        var title = basicInfo.checkAndFormatName($('#title-input').val());
        var briefDes = $('#brief-des-textarea').val();
        var categoryId = basicInfo.linkageSelect.getSelectedOption().value;
        if (title){
            $.post('/updateCourse/basicInfo',{
                id: Course.id,
                title: title,
                briefDes: briefDes,
                categoryId: categoryId
            }, function (msg) {
                if (msg.success){
                    alert("保存成功！");
                    Course.title = msg.data.title;
                    Course.briefDes = msg.data.briefDes;
                    Course.categoryId = msg.data.categoryId;
                    showContent('基本信息', '');
                    $('#banner-couseTitle').text(Course.title);
                }else{
                    alert("抱歉，保存失败！");
                }
            })
        } else{
            console.log('标题无效，请检查');
            //todo tips '标题无效，请检查'
            alert("标题无效，请检查！");
        }
    },
    checkAndFormatName : function (name) {
        //去掉开头结尾空格;
        var courseName = name.trim();
        var pattern=/^[ ]+$/gi;
        if (courseName.length > 0 && !pattern.test(courseName)){
            //course.showTitleHelp(false);
            return courseName;
        } else {
            //course.showTitleHelp(true, '标题无效，请检查');
            return null;
        }
    }
};

var detailDescpt = {
    tagList: [
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
    ],
    initUi: function() {
        var formBox = document.createElement('div');
        formBox.className = 'form-horizontal';
        formBox.id = 'detail-des-form-box';
        var originalData = {};
        if (Course.detailDes===0){
            formBox.innerHTML='网络卡，请等等哦';
            $.get('/load/loadModelFile?fileType=course_design&fileId=' + Course.id, function (msg) {
                if (msg.success && msg.data.fileDesc){
                    Course.detailDes = msg.data.fileDesc;
                    originalData = JSON.parse(Course.detailDes);
                }
                detailDescpt.makeFormBoxInnerHtml($('#detail-des-form-box')[0], originalData);
            });
        } else if(Course.detailDes){
            originalData = JSON.parse(Course.detailDes);
            detailDescpt.makeFormBoxInnerHtml(formBox, originalData);
        }
        return formBox;
    },
    makeFormBoxInnerHtml: function (formBox, originalData) {
        formBox.innerHTML='';
        for (var i = 0; i < detailDescpt.tagList.length; i++){
            var label = detailDescpt.tagList[i].name,
                content = (originalData[detailDescpt.tagList[i].id])?(originalData[detailDescpt.tagList[i].id]):'',
                placeholder = (detailDescpt.tagList[i].descrpt)?(detailDescpt.tagList[i].descrpt):'';
            formBox.innerHTML += '<div class="form-group"> ' +
                '<label class="col-md-2 control-label">' + label + '</label> ' +
                '<div class="col-md-8"> ' +
                '<textarea id="detail-des-textarea" rows="3" placeholder="' + placeholder + '" class="form-control">' + content + '</textarea> ' +
                '</div> ' +
                '</div>';
        }
        formBox.innerHTML += '<div class="form-group"> ' +
            '<div class="col-md-offset-2 col-md-8"> ' +
            '<button class="btn btn-primary btn-fat" onclick="detailDescpt.save();">保 存</button> ' +
            '</div> ' +
            '</div> ';
    },
    save: function () {
        var formDom = $('textarea#detail-des-textarea');
        var fileDescData = {};
        for (var i = 0; i < detailDescpt.tagList.length; i++){
            fileDescData[detailDescpt.tagList[i].id] = formDom[i].value;
        }
        $.post('/updateCourse/detailDescpt', {
            id: Course.id,
            detailDes: JSON.stringify(fileDescData)
        }, function (msg) {
            if (msg.success){
                Course.detailDes = msg.data.detailDes;
                showContent('详细信息', 'detailDescpt');
            }
        })
    }

};

var icon = {
    initUi: function(){
        var imgSrc = '../images/course.png';
        if (Course.icon){
            var iconInfo = JSON.parse(Course.icon);
            imgSrc = MATERIAL_URL + '/fileRead?createType=own&userId='+ iconInfo.ownerId +'&fileId=' + iconInfo.materialsId;
        }
        var html = '<div class="form-horizontal"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label"><!--封面--></label> ' +
            '<div class="col-md-4"><a class="thumbnail">' +
            '<img src="' + imgSrc + '" alt="课程封面"/>' +
            '</a></div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label for="icon-upload-input" class="col-md-2 control-label">上传封面</label> ' +
            '<div class="col-md-10"> ' +
            '<input type="file" accept="image/*" id="icon-upload-input" class="form-control"> ' +
            '</div> ' +
            '</div>' +
            '<div class="form-group"> ' +
            '<div class="col-md-offset-2 col-md-8"> ' +
            '<button class="btn btn-primary btn-fat" onclick="icon.upload(icon.save);">上 传</button> ' +
            '</div> ' +
            '</div> ' +
            '</div>';
        return html;
    },
    upload: function(next){
        var chooseImgInput = $('#icon-upload-input')[0];
        var files = chooseImgInput.files;
        var formData = new FormData();
        if(files.length > 0){
            var imgObj = files[0];
            formData.append('userId', Course.teacherId);
            formData.append('imageSizes','125m125');//默认图片裁剪大小"125m125_75m75"
            formData.append('file', imgObj);
            var xhr = new XMLHttpRequest();
            xhr.open('post', MATERIAL_URL + '/ownFileUpload' ,true);
            var result;
            xhr.onload = function(e){
                if(this.status == 200){
                    result = this.response;
                    var res = JSON.parse(result);
                    if(res.errorMsg){
                        alert(res.errorMsg);
                    } else {
                        res.originalName = imgObj.name;
                        res.materialsId = res.fileId;
                        res.ownerId = Course.teacherId;
                        next(res);
                    }
                }
            };
            xhr.send(formData);
        }else{
            alert('未选择图片！');
        }
    },
    save: function (resultFile) {
        if(resultFile.materialsId){
            var fileIconObj = {
                materialsId : resultFile.materialsId,
                fileName : resultFile.fileName,
                ownerId : resultFile.ownerId,
                filePath : resultFile.filePath
            };
            $.post('/updateCourse/icon', {
                id: Course.id,
                icon: JSON.stringify(fileIconObj)
            }, function (msg) {
                if (msg.success){
                    Course.icon = msg.data.icon;
                    initHeadIcon();
                    showContent('课程封面', 'icon');
                }
            })
        }
    }
};

var subCourses = {
    courseInfoList: [],
    index: 0, // 当前序号最大值
    iconCache: '',
    tagList : [
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
    ],
    headUi: function(){
        var html = '<div class="pull-right"> ' +
            '<button id="lesson-create-btn" data-modaltype="create" data-toggle="modal" data-target="#modal" data-backdrop="static" data-keyboard="false" class="btn btn-info btn-sm">' +
            '<i class="glyphicon glyphicon-plus"></i> ' +
            Course.subTypeTxt +
            '</button>' +
            '</div>' +
            Course.subTypeTxt + '列表';
        return html;
    },
    getSubCourseInfoList: function(next){ //有io操作，必须回调
        $.get('/getCoursesOfCourse?source=edit&fileId=' + Course.id, function (msg) {
            if (msg.success){
                subCourses.courseInfoList = msg.data;
                if (next) next();
            }
        })
    },
    initUi: function(){
        $('#sub-course-item-list').html('');
        subCourses.index = 0;
        subCourses.makeModal();
        subCourses.makeDeptAuthModal();
        subCourses.makeUserAuthModal();
        subCourses.getSubCourseInfoList(function () {
            var listHtml = '';
            for (var i = 0; i < subCourses.courseInfoList.length; i++){
                var num = ++(subCourses.index);
                listHtml += subCourses.makeSubCourseItem(num, subCourses.courseInfoList[i]);
            }
            $('#sub-course-item-list').html(listHtml);
        });
        var container = makeHtmlTag('div', "lesson-list-wrapper pbl"),
            containerUl = makeHtmlTag('ul', "lesson-list sortable-list js-period-list");
        containerUl.id = "sub-course-item-list";
        container.appendChild(containerUl);
        return container;
    },
    deleteSubCourseItem: function (id) {
        $.get('/toTrash?isInstance=true&gFileId=' + id, function (res) {
            var itemLi = $('li#'+id)[0];
            itemLi.parentNode.removeChild(itemLi);
        })
    },
    changePublicState: function (subCourseId) {
        $.get('/update/changePublicState?isInstance=true&fileId=' + subCourseId, function (msg) {
            if (msg.success){
                var statusDom = $('li#'+subCourseId+' span.unpublish-warning');
                var publishDom = $('li#'+subCourseId+' span.publish-btn');
                statusDom.text((statusDom.text())? '': '（未发布）');
                publishDom.text((publishDom.text().length > 3)? '发布': '取消发布');
            }
        })
    },
    makeSubCourseItem: function (num, infoObj) {
        var id = infoObj.id,
            title = infoObj.name,
            status = (infoObj.isPublished)?'(已发布)':'（未发布）',
            publishBtn = (infoObj.isPublished)?'取消发布':'发布',
            authDropdown = '<span class="dropdown">' +
                            '<a id="dropdown-more-move" data-toggle="dropdown" href="#" class="dropdown-toggle btn btn-link" ><span class="glyphicon glyphicon-menu-down prs"></span>授权管理</a>' +
                            '<ul class="dropdown-menu" style="width:70px">' +
                            '<li><a data-toggle="modal" data-target="#dept-auth-modal"  data-backdrop="static" data-keyboard="false"   class="btn btn-link"><span class="glyphicon glyphicon-list-alt prs"></span>机构授权管理</a></li> ' +
                            '<li><a data-toggle="modal" data-target="#user-auth-modal"  data-backdrop="static" data-keyboard="false"  class="btn btn-link"><span class="glyphicon glyphicon-list-alt prs"></span>人员授权管理</a></li> ' +
                            '</ul>' +
                            '</span>' ;
        var oneSubCourseHtml = '<li id=' + id + ' data-course-index = "'+num+'" style="word-break: break-all;" class="item-lesson clearfix"> ' +
            '<div class="item-line"></div> ' +
            '<div class="item-content">' +
            '<i class="fa fa-file-photo-o text-success"></i>' + Course.subTypeTxt +'<span class="number">' + num + '</span>：' + title + '<span></span>' +
            '<span class="unpublish-warning text-warning">' + status + '</span>' +
            '</div> ' +
            '<div class="item-actions">' +
            '<span class="dropdown">' +
            '<a id="dropdown-more" data-toggle="dropdown" href="" class="dropdown-toggle dropdown-more btn btn-link"><span class="glyphicon glyphicon-menu-down prs"></span>编辑</a> ' +
            '<ul role="menu" style="margin-top:12px;min-width:144px" aria-labelledby="dLabel" class="dropdown-menu pull-right dropdown-menu-more"> ' +
            '<li><a data-toggle="modal" data-target="#modal" data-modaltype="edit"  data-backdrop="static" data-keyboard="false"  data-courseid=' + id +' class="btn btn-link"><span class="glyphicon glyphicon-list-alt prs"></span>编辑课程信息</a></li> ' +
            '<li><a href="/?ui=process_design&isInstance=true&instanceId=' + id + '" target="_blank" class="btn btn-link"><span class="glyphicon glyphicon-edit prs"></span>编辑课程内容</a></li> ' +
            '</ul>' +
            '</span>' +
            '<a class="btn btn-link" onclick="subCourses.changePublicState(\'' + id + '\')"> <span class="glyphicon glyphicon-ok-circle prs"></span><span class="publish-btn">' + publishBtn + '</span></a>' +
            '<a class="delete-lesson-btn btn btn-link" onclick="subCourses.deleteSubCourseItem(\'' + id + '\');"> <span class="glyphicon glyphicon-trash prs" ></span>删除</a>';
            //'<a data-toggle="modal" data-target="#modal"  title="" class="btn btn-link"><span class="es-icon es-icon-edit prs"></span>编辑</a>' +
            //'<a href="" target="_blank" title="" class="btn btn-link"><span class="es-icon es-icon-visibility prs"></span>预览</a>' +
        if(infoObj.isPublished){//发布之后，可以进行授权
            oneSubCourseHtml += authDropdown;
        }
        oneSubCourseHtml += '<span class="dropdown">' +
            '<a id="dropdown-more-move" data-toggle="dropdown" href="#" class="dropdown-toggle btn btn-link" ><span class="glyphicon glyphicon-menu-down prs"></span>移动</a>' +
            '<ul class="dropdown-menu" style="width:70px">' +
                '<li><a href="#" onclick="subCourses.exchange(\'up\', \'' + id + '\')" >上移</a></li>' +
                '<li><a href="#" onclick="subCourses.exchange(\'down\', \'' + id + '\')" >下移</a></li>' +
            '</ul>' +
            '</span>' +
            '</div> </li> ';
        return oneSubCourseHtml;
    },
    makeModal: function () {//模态框内容
        $('#modal').on('hidden.bs.modal', function (event) {
            $(this).html();
        });
        $('#modal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget); // Button that triggered the modal
            var modalType = button.data('modaltype'); // Extract info from data-* attributes
            var headTxt = '',
                btnTxt = '',
                funcName = '',
                modalBody = '';
            if (modalType === 'create'){
                modalBody = '<div class="row"> ' +
                    '<div class="panel panel-default panel-page panel-create-course" style="border: none; box-shadow: none;"> ' +
                    '<form id="sub-course-create-form" novalidate="novalidate" data-widget-cid="widget-1" class="form-horizontal"> ' +
                    '<div style="display: inline-flex;"><div class="course-piece title-label active" onclick=\'$("#user-model-panel").css("display","none");$("#model-panel").css("display","block");\'>选择模板</div> ' +
                    '<div style="margin-left: 40px;cursor:pointer;" class="course-piece title-label" id="user-model-span" onclick="loadUserModels();">用户已有的模板</div></div> ' +
                    '<div class="row" id="model-panel" style="height: 300px;overflow: auto;"> ' +
                    '<div class="col-md-3"><div data-model="blank" class="course-select active" id="blank-course"><i class="es-icon es-icon-putongkecheng"></i> ' +
                    '<div class="course-type">空白模板</div> ' +
                    '<div class="course-intro"></div> ' +
                    '</div> </div> ' +
                    '<div class="col-md-3"><div data-model="model-single-flow" class="course-select"><i class="es-icon es-icon-putongkecheng"></i> ' +
                    '<div class= "course-type">单角色-顺序模板</div> ' +
                    '<div class="course-intro">适合单个角色、顺序执行的基础模板</div> ' +
                    '</div> </div> ' +
                    '</div> ' +
                    '<div class="row" id="user-model-panel" style="height: 300px;overflow: auto;display: none;"></div> ' +
                    '<div class="course-title row"> <div class="col-md-2 controls-label text-lg"> <div class="course-piece title">' +
                    Course.subTypeTxt + '标题' +
                    '</div> </div> <div class="col-md-10 controls"> <input id="sub-course-title-input" type="text" name="title" required="required" data-widget-cid="widget-2" data-explain="" class="form-control"> <div id="help-sub-course-title" style="display:none;" class="help-block"></div> </div> </div> </form> </div> </div>';
                headTxt = '添加';
                btnTxt = '添加';
                funcName = 'create';
            } else if (modalType === 'edit'){
                subCourses.iconCache = '';
                var subCourse = {};
                var id = button.data('courseid');
                for (var i =0; i<subCourses.courseInfoList.length; i++){
                    if (subCourses.courseInfoList[i].id === id){
                        subCourse = subCourses.courseInfoList[i];
                    }
                }
                var title,
                    imgSrc = '../images/course.png',
                    groupRange = {"minMember":"1","maxMember":"5","minRole":"1","maxRole":"5"},
                    detailDes = {};
                title = (subCourse.name) ? subCourse.name : '';
                if (subCourse.fileIcon){
                    var iconInfo = JSON.parse(subCourse.fileIcon);
                    imgSrc = MATERIAL_URL + '/fileRead?createType=own&userId='+ iconInfo.ownerId +'&fileId=' + iconInfo.materialsId;
                }
                if (subCourse.groupRange){
                    groupRange = JSON.parse(subCourse.groupRange);
                }
                if(subCourse.detailDes){
                    detailDes = JSON.parse(subCourse.detailDes);
                }
                //详细介绍
                var detailDesBox='';
                for (var i = 0; i < subCourses.tagList.length; i++){
                    var label = subCourses.tagList[i].name,
                        content = (detailDes[subCourses.tagList[i].id])?(detailDes[subCourses.tagList[i].id]):'',
                        placeholder = (subCourses.tagList[i].descrpt)?(subCourses.tagList[i].descrpt):'';
                    detailDesBox += '<div class="form-group"> ' +
                        '<label class="col-md-2 control-label">' + label + '</label> ' +
                        '<div class="col-md-8"> ' +
                        '<textarea id="sub-course-detail-des" rows="3" placeholder="' + placeholder + '" class="form-control">' + content + '</textarea> ' +
                        '</div> ' +
                        '</div>';
                }
                modalBody = '<div class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label for="sub-course-title-input" class="col-md-2 control-label">标题</label> ' +
                    '<div class="col-md-8"> ' +
                    '<input id="sub-course-title-input" type="text" value="' + title + '" placeholder="输入课程标题" class="form-control" data-courseid="' + id + '"/> ' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group"> ' +
                    '<label for="icon-upload-input" class="col-md-2 control-label">封面</label> ' +
                    '<div style="display: flex;"><div class="col-md-3"><a class="thumbnail">' +
                    '<img id="sub-course-icon-img" src="' + imgSrc + '" alt="子课程封面"/>' +
                    '</a></div></div>' +
                    '<div class="col-md-4 col-md-offset-2"> ' +
                    '<input type="file" accept="image/*" id="icon-upload-input" class="form-control"> ' +
                    '</div> ' +
                    '<div class="col-md-4"> ' +
                    '<button class="btn btn-primary" onclick="icon.upload(subCourses.saveIcon);">上 传</button> ' +
                    '</div> ' +
                    '</div>' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-2 control-label">每组人数</label> ' +
                    '<div class="col-md-8" id="category-div"> ' +
                    '<input class="form-control width-input width-input-small" value=' + groupRange.minMember + ' min="0" max="99" id="member-min" type="number">' +
                    '<span> 至 </span> ' +
                    '<input class="form-control width-input width-input-small" value=' + groupRange.maxMember + ' min="1" max="99" id="member-max" type="number">' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-2 control-label">每个角色人数</label> ' +
                    '<div class="col-md-8" id="category-div"> ' +
                    '<input class="form-control width-input width-input-small" value=' + groupRange.minRole + ' min="0" max="99" id="role-min" type="number">' +
                    '<span> 至 </span> ' +
                    '<input class="form-control width-input width-input-small" value=' + groupRange.maxRole + ' min="1" max="99" id="role-max" type="number">' +
                    '</div> ' +
                    '</div> ' +
                    detailDesBox +
                    '</div>';
                headTxt = '编辑';
                btnTxt = '保存';
                funcName = 'save';
            }
            var modalBox = '<div class="modal-dialog modal-lg"> ' +
                '<div class="modal-content"> ' +
                '<div class="modal-header"> ' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button> ' +
                '<h4 class="modal-title" id="myModalLabel">' + headTxt + Course.subTypeTxt + '</h4> ' +
                '</div> ' +
                '<div class="modal-body">' +
                modalBody +
                '</div> ' +
                '<div class="modal-footer"> ' +
                '<button type="button" class="btn btn-link" data-dismiss="modal" id="cancel-btn">取消</button> ' +
                '<button id="sub-course-save-btn" data-submiting-text="正在提交" class="btn btn-primary" onclick="subCourses.' + funcName + '();">' + btnTxt + '</button>' +
                '</div> </div> </div>';
            $(this).html(modalBox);
            $('.course-select').click(function () {
                $('.course-select').removeClass('active');
                this.className += ' active';
            });
            $('.course-piece.title-label').click(function () {
                $('.course-select').removeClass('active');
                if (this.id !='user-model-span'){
                    $("#blank-course").addClass("active");
                }
                $('.course-piece.title-label').removeClass('active');
                this.className += ' active';
            });
        })
    },
    makeDeptAuthModal: function () {//对机构的课程授权模态框内容
        $('#dept-auth-modal').on('hidden.bs.modal', function (event) {
            $(this).html();
        });
        $('#dept-auth-modal').on('show.bs.modal', function (event) {
            var modalBody = '<form class="form-horizontal" role="form">' +
                            '   <div class="form-group">' +
                            '       <label for="firstname" class="col-sm-2 control-label">选择组织</label>' +
                            '           <div class="col-sm-3">' +
                            '               <select class="form-control" name="orgSelect"></select>' +
                            '           </div>' +
                            '       <label for="lastname" class="col-sm-2 control-label">机构名称</label>' +
                            '       <div class="col-sm-3">' +
                            '           <input type="text" class="form-control" name="deptName" placeholder="必填，请输入院系/班级">' +
                            '       </div>' +
                            '       <div class="col-sm-2">' +
                            '           <button type="button" class="btn btn-success" onclick="subCourses.getDeptAuthorizedInfos()">查 找</button>' +
                            '       </div>' +
                            '   </div>' +
                            '</form>' +
                            '<table class="table table-bordered">' +
                            '  <caption>机构与授权信息列表</caption>' +
                            '  <thead>' +
                            '    <tr><th>序 号</th><th>组 织</th><th>上级机构</th><th>机 构</th><th>授 权</th></tr>' +
                            '  </thead>' +
                            '  <tbody></tbody>' +
                            '</table>';
            var modalBox = '<div class="modal-dialog modal-lg"> ' +
                            '   <div class="modal-content"> ' +
                            '       <div class="modal-header"> ' +
                            '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                            '               <span aria-hidden="true">&times;</span>' +
                            '           </button> ' +
                            '           <h4 class="modal-title" id="myModalLabel">机构授权管理</h4> ' +
                            '       </div> ' +
                            '       <div class="modal-body">' +
                                    modalBody +
                            '       </div> ' +
                            '   </div>'+
                            '</div>';
            $(this).html(modalBox);
            $.post('/getSysOrgList', {}, function (data) {
                if (data.status == '200'){
                    var orgOptions = '<option value="">---请选择---</option>';
                    $.each(data.orgList, function(index, orgInfo){
                        orgOptions += '<option value="' + orgInfo.orgID + '">' + orgInfo.orgFullDes + '</option>';
                    });
                    $('select[name="orgSelect"]', '#dept-auth-modal').append(orgOptions);
                } else {
                    alert("拉取组织列表失败！");
                }
            });
            $('.course-select').click(function () {
                $('.course-select').removeClass('active');
                this.className += ' active';
            });
            $('.course-piece.title-label').click(function () {
                $('.course-select').removeClass('active');
                if (this.id !='user-model-span'){
                    $("#blank-course").addClass("active");
                }
                $('.course-piece.title-label').removeClass('active');
                this.className += ' active';
            });
        })
    },
    getDeptAuthorizedInfos: function(){
        var orgID = $('select[name="orgSelect"]', '#dept-auth-modal').val();
        var deptName = $('input[name="deptName"]', '#dept-auth-modal').val();
        if(!orgID){
            alert("请选择一个组织！");
            return false;
        }
        if(!deptName){
            alert("请填写机构名称！");
            return false;
        }
        var params = {orgID: orgID, deptName: deptName, courseId: Course.id, getType: 'dept'};
        $.post('/getAuthorizedInfos', params, function (resp) {
            var authInfoTable = '';
            if (resp.status == '200'){
                $.each(resp.datas, function(index, authInfo){
                    if(!authInfo.rights){
                        authInfo.rights = '';
                    }
                    var authType1 = authInfo.rights.indexOf('1') != -1 ? 'checked="checked"' : '';
                    var authType2 = authInfo.rights.indexOf('2') != -1 ? 'checked="checked"' : '';
                    authInfoTable += '<tr>' +
                                    '   <td>' + (index + 1) + '</td>' +
                                    '   <td>' + authInfo.orgFullDes + '</td>' +
                                    '   <td>' + authInfo.parentDeptDes + '</td>' +
                                    '   <td>' + authInfo.deptDes + '</td>' +
                                    '   <td>' +
                                    '       <label class="checkbox-inline">' +
                                    '           <input type="checkbox"  value="1" ' + authType1 + ' onchange="subCourses.dealDeptAuth(this, \'' + authInfo.deptID + '\', \'' + authInfo.deptDes +'\')"> 组织课程' +
                                    '       </label>' +
                                    '       <label class="checkbox-inline">' +
                                    '           <input type="checkbox"  value="2" ' +authType2 + ' onchange="subCourses.dealDeptAuth(this, \'' + authInfo.deptID + '\', \'' + authInfo.deptDes +'\')"> 学习课程' +
                                    '       </label>' +
                                    '   </td>' +
                                    '</tr>';
                });
                if(!authInfoTable){
                    authInfoTable = '<tr><td colspan="5">暂无数据！</td></tr>';
                }
            } else {
                authInfoTable = '<tr><td colspan="5">查询异常！</td></tr>';
            }
            $('tbody', '#dept-auth-modal').html(authInfoTable);
        });
    },
    dealDeptAuth: function(obj, deptID, deptDes){
        var isChecked = obj.checked;
        var authType = $(obj).attr('value');
        var authLable = authType == '1' ? '组织' : '学习';
        if(isChecked){// 授权
            if(confirm('确定将课程 ' + Course.title + ' 的 ' + authLable + ' 权利授予' + deptDes + '吗？')){
                var authParam = {
                    deptID: deptID,
                    right: authType,
                    courseId: Course.id,
                    courseName: Course.title,
                    courseType: '2'
                };
                $.post('/authorizeToDept', authParam, function (resp) {
                    if (resp.status == '200'){
                        alert(resp.datas);
                        subCourses.getDeptAuthorizedInfos();//刷新table
                    } else {
                        alert("授权失败：" + resp.err);
                        obj.checked = false;
                    }
                });
            }
        }else{//解除授权
            if(confirm('确定解除' + deptDes + '对课程 ' + Course.title + ' 的 ' + authLable + ' 权利吗？')){
                var cancelAuthParam = {
                    deptID: deptID,
                    right: authType,
                    courseId: Course.id
                };
                $.post('/cancelAuthorizeOfDept', cancelAuthParam, function (resp) {
                    if (resp.status == '200'){
                        alert(resp.datas);
                        subCourses.getDeptAuthorizedInfos();//刷新table
                    } else {
                        alert("解除授权失败：" + resp.err);
                        obj.checked = true;
                    }
                });
            }
        }
    },
    makeUserAuthModal: function () {//对机构的课程授权模态框内容
        $('#user-auth-modal').on('hidden.bs.modal', function (event) {
            $(this).html();
        });
        $('#user-auth-modal').on('show.bs.modal', function (event) {
            var modalBody = '<form class="form-horizontal" role="form">' +
                '   <div class="form-group">' +
                '       <label for="firstname" class="col-sm-2 control-label">选择组织</label>' +
                '           <div class="col-sm-3">' +
                '               <select class="form-control" name="orgSelect"></select>' +
                '           </div>' +
                '       <label for="lastname" class="col-sm-2 control-label">机构名称</label>' +
                '       <div class="col-sm-3">' +
                '           <input type="text" class="form-control" name="deptName" placeholder="必填，请输入院系/班级">' +
                '       </div>' +
                '       <div class="col-sm-2">' +
                '           <button type="button" class="btn btn-success" onclick="subCourses.getUserAuthorizedInfos()">查 找</button>' +
                '       </div>' +
                '   </div>' +
                '</form>' +
                '<table class="table table-bordered">' +
                '  <caption>人员与授权信息列表</caption>' +
                '  <thead>' +
                '    <tr><th>序 号</th><th>组 织</th><th>上级机构</th><th>机 构</th><th>人 员</th><th>授 权</th></tr>' +
                '  </thead>' +
                '  <tbody></tbody>' +
                '</table>';
            var modalBox = '<div class="modal-dialog modal-lg"> ' +
                '   <div class="modal-content"> ' +
                '       <div class="modal-header"> ' +
                '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '               <span aria-hidden="true">&times;</span>' +
                '           </button> ' +
                '           <h4 class="modal-title" id="myModalLabel">人员授权管理</h4> ' +
                '       </div> ' +
                '       <div class="modal-body">' +
                modalBody +
                '       </div> ' +
                '   </div>'+
                '</div>';
            $(this).html(modalBox);
            $.post('/getSysOrgList', {}, function (data) {
                if (data.status == '200'){
                    var orgOptions = '<option value="">---请选择---</option>';
                    $.each(data.orgList, function(index, orgInfo){
                        orgOptions += '<option value="' + orgInfo.orgID + '">' + orgInfo.orgFullDes + '</option>';
                    });
                    $('select[name="orgSelect"]', '#user-auth-modal').append(orgOptions);
                } else {
                    alert("拉取组织列表失败！");
                }
            });
            $('.course-select').click(function () {
                $('.course-select').removeClass('active');
                this.className += ' active';
            });
            $('.course-piece.title-label').click(function () {
                $('.course-select').removeClass('active');
                if (this.id !='user-model-span'){
                    $("#blank-course").addClass("active");
                }
                $('.course-piece.title-label').removeClass('active');
                this.className += ' active';
            });
        })
    },
    getUserAuthorizedInfos: function(){
        var orgID = $('select[name="orgSelect"]', '#user-auth-modal').val();
        var deptName = $('input[name="deptName"]', '#user-auth-modal').val();
        if(!orgID){
            alert("请选择一个组织！");
            return false;
        }
        if(!deptName){
            alert("请填写机构名称！");
            return false;
        }
        var params = {orgID: orgID, deptName: deptName, courseId: Course.id, getType: 'user'};
        $.post('/getAuthorizedInfos', params, function (resp) {
            var authInfoTable = '';
            if (resp.status == '200'){
                $.each(resp.datas, function(index, authInfo){
                    if(!authInfo.rights){
                        authInfo.rights = '';
                    }
                    var authType1 = authInfo.rights.indexOf('1') != -1 ? 'checked="checked"' : '';
                    var authType2 = authInfo.rights.indexOf('2') != -1 ? 'checked="checked"' : '';
                    authInfoTable += '<tr>' +
                        '   <td>' + (index + 1) + '</td>' +
                        '   <td>' + authInfo.orgFullDes + '</td>' +
                        '   <td>' + authInfo.parentDeptDes + '</td>' +
                        '   <td>' + authInfo.deptDes + '</td>' +
                        '   <td>' + authInfo.userName + '</td>' +
                        '   <td>' +
                        '       <label class="checkbox-inline">' +
                        '           <input type="checkbox"  value="1" ' + authType1 + ' onchange="subCourses.dealUserAuth(this, \'' + authInfo.deptID + '\', \'' + authInfo.userID +'\', \'' + authInfo.userName + '\')"> 组织课程' +
                        '       </label>' +
                        '       <label class="checkbox-inline">' +
                        '           <input type="checkbox"  value="2" ' +authType2 + ' onchange="subCourses.dealUserAuth(this, \'' + authInfo.deptID + '\', \'' + authInfo.userID +'\', \'' + authInfo.userName + '\')"> 学习课程' +
                        '       </label>' +
                        '   </td>' +
                        '</tr>';
                });
                if(!authInfoTable){
                    authInfoTable = '<tr><td colspan="5">暂无数据！</td></tr>';
                }
            } else {
                authInfoTable = '<tr><td colspan="5">查询异常！</td></tr>';
            }
            $('tbody', '#user-auth-modal').html(authInfoTable);
        });
    },
    dealUserAuth: function(obj, deptID, userID, userName){
        var isChecked = obj.checked;
        var authType = $(obj).attr('value');
        var authLable = authType == '1' ? '组织' : '学习';
        if(isChecked){// 授权
            if(confirm('确定将课程 ' + Course.title + ' 的 ' + authLable + ' 权利授予' + userName + '吗？')){
                var authParam = {
                    deptID: deptID,
                    userID: userID,
                    right: authType,
                    courseId: Course.id,
                    courseName: Course.title,
                    courseType: '2'
                };
                $.post('/authorizeToUser', authParam, function (resp) {
                    if (resp.status == '200'){
                        alert(resp.datas);
                        subCourses.getUserAuthorizedInfos();//刷新table
                    } else {
                        alert("授权失败：" + resp.err);
                        obj.checked = false;
                    }
                });
            }
        }else{//解除授权
            if(confirm('确定解除' + userName + '对课程 ' + Course.title + ' 的 ' + authLable + ' 权利吗？')){
                var cancelAuthParam = {
                    userID: userID,
                    right: authType,
                    courseId: Course.id
                };
                $.post('/cancelAuthorizeOfUser', cancelAuthParam, function (resp) {
                    if (resp.status == '200'){
                        alert(resp.datas);
                        subCourses.getUserAuthorizedInfos();//刷新table
                    } else {
                        alert("解除授权失败：" + resp.err);
                        obj.checked = true;
                    }
                });
            }
        }
    },
    exchange: function (type, subCourseId) {
        var subCourseId2 = '';
        var currSubCourseIndex = parseInt($('#'+subCourseId, '#sub-course-item-list').eq(0).attr('data-course-index'));
        if(type == 'up'){
            if(currSubCourseIndex == 1){
                alert('已经是第一个， 不能上移了！');
                return false;
            }
            subCourseId2 =  $('li[data-course-index='+(currSubCourseIndex-1)+']', '#sub-course-item-list').eq(0).attr('id');
        }else{
            if($('li[data-course-index='+(currSubCourseIndex + 1) +']', '#sub-course-item-list').length <= 0){
                alert('已经是最后一个， 不能下移了！');
                return false;
            }
            subCourseId2 = $('li[data-course-index='+(currSubCourseIndex + 1) +']', '#sub-course-item-list').eq(0).attr('id');
        }

        if (subCourseId && subCourseId2){
            var exchangeObj = {
                parentId: Course.id,
                subCourseId1: subCourseId,
                subCourseId2: subCourseId2
            };
            $.post('/exchangeSubCourse', exchangeObj, function (msg) {
                if (msg.success){
                    subCourses.initUi();
                } else {
                    alert("交换位置失败！");
                }
            });
        }
    },
    create: function () {
        var title = basicInfo.checkAndFormatName($('#sub-course-title-input').val());
        var courseType = Course.type;
        var xml;
        var xmlId;
        var modelType = $('form#sub-course-create-form div.course-select.active').data('model');
        if (modelType === 'blank'){
            xml = subCourses.initXml();
        } else {
            xmlId = modelType;
        }
        if (title){
            //save to db
            var subCourseObj = {
                isUpdateFile: false,
                rolePool: JSON.stringify([{"roleId":"学生","roleName":"学生"}]),
                name: title,
                parentId: Course.id,
                courseType: courseType,
                isCooperation: false,
                groupRange: JSON.stringify({"minMember":"1","maxMember":"5","minRole":"1","maxRole":"5"}),
                xml: xml,
                xmlId: xmlId
            };
            $.post('/saveInstance', subCourseObj, function (msg) {
                if (msg.success){
                    //增加子课程列表
                    var list = $('#sub-course-item-list');
                    list.html(list.html() + subCourses.makeSubCourseItem(++(subCourses.index), msg.data));
                    $('#modal').modal('hide');
                    subCourses.getSubCourseInfoList();

                    //法二
                    //subCourses.initUi();
                } else {
                    //todo tips '保存失败'
                    console.log(msg);
                }
            })
        }
    },
    initXml: function(){
        return '<mxGraphModel dx="652" dy="804" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" fold="1" page="1" pageScale="1" pageWidth="826" pageHeight="1169" background="#FFFFCC"><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>'
    },
    saveIcon: function (resultFile) {
        if(resultFile.materialsId){
            var fileIconObj = {
                materialsId : resultFile.materialsId,
                fileName : resultFile.fileName,
                ownerId : resultFile.ownerId,
                filePath : resultFile.filePath
            };
            subCourses.iconCache = JSON.stringify(fileIconObj);
            console.log('icon upload success');
            var imgSrc = MATERIAL_URL + '/fileRead?createType=own&userId='+ fileIconObj.ownerId +'&fileId=' + fileIconObj.materialsId;
            $('#sub-course-icon-img').attr('src', imgSrc);
        }
    },
    save: function () {
        var courseObj = {"id": $('#sub-course-title-input').data('courseid')};
        courseObj['title'] = basicInfo.checkAndFormatName($('#sub-course-title-input').val());
        courseObj['groupRange'] = JSON.stringify({
            "minMember": $('#member-min').val(),
            "maxMember": $('#member-max').val(),
            "minRole": $('#role-min').val(),
            "maxRole": $('#role-max').val()
        });
        var detailDesDom = $('textarea#sub-course-detail-des');
        var fileDescData = {};
        for (var i = 0; i < subCourses.tagList.length; i++){
            fileDescData[subCourses.tagList[i].id] = detailDesDom[i].value;
        }
        courseObj['detailDes'] = JSON.stringify(fileDescData);
        if (subCourses.iconCache) {
            courseObj['icon'] = subCourses.iconCache
        }
        if (courseObj['title']){
            $.post('/updateSubCourseInfo', courseObj, function (msg) {
                if (msg.success){
                    $('#modal').modal('hide');
                    showContent('课程单元管理', 'subCourses');
                }else {
                    console.log(msg);
                }
            })
        } else{
            console.log('标题无效，请检查');
            //todo tips '标题无效，请检查'
        }
    }
};
//[end]ui block
initHeadIcon();
showContent('基本信息', '');