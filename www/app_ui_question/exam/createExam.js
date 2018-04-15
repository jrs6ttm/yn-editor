/**
 * Created by Administrator on 2015/10/29.
 */
(function($) {
    var Question_Page =
        '<div><div class="panel panel-info">' +
            '<div class="panel-body">' +
                '<div class="well well-sm" valign="middle" style="background-color:#D2E9FF;">' +
                    '<div class="currExamName" align="center"><font size="5">&nbsp;<%=examName%></font></div>' +
                '</div>' +
                '<div class="examItemsArea" data-page-id = "<%=pageId%>"></div>' +
                '<div style="margin-top:5%;margin-left: 40%;">' +
                    '<%if(pagePosition > 1){%>'+
                        '<button type="button" class="btn btn-info preExamPage" value="pre"><span class="glyphicon glyphicon-arrow-left"></span></button>&nbsp;&nbsp;' +
                    '<%}%>'+
                    '<span>&nbsp;<strong><%=pagePosition%></strong> / <%=pageCount%>&nbsp;</span>' +
                    '<%if(pagePosition < pageCount){%>'+
                        '&nbsp;&nbsp;<button type="button" class="btn btn-info nextExamPage" value="next">&nbsp;<span class="glyphicon glyphicon-arrow-right"></span>&nbsp;</button>' +
                    '<%}else if(examType == "test"){%>'+
                        '&nbsp;&nbsp;<button type="button" class="btn btn-info nextExamPage" value="over">提交试卷</span></button>' +
                    '<%}%>'+
                '</div>' +
            '</div>' +
        '</div></div>';

    var Choice_Question_QItem =
        '<div style="margin-top:10px;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>"  class="examItem">'+
                '<div style="margin-bottom:20px;">'+
                    '<h4><span><%=itemPosition%></span>.<%=itemDescription%></h4>'+
                    '<div style="margin-left:10px;">'+
                        '<%_.each(choiceCollection, function(choiceItem){%>'+
                            '<div class="row" style="margin-bottom: 5px;margin-left:5px;">'+
                                '<div class="col-sm-1">'+
                                    '<%if(itemType == "MULTIPLE_RESPONSE"){%>'+
                                        '<input type="checkbox" <%if(choiceItem.isChecked){%>checked="checked"<%}%> <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%> name="selectionItem_<%=itemId%>" />'+
                                    '<%}else{%>'+
                                        '<input type="radio" <%if(choiceItem.isChecked){%>checked="checked"<%}%> <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%> name="selectionItem_<%=itemId%>" />'+
                                    '<%}%>'+
                                '</div>'+
                                '<label class="col-sm-1" style="margin-left:-3%;"><%=choiceItem.choiceCode%></label>'+
                                '<div class="col-sm-9" >'+
                                    '<p style="margin-left:-6%;"><%=choiceItem.choiceDescription%></p>'+
                                '</div>'+
                            '</div>'+
                        '<%});%>'+
                        '<%if(examType == "check"){%>'+
                            '<div class="well well-sm" style="background-color:#ECF5FF;margin-left:2%;margin-right:2%;">'+
                                '<div class="row">'+
                                    '<label class="col-sm-2">结果：</label>'+
                                    '<label class="col-sm-2" style="margin-left:-10%;">'+
                                        '[ <strong ><font color = "red">'+
                                        '<%if(rightAnswer[0].isRight){%>'+
                                            '正确'+
                                        '<%}else{%>'+
                                            '错误'+
                                        '<%}%>'+
                                        '</font></strong> ]'+
                                    '</label>'+
                                    '<label class="col-sm-2" style="margin-left:-5%;">得分：</label>'+
                                    '<label class="col-sm-2" style="margin-left:-10%;">'+
                                        '[ <strong ><font color = "red"><%=rightAnswer[0].myScore%></font></strong> ]'+
                                    '</label>'+
                                    '<div class="col-sm-2">'+
                                        '<%if(!rightAnswer[0].isRight){%>'+
                                            '<button type="button" class="btn btn-info btn-xs lookAnswer" data-type = "answer_<%=rightAnswer[0].choiceItemId%>">查看答案</button>'+
                                        '<%}%>'+
                                    '</div>'+
                                    '<div class="col-sm-2" style="margin-left:-5%;">'+
                                        '<button type="button" class="btn btn-info btn-xs lookAnalysis" data-type = "analysis_<%=rightAnswer[0].choiceItemId%>">查看解析</button>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="display:none" data-type = "answer_<%=rightAnswer[0].choiceItemId%>">'+
                                    '<label class="col-sm-2">答案：</label>'+
                                    '<label class="col-sm-2" style="margin-left:-10%;">'+
                                        '<strong >'+
                                        '<%_.each(rightAnswer[0].rightChoiceIds, function(rightChoiceId){%>'+
                                            '<span><%=alt[rightChoiceId-1]%>&nbsp;</span>'+
                                        '<%});%>'+
                                        '</strong>'+
                                    '</label>'+
                                '</div>'+
                                '<div class="row" style="display:none" data-type = "analysis_<%=rightAnswer[0].choiceItemId%>">'+
                                    '<label class="col-sm-2">解析：</label>'+
                                    '<label class="col-sm-9" style="margin-left:-10%;">'+
                                        '<p><strong ><%=rightAnswer[0].feedback%></strong><p>'+
                                    '</label>'+
                                '</div>'+
                            '</div>'+
                        '<%}%>'+
                    '</div>'+
                '</div>'+
        '</div>';

    var Likert_QItem =
        '<div style="margin-top:10px;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>"  class="examItem examItem-<%=pageId%>">'+
            '<div style="margin-bottom:20px;">'+
                '<h4><p><span><%=itemPosition%></span>.<%=itemDescription%></p></h4>'+
                '<div style="margin-top:10px;margin-bottom: 10px;margin-left: 5px;">' +
                    '<table class="table table-striped">' +
                        '<thead>' +
                            '<tr>' +
                                '<th style="width:45%;"></th>' +
                                '<%for(var i=1;i<=likertLevel;i++){%>'+
                                    '<th><%=i%></th>'+
                                '<%}%>'+
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<%_.each(choiceCollection, function(choiceItem, index){%>'+
                                '<tr>' +
                                    '<td><p><%=choiceItem.choiceDescription%></p></td>' +
                                    '<%for(var i=1;i<=likertLevel;i++){%>'+
                                        '<td><input type="radio" <%if(choiceItem.myAnswer == i){%>checked="checked"<%}%> <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%> name="myLikert_<%=itemId%>_<%=choiceItem.choiceId%>"></td>' +
                                    '<%}%>'+
                                '</tr>' +
                            '<%});%>'+
                        '</tbody>' +
                    '</table>' +
                '</div>'+
            '</div>'+
        '</div>';

    var Open_Question_QItem =
        '<div style="margin-top:10px;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>"  class="examItem">'+
            '<div style="margin-bottom:20px;">'+
                '<h4><span><%=itemPosition%></span>.<%=itemDescription%></h4>'+
                '<div style="margin-left:10px;" class="row">'+
                    '<div class="col-sm-10">'+
                        '<%if(myAnswer){%>'+
                            '<textarea  class="form-control questionDes" rows="3" style="background-color:#FFFFFF;" <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%>><%=myAnswer%></textarea>'+
                        '<%}else{%>'+
                             '<textarea  class="form-control questionDes" rows="3" style="background-color:#FFFFFF;" <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%>></textarea>'+
                        '<%}%>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';

    var Slider_QItem =
        '<div style="margin-top:10px;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" class="examItem examItem-<%=pageId%>">'+
            '<div style="margin-bottom:20px;">'+
                '<h4><p><span><%=itemPosition%></span>.<%=itemDescription%></p></h4>'+
                '<div style="margin-top:10px;margin-bottom: 10px;margin-left: 5px;">' +
                    '<div align="center">'+
                        '<label for="amount">当前值(百分比)：</label>'+
                        '<input type="text"  id="slider_<%=itemId%>_value" style="border:0; color:#f6931f; font-weight:bold;" />'+
                    '</div>'+
                    '<div id="slider_<%=itemId%>" style="cursor: pointer;margin-top:10px;margin-bottom: 10px;margin-left: 5px;"></div>'+
                '</div>'+
            '</div>'+
        '</div>';

    var Fill_IN_Blank_QItem =
        '<div style="margin-top:10px;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" class="examItem examItem-<%=pageId%>">'+
            '<div style="margin-bottom:20px;">'+
                '<h4><p><span><%=itemPosition%></span>.<%=itemDescription%><p></h4>'+
                '<%_.each(blankCollection, function(blankItem){%>'+
                    '<div class="row" style="margin-bottom: 10px;">'+
                        '<div class="col-sm-1" align="center">'+
                            '<label class="control-label">(<%=blankItem.blankId%>). </label>'+
                        '</div>'+
                        '<div class="col-sm-9" >'+
                            '<input type="text" class="form-control mySelectionContents" style="margin-left: -5%;background-color:#FFFFFF;" <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%> placeholder="请填写答案" value="<%=blankItem.myAnswer%>" />'+
                        '</div>'+
                    '</div>'+

                    '<%if(examType == "check"){%>'+
                        '<div class="well well-sm" style="background-color:#ECF5FF;width:77%;margin-left:2%;margin-right:2%;">'+
                            '<div class="row">'+
                                '<label class="col-sm-2">结果：</label>'+
                                '<label class="col-sm-2" style="margin-left:-10%;">'+
                                    '[ <strong ><font color = "red">'+
                                    '<%if(blankItem.isRight){%>'+
                                        '正确'+
                                    '<%}else{%>'+
                                        '错误'+
                                    '<%}%>'+
                                    '</font></strong> ]'+
                                '</label>'+
                                '<label class="col-sm-2" style="margin-left:-5%;">得分：</label>'+
                                '<label class="col-sm-2" style="margin-left:-10%;">'+
                                    '[ <strong ><font color = "red"><%=blankItem.myScore%></font></strong> ]'+
                                '</label>'+
                                '<div class="col-sm-2">'+
                                '<%if(!blankItem.isRight){%>'+
                                    '<button type="button" class="btn btn-info btn-xs lookAnswer" data-type = "answer_<%=blankItem.blankId%>">查看答案</button>'+
                                '<%}%>'+
                                '</div>'+
                                '<div class="col-sm-2" style="margin-left:-5%;">'+
                                    '<button type="button" class="btn btn-info btn-xs lookAnalysis" data-type = "analysis_<%=blankItem.blankId%>">查看解析</button>'+
                                '</div>'+
                            '</div>'+

                            '<div class="row" style="display:none" data-type = "answer_<%=blankItem.blankId%>">'+
                                '<label class="col-sm-2">答案：</label>'+
                                '<label class="col-sm-8" style="margin-left:-10%;">'+
                                    '<strong >'+
                                    '<%_.each(blankItem.blankValue, function(value){%>'+
                                        '<span><%=value%>&nbsp;</span>'+
                                    '<%});%>'+
                                    '</strong>'+
                                '</label>'+
                            '</div>'+
                            '<div class="row" style="display:none" data-type = "analysis_<%=blankItem.blankId%>">'+
                                '<label class="col-sm-2">解析：</label>'+
                                '<label class="col-sm-9" style="margin-left:-10%;">'+
                                    '<p><strong ><%=blankItem.feedback%></strong><p>'+
                                '</label>'+
                            '</div>'+
                        '</div>'+
                    '<%}%>'+
                '<%});%>'+
             '</div>'+
        '</div>';

    var Inline_Choice_QItem =
        '<div style="margin-top:10px;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>"  class="examItem examItem-<%=pageId%>">'+
            '<div style="margin-bottom:20px;">'+
                '<h4><p><span><%=itemPosition%></span>.<%=itemDescription%><p></h4>'+
                '<%_.each(choiceCollection, function(inlineChoiceItem, index){%>'+
                    '<div class="row" style="margin-left:5px;">'+
                        '<div class="col-sm-1">'+
                            '<label class="control-label">(<%=inlineChoiceItem.inlineChoiceId%>). </label>'+
                        '</div>'+
                        '<div class="col-sm-10">'+
                            '<%_.each(inlineChoiceItem.inlineChoice, function(choiceItem){%>'+
                                '<div class="row" style="margin-bottom: 5px;margin-left:-6%;">'+
                                    '<div class="col-sm-1">'+
                                        '<input type="radio" <%if(choiceItem.isChecked){%>checked="checked"<%}%> <%if(examType == "check" || examType == "submitted"){%>disabled="disabled"<%}%> name="selectionItem_<%=itemId%>_<%=inlineChoiceItem.inlineChoiceId%>" />'+
                                    '</div>'+
                                    '<label class="col-sm-1" style="margin-left:-3%;"><%=choiceItem.choiceCode%></label>'+
                                    '<div class="col-sm-9">'+
                                        '<p style="margin-left:-6%;"><%=choiceItem.choiceDescription%></p>'+
                                    '</div>'+
                                '</div>'+
                            '<%});%>'+
                        '</div>'+
                    '</div>'+
                    '<%if(examType == "check"){%>'+
                        '<div class="well well-sm" style="background-color:#ECF5FF;margin-left:2%;margin-right:2%;">'+
                            '<div class="row">'+
                                '<label class="col-sm-2">结果：</label>'+
                                '<label class="col-sm-2" style="margin-left:-10%;">'+
                                    '[ <strong ><font color = "red">'+
                                    '<%if(rightAnswer[index].isRight){%>'+
                                        '正确'+
                                    '<%}else{%>'+
                                        '错误'+
                                    '<%}%>'+
                                    '</font></strong> ]'+
                                '</label>'+
                                '<label class="col-sm-2" style="margin-left:-5%;">得分：</label>'+
                                '<label class="col-sm-2" style="margin-left:-10%;">'+
                                    '[ <strong ><font color = "red"><%=rightAnswer[index].myScore%></font></strong> ]'+
                                '</label>'+
                                '<div class="col-sm-2">'+
                                    '<%if(!rightAnswer[index].isRight){%>'+
                                        '<button type="button" class="btn btn-info btn-xs lookAnswer" data-type = "answer_<%=rightAnswer[index].inlineChoiceId%>">查看答案</button>'+
                                    '<%}%>'+
                                '</div>'+
                                '<div class="col-sm-2" style="margin-left:-5%;">'+
                                    '<button type="button" class="btn btn-info btn-xs lookAnalysis" data-type = "analysis_<%=rightAnswer[index].inlineChoiceId%>">查看解析</button>'+
                                '</div>'+
                            '</div>'+

                            '<div class="row" style="display:none" data-type = "answer_<%=rightAnswer[index].inlineChoiceId%>">'+
                                '<label class="col-sm-2">答案：</label>'+
                                '<label class="col-sm-2" style="margin-left:-10%;">'+
                                    '<strong >'+
                                    '<%_.each(rightAnswer[index].rightChoiceIds, function(rightChoiceId){%>'+
                                        '<span><%=alt[rightChoiceId-1]%>&nbsp;</span>'+
                                    '<%});%>'+
                                    '</strong>'+
                                '</label>'+
                            '</div>'+
                            '<div class="row" style="display:none" data-type = "analysis_<%=rightAnswer[index].inlineChoiceId%>">'+
                                '<label class="col-sm-2">解析：</label>'+
                                '<label class="col-sm-9" style="margin-left:-10%;">'+
                                    '<p><strong><%=rightAnswer[index].feedback%></strong><p>'+
                                '</label>'+
                            '</div>'+
                        '</div>'+
                    '<%}%>'+
                '<%});%>'+
            '</div>'+
        '</div>';

    var examReport =    '<div align="center" style="margin-top:5%;">'+
                            '<table class="table table-hover">' +
                                '<caption align="center">测试者：<%=username%> / 试卷：<%=examName%> / 测试时间：<%=new Date(createTime).toLocaleString()%></caption>' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th>题型</th>' +
                                        '<th>分数</th>' +
                                        '<th>得分</th>' +
                                        '<th>正确率</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<%if(itemReports && itemReports.length>0){%>'+
                                    '<%_.each(itemReports, function(itemReport){%>'+
                                        '<tr>' +
                                            '<td><%=itemReport.itemType%></td>' +
                                            '<td class="score"><%=itemReport.score%></td>' +
                                            '<td class="myScore"><%=itemReport.myScore%></td>' +
                                            '<%if(itemReport.itemType == "LIKERT" || itemReport.itemType == "SLIDER" || itemReport.itemType == "OPEN_QUESTION"){%>'+
                                                '<td>--</td>' +
                                            '<%}else{%>'+
                                                '<td>' +
                                                    '<%if(itemReport.score === 0){%><span>--</span><%}else{%>'+
                                                    '<%=Math.round((itemReport.myScore/itemReport.score)*100*100)/100%>%<%}%>'+
                                                '</td>'+
                                            '<%}%>'+
                                        '</tr>' +
                                    '<%});%>'+
                                '<%}%>'+
                                '</tbody>' +
                                '<tfoot>'+
                                    '<tr>' +
                                        '<td>总计</td>' +
                                        '<td>0</td>' +
                                        '<td>0</td>' +
                                        '<td>0.00%</td>' +
                                    '</tr>' +
                                '</tfoot>'+
                            '</table>' +
                        '</div>';


    var ExamReportModel = Backbone.Model.extend({
        defaults:{
            username:'', examName: '', createTime:'', itemReports:[]
        }
    });
    var ExamReportView = Backbone.View.extend({
        initialize : function(){
            _.bindAll(this, 'render', 'mySummarize');
            this.template = _.template(examReport);
        },

        render : function(){
            $(this.el).append(this.template(this.model.toJSON()));

            this.mySummarize();
            return this;
        },

        mySummarize : function(){
            var sumScore = 0, sumMyScore = 0;
            $('.score', this.el).each(function(index){
                sumScore += Number($(this).text());
            });
            $('.myScore', this.el).each(function(index){
                sumMyScore += Number($(this).text());
            });

            $('tfoot', this.el).find('td').eq(1).text(sumScore);
            $('tfoot', this.el).find('td').eq(2).text(sumMyScore);
            var sumPercent = sumScore === 0? '--':Math.round((sumMyScore/sumScore)*100*100)/100 + '%';
            $('tfoot', this.el).find('td').eq(3).text(sumPercent);
        }
    });

    var ExamItemView = Backbone.View.extend({
        events: {
            'click .lookAnswer' : 'lookOpt',
            'click .lookAnalysis' : 'lookOpt'
        },
        initialize : function(){
            _.bindAll(this, 'render', 'addSlider', 'lookOpt');
        },

        render : function(){
            var examType = this.model.get('itemType');

            if(examType == 'MULTIPLE_CHOICE' || examType == 'MULTIPLE_RESPONSE' || examType == 'YES_NO'|| examType == 'TRUE_FALSE'){
                this.template = _.template(Choice_Question_QItem);
                var alt = ['A','B','C','D','F','G','H','I','J','K'];
                this.model.set({alt: alt});
                $(this.el).append(this.template(this.model.toJSON()));
                return this;
            }else if(examType == 'LIKERT'){
                this.template = _.template(Likert_QItem);
                $(this.el).append(this.template(this.model.toJSON()));
                return this;
            }else if(examType == 'SLIDER'){
                this.template = _.template(Slider_QItem);
                $(this.el).append(this.template(this.model.toJSON()));
                this.addSlider();
                return this;
            }else if(examType == 'FILL_IN_BLANK'){
                this.template = _.template(Fill_IN_Blank_QItem);
                $(this.el).append(this.template(this.model.toJSON()));
                return this;
            }else if(examType == 'INLINE_CHOICE'){
                this.template = _.template(Inline_Choice_QItem);
                var alt = ['A','B','C','D','F','G','H','I','J','K'];
                this.model.set({alt: alt});
                $(this.el).append(this.template(this.model.toJSON()));
                return this;
            }else if(examType == 'OPEN_QUESTION'){
                this.template = _.template(Open_Question_QItem);
                $(this.el).append(this.template(this.model.toJSON()));
                return this;
            }else {
                alert('错误，无题型：'+examType.trim()+'!');
                return null;
            }
        },

        addSlider: function(){
            var itemId = this.model.get('itemId'), myAnswer = this.model.get('myAnswer');
            var me = this;
            $("#slider_"+itemId, me.el).slider({
                range: "min",
                value: myAnswer?myAnswer:30,
                min: 1,
                max: 100,
                slide: function( event, ui ) {
                    $( "#slider_"+itemId+"_value", me.el ).val(ui.value );
                }
            });
            $( "#slider_"+itemId+"_value", this.el ).val($( "#slider_"+itemId, this.el ).slider( "value" ));
        },

        lookOpt: function(event){
            var obj = event.currentTarget;
            var btnOpt = $(obj).attr('data-type');
            var status = $('div[data-type = "'+btnOpt+'"]', this.el).css('display');
            status = (status == 'block')?'none':'block';
            $('div[data-type = "'+btnOpt+'"]', this.el).css('display', status);
        }
    });

    var ExamItemList = Backbone.Collection.extend({model: ExamItemModel});

    var ExamPageView = Backbone.View.extend({
        className: 'examPage',
        attributes : {

        },

        events: {
            'click .preExamPage': 'getExamPage',
            'click .nextExamPage': 'getExamPage',
            'click .lookMyExamResult': 'lookMyExamResult'
        },

        initialize : function(){
            _.bindAll(this, 'render', 'getPageItem', 'getExamPage', 'toExamPage');
            this.template = _.template(Question_Page);
            this.collection = new ExamItemList();
        },

        render : function(){
            $(this.el).append(this.template(this.model.toJSON()));
            this.getPageItem();
            return this;
        },

        getPageItem : function(){
            var pageId = this.model.get('pageId'), examType = this.model.get('examType'), examId = this.model.get('examId');
            var me = this;
            this.collection.reset();
            $.post('/exam/getExamItems', {pageId : pageId, examType: examType, examId:examId}, function(results){
                if(results && results.length > 0){
                    _.each(results, function(item){
                        var examItemModel = new ExamItemModel(item);
                        examItemModel.set({examType: examType});//应对check/submitted的场景
                        me.collection.add(examItemModel);

                        var examItemView = new ExamItemView({model: examItemModel});
                        var render = examItemView.render();
                        if(render) {
                            $('.examItemsArea', me.el).append(render.el);
                        }
                    });
                }
            });
        },

        getExamPage : function(event){
            var obj = event.currentTarget;
            var action = $(obj).attr('value'), toPage= this.model.get('pagePosition');
            if(action == 'pre'){
                toPage = toPage - 1;
            }else if(action == 'next'){
                toPage = toPage + 1;
            }else{

            }

            this.toExamPage(toPage, action);
        },

        toExamPage : function(toPage, action){
            var examType = this.model.get('examType')
                , pageCount = this.model.get('pageCount'), examId = this.model.get('examId');
            if(examType == 'test' && action != 'pre'){//考试，且向后翻页时，记录当页作答
                var answers = this.checkAndGetAnswer();
                if(answers && answers.itemAnswers.length>0){
                    var me = this;
                    $.post('/exam/updateMyExamAnswer', {examId: examId, answers: JSON.stringify({myAnswer: answers})}, function (result) {//保存当页测试结果
                        if (result && result.success) {
                            me.updateExamPage(toPage, action, examType, pageCount);
                        }
                    });
                }
            }else {//预览试卷，查看试卷，或向前翻页，不记录作答 //examType == 'preShow' || examType == 'check' || examType == 'submitted'|| action == 'pre'
                this.updateExamPage(toPage, action, examType, pageCount);
            }
        },

        updateExamPage : function(toPage, action, examType, pageCount){
            var me = this;
            if(action == 'over'){//提交试卷
                if(confirm('确定提交试卷吗？')) {
                    var examId = this.model.get('examId');
                    $.post('/exam/submitMyExam', {examId: examId}, function(result){
                        if(result && result.success){
                            me.el.innerHTML = '<div align="center" style="margin-top:25%;">作答结束，试卷已提交，谢谢！'+
                                                '<!--<button type="button" class="btn btn-info lookMyExamResult" data-type="1">查看结果</span></button>-->' +
                                                '<!--<button type="button" class="btn btn-info lookMyExamResult" data-type="2">查看详细结果</span></button>-->' +
                                                '<button type="button" class="btn btn-info lookMyExamResult" data-type="3">查看我的考卷</span></button>' +
                                            '</div>';
                            $("#linkId", window.parent.document).val(examId);
                        }else{
                            alert('抱歉，提交失败！');
                        }
                    });
                }
            }else {//试卷翻页
                $.get('/exam/getExamPage', {examId: me.model.get('examId'), pagePosition: toPage}, function (data) {
                    if (data && data.length > 0) {
                        me.model.set(data[0]);
                        me.model.set({examType: examType, pageCount: pageCount});
                        me.el.innerHTML = '';

                        $('.examArea').append(me.render().el);
                    }
                });
            }
        },

        checkAndGetAnswer : function(){
            var currItems = this.collection, currItem = {}, currItemType = '', itemAnswers=[];
            for(var i=0; i<currItems.models.length;i++){
                currItem = currItems.models[i].toJSON();
                currItemType = currItem.itemType;

                var currAnswer = {itemId: currItem.itemId, itemType: currItemType, myAnswer : []};
                var itemObj = $('div[data-examItem-id='+currItem.itemId+']');
                if(currItemType == 'MULTIPLE_CHOICE' || currItemType == 'MULTIPLE_RESPONSE' || currItemType == 'YES_NO'|| currItemType == 'TRUE_FALSE'){
                    var selector = 'input[name="selectionItem_'+currItem.itemId+'"]';
                    var answerItem = {choiceItemId:1, rightChoiceIds:[], score:0, myScore:0, isRight: false};
                    $(selector, itemObj).each(function(index){
                        if($(this)[0].checked) {
                            //currAnswer.myAnswer.push(index + 1);
                            answerItem.rightChoiceIds.push(index+1);
                        }
                    });

                    var myChoice = answerItem.rightChoiceIds.sort().toString();
                    var stdChoice = currItem.rightAnswer[0].rightChoiceIds.sort().toString();
                    if(myChoice == stdChoice){
                        answerItem.myScore = currItem.rightAnswer[0].score;
                        answerItem.isRight = true;
                    }

                    answerItem.score = currItem.rightAnswer[0].score;
                    currAnswer.myAnswer.push(answerItem);
                    /*
                    if(currAnswer.answer.length == 0){
                        alert('您有未答的题目！');
                        return false;
                    }*/
                }else if(currItemType == 'LIKERT'){
                    var choices = currItem.choiceCollection;
                    for(var j=0;j<choices.length;j++){
                        var selector = 'input[name="myLikert_'+currItem.itemId+'_'+choices[j].choiceId+'"]';
                        $(selector, itemObj).each(function(index){
                            if($(this)[0].checked) {
                                currAnswer.myAnswer.push({
                                    choiceId: choices[j].choiceId,
                                    value: index+1
                                });
                            }
                        });
                    }
                    /*
                    if(currAnswer.answer.length == 0){
                        alert('您有未答的题目！');
                        return false;
                    }*/

                }else if(currItemType == 'SLIDER'){
                    var sliderValue = $('#slider_'+currItem.itemId+'_value', itemObj).val();
                    currAnswer.myAnswer.push(Number(sliderValue));
                }else if(currItemType == 'FILL_IN_BLANK'){
                    $('.mySelectionContents', itemObj).each(function(index){
                        var currInput = $(this).val();
                        var answerItem = {blankId:index+1, blankValue:[], score:0, myScore:0, isRight: false};
                        if(currInput && currInput.trim() != ''){
                            answerItem.blankValue.push(currInput.trim());
                            //currAnswer.myAnswer.push({blankId: index+1, value: currInput.trim()});
                        }

                        var myBlank = answerItem.blankValue.sort().toString();
                        var stdBlank = currItem.blankCollection[index].blankValue.sort().toString();
                        if(myBlank.toLowerCase() == stdBlank.toLowerCase()){
                            answerItem.myScore = currItem.blankCollection[index].score;
                            answerItem.isRight = true;
                        }

                        answerItem.score = currItem.blankCollection[index].score;
                        currAnswer.myAnswer.push(answerItem);
                    });
                    /*
                    if(currAnswer.answer.length == 0){
                        alert('您有未答的题目！');
                        return false;
                    }*/

                }else if(currItemType == 'INLINE_CHOICE'){
                    var inlineChoices = currItem.choiceCollection, rightAnswer = currItem.rightAnswer;
                    for(var j=0;j<inlineChoices.length;j++){
                        var selector = 'input[name="selectionItem_'+currItem.itemId+'_'+inlineChoices[j].inlineChoiceId+'"]';
                        var answerItem = {inlineChoiceId: inlineChoices[j].inlineChoiceId, rightChoiceIds:[], score:0, myScore:0, isRight: false};
                        $(selector, itemObj).each(function(index){
                            if($(this)[0].checked) {
                                answerItem.rightChoiceIds.push(index + 1);
                            }
                        });

                        var myChoice = answerItem.rightChoiceIds.sort().toString();
                        var stdChoice = rightAnswer[j].rightChoiceIds.sort().toString();
                        if(myChoice == stdChoice){
                            answerItem.myScore = rightAnswer[j].score;
                            answerItem.isRight = true;
                        }

                        answerItem.score = rightAnswer[j].score;
                        currAnswer.myAnswer.push(answerItem);
                    }
                    /*
                    if(currAnswer.answer.length == 0){
                        alert('您有未答的题目！');
                        return false;
                    }*/
                }else if(currItemType == 'OPEN_QUESTION'){
                    var currInput = $('.questionDes', itemObj).val();
                    if(currInput && currInput.trim() != ''){
                        currAnswer.myAnswer.push(currInput);
                    }/*
                    else{
                        alert('您有未答的题目！');
                        $('.questionDes', itemObj).focus();
                        return false;
                    }*/
                }else {
                    alert('错误，无题型：'+currItemType.trim()+'!');
                }

                itemAnswers.push(currAnswer);
            }

            var pageAnswer = {
                pageId: this.model.get('pageId'),
                itemAnswers : itemAnswers
            };

            return pageAnswer;
        },

        lookMyExamResult: function(event){
            var obj = event.currentTarget;
            var type = $(obj).attr('data-type');
            var examId = this.model.get('examId'), me = this;
            if(type == '1'){
                $.post('/exam/getMyExamReport', {examId: examId, isDetailed: 0}, function (result) {
                    var rate = Math.round((result.sumMyScore/result.sumScore)*100*100)/100 + '%';
                    me.el.innerHTML = '<div style="margin-top:10%;" align="center">总分：'+result.sumScore+' <br />得分：'+result.sumMyScore+'<br />'+
                                        '正确率：'+rate+'</div>';
                });
            }else if(type == '2') {
                $.post('/exam/getMyExamReport', {examId: examId, isDetailed: 1}, function (result) {
                    var examReportModel = new ExamReportModel(result);
                    var examReportView = new ExamReportView({model: examReportModel});

                    me.el.innerHTML = '';
                    $(me.el).append(examReportView.render().el);
                });
            }else{
                window.location.href = '/exam/enterExam?examId='+examId+'&examType=check';
            }
        }
    });

    var ExamAppView = Backbone.View.extend({
        el : '.container',
        events: {
            'click .lookDetailedReport' : 'lookDetailedReport',
            'click #useNewestExam' : 'useNewestExam'
        },

        initialize : function(){
            _.bindAll(this, 'render');
            this.Html =  '<div id="alertMsg"></div>'+
                         '<div style="width:100%;">'+
                                '<div>'+
                                    '<font size="5">'+
                                        '<span class="glyphicon glyphicon-hand-right"></span>&nbsp;'+
                                        '<span id="examName" data-exam-id="<%=examId%>"><%=examName%></span>'+
                                    '</font>'+
                                '</div>'+
                                '<div class="row" style="margin-top:10px;">'+
                                    '<%if(examType == "check"){%>'+
                                        '<label class="col-md-1"></label>'+
                                        '<label class="col-md-2">测试者: <font color="red"><%=username%></font></label>'+
                                        '<label class="col-md-2">总分：<font color="red"><%=sumScore%></font></label>'+
                                        '<label class="col-md-2">得分：<font color="red"><%=sumMyScore%></font></label>'+
                                        '<label class="col-md-2">正确率：<font color="red"><%=Math.round((sumMyScore/sumScore)*100*100)/100%>%</font></label>'+
                                        '<div class="col-md-2" >'+
                                            '<button type="button" class="btn btn-info btn-xs lookDetailedReport" data-toggle="modal" data-target="#myDetailedReport">查看详细报告</button>'+
                                        '</div>'+
                                    '<%}%>'+
                                '</div>'+
                                '<hr />'+
                                '<div class="modal fade" id="myDetailedReport" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                                    '<div class="modal-dialog">'+
                                        '<div class="modal-content">'+
                                            '<div class="modal-body">'+
                                                '<button type="button" class="close"data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                            '</div>'+
                                            '<div class="modal-footer">'+
                                                '<button type="button" class="btn btn-info" data-dismiss="modal">关闭</button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                         '</div>'+
                         '<div class="row">'+
                            '<div class="col-md-1"></div>'+
                            '<div class="col-md-10 examArea"></div>'+
                            '<div class="col-md-1"></div>'+
                         '</div>';
            this.template = _.template(this.Html);
            this.render();
        },

        render : function(){
            //处理可能的请求，即此页面可能由其他页面请求而来
            var urlParams = window.location.search;
            if(urlParams.indexOf('?') != -1) {
                var param = urlParams.substr(1);
                var paramArr = param.split('&');
                var param_examId = (paramArr[0]).split('=');
                var param_examType = (paramArr[1]).split('=');
                var status = param_examType[1];

                if(!param_examId[1]){
                    $('#alertMsg', this.el).append('<p><font color="red">*得不到该试卷id，无法获取试卷！</font></p>');
                    return false;
                }
                var me = this;
                $.get('/exam/getExam', {examId : param_examId[1]}, function(data){//获取试卷基本信息
                    if(data && data.length > 0) {
                        $.post('/exam/getExamPageCount', {examId : param_examId[1]}, function(count){//获取试卷页数
                            if(count && Number(count)>0) {
                                var exam = data[0];
                                me.model = new ExamModel(exam);
                                $.post('/exam/MyExamIsSubmit', {examId: param_examId[1]}, function(result) {
                                    if(status == 'test'){
                                        if(result) {
                                            $(me.el).append('<p><font color="red">*本试卷已经被您提交过了，不能再作答了。</font></p>');
                                            status = 'submitted';
                                        }
                                    }
                                    me.model.set({examType: status});
                                    if(status == 'check'){//查看考卷场景，获取试卷批改结果
                                        var checkQuery = {examId: param_examId[1], isDetailed: 0};
                                        if(paramArr.length == 3){
                                            var param_userId = (paramArr[2]).split('=');
                                            checkQuery.userId = param_userId[1];//check指定考生的试卷
                                            me.checkUserId = param_userId[1];
                                        }
                                        $.post('/exam/getMyExamReport', checkQuery, function (result) {
                                            me.model.set(result);
                                            $(me.el).append(me.template(me.model.toJSON()));
                                        });
                                    }else {
                                        $(me.el).append(me.template(me.model.toJSON()));
                                    }
                                    var examPageModel = new ExamPageModel({
                                        pagePosition: 1,
                                        examId: param_examId[1],
                                        examName: exam.examName
                                    });
                                    me.examPageView = new ExamPageView({model: examPageModel});
                                    me.examPageView.updateExamPage(1, '', status, Number(count));

                                    if(status == "test"){//检查最新版本
                                        $.get('/exam/getExam', {examId : exam.copyFrom}, function(copyFrom){
                                            if(copyFrom && copyFrom.length > 0){//不是最新版本，给予提示
                                                if(copyFrom[0].exam_version > exam.exam_version) {
                                                    $('#alertMsg', me.el).append(
                                                        '<div class="alert alert-info alert-dismissable">' +
                                                            '<button type="button" class="close" data-dismiss="alert"aria-hidden="true">&times;</button>' +
                                                            '<span>发现该试卷有新版本，<a href="javascript:void(0);" id="useNewestExam">立即使用新版本试卷作答~</a></span>' +
                                                        '</div>'
                                                    );
                                                }
                                            }else{//检查试卷最新版本失败
                                                $('#alertMsg', me.el).append(
                                                    '<div class="alert alert-warning alert-dismissable">'+
                                                        '<button type="button" class="close" data-dismiss="alert"aria-hidden="true">&times;</button>'+
                                                        '检查试卷最新版本失败!'+
                                                    '</div>'
                                                );
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        $(this.el).append('<p><font color="red">*获取不到试卷！</font></p>');
                    }
                });
            }
        },

        lookDetailedReport : function(){
            var me = this;
            var examId = me.model.get('examId');
            $('.modal-body', me.el).find('div').remove();
            $.post('/exam/getMyExamReport', {examId: examId, userId: me.checkUserId?me.checkUserId:'', isDetailed: 1}, function (result) {
                var examReportModel = new ExamReportModel(result);
                var examReportView = new ExamReportView({model: examReportModel});

                $('.modal-body', me.el).append(examReportView.render().el);
            });
        },

        useNewestExam : function(){
            if(confirm('您将放弃使用当前版本的试卷，使用最新版本的试卷作答，确定吗？')){
                window.location.href = '/exam/enterExam?examId='+this.model.get('copyFrom')+'&examType=test&versionType=newest';
            }
        }
    });

    var examAppView = new ExamAppView();
})(jQuery)