/**
 * Created by Administrator on 2015/10/29.
 */
(function($) {
    var ExamTypesHTML =
                    //'<div class="panel-group" id="accordion" style="z-index: 10; position: fixed; left: 20%; top: 14%; width:350px;">'+
                    '<div class="panel-group" id="accordion">'+
                        '<div class="panel panel-info">'+
                            '<div class="panel-heading">'+
                                '<span class="glyphicon glyphicon-chevron-up"></span>'+
                                '<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">题目类型</a>'+
                            '</div>'+
                            '<div id="collapseOne" class="panel-collapse collapse">'+
                                '<div class="panel-body">'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="MULTIPLE_CHOICE">MULTIPLE_CHOICE</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="MULTIPLE_RESPONSE">MULTIPLE_RESPONSE</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="LIKERT">LIKERT</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="YES_NO">YES_NO</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="TRUE_FALSE">TRUE_FALSE</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="SLIDER">SLIDER</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="FILL_IN_BLANK">FILL_IN_BLANK</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="INLINE_CHOICE">INLINE_CHOICE</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div class="well well-sm draggable" style="cursor:move;" title="拖拽编辑">'+
                                        '<div>'+
                                            '<span data-itemType="OPEN_QUESTION">OPEN_QUESTION</span>'+
                                            '<button type="button" class="btn btn-info btn-xs addNewItem" style="float:right;display:none;">+ 新增</button>'+
                                        '</div>'+
                                    '</div>'+

                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

    var Question_Page =
        '<p>第 <strong><span><%=pagePosition%></span></strong> 页<span style="float:right;cursor: pointer;" data-pagePosition = "<%=pagePosition%>" data-page-id="<%=pageId%>" class="glyphicon glyphicon-remove deleteExamPage" title="删除该页"></span></p>' +
        '<div class="panel panel-info">' +
            '<div class="panel-body">' +
                '<div class="well well-sm panelChild" valign="middle" style="background-color:#D2E9FF;">' +
                    '<div class="currExamName" align="center" style="cursor: pointer;" title="双击编辑"><font size="5">&nbsp;<%=examName%></font></div>' +
                    '<div class="editExamName" style="display:none;">' +
                        '<form class="form-horizontal" role="form">' +
                            '<div class="form-group">' +
                                '<label class="col-sm-2 control-label">标题</label>' +
                                '<div class="col-sm-10">' +
                                    '<input type="text" class="form-control newExamName" placeholder="请输入试题标题~" value="<%=examName%>"/>' +
                                    '<p><small>您最多可以输入100个字.</small></p>' +
                                    '<p><small style="display: none;"><font color="red">*必填，且不超过100字符！</font></small><p>' +
                                    '<p>' +
                                        '<button type="button" class="btn btn-info saveEditExamName">确 定</button>&nbsp;&nbsp;' +
                                        '<button type="button" class="btn btn-info cancelEditExamName">取 消</button>' +
                                    '</p>' +
                                '</div>' +
                            '</div>' +
                        '</form>' +
                    '</div>' +
                '</div>' +
                '<div class="sortable sortable-<%=pageId%>" data-page-id = "<%=pageId%>">' +
                '</div>' +
                '<div style="width: 100%;height:130px; border-style:dashed;margin-top:10%;" class="well well-sm droppable droppable-<%=pageId%>" valign="middle">' +
                    '<h4 style="position: relative; left: 15%; top: 35%;margin-right: 15%;">'+
                        '点击新增按钮或者从题目类型中拖拽相应题目，以便开始编辑题目</h4>' +
                '</div>' +
            '</div>' +
        '</div>';

    var ExamPageView = Backbone.View.extend({
        className: 'examPage',
        attributes : {

        },

        events: {
            'dblclick .currExamName': 'editExamName',
            'click .saveEditExamName': 'saveEditExamName',
            'click .cancelEditExamName': 'cancelEditExamName',
            'click .deleteExamPage': 'deleteExamPage'
        },

        initialize : function(){
            _.bindAll(this, 'render', 'getPageItem', 'editExamName', 'saveEditExamName', 'cancelEditExamName', 'addSortEvent', 'deleteExamPage');
        },

        render : function(){
            this.template = _.template(Question_Page);
            $(this.el).append(
                this.template(this.model.toJSON())
            );

            this.getPageItem();

            this.addSortEvent();

            return this;
        },

        getPageItem : function(){
            var pageId = this.model.get('pageId');
            var me = this;
            $.post('/exam/getExamItems', {pageId : pageId}, function(results){
                if(results && results.length > 0){
                    _.each(results, function(item){
                        var examItemModel = new ExamItemModel(item);
                        var examItemView = new ExamItemView({model: examItemModel});
                        var render = examItemView.render();
                        if(render) {
                            $('.sortable', me.el).append(render.el);
                        }
                    });
                }
            });
        },

        addSortEvent : function(){
            var me = this;
            var pageId = this.model.get('pageId');

            $('.droppable', me.el).droppable({
                drop: function( event, ui ) {
                    var examType=(ui.helper[0].innerText).trim();
                    //var L = ($('.examItem-'+pageId, me.el)).length + 1;//每页重新编号
                    //var L = ($('.examItem')).length + 1;//题号一直递增
                    var examPanelView = null;
                    //var examItemModel = new ExamItemModel({itemPosition: L, pageId: pageId, itemType: examType});
                    var examItemModel = new ExamItemModel({pageId: pageId, itemType: examType});
                    if(examType == 'MULTIPLE_CHOICE' || examType == 'MULTIPLE_RESPONSE' || examType == 'YES_NO'|| examType == 'TRUE_FALSE'){
                        examPanelView = new ChoiceQuestionPanelView({model: examItemModel});
                    }else if(examType == 'LIKERT'){
                        examPanelView = new LikertPanelView({model: examItemModel});
                    }else if(examType == 'SLIDER'){
                        examPanelView = new SliderPanelView({model: examItemModel});
                    }else if(examType == 'FILL_IN_BLANK'){
                        examPanelView = new FillInBlankPanelView({model: examItemModel});
                    }else if(examType == 'INLINE_CHOICE'){
                        examPanelView = new InlineChoicePanelView({model: examItemModel});
                    }else if(examType == 'OPEN_QUESTION'){
                        examPanelView = new OpenQuestionPanelView({model: examItemModel});
                    }else {
                        alert('错误，无题型：'+examType.trim()+'!');
                    }

                    if(examPanelView) {
                        $(this).before(examPanelView.render().el);
                        $(this).css('display', 'none');
                    }
                }
            });

            $('.sortable-'+pageId, me.el).sortable(
                {   distance: 10,
                    update: function(event, ui) {
                        var obj = ui.item;
                        //preP:原位置；currP:现位置
                        var currP=0, preP = $(obj).find('div').eq(0).attr('data-itemPosition');
                        var sumL = ($('.examItem-'+pageId, me.el)).length;
                        var sortItems = [];
                        var start= 0, end=0;
                        for(var i=0;i<sumL;i++){
                            var currObj = $('.examItem-'+pageId, me.el)[i];
                            if($(currObj).attr('data-itemPosition') == preP){
                                currP = i+1;
                            }
                        }
                        preP = Number(preP);
                        if(preP > currP) {//上移，影响下面的item
                            start =  currP-1;
                            end = sumL;
                        }else{//下移，影响上面的item
                            start =  0;
                            end = currP;
                        }

                        for (var i = start; i < end; i++) {
                            var currObj = $('.examItem-'+pageId, me.el)[i];
                            $(currObj).attr('data-itemPosition', (i + 1)+'');
                            $(currObj).find('h4').eq(0).find('span').eq(0).text(i + 1);
                            sortItems.push($(currObj).attr('data-examItem-id'));
                        }

                        var sortedItems = {
                            startPosition : start+1,
                            sortsItems : sortItems
                        };

                        $.post('/exam/sortExamItems', {sortedItems : JSON.stringify(sortedItems)}, function(result){
                            //console.log(result);
                        });

                    }
                }
            );
            //$('.sortable-'+pageId, me.el).disableSelection();
        },

        editExamName : function(){
            $('.currExamName', this.el).css('display', 'none');
            $('.editExamName', this.el).css('display', 'block');
        },

        saveEditExamName : function(){
            var examId = $('#examName').attr('data-exam-id');
            var examName = $('.newExamName', this.el).val();
            var me = this;
            $.post('/exam/updateExam', {examId: examId, examName: examName}, function(result){
                if(result && result.success){
                    $('.currExamName').html('<font size="5">&nbsp;'+examName+'</font>');//可能有多页，此处不限制在me.el范围内
                    $('#examName').text(examName);
                    me.cancelEditExamName();
                }
            });
        },

        cancelEditExamName : function(){
            $('.currExamName', this.el).css('display', 'block');
            $('.editExamName', this.el).css('display', 'none');
        },

        deleteExamPage : function(event){
            var obj = event.currentTarget;
            //var pagePosition = $(obj).attr('data-pagePosition');
            var pageId = this.model.get('pageId');
            var me = this;
            var currP = $(obj).attr('data-pagePosition');
            $.post('/exam/deleteExamPage', {pageId: pageId}, function(result){
                if(result && result.success){

                    var sumL = ($('.examPage')).length;
                    var sortItems = [];

                    for(var i = currP; i<sumL;i++){
                        var currObj = $('.examPage')[i];
                        $(currObj).find('p').eq(0).find('span').eq(0).text(i);
                        $(currObj).find('p').eq(0).find('span').eq(1).attr('data-pagePosition', i);
                        sortItems.push($('.sortable', currObj).attr('data-page-id'));
                    }
                    $(me.el).remove();
                    var sortedItems = {
                        startPosition : currP,
                        sortsItems : sortItems
                    };

                    $.post('/exam/sortExamPages', {sortedItems : JSON.stringify(sortedItems)}, function(result){
                        //console.log(result);
                    });

                }
            });
        }
    });

    var ExamTypesView = Backbone.View.extend({
        el: '.examTypeBar',

        attributes : {

        },

        events: {
            'click .addNewItem' : 'addNewItem',
            'show.bs.collapse #collapseOne': 'showExamType',
            'hide.bs.collapse #collapseOne': 'hideExamType'
        },

        initialize : function(){
            _.bindAll(this, 'render','addHover', 'addNewItem', 'showExamType');
            this.render();
        },

        render : function () {
            $(this.el).append(ExamTypesHTML);

            $( ".draggable" ).draggable({ distance: 5, helper: "clone", cursor: "move" , zIndex: 2, opacity: 0.35,
                start: function( event, ui ) {
                    var type = ui.helper.find('span').eq(0).attr('data-itemType');
                    var iHtml = '<div style="width: 580px;height:80px; border-style:dashed; background-color: #CFCFCF;">'+
                        '<h3 style="position: relative; left: 40%;">'+type+'</h3></div>';
                    ui.helper.html(iHtml);
                },
                stop: function( event, ui ) {
                    ui.helper.remove();
                }
            });

            this.addHover();
        },

        addHover: function(){
            $('.draggable').hover(
                function(event){
                    var x = event.pageX + 30;
                    var y = event.pageY + 10;
                    var obj = event.currentTarget;

                    var itemType = $(obj).find('span').eq(0).attr('data-itemType');
                    $.post('/exam/getExamItems', {itemType : itemType, isExample: true}, function(result){
                        if(result){
                            var examItemModel = new ExamItemModel(result);
                            var examItemView = new ExamItemView({model: examItemModel});
                            var render = examItemView.render();
                            if(render) {
                                var itemExample =   '<div class="panel panel-default itemExample">'+
                                                        '<div class="panel-heading" align="center">'+itemType+'示例：</div>'+
                                                        '<div class="panel-body">'+render.el.innerHTML+'</div>'+
                                                    '</div>';
                                $('body').append(itemExample);
                                $(".itemExample").css({
                                    "width": 600 + "px",
                                    "top":  y + "px",
                                    "left": x + "px",
                                    "position": "absolute",
                                    "z-index": 10
                                }).show("fast");
                            }

                        }
                    });
                },
                function(){
                    $(".itemExample").remove();
                }
            );
        },

        addNewItem: function (){//此功能没做好，需修改。现在不用
            var L = ($('.examItem')).length + 1;
            var examItemModel = new ExamItemModel({itemPosition : L});
            var examPanelView = new ChoiceQuestionPanelView({model : examItemModel});
            var firstDroppable = $(".droppable")[0];
            $(firstDroppable).before(examPanelView.render().el);
            $(firstDroppable).css('display', 'none');
        },

        showExamType : function(){
            var status = $('.panel-heading').find('span').eq(0);
            $(status).removeClass('glyphicon-chevron-up');
            $(status).addClass('glyphicon-chevron-down');
        },

        hideExamType : function(){
            var status = $('.panel-heading').find('span').eq(0);
            $(status).removeClass('glyphicon-chevron-down');
            $(status).addClass('glyphicon-chevron-up');
        }
    });

    var ExamWorkspaceView = Backbone.View.extend({
        el: '.workspace',

        events: {
        },

        initialize : function(){
            _.bindAll(this, 'render');
            this.render();
        },

        render : function (){
            var me = this;
            $.get('/exam/getExamPage', {examId : me.model.get('examId')}, function(data){
                if(data && data.length > 0) {
                    _.each(data, function (result) {
                        var examPageModel = new ExamPageModel(result);
                        examPageModel.set({examName: me.model.get('examName')});

                        var examPageView = new ExamPageView({model: examPageModel});
                        $(me.el).append(examPageView.render().el);
                    });
                }
            });
        }
    });

    var ExamAppView = Backbone.View.extend({
        el : '.container',
        events: {
            'click .previewExam': 'previewExam',
            'click .finishExam': 'finishExam',
            'click .addNewPage' : 'createNewQPage'
        },

        initialize : function(){
            _.bindAll(this, 'render');
            this.Html =
                         '<div style="width:100%;">'+
                            '<h3>'+
                                '<span class="glyphicon glyphicon-hand-right"></span>&nbsp;'+
                                '<span id="examName" data-exam-id="<%=examId%>"><%=examName%></span>'+
                                '<!--<button type="button" class="btn btn-info btn-sm previewExam" data-examType="test" style="float:right;">测 试</button>-->'+
                                '<button type="button" class="btn btn-info btn-sm finishExam" data-examType="finish" style="float:right;">保 存</button>'+
                                '<button type="button" class="btn btn-info btn-sm previewExam" data-examType="preShow" style="float:right;margin-right:5px;">预 览</button>'+
                            '</h3>'+
                            '<hr />'+
                         '</div>'+
                         '<div class="row">'+
                            '<div class="col-md-3 examTypeBar"></div>'+
                            '<div class="col-md-9" style="height:800px;overflow-y:auto;">'+
                                 '<div class="workspace"></div>'+
                                 '<div class="well well-sm addNewPage" style="width: 100%; border-style:dashed;cursor:pointer;" valign="middle" align="center">' +
                                    '<h4 style="position: relative; left: 15%; top: 35%;margin-right: 15%;" >+ 新增頁面</h4>' +
                                 '</div>'+
                             '</div>'+
                         '</div>';
            this.template = _.template(this.Html);
            this.render();
        },

        render : function(){
            //处理可能的请求，即此页面可能由其他页面请求而来
            var urlParams = window.location.search;
            if(urlParams.indexOf('?') != -1) {
                var param = urlParams.substr(1);
                var paramArr1 = param.split('&');
                var paramArr2 = paramArr1[0].split('=');

                if(!paramArr2[1]){
                    $(this.el).append('<p><font color="red">*得不到该试卷id，无法编辑！</font></p>');
                    return false;
                }
                var me = this;
                $.get('/exam/getExam', {examId : paramArr2[1]}, function(data){
                    if(data && data.length > 0) {
                        var exam = data[0];
                        var query = {examId: exam.examId};
                        if(exam.isUsed) {//已经被使用过了，再编辑时就是新版本了，需要更新版本号
                            query.exam_version = exam.exam_version + 1.0;
                            query.isUsed = false;
                        }
                        $.post('/exam/updateExam', query, function(result){
                            if(result && result.success){
                                me.model = new ExamModel(exam);
                                $(me.el).append(
                                    me.template(me.model.toJSON())
                                );
                                me.examTypesView = new ExamTypesView();
                                me.examWorkspaceView = new ExamWorkspaceView({model: me.model});
                            }else{
                                $(this.el).append('<p><font color="red">*更新试卷版本失败！</font></p>');
                                return false;
                            }
                        });

                        /*
                        me.model = new ExamModel(exam);
                        $(me.el).append(
                            me.template(me.model.toJSON())
                        );

                        me.examTypesView = new ExamTypesView();
                        if(exam.isFinish){//现在加上版本后，允许试卷多次编辑
                            $('.workspace', me.el).html('<div align="center" style="margin-top:25%;">试卷['+exam.examName+']编辑已提交完成，不能再次编辑了！</div>');
                            $('.finishExam', me.el).remove();
                            $('.addNewPage', me.el).remove();
                        }else {
                            me.examWorkspaceView = new ExamWorkspaceView({model: me.model});
                        }
                        */
                    }else{
                        $(me.el).append('<p><font color="red">*获取不到试卷，无法编辑！</font></p>');
                        return false;
                    }
                });
            }
        },

        previewExam : function(event){
            var obj = event.currentTarget;
            var examType = $(obj).attr('data-examType');
            var examId = $('#examName').attr('data-exam-id');
            window.open('/exam/enterExam?examId='+examId+'&examType='+examType);
        },

        finishExam: function(){
            var me = this, isFinish = true;
            $('.examPage', me.el).each(function(index){
                var currObj = $(this);
                var currObj_items = $('.examItem', currObj).length;
                if(currObj_items == 0){
                    alert('第'+(index+1)+'页没有题目，不能提交！');
                    isFinish = false;
                    return false;
                }
            });
            if(isFinish){
                $('.workspace', me.el).html('<div align="center" style="margin-top:25%;">试卷['+me.model.get('examName')+']编辑已保存！</div>');
                $('.finishExam', me.el).remove();
                $('.addNewPage', me.el).remove();
            }
            /*
            //现在加上版本后，允许试卷多次编辑
            if(confirm('提交完成后不能再次编辑了，现在确定提交完成编辑吗？')){
                var examId = $('#examName').attr('data-exam-id');
                var me = this;
                $.post('/exam/finishEditExam', {examId: examId}, function(result){
                    if(result && result.success){
                        $('.workspace', me.el).html('<div align="center" style="margin-top:25%;">试卷['+me.model.get('examName')+']编辑已完成！</div>');
                        $('.finishExam', me.el).remove();
                        $('.addNewPage', me.el).remove();
                    }else{
                        alert('抱歉，提交失败！');
                    }
                });
            }
            */
        },

        createNewQPage : function(){
            var me = this;
            var examPageModel = new ExamPageModel({
                pageId : getDateStrUUID(),
                pageName : '',
                pagePosition : $('.examPage').length + 1,
                examId : me.model.get('examId')
            });
            $.post('/exam/saveExamPage', {examPage : JSON.stringify(examPageModel.toJSON())}, function(data){
                if(data && data.success){
                    examPageModel.set({examName : me.model.get('examName')});
                    var examPageView = new ExamPageView({model: examPageModel});
                    $('.workspace').append(examPageView.render().el);
                }
            });

        }
    });

    var examAppView = new ExamAppView();
})(jQuery)