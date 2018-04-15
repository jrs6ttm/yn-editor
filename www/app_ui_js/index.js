(function($){
	var TemplateHtml = 
	'<!-- Start Home -->'+
    '<section id="AnimatedBg" class="home bg-animate">'+
		'<div class="home-container">'+
			'<div class="container">'+
				'<div class="row">'+
					'<div class="col-md-8 col-md-offset-2 text-center">'+
						'<h1 class="title-one">学中做，做中学</h1>'+
						'<h4 class="title-two">拒绝枯燥的知识灌输，轻松get新能力</h4>'+
						'<a href="http://player.xuezuowang.com/#/website-pages/home" class="btn btn-primary" target="_blank">开始学习</a>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="street"></div>'+
    '</section>'+
    '<!-- End Home -->'+
    '<div class="clearfix"></div>'+
    '<!-- Start About -->'+
    '<section id="about">'+
        '<div class="container">'+
            '<!-- Start Title -->'+
            '<div class="row">'+
                '<div class="col-md-10 col-md-offset-1 title-section">'+
                    '<h4 class="title"><span>我们是</span> 这样一家年轻的公司</h4>'+
                    '<div class="line"><i class="icon icon-24 icon-profle"></i></div>'+
                '</div>'+
            '</div>'+
            '<!-- End Title -->'+
            '<!-- Start Feature One -->'+
            '<div class="row wrap-feature-one">'+
                '<div class="col-md-3 col-sm-6 feature-one">'+
                    '<i class="icon icon-64 icon-magicwand"></i>'+
                    '<h5 class="title">年轻</h5>'+
                    '<p>'+
                        '我们的团队成员平均年龄不超过25，富有朝气，蓬勃向上是我们最大的特色。'+
                    '</p>'+
                '</div>'+
                '<div class="col-md-3 col-sm-6 feature-one">'+
                    '<i class="icon icon-64 icon-tools"></i>'+
                    '<h5 class="title">创新</h5>'+
                    '<p>'+
                        '我们坚信，没有创新就没有进步，没有进步就无法离梦想更近一步！'+
                    '</p>'+
                '</div>'+
                '<div class="col-md-3 col-sm-6 feature-one">'+
                    '<i class="icon icon-64 icon-easel"></i>'+
                    '<h5 class="title">好学</h5>'+
                    '<p>'+
                        '我们推崇终身学习的理念。在做中学，在学中做，学无止境，你我同行！'+
                    '</p>'+
                '</div>'+
                '<div class="col-md-3 col-sm-6 feature-one">'+
                    '<i class="icon icon-64 icon-browser"></i>'+
                    '<h5 class="title">坚持</h5>'+
                    '<p>'+
                        '困难与机遇同在，我们已经做好了同甘共苦的准备，风雨过后终能看见彩虹。'+
                    '</p>'+
                '</div>'+
            '</div>'+
            '<!-- End Feature One -->'+
        '</div>'+
    '</section>'+
    '<!-- End About -->'+
    
    '<div class="clearfix"></div>'+
    
    '<!-- Start Description -->'+
    '<section id="services" class="gray">'+
        '<div class="container">'+
            '<div class="row" style="margin-bottom: 30px;">'+
                '<!-- Strat Description -->'+
                '<div class="col-md-7 col-md-push-5 img-desc">'+
                    '<img src="../images/courseEditor.png" class="img-responsive" alt="课程开发工具">'+
                '</div>'+
                '<div class="col-md-5 col-md-pull-7 content-desc">'+
                    '<h4>易能易编</h4>'+
                    '<p>'+
                        '工作过程导向课程是以综合性工作任务为载体的理论实践一体化的课程，引导学生在学习中经历完整工作过程，获得实际工作经验。'+
                        '易能易编作为一个直观易操作的工具，辅助教师进行工作过程导向课程的设计。在BPMN建模符号的支持下，您通过简易地拖拽即可建立学习任务流程图。'+
                        '根据学习任务流程图，针对不同学习群体的特点，定制切合需求的学习课程。'+
                    '</p>'+
                    '<ul class="list-checked">'+
                        '<li>图形化界面易操作，流程图形式直观明了</li>'+
                        '<li>课程与模型分离，课程均量身定制</li>'+
                        '<li>支持单人独立或多人合作的角色扮演式课程</li>'+
                        '<li>基于BPMN业务流程建模国际标准</li>'+
                    '</ul>'+
                    '<div class="text-left">'+
                        '<!--<a href="#" class="btn btn-default">Live Demo</a>-->'+
                        '<a href="http://www.xuezuowang.com:80/?ui=process_design" class="btn btn-primary" target="_blank">开始制作课程</a>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="row">'+
                '<!-- Strat Description -->'+
                '<div class="col-md-5 col-md-push-7 content-desc">'+
                    '<h4>易能易播——它不止是一个播放器</h4>'+
                    '<p>'+
                        '课程播放器是播放由课程设计工具所设计的一系列的基于工作流程的课程的工具。'+
                        '其最具特色的一点是可以根据课程的设计流程一步步开展课程的播放，用户需在一个学习任务中完成相关任务，才能进入下下一个课程的活动。'+
                        '以功能分可分为资料区（用户浏览课程所推荐的相关资料的区域）和工作台（用户完成学习过程中需要完成的任务都在该区域完成）。'+
                    '</p>'+
                    '<ul class="list-checked">'+
                        '<li>流程清晰，学习行程一目了然</li>'+
                        '<li>任务明确，任务要求清晰明确</li>'+
                        '<li>资料全面，为你提供全面的学习资料</li>'+
                    '</ul>'+
                    '<div class="text-left">'+
                        '<!--<a href="#" class="btn btn-default">Live Demo</a>-->'+
                        '<a href="http://player.xuezuowang.com/#/website-pages/home" class="btn btn-primary" target="_blank">开始课程</a>'+
                    '</div>'+
                '</div>'+
                '<div class="col-md-7 col-md-pull-5 img-desc">'+
                    '<img src="../images/coursePlayer.png" class="img-responsive" alt="课程播放器">'+
                '</div>'+
            '</div>'+
        '</div>'+

        '<!-- End Description -->'+

        '</div>'+
    '</section>'+
    '<!-- End Description -->'+
    '<div class="clearfix"></div>'+
    '<!-- Start Features -->'+
    '<section id="features">'+
        '<div class="container">'+
            '<!-- Start Title -->'+
            '<div class="row">'+
                '<div class="col-md-10 col-md-offset-1 title-section">'+
                    '<h4 class="title"><span>我们的特色</span> 选择我们的理由</h4>'+
                    '<div class="line"><i class="icon icon-24 icon-trophy"></i></div>'+
                '</div>'+
            '</div>'+
            '<!-- End Title -->'+
            '<!-- Start Features -->'+
            '<div class="row wrap-feature-two">'+
                '<div class="col-md-4">'+
                    '<!-- Start Feature Two Left -->'+
                    '<ul class="feature-two left">'+
                        '<li>'+
                            '<i class="icon icon-64 icon-tablet"></i>'+
                            '<h5>学习方式灵活</h5>'+
                            '<p>'+
                                '提供最方便快捷的在线学习方式，在职提升职业能力的最佳选择'+
                            '</p>'+
                       '</li>'+
                        '<li>'+
                            '<i class="icon icon-64 icon-clipboard"></i>'+
                            '<h5>权威师资</h5>'+
                            '<p>'+
                                '课程由业内出色的工程师和武汉大学等高校名师合作设计'+
                            '</p>'+
                        '</li>'+
                        '<li>'+
                            '<i class="icon icon-64 icon-hourglass"></i>'+
                            '<h5>理念创新</h5>'+
                            '<p>'+
                                '以工作过程为导向，抛弃了传统的死记硬背的教学模式'+
                            '</p>'+
                        '</li>'+
                    '</ul>'+
                    '<!-- End Feature Two Left -->'+
                '</div>'+
                '<div class="col-md-4">'+
                    '<img src="../images/features/man.png" class="img-responsive img-feature-two" alt="">'+
                '</div>'+
                '<div class="col-md-4">'+
                    '<!-- Start Feature Two Right -->'+
                    '<ul class="feature-two right">'+
                        '<li>'+
                            '<i class="icon icon-64 icon-rocket"></i>'+
                            '<h5>个性化</h5>'+
                            '<p>'+
                                '课程均量身定制开发，满足您的多元化需求'+
                            '</p>'+
                        '</li>'+
                        '<li>'+
                            '<i class="icon icon-64 icon-gamecontroller"></i>'+
                            '<h5>多角色</h5>'+
                            '<p>'+
                                '支持单人独立或多人合作的角色扮演式课程，互动性强'+
                            '</p>'+
                        '</li>'+
                        '<li>'+
                            '<i class="icon icon-64 icon-interstate"></i>'+
                            '<h5>学做结合</h5>'+
                            '<p>'+
                                '学着做，做中学，工作活动与学习过程有机结合'+
                            '</p>'+
                        '</li>'+
                    '</ul>'+
                    '<!-- End Feature Two Right -->'+
                '</div>'+
            '</div>'+
            '<!-- End Features -->'+
        '</div>    '+
    '</section>'+
    '<!-- End Features -->'+
    '<div class="clearfix"></div>'+
    '<div class="clearfix"></div>'+
    '<!-- Start Work It -->'+
    '<div class="dark">'+
        '<div class="container">'+
            '<div class="row">'+
                '<div class="col-md-10 col-md-offset-1">'+
                    '<!-- Start Feature Three -->'+
                    '<div class="row">'+
                        '<div class="col-md-4 col-sm-4 feature-three">'+
                            '<div class="img-feature">'+
                                '<span class="count">1</span>'+
                                '<i class="icon icon-64 icon-download"></i>'+
                            '</div>'+
                            '<h5>注册</h5>'+
                            '<p>注册成为系统的一员</p>'+
                        '</div>'+
                        '<div class="col-md-4 col-sm-4 feature-three">'+
                            '<div class="img-feature">'+
                                '<span class="count">2</span>'+
                                '<i class="icon icon-64 icon-tools"></i>'+
                            '</div>'+
                            '<h5>选择课程</h5>'+
                            '<p>学中作，做中学，拒绝枯燥的知识灌输</p>'+
                        '</div>'+
                        '<div class="col-md-4 col-sm-4 feature-three">'+
                            '<div class="img-feature">'+
                                '<span class="count">3</span>'+
                                '<i class="icon icon-64 icon-tablet"></i>'+
                            '</div>'+
                            '<h5>get技能</h5>'+
                            '<p>相关技能在实际操作中稳步提高与锻炼</p>'+
                        '</div>'+
                    '</div>'+
                    '<!-- End Feature Three -->'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<!-- End Work It -->'+
    '<div class="clearfix"></div>'+
    '<!-- Start Article -->'+
    '<section id="blog" class="gray">'+
        '<div class="container">'+
            '<!-- Start Title -->'+
            '<div class="row">'+
                '<div class="col-md-10 col-md-offset-1 title-section">'+
                    '<h4 class="title"><span>招贤纳士</span> 最新招聘职位</h4>'+
                    '<div class="line"><i class="icon icon-24 icon-compose"></i></div>'+
                '</div>'+
            '</div>'+
            '<!-- End Title -->'+
			
			'<!-- Start Blog -->'+
            '<div class="row">'+
                '<div id="post" class="masonry wrap-post">'+
                    '<div class="grid-sizer col-md-6 col-sm-12 col-xs-12"></div>'+
                    '<div class="grid-item col-md-6 col-sm-12 col-xs-12">'+
                        '<!-- Start Article 01 -->'+
                        '<div class="row post">'+
                            '<div class="col-md-6 col-sm-6 img-post">'+
                                '<img src="../images/blog/1.jpg" class="img-responsive" alt="">'+
                            '</div>'+
                            '<div class="col-md-6 col-sm-6 content-post">'+
                                '<h5><a href="http://www.allzhaopin.com/zhiwei/job4914655.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank">'+
                                    'Node.js高级软件研发工程师(职位编号：004)'+
                                '</a></h5>'+
                                '<ul class="meta-post">'+
                                    '<li><a href="#"><span class="fa fa-calendar"></span> 03/2/2016</a></li>'+
                                '</ul>'+
                                '<p>'+
                                    '工作地点：<strong>武汉</strong> &nbsp;&nbsp;&nbsp;&nbsp;招聘人数：<strong>2</strong><br/>'+
                                    '学&nbsp;&nbsp;历：<strong>本科</strong>&nbsp;&nbsp;&nbsp;&nbsp;薪水范围：<strong>面议</strong>'+
                                '</p>'+
                                '<a href="http://www.allzhaopin.com/zhiwei/job4914655.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank" class="btn btn-primary">职位详情</a>'+
                            '</div>'+
                        '</div>'+
                        '<!-- End Article 01 -->'+
                    '</div>'+
                    '<div class="grid-item col-md-6 col-sm-12 col-xs-12">'+
                        '<!-- Start Article 02 -->'+
                        '<div class="row post current">'+
                            '<div class="col-md-6 col-sm-6 img-post">'+
                                '<img src="../images/blog/2.jpg" class="img-responsive" alt="">'+
                            '</div>'+
                            '<div class="col-md-6 col-sm-6 content-post">'+
                                '<h5><a href="http://www.allzhaopin.com/zhiwei/job4914712.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank">'+
                                    '信息处理高级软件研发工程师(职位编号：002)'+
                                '</a></h5>'+
                                '<ul class="meta-post">'+
                                    '<li><a href="javascript:void(0);"><span class="fa fa-calendar"></span> 03/2/2016</a></li>'+
                                '</ul>'+
                                '<p>'+
                                    '工作地点：<strong>武汉</strong> &nbsp;&nbsp;&nbsp;&nbsp;招聘人数：<strong>2</strong><br/>'+
                                    '学&nbsp;&nbsp;历：<strong>本科</strong>&nbsp;&nbsp;&nbsp;&nbsp;薪水范围：<strong>10000~14999</strong>'+
                                '</p>'+
                                '<a href="http://www.allzhaopin.com/zhiwei/job4914712.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank" class="btn btn-primary">职位详情</a>'+
                            '</div>'+
                        '</div>'+
                        '<!-- End Article 02 -->'+
                    '</div>'+
                    '<div class="grid-item col-md-6 col-sm-12 col-xs-12">'+
                        '<!-- Start Article 03 -->'+
                        '<div class="row post">'+
                            '<div class="col-md-6 col-sm-6 col-md-push-6 img-post">'+
                                '<img src="../images/blog/4.jpg" class="img-responsive" alt="">'+
                            '</div>'+
                            '<div class="col-md-6 col-sm-6 col-md-pull-6 content-post">'+
                                '<h5><a href="http://www.allzhaopin.com/zhiwei/job4914571.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank">'+
                                    'Mongo数据库应用工程师(职位编号：009)'+
                                    '</a></h5>'+
                                '<ul class="meta-post">'+
                                    '<li><a href="javascript:void(0);" target="_blank"><span class="fa fa-calendar"></span> 03/2/2016</a></li>'+
                                '</ul>'+
                                '<p>'+
                                    '工作地点：<strong>武汉</strong> &nbsp;&nbsp;&nbsp;&nbsp;招聘人数：<strong>2</strong><br/>'+
                                    '学&nbsp;&nbsp;历：<strong>本科</strong>&nbsp;&nbsp;&nbsp;&nbsp;薪水范围：<strong>面议</strong>'+
                                '</p>'+
                                '<a href="http://www.allzhaopin.com/zhiwei/job4914608.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank" class="btn btn-primary">职位详情</a>'+
                            '</div>'+
                        '</div>'+
                        '<!-- End Article 03 -->'+
                    '</div>'+
                    '<div class="grid-item col-md-6 col-sm-12 col-xs-12">'+
                        '<!-- Start Article 04 -->'+
                        '<div class="row post current">'+
                            '<div class="col-md-6 col-sm-6 col-md-push-6 img-post">'+
                                '<img src="../images/blog/3.jpg" class="img-responsive" alt="">'+
                            '</div>'+
                            '<div class="col-md-6 col-sm-6 col-md-pull-6 content-post">'+
                                '<h5><a href="http://www.allzhaopin.com/zhiwei/job4914608.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank">UE/UI交互设计工程师(职位编号：007)</a></h5>'+
                                '<ul class="meta-post">'+
                                    '<li><a href="javascript:void(0);"><span class="fa fa-calendar"></span> 3/2/2016</a></li>'+
                                '</ul>'+
                                '<p>'+
                                    '工作地点：<strong>武汉</strong> &nbsp;&nbsp;&nbsp;&nbsp;招聘人数：<strong>2</strong><br/>'+
                                    '学&nbsp;&nbsp;历：<strong>大专</strong>&nbsp;&nbsp;&nbsp;&nbsp;薪水范围：<strong>面议</strong>'+
                                '</p>'+
                                '<a href="http://www.allzhaopin.com/zhiwei/job4914608.html?utm_source=zhiwei&utm_medium=baidu&utm_campaign=ald" target="_blank" class="btn btn-primary">职位详情</a>'+
                            '</div>'+
                        '</div>'+
                        '<!-- End Article 04 -->'+
                    '</div>'+
                '</div>'+
            '</div>'+
			'<!-- End Blog -->'+
        '</div>'+
    '</section>'+
    '<!-- End Article -->'+
     '<div class="clearfix"></div>'+
    '<!-- Start inner page -->'+
	'<div id="contact" class="inner-page">'+
		'<div class="container">'+
			'<div class="col-md-12">'+
				'<div class="row">'+
					'<div class="col-md-6 marginbot20">'+
						'<i class="icon icon-64 icon-map alignleft"></i>'+
						'<h6>公司地址</h6>'+
						'<p>'+
							'湖北省 武汉市 洪山区 花山街道花城大道9号武汉软件新城A5栋<br />'+
							'武汉易能教育科技有限公司'+
						'</p>'+
					'</div>'+
					'<div class="col-md-6">'+
						'<i class="icon icon-64 icon-mail alignleft"></i>'+
						'<h6>联系方式:</h6>'+
						'<p>'+
							'<strong>邮箱 :</strong> kefu@xuezuowang.com<br />'+
							'<strong>电话 :</strong> 59705386'+
						'</p>'+
					'</div>'+
				'</div>'+
                '<div class="clearfix"></div>'+
                '<div id="sendMessageOk"></div>	'+
                '<ul class="listForm">'+
                    '<li>'+
                        '<label>名字 :</label>'+
                        '<input class="form-control input-name input-lg" type="text" name="name" data-rule="maxlen:4" data-msg="Required field" placeholder="请输入你的名字 . . ." />'+
                        '<div class="validation"></div>'+
                    '</li>'+
                    '<li>'+
                        '<label>邮箱 :</label>'+
                        '<input class="form-control input-email input-lg" type="text" name="email" data-rule="email" data-msg="Please enter a valid email" placeholder="请输入你的邮箱地址 . . ."/>'+
                        '<div class="validation"></div>'+
                    '</li>'+
                    '<li class="full-list">'+
                        '<label>信息 :</label>'+
                        '<textarea class="form-control input-lg" rows="8" name="message" data-rule="required" data-msg="Please write something for us" placeholder="写下您的问题/建议/意见 . . ."></textarea>'+
                        '<div class="validation"></div>'+
                    '</li>'+
                    '<li class="full-list last-list">'+
                        '<input type="button" value="提交信息" class="btn btn-primary btn-lg btn-block" name="sendMessage" />'+
                    '</li>'+
                '</ul>'+
			'</div>'+
			
		'</div>'+
	'</div>'+
	'<!-- End inner page -->'+
    '<div class="clearfix"></div>'+
    '<!-- Start Footer -->'+
    '<footer> '+
        '<div class="main-footer">'+
            '<div class="container">'+
                '<div class="row">'+
                    '<div class="col-md-3 footer-item">'+
                        '<img src="../images/index-logo.png" class="logo-footer" style="width:125px;" alt="武汉易能教育">'+
                        '<!-- Start Network Social Icon -->'+
                        '<ul class="social-network">'+
                            '<li><a href="javascript:void(0);"><span class="fa fa-weixin"></span></a></li>'+
                            '<li><a href="javascript:void(0);"><span class="fa fa-weibo"></span></a></li>'+
                            '<li><a href="javascript:void(0);"><span class="fa fa-qq"></span></a></li>'+
                            '<li><a href="javascript:void(0);"><span class="fa fa-renren"></span></a></li>'+
                        '</ul>'+
                        '<!-- End Network Social Icon -->'+
                    '</div>'+
                    '<div class="col-md-3 footer-item">'+
                        '<div class="row">'+
                            '<div class="col-md-6 col-sm-6 col-xs-6">'+
                                '<!-- Start Link -->'+
                                '<ul class="footer-link">'+
                                    '<li><a href="#about">关于我们</a></li>'+
                                    '<li><a href="#services">产品服务</a></li>'+
                                    '<li><a href="#contact">联系我们</a></li>'+
                                    '<li><a href="javascript:void(0);">合作伙伴</a></li>'+
                                    '<li><a href="javascript:void(0);">法律条款</a></li>'+
                                '</ul>'+
                                '<!-- Start Link -->'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-md-4 footer-item">'+
                        '<h5 class="title-footer">公司地址</h5>'+
                        '<div>湖北省 武汉市 洪山区 花山街道花城大道9号武汉软件新城A5栋<br />武汉易能教育科技有限公司</div><br />'+
                        '<h5 class="title-footer">联系方式</h5>'+
                        '<div><strong>邮箱 :</strong> kefu@xuezuowang.com<br /><strong>电话 :</strong> 59705386</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="sub-footer">'+
            '2015 &copy; Copyright <a href="#AnimatedBg">武汉易能教育</a> - All right reserved'+
        '</div>'+
    '</footer>'+
    '<!-- End Footer -->';

	var YiNengView = Backbone.View.extend({
		el:'#main-contents',

		events:{
            'click input[name="sendMessage"]': 'sendMessage'
		},

		initialize: function(){
			_.bindAll(this, 'render');
			this.render();
		},

		render: function(){
			$(this.el).append(TemplateHtml);
		},

        sendMessage : function(){
            $('.validation', this.el).text('');
            var parentObj = $('.listForm',this.el);
            var name = $('input[name="name"]', parentObj).val()
                ,email = $('input[name="email"]', parentObj).val()
                ,message = $('textarea[name="message"]', parentObj).val();

            if(!name || name.length > 20){
                $('input[name="name"]', parentObj).focus();
                $('input[name="name"]', parentObj).parent().find('div').eq(0).text('名字必填且不超过20个字符！');
                return false;
            }
            if(!email || email.length > 20){
                $('input[name="email"]', parentObj).focus();
                $('input[name="email"]', parentObj).parent().find('div').eq(0).text('请填写有效的email地址！');
                return false;
            }
            if(!message || message.length > 1000){
                $('textarea[name="message"]', parentObj).focus();
                $('textarea[name="message"]', parentObj).parent().find('div').eq(0).text('信息必填且不超过1000个字符！');
                return false;
            }
            $('#sendMessageOk', this.el).html(
                '<div class="alert alert-info marginbot35">'+
                '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
                '<strong>我们正在完善留言功能，谢谢！</strong><br />'+
                '</div>'
            );
            return false;
            var me = this;
            $.post('/contact/sendMessage', {name: name, email: email, message: message}, function(result){
                if(result && result.success){
                    $('input[name="name"]', parentObj).val('');
                    $('input[name="email"]', parentObj).val('');
                    $('textarea[name="message"]', parentObj).val('');
                    $('#sendMessageOk', me.el).html(
                        '<div class="alert alert-info marginbot35">'+
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
                        '<strong>我们已接收您的信息，谢谢！</strong><br />'+
                        '</div>'
                    );
                }else{
                    $('#sendMessageOk', me.el).html(
                        '<div class="alert alert-warning marginbot35">'+
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
                        '<strong>信息发送失败！</strong><br />'+
                        '</div>'
                    );
                }
            });
        }
	});

	var YiNengApp = new YiNengView();
})(jQuery)