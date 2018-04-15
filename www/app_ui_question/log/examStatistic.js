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
                                        '<input type="checkbox" <%if(choiceItem.isAnswer){%>checked="checked" title="正确选项"<%}%> disabled="disabled" name="selectionItem_<%=itemId%>" />'+
                                    '<%}else{%>'+
                                        '<input type="radio" <%if(choiceItem.isChecked){%>checked="checked" title="正确选项"<%}%> disabled="disabled" name="selectionItem_<%=itemId%>" />'+
                                    '<%}%>'+
                                '</div>'+
                                '<label class="col-sm-1" style="margin-left:-3%;"><%=choiceItem.choiceCode%></label>'+
                                '<div class="col-sm-9" >'+
                                    '<p style="margin-left:-6%;"><%=choiceItem.choiceDescription%></p>'+
                                '</div>'+
                            '</div>'+
                        '<%});%>'+
                        '<!--<div class="row" style="margin-bottom:5px;">'+
                            '<div class="col-sm-4"></div>'+
                            '<div class="col-sm-2">'+
                                '<button type="button" class="btn btn-info btn-xs lookAnalysis" data-type = "analysis_<%=rightAnswer[0].choiceItemId%>">查看解析</button>'+
                           '</div>'+
                            '<div class="col-sm-2" style="margin-left:-5%;">'+
                                '<button type="button" class="btn btn-info btn-xs lookStatistic" data-type = "statistic_<%=rightAnswer[0].choiceItemId%>">查看统计</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row" style="display:none" data-type = "analysis_<%=rightAnswer[0].choiceItemId%>">'+
                            '<label class="col-sm-2">解析：</label>'+
                            '<label class="col-sm-9" style="margin-left:-10%;">'+
                                '<p><strong ><%=rightAnswer[0].feedback%></strong><p>'+
                            '</label>'+
                        '</div>'+
                        '<hr />-->'+
                        '<div style="overflow-x:auto;"><div id="<%=itemId%>"  class="row" style="min-width:850px;height: 400px; margin: 0 auto"></div></div>'+
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
        '<%for(var i=1;i<=likertLevel;i++){%>'+
            '<div style="overflow-x:auto;"><div id="<%=itemId%>_<%=i%>" class="row" style="min-width:850px; height: 400px; margin: 0 auto"></div></div>'+
        '<%}%>'+

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
                    '<div style="overflow-x:auto;"><div id="<%=itemId%>" class="row" style="min-width:850px; height: 400px; margin: 0 auto"></div></div>'+
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
                            '<input type="text" class="form-control mySelectionContents" style="margin-left: -5%;background-color:#FFFFFF;" disabled="disabled" title="参考答案" value="<%=blankItem.blankValue[0]%>" />'+
                        '</div>'+
                    '</div>'+
                    '<div style="overflow-x:auto;"><div id="<%=itemId%>_<%=blankItem.blankId%>" class="row" style="min-width:850px; height: 400px; margin: 0 auto"></div></div>'+

                    '<!--<div class="well well-sm" style="background-color:#ECF5FF;width:77%;margin-left:2%;margin-right:2%;">'+
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
                    '</div>-->'+

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
                                        '<input type="radio" <%if(choiceItem.isAnswer){%>checked="checked" title="正确选项"<%}%> disabled="disabled" name="selectionItem_<%=itemId%>_<%=inlineChoiceItem.inlineChoiceId%>" />'+
                                    '</div>'+
                                    '<label class="col-sm-1" style="margin-left:-3%;"><%=choiceItem.choiceCode%></label>'+
                                    '<div class="col-sm-9">'+
                                        '<p style="margin-left:-6%;"><%=choiceItem.choiceDescription%></p>'+
                                    '</div>'+
                                '</div>'+
                            '<%});%>'+
                        '</div>'+
                    '</div>'+
                    '<div style="overflow-x:auto;"><div id="<%=itemId%>_<%=inlineChoiceItem.inlineChoiceId%>" class="row" style="min-width:850px; height: 400px; margin: 0 auto"></div></div>'+
                    '<!--'+
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
                    '-->'+
                '<%});%>'+
            '</div>'+
        '</div>';

    var examReport =    '<div align="center" style="margin-top:5%;">'+
                            '<div style="overflow-x:auto;"><div id="<%=itemId%>_<%=inlineChoiceItem.inlineChoiceId%>" class="row" style="min-width:850px; height: 400px; margin: 0 auto"></div></div>'+
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
            'click .lookStatistic' : 'lookOpt',
            'click .lookAnalysis' : 'lookOpt'
        },
        initialize : function(){
            _.bindAll(this, 'render', 'addSlider', 'lookOpt');
        },

        render : function(){
            var examType = this.model.get('itemType'), alt = ['A','B','C','D','F','G','H','I','J','K'], itemId = this.model.get('itemId');
            
            if(examType == 'MULTIPLE_CHOICE' || examType == 'MULTIPLE_RESPONSE' || examType == 'YES_NO'|| examType == 'TRUE_FALSE'){
                this.template = _.template(Choice_Question_QItem);
                this.model.set({alt: alt});
                $(this.el).append(this.template(this.model.toJSON()));

                var choiceLength = this.model.get('choiceCollection').length,
                    statisticData_multi = this.model.get('statisticData'),
                    sDate_multi = new Date(this.model.get('statisticDate')).toLocaleString();
                var sData_multi = [["未选",statisticData_multi['none']?statisticData_multi['none']:0]];
                for(var i=0; i<choiceLength;i++){
                    var letter_multi = alt[i];
                    sData_multi.push([letter_multi,statisticData_multi[letter_multi]?statisticData_multi[letter_multi]:0]);
                }
                this.statistic(itemId, sDate_multi, sData_multi);

                return this;
            }else if(examType == 'LIKERT'){
                this.template = _.template(Likert_QItem);
                $(this.el).append(this.template(this.model.toJSON()));

                var likertCollection = this.model.get('choiceCollection'), sData_likert = [], likertLevel = this.model.get('likertLevel');
                for(var i=0; i<likertCollection.length;i++){
                    var statisticData_likert = likertCollection[i].statisticData,
                        sDate_likert = new Date(likertCollection[i].statisticDate).toLocaleString();

                    if(statisticData_blank){
                        for(var j = 1; j<= likertLevel; j++) {
                            sData_likert.push([likertLevel, statisticData_likert[likertLevel] ? statisticData_likert[likertLevel] : 0]);
                        }
                    }else{
                        sData_likert.push(['未选',0]);
                    }
                    this.statistic(itemId+'_'+likertCollection[i].choiceId, sDate_likert, sData_likert, likertCollection[i].choiceId);
                }

                return this;
            }else if(examType == 'SLIDER'){
                this.template = _.template(Slider_QItem);
                $(this.el).append(this.template(this.model.toJSON()));
                this.addSlider();

                var statisticData_slider = this.model.get('statisticData'),
                    sDate_slider = new Date(this.model.get('statisticDate')).toLocaleString();
                var sData_slider = [];
                sData_slider.push(['le60',statisticData_slider['le60']?statisticData_slider['le60']:0]);
                sData_slider.push(['60~70',statisticData_slider['60~70']?statisticData_slider['60~70']:0]);
                sData_slider.push(['70~80',statisticData_slider['70~80']?statisticData_slider['70~80']:0]);
                sData_slider.push(['80~90',statisticData_slider['80~90']?statisticData_slider['80~90']:0]);
                sData_slider.push(['90~100',statisticData_slider['90~100']?statisticData_slider['90~100']:0]);

                this.statistic(itemId, sDate_slider, sData_slider);

                return this;
            }else if(examType == 'FILL_IN_BLANK'){
                this.template = _.template(Fill_IN_Blank_QItem);
                $(this.el).append(this.template(this.model.toJSON()));

                var blankCollection = this.model.get('blankCollection'), sData_blank = [];
                for(var i=0; i<blankCollection.length;i++){
                    var statisticData_blank = blankCollection[i].statisticData,
                        sDate_blank = new Date(blankCollection[i].statisticDate).toLocaleString();

                    if(statisticData_blank){
                        sData_blank.push(['正确',statisticData_blank['right']?statisticData_blank['right']:0]);
                        sData_blank.push(['错误',statisticData_blank['wrong']?statisticData_blank['wrong']:0]);
                    }else{
                        sData_blank.push(['正确',0]);
                        sData_blank.push(['错误',0]);
                    }
                    this.statistic(itemId+'_'+blankCollection[i].blankId, sDate_blank, sData_blank);
                }

                return this;
            }else if(examType == 'INLINE_CHOICE'){
                this.template = _.template(Inline_Choice_QItem);
                this.model.set({alt: alt});
                $(this.el).append(this.template(this.model.toJSON()));

                var inlineChoiceCollection = this.model.get('choiceCollection'), sData_inline = [];

                for(var i=0; i<inlineChoiceCollection.length;i++){
                    var inlineChoiceLength = inlineChoiceCollection[i].inlineChoice.length,
                        statisticData_inline = inlineChoiceCollection[i].statisticData,
                        sDate_inline = new Date(inlineChoiceCollection[i].statisticDate).toLocaleString(),
                        sData = [];
                    if(statisticData_inline) {
                        sData.push(['未选', statisticData_inline['none'] ? statisticData_inline['none'] : 0]);
                    }else{
                        sData.push(['未选', 0]);
                    }

                    for(var j=0; j<inlineChoiceLength;j++){
                        var letter_inline = alt[j];
                        if(statisticData_inline) {
                            sData.push([letter_inline, statisticData_inline[letter_inline] ? statisticData_inline[letter_inline] : 0]);
                        }else{
                            sData.push([letter_inline, 0]);
                        }
                    }

                    this.statistic(itemId+'_'+inlineChoiceCollection[i].inlineChoiceId, sDate_inline, sData_inline);
                }

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
            /*
            if(btnOpt.indexOf('statistic') == 0 && status == 'block' && $('div[data-type = "'+btnOpt+'"]', this.el).html() == ''){
                this.statistic();
            }
            */
        },

        statistic : function(targetId, sDate, sData, orderId){
            var me = this, titleStr = '';
            if(orderId){
                titleStr = '第'+orderId+'个:'
            }
            $('#'+targetId, me.el).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: titleStr+'每个选项做答人数统计'
                },
                subtitle: {
                    text: '统计数据截止于'+sDate
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '人数 (人)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '共有: <b>{point.y} 人</b>'
                },
                series: [{
                    name: 'Population',
                    data: sData,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y}',
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        }
    });

    var ExamItemList = Backbone.Collection.extend({model: ExamItemModel});

    var ExamPageView = Backbone.View.extend({
        className: 'examPage',
        attributes : {

        },

        events: {
            'click .preExamPage': 'getExamPage',
            'click .nextExamPage': 'getExamPage'
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
             this.updateExamPage(toPage, action, examType, pageCount);
        },

        updateExamPage : function(toPage, action, examType, pageCount){
            var me = this;
            $.get('/exam/getExamPage', {examId: me.model.get('examId'), pagePosition: toPage}, function (data) {
                if (data && data.length > 0) {
                    me.model.set(data[0]);
                    me.model.set({examType: examType, pageCount: pageCount});
                    me.el.innerHTML = '';

                    $('.examArea').append(me.render().el);
                }
            });
        }
    });

    var ExamAppView = Backbone.View.extend({
        el : '.container',
        events: {
            'click .lookDetailedReport' : 'lookDetailedReport'
        },

        initialize : function(){
            _.bindAll(this, 'render');
            this.Html =  '<div id="alertMsg"></div>'+
                         '<div style="width:100%;">'+
                                '<div>'+
                                    '<font size="5">'+
                                        '<span class="glyphicon glyphicon-hand-right"></span>&nbsp;'+
                                        '<span id="examName" data-exam-id="<%=examId%>"><%=examName%>_V<%=exam_version%> · 统计分析</span>'+
                                    '</font>'+
                                '</div>'+
                                '<div class="row" style="margin-top:10px;">'+
                                        '<label class="col-md-2"></label>'+
                                        '<label class="col-md-2">测试人数(已提交): <font color="red"><%=numbers%></font>人</label>'+
                                        '<label class="col-md-4">统计时间：<font color="red"><%=new Date(statisticDate).toLocaleString()%></font></label>'+
                                        '<!--<label class="col-md-4">统计时间范围：<font color="red"><%=new Date(startSDate).toLocaleString()%></font>~<font color="red"><%=new Date(endSDate).toLocaleString()%></font></label>-->'+
                                    '<%if(examType == "statistic"){%>'+
                                        '<div class="col-md-2" >'+
                                            '<button type="button" class="btn btn-info btn-xs lookDetailedReport" data-toggle="modal" data-target="#myDetailedReport">查看试卷统计</button>'+
                                        '</div>'+
                                    '<%}%>'+
                                '</div>'+
                                '<hr />'+
                                '<div class="modal fade" id="myDetailedReport" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                                    '<div class="modal-dialog">'+
                                        '<div class="modal-content">'+
                                            '<div class="modal-header">'+
                                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                            '<h4 class="modal-title" id="myModalLabel"><%=examName%></h4>'+
                                            '</div>'+
                                            '<div class="modal-body"></div>'+
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
                var status = param_examType[1];//exam||research

                if(!param_examId[1]){
                    $('#alertMsg', this.el).append('<p><font color="red">*得不到该试卷id，无法获取试卷！</font></p>');
                    return false;
                }
                var me = this;
                $.get('/exam/getExam', {examId : param_examId[1], type: status}, function(data){//获取试卷基本信息
                    if(data && data.length > 0) {
                        $.post('/exam/getExamPageCount', {examId : param_examId[1]}, function(count){//获取试卷页数
                            if(count && Number(count)>0) {
                                var exam = data[0];
                                exam.examType = status;
                                me.model = new ExamModel(exam);

                               $(me.el).append(me.template(me.model.toJSON()));

                                var examPageModel = new ExamPageModel({
                                    pagePosition: 1,
                                    examId: param_examId[1],
                                    examName: exam.examName
                                });
                                me.examPageView = new ExamPageView({model: examPageModel});
                                me.examPageView.updateExamPage(1, '', status, Number(count));
                            }
                        });
                    }else{
                        $(this.el).append('<p><font color="red">*获取不到试卷！</font></p>');
                    }
                });
            }
        },

        lookDetailedReport : function(){
            var me = this, examId = me.model.get('examId');
            $('.modal-body', me.el).find('div').remove();
            $.post('/exam/getExamStatistic', {examId: examId, isDetailed: 1}, function (result) {
                //var examReportModel = new ExamReportModel(result);
                //var examReportView = new ExamReportView({model: examReportModel});

                $('.modal-body', me.el).append('<div style="overflow-x:auto;"><div id="'+examId+'"  class="row" style="min-width:850px;height: 600px; margin: 0 auto"></div></div>');
                var sDate = result.statisticDate, statisticData = result.statisticData, sData = [];
                sData.push(['小于60%',statisticData['le60']?statisticData['le60']:0]);
                sData.push(['60%~70%',statisticData['60~70']?statisticData['60~70']:0]);
                sData.push(['70%~80%',statisticData['70~80']?statisticData['70~80']:0]);
                sData.push(['80%~90%',statisticData['80~90']?statisticData['80~90']:0]);
                sData.push(['90%~100%',statisticData['90~100']?statisticData['90~100']:0]);
                me.statistic(examId, sDate, sData);
            });
        },

        statistic : function(targetId, sDate, sData){
            var me = this;

            $('#'+targetId, me.el).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: '测试结果正确率分布情况统计'
                },
                subtitle: {
                    text: '统计数据截止于'+new Date(sDate).toLocaleString()
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '人数 (人)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '共有: <b>{point.y} 人</b>'
                },
                series: [{
                    name: 'Population',
                    data: sData,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y}',
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        }
    });

    var examAppView = new ExamAppView();
})(jQuery)