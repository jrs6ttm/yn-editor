/**
 * Created by Administrator on 2015/11/26.
 */
var ExamModel = Backbone.Model.extend({
    defaults : {
        examId : '',
        examName : '',
        examType : '',
        username : '',
        isFinish : false,//
        exam_version : 1.0,
        isUsed : false,//是否被使用
        copyTime : '',//创建考试副本的时间
        copyFrom : '',//试卷id，代表是谁的副本
        createTime : '',
        lastModify : '',

        //统计字段
        numbers : 0,//统计人数
        statisticDate: null,
        startSDate : null,//统计时间范围
        endSDate : null
    }
});

var ExamPageModel = Backbone.Model.extend({
    defaults : {
        pageId : '',
        pageName : '',
        pagePosition: 1,
        examId : ''
    }
});

var ExamItemModel = Backbone.Model.extend({
    defaults : {
        itemId :  "",
        itemName: "",
        itemPosition : 1,
        pageId : '',
        itemType: "",
        itemDescription: "",
        likertLevel: 3,
        rightAnswer:[],
        choiceCollection:[],
        blankCollection:[],
        statisticData:{},
        statisticDate: null
    }
});
