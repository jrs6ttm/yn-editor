var Material = Backbone.Model.extend({
    defaults : {
        gFileId: '',
        fileName: '',
        size: '',
        createTime: '',
        lastModify: '',
        isDeleted: '',
        publisherId: '',
        publisher: '',
        sourceF: '',
        transformF: '',
        videoImagePath : '',
        materialsId: '',
        toUser: '',
        description: '',
        fileType: '',
        isCreated: '',
        usageType: '',
        courses: [],
        readTimes : 0,
        downloadTimes : 0,
        praiseTimes : 0,
        keyword:[],
        difficulty:'',
        typicalAgeRange:'',
        language:'',
        status:'',
        learningResourceType:'',
        structure:'',

        userId : '',
        username : ''
    },

    initialize : function(){
        _.bindAll(this, 'updateTimes');
    },

    updateTimes : function(){
        var queryObj = _.clone(this.changed);
        console.log(queryObj);
        queryObj.materialsId = this.get('materialsId');

        $.post('/LR/updateLR', {updateObj: JSON.stringify(queryObj)}, function(data){
            console.log(data);
        });
    }

});

var QueryModel = Backbone.Model.extend({
    defaults:{
        fileName: '',
        toUser: '0',
        sortType: 'createTime',
        difficulty:'',
        typicalAgeRange:'',
        language:'',
        status:'',
        learningResourceType:'',
        structure:'',

        recordsSize: 10,
        totalPage: 0,
        totalRecords: 0,
        currentPage: 1,
        pageSize: 10,
        startPage:1,
        endPage: 10
    }
});
var Query = new QueryModel();

var Comment = Backbone.Model.extend({
    defaults : {
        _id : '',
        id : '',
        reply_to_id : '',
        publishDate : '',
        publisher : '',
        comment : '',
        childComments : 0
    }
});

var MaterialList = Backbone.Collection.extend({
    model: Material,
    initialize : function(){
        _.bindAll(this, 'postForm');
        //处理可能的请求，即此页面可能由其他页面请求而来
        var urlParams = window.location.search;
        if(urlParams.indexOf('?') != -1){
            var param = urlParams.substr(1);
            var paramArr = param.split('=');
            Query.set({fileName : paramArr[1]}, {silent: true});
            console.log(Query);
        }

        //this.postForm();//初始化对象，也即加载初始化页面时，请求数据
    },

    //集合数据排序依据
    comparator : function(model_1, model_2){
        var changed = Query.changed.sortType;
        var old = Query.get('sortType');
        var changedParam = changed?changed:old;
        var start = model_1.get(changedParam);
        var end = model_2.get(changedParam);
        var compareResult = start > end;
        return compareResult ? 0:1;
    },

    postForm : function(){
        var me = this;
        $.get('/load/searchLearningRes', Query.toJSON(), function(data){
            if(data && data.data && data.data.length > 0) {
                var counts = data.data.length;
                var size = Math.ceil(counts / Query.get('recordsSize'));

                Query.set({totalRecords: counts, totalPage: size, currentPage : 1, startPage: 1, endPage: size > 10?10:size}, {silent: true});
                me.reset(data.data);
            }else {
                Query.set({totalRecords: 0, totalPage: 0, currentPage : 1, startPage: 1, endPage: Query.get('totalPage')}, {silent: true});
                me.reset(null);
            }
        });
    }

});
var materialList = new MaterialList();
materialList.postForm();

var CommentsCollection = Backbone.Collection.extend({
    model : Comment,
    comparator : function(model_1, model_2){
        var start = model_1.get('publishDate');
        var end = model_2.get('publishDate');
        var compareResult = start > end;
        return  compareResult? 0:1;
    }
});

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
