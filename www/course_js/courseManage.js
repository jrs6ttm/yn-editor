/**
 * Created by fangz_000 on 4/21/2017.
 */
var CourseList=[];
var isAscStatus = false;

/*
* change sort-sign depend on 'isAscStatus'
*/
var changeSortSign = function (sortKey) {
    $('.sortSignSpan').text('');
    var sign = (isAscStatus)?'↑':'↓';
    $('#sort-sign-' + sortKey).text(sign);
};
var genQueryStrFromObj = function (obj, isWithQuestMark) {
    var parts = [], queryStr = "";
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]!=='') {
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    queryStr = parts.join('&');
    if (isWithQuestMark === undefined || isWithQuestMark) {
        queryStr = '?' + queryStr;
    }
    return queryStr;
};

var handleNoSession = function () {
    console.log('no session');
    /*//var url = 'http://' + loginHost + '/index.php?redirect_url=/';
    var url = 'http://' + loginHost;
    var msg='<b>' + mxResources.get('lPleaseLoginAgain', ['<a href=' + url + ' target="_blank"><button>'+mxResources.get('login')+'</button></a></b><br><br>']);
    //var msg='<b>抱歉！您已离线，请重新<a href=' + url + ' target="_blank"><button>'+mxResources.get('login')+'</button></a></b><br><br>登陆后此页面依旧有效';
    this.editorUi.showDialog(new tipDialogBody(this.editorUi, msg, 'left'), 300, null, true, false);
    this.editor.setModified('break');*/
};
/*
 sort by dateDesc
 by chenwenyan
 */
function dateDescSort(array, sortKey) {
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
        if (arr[i][sortKey] > pivot[sortKey]) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return dateDescSort(left, sortKey).concat([pivot], dateDescSort(right, sortKey));
}

/*
 sort by dateAsc
 by chenwenyan
 */
function dateAscSort(array, sortKey) {
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
        if (arr[i][sortKey] < pivot[sortKey]) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return dateAscSort(left, sortKey).concat([pivot], dateAscSort(right, sortKey));
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

var makeOneCourseBox = function (courseInfo) {
    var ImgSrc = (courseInfo.icon)?(MATERIAL_URL + '/fileRead?createType=own&userId='+ courseInfo.icon.ownerId +'&fileId=' + courseInfo.icon.materialsId):'../images/course.png',
        CourseName = courseInfo.name,
        IsPublished = (courseInfo.isPublished==true)?'已发布':'未发布',
        CreateTime = courseInfo.createTime,
        LastModify = courseInfo.lastModify,
        preHrefHtml = (courseInfo.isPublished==true)?'href="http://' + LOGIN_HOST + '/situation#' + courseInfo.id +'"':'style="cursor:default"',
        courseNameHtml = (courseInfo.isPublished==true)?'<a target="_blank" ' + preHrefHtml + '>' + CourseName + '</a>':'<span class="text-muted">' + CourseName + '</span>';

    var html = '<tr id="' + courseInfo.id + '"> ' +
        '<td><a target="_blank" ' + preHrefHtml + ' class="pull-left mrm"><img src=' + ImgSrc + ' alt="p" width="100" class="course-picture"/></a> ' +
        '<div class="mlm">' + courseNameHtml + '</div> ' +
        '</td> ' +
        '<td><span class="text-muted" style="font-size: smaller;">' + CreateTime + '</span></td> ' +
        '<td><span class="text-muted" style="font-size: smaller;">' + LastModify + '</span></td> ' +
        '<td><span class="text-muted">' + IsPublished + '</span></td> ' +
        '<td> ' +
        '<div class="btn-group">' +
        '<a class="btn btn-default btn-sm" target="_blank" href="/courseEdit?id=' + courseInfo.id + '">管理</a>' +
        '<a type="button" data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></a> ' +
        '<ul class="dropdown-menu"><li><a target="_blank" href="/courseEdit?id=' + courseInfo.id + '">课程编辑</a></li>' +
        //'<li><a onclick="deleteSubCourseItem(\'' + courseInfo.id + '\');">删除</a></li>' +
        '</ul>' +
        '</div> ' +
        '</td> ' +
        '</tr>';
    return html;
};
var deleteSubCourseItem = function (id) {
    $.get('/toTrash?isInstance=false&gFileId=' + id, function (msg) {
        if (msg.success){
            var itemTr = $('tr#'+id)[0];
            itemTr.parentNode.removeChild(itemTr);
        } else {
            console.log(msg);
        }
    })
};
var makeCourseBoxes = function (courses) {
    var tableBody = $('table#course-table tbody');
    tableBody.html('');
    if (courses.length > 0){
        for (var i = 0; i < courses.length; i++){
            tableBody.html(tableBody.html() + (makeOneCourseBox({
                "id": courses[i].gFileId,
                "name": courses[i].fileName,
                "icon": (courses[i].fileIcon)?(JSON.parse(courses[i].fileIcon)):null,
                "isPublished": courses[i].isPublished,
                "createTime": new Date(courses[i].createTime).toLocaleString(),
                "lastModify": new Date(courses[i].lastModify).toLocaleString()
            })));
        }
    }
};

var loadCourses = function (courseType) {
    var paramObj = {
        isDeleted : false,
        fileType : 'course_design'
    };
    if (courseType) {
        paramObj['courseType'] = courseType;
    }
    $.get(/*'http://authoring.xuezuowang.com/load/loadAllModelFile'*/'/load/loadAllModelFile' + genQueryStrFromObj(paramObj), function (message) {
        console.log(message);
        if(message.success){
            CourseList = message.data;
            //for (var i = 0; i < CourseList.length; i++){
            //    CourseList[i].createTime = new Date(CourseList[i].createTime)
            //}
            sortFileByTime('false');
            makeCourseBoxes(CourseList);
            changeSortSign('lastModify');
        } else if (message.msg === 'no_session'){
            handleNoSession();
        }
    });
};

var sortFileByTime = function (isToAsc, sortKey) {
    if (!sortKey){
        var sortKey = 'lastModify';
    }
    if ((isToAsc && (isToAsc == 'true')) || ((!isToAsc) && (!isAscStatus))){
        if (sortKey ==='name'){
            CourseList = nameAscSort(CourseList);
        }else {
            CourseList = dateAscSort(CourseList, sortKey);
        }
        isAscStatus = true;
    } else if ((isToAsc && (isToAsc == 'false')) || (isAscStatus)){
        if (sortKey ==='name'){
            CourseList = nameDescSort(CourseList);
        }else {
            CourseList = dateDescSort(CourseList, sortKey);
        }
        isAscStatus = false;
    }
};
//左侧导航栏active状态切换
$('li.list-group-item').click(function(){
    $('li.list-group-item').removeClass('active');
    this.className += ' active';
    var courseType = this.getAttribute('data-type');
    loadCourses(courseType);
});
$('th.sortable').click(function () {
    var sortKey = this.childNodes[1].id.substr(10);
    var isToAsc = (isAscStatus)? 'false':'true';
    sortFileByTime(isToAsc, sortKey);
    makeCourseBoxes(CourseList);
    changeSortSign(sortKey);
});
loadCourses();