/**
 * Created by Administrator on 2015/11/19.
 */
var Slider_QPanel =
    '<div class="panel panel-default">'+
        '<div class="panel-heading" align="center">'+
            '<h2 class="panel-title">编辑<%=itemType%></h2>'+
        '</div>'+
        '<div class="panel-body">'+
                '<label for="name">编辑问题描述:</label>'+
                '<textarea  class="form-control questionDes" rows="3" placeholder="请输入问题描述"><%=itemDescription%></textarea>'+

                '<div style="margin-top:10px;margin-bottom: 10px;margin-left: 5px;">' +
                    '<div align="center">'+
                        '<label for="amount">当前值(百分比)：</label>'+
                        '<input type="text"  id="amount" style="border:0; color:#f6931f; font-weight:bold;" />'+
                    '</div>'+
                    '<div id="slider-range-min" style="cursor: pointer;margin-top:10px;margin-bottom: 10px;margin-left: 5px;"></div>'+
                '</div>'+
        '</div>'+
        '<div class="panel-footer" align="right">'+
            '<button type="button" class="btn btn-default btn-sm saveExamItem" style="margin-right: 5%;">确 定</button>'+
            '<button type="button" class="btn btn-default btn-sm cancel_addExamItem" style="margin-right: 5%;">取 消</button>'+
        '</div>'+
    '</div>';

var SliderPanelView = Backbone.View.extend({
    attributes: {

    },

    events: {
        'click .saveExamItem' : 'saveExamItem',
        'click .cancel_addExamItem' : 'cancel_addExamItem'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'addSlider', 'saveExamItem', 'cancel_addExamItem', 'getExamItem');
        this.template = _.template(Slider_QPanel);
    },

    render: function(){
        $(this.el).append(this.template(this.model.toJSON()));

        this.addSlider();

        return this;
    },

    addSlider: function(){
        var me = this;
        $("#slider-range-min", me.el).slider({
            range: "min",
            value: 20,
            min: 0,
            max: 100,
            slide: function( event, ui ) {
                $( "#amount", me.el ).val(ui.value );
            }
        });
        $( "#amount", this.el ).val($( "#slider-range-min", this.el ).slider( "value" ));
    },

    saveExamItem : function(){
        var item = this.getExamItem();
        if(item) {
            item.itemType =  this.model.get('itemType');
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
                            //var examItemView = new SliderItemView({model: examItemModel});
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
                            //var examItemView = new SliderItemView({model: examItemModel});
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
            itemType: "SLIDER",
            itemDescription: "",
            itemPosition: 1,
            weight:0,
            difficultyDegree:0,
            rightAnswer:[],
            myAnswer: 30
        };

        var tArea = $(".questionDes", this.el).val();
        if(!tArea || tArea.trim() == ""){
            $(".questionDes", this.el).focus();
            return false;
        }

        item.itemDescription = tArea;
        item.myAnswer = Number($( "#amount", this.el).val());

        return item;
    }
});

