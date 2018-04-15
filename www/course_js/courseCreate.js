/**
 * Created by fangz_000 on 4/20/2017.
 */

var course = {};
course.type = 'situation';
//选择类型处active状态切换
$('.course-select').click(function(){
    $('.course-select').removeClass('active');
    this.className += ' active';
    course.type = this.getAttribute('data-type');
});

var courseNameInput = $('input#course_title')[0];
course.checkAndFormatName = function () {
    //去掉开头结尾空格;
    var courseName = courseNameInput.value.trim();
    var pattern=/^[ ]+$/gi;
    if (courseName.length > 0 && !pattern.test(courseName)){
        course.showTitleHelp(false);
        return courseName;
    } else {
        course.showTitleHelp(true, '标题无效，请检查');
        return null;
    }
};
course.showTitleHelp = function (isShow, text) {
    var titleHelp = $('#help-block-course-title');
    if (isShow){
        titleHelp.text(text);
        titleHelp.css("display", "block");
    } else {
        titleHelp.text('');
        titleHelp.css("display", "none");
    }
};

var courseCreateBtn = $('#course-create-btn')[0];
courseCreateBtn.onclick = function () {
    course.name = course.checkAndFormatName();
    if (course.name){
        //save to db
        var courseObj = {
            isSaveNewFile: true,
            fileName: course.name,
            courseType: course.type,
            fileType: 'course_design',
            xml:'v2.2_parent_course'
        };
        $.post('/save', courseObj, function (msg) {
            if (msg.success){
                //打开edit页面
                window.location.href = "/courseEdit?id=" + msg.data.gFileId;
            } else {
                course.showTitleHelp(true, '保存失败');
            }
        })
    }
};
