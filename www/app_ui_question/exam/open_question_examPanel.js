/**
 * Created by Administrator on 2015/11/10.
 */
var OPEN_QUESTION_QPanel =
                        '<div class="panel panel-default">'+
                            '<div class="panel-heading" align="center">'+
                                '<h2 class="panel-title">编辑<%=itemType%></h2>'+
                            '</div>'+
                            '<div class="panel-body">'+
                                '<ul class="nav nav-tabs nav-justified" style="margin-bottom:25px;">'+
                                    '<li class="active myTabsLi" data-tab = "tab1"><a href="javascript:void(0);">题目基本设置</a></li>'+
                                    '<li class="myTabsLi" data-tab = "tab2"><a href="javascript:void(0);">分数设置</a></li>'+
                                '</ul>'+
                                '<div class="myTabsDiv tab1">'+
                                    '<label for="name">编辑问题描述:</label>'+
                                    '<textarea  class="form-control questionDes" rows="3" placeholder="请输入问题描述"><%=itemDescription%></textarea>'+
                                '</div>'+
                                '<div class="myTabsDiv tab2" style="display:none;margin-bottom:25px;">'+
                                    '<div class="row" style="margin-bottom:10px;">'+
                                        '<label  class="col-sm-3" align="center">正确得分：</label>'+
                                        '<div class="col-sm-3" style="margin-left:-5%;">'+
                                            '<input type="number"  class="form-control" id="tab2_score" placeholder="请输入分数" value="10"/>'+
                                        '</div>'+
                                        '<label  class="col-sm-3" align="center">错误扣分：</label>'+
                                        '<div class="col-sm-3" style="margin-left:-5%;">'+
                                            '<input type="number"  class="form-control" id="tab2_deduct" placeholder="请输入分数" value="0"/>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row">'+
                                        '<label  class="col-sm-3" align="center">题目权重：</label>'+
                                        '<div class="col-sm-3" style="margin-left:-5%;">'+
                                            '<input type="number"  class="form-control" id="tab2_weight" placeholder="请输入得分权重" value="0.1"/>'+
                                        '</div>'+
                                        '<label  class="col-sm-3" align="center">难度系数：</label>'+
                                        '<div class="col-sm-3" style="margin-left:-5%;">'+
                                            '<input type="number"  class="form-control" id="tab2_difficulty_degree" placeholder="请输入难度系数" value="0.1"/>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="panel-footer" align="right">'+
                                '<button type="button" class="btn btn-default btn-sm saveExamItem" style="margin-right: 5%;">确 定</button>'+
                                '<button type="button" class="btn btn-default btn-sm cancel_addExamItem" style="margin-right: 5%;">取 消</button>'+
                            '</div>'+
                        '</div>';

var OpenQuestionPanelView = Backbone.View.extend({
    attributes: {

    },

    events: {
        'click .myTabsLi': 'switchTab',
        'click .saveExamItem' : 'saveExamItem',
        'click .cancel_addExamItem' : 'cancel_addExamItem'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'saveExamItem', 'cancel_addExamItem', 'getExamItem');
        this.template = _.template(OPEN_QUESTION_QPanel);
    },

    render: function(){
        $(this.el).append(this.template(this.model.toJSON()));

        return this;
    },

    switchTab: function(event){
        var obj = event.currentTarget;
        this.switchTabOpt($(obj).attr('data-tab'));
    },

    switchTabOpt: function(data_tab){
        $('.myTabsLi', this.el).removeClass('active');
        $('.myTabsDiv', this.el).css('display', 'none');

        $('[data-tab="'+data_tab+'"]', this.el).addClass('active');
        $('.'+data_tab, this.el).css('display', 'block');
    },

    saveExamItem : function(){
        var item = this.getExamItem();
        if(item) {
            item.itemType = this.model.get('itemType');
            var pageId = this.model.get('pageId');
            if(pageId && pageId.trim() != '')//update item.不能用new item的方法取pageId, 因为这两种情况下Panel加载的位置不一样
                item.pageId = pageId;
            else
                item.pageId = $(this.el).parent().find('.sortable').eq(0).attr('data-page-id');//new item

            var me = this;
            var hasItemId = this.model.get('itemId');
            if(hasItemId && hasItemId.trim() != ''){//update
                item.itemId = hasItemId;
                item.itemPosition = this.model.get('itemPosition');
                $.post("/exam/updateExamItem", {item: JSON.stringify(item)},
                    function (result) {
                        if (result && result.success) {
                            var examItemModel = new ExamItemModel(item);
                            //var examItemView = new OpenQuestionItemView({model: examItemModel});
                            var examItemView = new ExamItemView({model: examItemModel});

                            var render = examItemView.render();
                            if(render != null) {
                                $('div[data-examItem-id="' + me.model.get('itemId') + '"]').parent().remove();//先删除旧的item,再重新添加新的item
                                $(me.el).before(render.el);
                                $(me.el).remove();
                                $('.sortable-' + pageId).sortable('enable');//启用本页拖拽功能
                            }
                        }
                    }
                );
            }else {//new
                item.itemPosition = ($('.examItem-'+item.pageId)).length + 1;
                $.post("/exam/saveExamItem", {item: JSON.stringify(item)},
                        function (result) {
                            if (result && result.success) {
                                var examItemModel = new ExamItemModel(item);
                                //var examItemView = new OpenQuestionItemView({model: examItemModel});
                                var examItemView = new ExamItemView({model: examItemModel});

                                var render = examItemView.render();
                                if(render != null) {
                                    $('div[data-page-id="' + item.pageId + '"]').append(render.el);
                                    me.model.set({itemPosition: item.itemPosition + 1});
                                    //$(me.el).children().remove();
                                    me.el.innerHTML = '';
                                    me.render();
                                    $('.sortable-' + pageId).sortable('enable');//启用本页拖拽功能
                                }
                            }
                        }
                );
            }

        }

    },

    cancel_addExamItem : function(){
        var itemId = this.model.get('itemId');
        var pageId = this.model.get('pageId');
        if(itemId) {//取消编辑已有item
            $('div[data-examItem-id="' + itemId + '"]').css('display', 'block');
        }else{//取消新编辑item
            $(".droppable-"+pageId).css('display', 'block');
        }

        $(this.el).remove();
        $('.sortable-'+pageId).sortable('enable');//启用本页拖拽功能
    },

    getExamItem : function(){
        var item = {
            itemId :  getDateStrUUID(),
            itemName: "question",
            itemType: "OPEN_QUESTION",
            itemDescription: "",
            itemPosition: 1,
            weight:0,
            difficultyDegree:0,
            rightAnswer:[],
            myAnswer: ''
        };

        var score = $('#tab2_score', this.el).val();
        if(!score || Number(score) <0 || Number(score) >100){
            alert('正确得分请输入0~100的数字！');
            this.switchTabOpt('tab2');
            $('#tab2_score', this.el).focus();
            return false;
        }

        var deduct = $('#tab2_deduct', this.el).val();
        if(!deduct || Number(score) <0 || Number(score) >100){
            alert('错误扣分请输入0~100的数字！');
            this.switchTabOpt('tab2');
            $('#tab2_deduct', this.el).focus();
            return false;
        }

        var weight = $('#tab2_weight', this.el).val();
        if(!weight || Number(weight) <0 || Number(weight) >1){
            alert('得分权重请输入0~1的数字！');
            this.switchTabOpt('tab2');
            $('#tab2_weight', this.el).focus();
            return false;
        }
        item.weight = Number(weight);

        var difficulty_degree = $('#tab2_difficulty_degree', this.el).val();
        if(!difficulty_degree || Number(difficulty_degree) <0 || Number(difficulty_degree) >1){
            alert('难度系数请输入0~1的数字！');
            this.switchTabOpt('tab2');
            $('#tab2_difficulty_degree', this.el).focus();
            return false;
        }
        item.difficultyDegree = Number(difficulty_degree);

        var tArea = $(".questionDes", this.el).val();
        if(!tArea || tArea.trim() == ""){
            this.switchTabOpt('tab1');
            $(".questionDes", this.el).focus();
            return false;
        }

        item.itemDescription = tArea;

        return item;
    }
});

