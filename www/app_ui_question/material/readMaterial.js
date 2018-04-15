(function($){
	var TemplateView = {
		SearchInputHTML : '<form class="bs-example bs-example-form" role="form">'+
				            '<div class="row">'+
				               '<div class="col-md-1">'+
			/*
									'<a href="http://player.xuezuowang.com/#/website-pages/home" title="首页">'+
										'<img src="images/logo.png" width="50px;" alt="易能教育"/>'+
									'</a>'+
									*/
							'</div>'+
							'<div class="col-md-10">'+
								'<div class="input-group">'+
				                     '<input type="text" class="form-control" placeholder="搜一下~" name="keyWords">'+
				                     '<span class="input-group-btn">'+
				                        '<button class="btn btn-success ripple" type="button" id="submitSearchBut">SEARCH</button>'+
				                     '</span>'+
				                  '</div>'+
				               '</div>'+
				            '</div>'+
							'<div class="col-md-1"></div>'+
				         '</form><hr />',

	    DocContentsHTML : 	'<div id="doc-top">'+
		                        '<p data-material-id = "<%=materialsId%>"><font size="5"><%=fileName%></font></p>'+
		                        '<p>'+
		                            '<span title="4.3分，5357人评">'+
		                                '<b class="ic ic-star-s-on"></b>'+
		                                '<b class="ic ic-star-s-on"></b>'+
		                                '<b class="ic ic-star-s-on"></b>'+
		                                '<b class="ic ic-star-s-on"></b>'+
		                                '<b class="ic ic-star-s-half"></b>'+
		                            '</span><label id="read-times"><%=readTimes%></label>&nbsp;次阅读&nbsp;&nbsp;|&nbsp;&nbsp;<label id="download-times"><%=downloadTimes%></label>&nbsp;次下载&nbsp;&nbsp;|&nbsp;&nbsp;'+
		                            '<button type="button" class="btn btn-link" id="praiseSpan" title="点赞" style="margin-left:-12px;"><img src="images/praise.jpg" width="30px"/>(&nbsp;<label id="praise-times"> <%=praiseTimes%> </label>&nbsp;)</button>'+
		                        '</p>'+
		                    '</div>'+
		                    '<div id="doc-main"></div>'+
		                    '<div id="doc-bottom" style="margin-top: 10px;margin-bottom: 80px;">'+
		                          '<div style="float:right;margin-left: 10px;margin-right: 10px;">'+
									' <span class="downloadFile" data-sourceF="<%=sourceF%>" data-fileType="<%=fileType%>" data-fileName="<%=fileName%>"> '+
										'<button type="button" class="btn btn-info"> 下载</button></span>&nbsp;&nbsp;'+
		                              '<button type="button" class="btn btn-info">收 藏</button>'+
		                          '</div>'+
		                          '<div style="float:right;margin-top: 5px;">'+
		                              '<p>大小：<%=size%></p>'+
		                          '</div>'+
		                    '</div>',

			DocPublisherHTML : 	'<div>'+
									'<%if(username && username.trim() != ""){%>'+
										'<a href="/editMaterial" class="btn btn-info" role="button">'+
											'<span class="glyphicon glyphicon-arrow-up"></span>&nbsp;   编 辑 我 的 资 料&nbsp;&nbsp;&nbsp;'+
										'</a>'+
									'<%}%>'+
								'</div>'+
								'<div>'+
									'<h4>文档贡献者</h4>'+
									'<div style="float:left;margin-right: 10px;">'+
										'<a href="#" target="_blank">'+
											'<img src="http://himg.bdimg.com/sys/portraitn/item/84ab7766656e6735323031333134383c2f"alt="头像" />'+
										'</a>'+
									'</div>'+
									'<div>'+
										'<p class="owner-name">'+
											'<a href="#" target="_blank"><%=publisher%></a>'+
										'</p>'+
										'<p >贡献于<%=new Date(createTime).toLocaleDateString()%></p>'+
									'</div>'+
									'<hr />'+
								'</div>',

		    AddCommentHTML :   '<h4 id="publishMyComment">'+
		                          '<strong>您的评论</strong>'+
		                          '<span class="star-act">'+
	                          		'<b class="ic ic-star-s-off"></b>'+
	                                '<b class="ic ic-star-s-off"></b>'+
	                                '<b class="ic ic-star-s-off"></b>'+
	                                '<b class="ic ic-star-s-off"></b>'+
	                                '<b class="ic ic-star-s-off"></b>'+
		                          '</span>'+
									/*
		                          '<span class="f-star"></span>'+
		                          '<span class="tip"><small>*感谢支持，给文档评个星吧！</small></span>'+
		                          */
		                        '</h4>'+
		                        '<div class="add-ct-tip">'+
		                          '<div style="padding:10px;">'+
		                            '<textarea id="newComment" class="form-control newComment" rows="3"></textarea>'+
		                            '<span style="float:right;margin-top:-20px;margin-right: 5px;">240</span>'+
		                          '</div>'+
		                          '<div style="margin-left:88%">'+
		                            '<button id="publishCommentBut" class="btn btn-info">发布评论</button>'+
		                          '</div>'+
		                        '</div>',

		    DocCommentItemHTML :  '<div class="doc-comment-item">'+
		                              '<ul class="nav nav-pills">'+
		                                 '<li>'+
		                                   '<div>'+
		                                    '<a href="#" target="_blank">'+
		                                      '<img class="avatar" src="http://himg.bdimg.com/sys/portraitn/item/62ba636169737579613838303131319b72">'+
		                                    '</a>'+
		                                   '</div>'+
		                                 '</li>'+
		                                 '<li style="margin-left: 10px;width:80%;">'+
		                                    '<div>'+
		                                      '<p>'+
		                                        '<span class="ct-star">'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                        '</span>'+
		                                        '<a class="publisher" href="#" target="_blank"><%=publisher%></a>'+
												'<span style="float:right;">发表日期：<%=new Date(publishDate).toLocaleString()%></span>'+
		                                      '</p>'+
		                                      '<div>'+
		                                        '<p><%=comment%></p>'+
		                                      '</div>'+
		                                   '</div>'+
		                                 '</li>'+
										 '<li style="float:right;">'+
											 '<p>'+
												'<span  class="replyComment" data-replyId="<%=id%>">&nbsp;&nbsp;<a href="javascript:void(0);">回复(<label><%=childComments%></label>)</a></span>'+
											 '</p>'+
										 '</li>'+
		                              '</ul>'+
		                              '<hr />'+
		                          '</div>',

		    RelatedDocumentsHTML :  '<div style="float:right;">'+
			                            '<a href="#home" data-toggle="tab" disabled="disabled"><</a>&nbsp;'+
			                            '<a href="#ios" data-toggle="tab">></a>'+
			                        '</div>'+
			                        '<h4><a href="http://wenku.baidu.com/search?word=&amp;lm=0&amp;od=0" target="_blank">相关文档推荐</a></h4>'+
		                            '<div id="myTabContent" class="tab-content">'+
		                               '<div class="tab-pane fade in active" id="home">'+
		                                  '<div class="item">'+
		                                    '<p class="doc-title"><b class="ic ic-pdf"></b><a href="#" target="_blank" title="abc">推荐文档1</a></p>'+
		                                    '<div class="gd-g tail-info">'+
		                                      '<div class="gd-g-u gd-u-3-8">'+
		                                        '<span title="4分，123人评">'+
			                                        '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                        '</span>'+
		                                      '</div>'+
		                                      '<div class="gd-g-u gd-u-1-4" style="display:inline-block;">&nbsp;344KB</div>'+
		                                      '<div class="gd-g-u gd-u-7-24" style="display:inline-block;">&nbsp;&nbsp;免费</div>'+
		                                    '</div>'+
		                                  '</div>'+
		                               '</div>'+
		                               '<div class="tab-pane fade" id="ios">'+
		                                  '<div class="item">'+
		                                    '<p class="doc-title"><b class="ic ic-pdf"></b><a href="#" target="_blank" title="def">推荐文档2</a></p>'+
		                                    '<div class="gd-g tail-info">'+
		                                      '<div class="gd-g-u gd-u-3-8">'+
		                                        '<span title="4分，123人评">'+
		                                        	'<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                            '<b class="ic-star-score star-score-on"></b>'+
		                                        '</span>'+
		                                      '</div>'+
		                                      '<div class="gd-g-u gd-u-1-4" style="display:inline-block;">&nbsp;58页</div>'+
		                                      '<div class="gd-g-u gd-u-7-24" style="display:inline-block;">&nbsp;&nbsp;免费</div>'+
		                                    '</div>'+
		                                  '</div>'+
		                               '</div>'+
			                        '</div><hr />',

			RecommentDocumentsHTML :  '<div class="inner">'+
			                            '<div class="hd clearfix">'+
			                              '<h4>专题推荐</h4>'+
			                            '</div>'+
			                            '<div class="bd">'+
			                                '<p>'+
			                                  '<a href="#" title="信息安全与防护" target="_blank">信息安全与防护措施</a>'+
			                                '</p>'+
			                                '<p>'+
			                                  '<a href="#"  target="_blank" title="sql注入攻防实验">sql注入攻防实验</a>'+
			                                '</p>'+
			                            '</div>'+
			                        '</div>',

			PlayPPTHTML  :  '<div id="myCarousel" class="carousel slide" data-interval="false" width="400px">'+
							   '<!-- 轮播（Carousel）项目 -->'+
							   '<div class="carousel-inner">'+
							      '<div class="item active">'+
							         '<img src="./logo.png" alt="First slide" width="400px;">'+
							      '</div>'+
							      '<div class="item">'+
							         '<img src="praise.jpg" alt="Second slide" width="400px;">'+
							      '</div>'+
							      '<div class="item">'+
							         '<img src="./wait.jpg" alt="Third slide" width="400px;">'+
							      '</div>'+
							   '</div>'+
							   '<!-- 轮播（Carousel）导航 -->'+
							   '<a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>'+
							   '<a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>'+
							   '<!-- 控制按钮 -->'+
							   '<div style="text-align:center;">'+
							     '<button class="btn prev-slide play-action" data-play-action="prev"><span class="glyphicon glyphicon-chevron-left"></span></button>'+
							     '<span>1/3</span>'+
							      '<button class="btn next-slide play-action" data-play-action="next"><span class="glyphicon glyphicon-chevron-right"></span></button>'+
							   '</div>'+
							'</div>'
	};

	var CommentCollection = new CommentsCollection();

	//搜索框
	var SearchInputView = Backbone.View.extend({
		className: 'searchInput',
		attributes: {
			style: 'margin-bottom: 10px'
		},

		events : {
			'click  #submitSearchBut' : 'submitSearch'
		},

		initialize : function(){
			_.bindAll(this, 'render');
		},

		render: function(){
			$(this.el).append(TemplateView.SearchInputHTML);
			return this;
		},

		submitSearch : function(){
			var keyWords = $('input[name="keyWords"]', this.el).val();
			window.open('/searchMaterials?fileName='+keyWords);
			//window.location.href = './searchMaterials.html?fileName='+keyWords;
		}
	});

	var DocPublisherView = Backbone.View.extend({
		tagName : 'div',

		events : {

		},

		initialize : function(){
			_.bindAll(this, 'render');
		},

		render : function(){
			this.template = _.template(TemplateView.DocPublisherHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			return this;
		}
	});

	//文档内容
	var DocContentsView = Backbone.View.extend({
		tagName : 'div',

		events : {
			'click #praiseSpan' : 'changePraise',
			'click .downloadFile' : 'downloadFile'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'changePraise', 'downloadFile');
			this.listenTo(this.model, 'change', this.changeTimes);
		},

		render : function(){
			this.template = _.template(TemplateView.DocContentsHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);

			return this;
		},

		changePraise : function(){
			this.model.set({praiseTimes : Number(this.model.get('praiseTimes')) + 1});
		},

		changeTimes : function(){
			var changedObj = this.model.changed;
			console.log(changedObj);
			if(changedObj.praiseTimes)
				$('#praise-times', this.el).text(changedObj.praiseTimes);
			if(changedObj.downloadTimes)
				$('#download-times', this.el).text(changedObj.downloadTimes);

			this.model.updateTimes();
		},

		downloadFile : function(event){
			var Obj = event.currentTarget;
			var params = '?';
			params = params + 'sourceF=' + $(Obj).attr('data-sourceF')+ '&fileType=' + $(Obj).attr('data-fileType')+ '&fileName=' + $(Obj).attr('data-fileName');

			window.location.href='/LR/downloadMaterial'+params;
			this.model.set({downloadTimes : Number(this.model.get('downloadTimes'))+1});
		}
	});

	//资料播放
	var DocPlayerView = Backbone.View.extend({
		tagName : 'div',

		events : {
			'click .play-action' : 'playAction'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'playAction', 'playVideo');
			/*
			var me = this;
			$.get('/LR/isMaterialExist', {materialId: me.model.get('materialsId')}, function(result){
				if(result)
					me.template = _.template('<iframe src="http://218.106.119.150:8088/OfficeTransfer/<%=transformF?transformF:sourceF%>" '+
												'width="100%" height="550px;" ></iframe>');
				else
					me.template = _.template('<iframe src="/getNotFoundPage" width="100%" height="550px;" ></iframe>');
			});
			*/
		},

		render : function(){
			this.fileType = this.model.get('fileType');
			this.isVideo = this.model.get('videoImagePath');
			if(this.isVideo && this.isVideo.trim() != '' && this.isVideo.trim() != 'undefined') {//视频，用播放器播
				//this.template = _.template(TemplateView.PlayPPTHTML);'http://218.106.119.150:8088/OfficeTransfer/'+this.model.get('sourceF'),
				$(this.el).append('<div id="video-player"></div>');
				this.flashvars={
					f:'http://www.xuezuowang.com:8088/OfficeTransfer/'+this.model.get('sourceF'),
					c:0,
					p:0,
					h:"2",
					//l:'http://www.ckplayer.com/down/adv6.1_1.swf|http://www.ckplayer.com/down/adv6.1_2.swf',//前置广告，swf/图片/视频，多个用竖线隔开，图片和视频要加链接地址
					//t:15,
					b:1,
					e:3,
					//i:'<%=basePath%>/logo.jpg',
					my_url:encodeURIComponent(window.location.href)
				};
				this.params={bgcolor:'#FFF', allowFullScreen:true, allowScriptAccess:'always', wmode:'transparent'};
			}else{
				this.template = _.template('<iframe src="http://www.xuezuowang.com:8088/OfficeTransfer/<%=transformF?transformF:sourceF%>" width="100%" height="550px;" ></iframe>');
				$(this.el).append(
					this.template(this.model.toJSON())
				);
			}

			return this;
		},

		playVideo : function(){
			CKobject.embedSWF('app_3th_js/ckplayer/ckplayer.swf','video-player','ckplayer_a1','100%','450',this.flashvars, this.params);
		},

		playAction : function(event){
			var Obj = event.currentTarget;
			var playAction = $(Obj).attr('data-play-action');
			$('#myCarousel', this.el).carousel(playAction);
			if(playAction == 'next' || playAction == 'prev')
				$('#myCarousel', this.el).carousel('pause');
		}
	});

	//增加评论
	var AddCommentView = Backbone.View.extend({
		tagName : 'div',

		events : {
			'click #publishCommentBut' : 'publishComment'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'publishComment');
		},

		render : function(){
			$(this.el).append(TemplateView.AddCommentHTML);
			return this;
		},

		publishComment : function(){
			var userId = this.model.get('userId'), username = this.model.get('username');
			/*if(!username || username.trim() == ''){
				alert('您还未登陆，不能评论！');
				return false;
			}*/
			var reply_to_id = $('#doc-top').find('p').eq(0).attr('data-material-id');
			var newComment = $('#newComment', this.el).val();
			if(!newComment || newComment.trim() == ''){
				$('#newComment', this.el).focus();
				return false;
			}
			var comment = new Comment({
				reply_to_id : reply_to_id,
				publishDate : getDateStr(),
				publisherId: userId,
				publisher : username,
				comment : newComment
			});
			var me = this;
			$.post('/LR/saveComment', {comment: JSON.stringify(comment.toJSON())}, function(result){
				if(result.success){
					$('#newComment', me.el).val('');
					comment.set({id: result.data});
					CommentCollection.add(comment);
					Query.set({totalRecords: Number(Query.get('totalRecords')) + 1}, {silent: true});
					CommentCollection.trigger('addComment');
					console.log('save comment success!');
				}else{
					console.log('save comment fails!');
				}
			});
		}

	});

	//评论item
	var DocCommentItemView = Backbone.View.extend({
		tagName : 'div',

		events : {
			'click .replyComment': 'replyComment',
			'click .replyCommentBut': 'replyBut'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'replyComment', 'replyBut');
		},

		render : function(){
			this.template = _.template(TemplateView.DocCommentItemHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			this.replyInputHTML = '<form class="form-horizontal" role="form">'+
									'<div class="replyItem form-group publishMyReply" style="margin-bottom:15px;">'+
										'<div class="col-sm-11">'+
											'<input type="text" class="form-control newReply" placeholder="请输入回复" />'+
										'</div>'+
									    '<div class="col-sm-1">'+
											'<button class="btn btn-info replyCommentBut">回复</button>'+
										'</div>'+
								    '</div>'+
								  '</form>';

			return this;
		},

		replyBut : function(event){
			var Obj = event.currentTarget;
			var commentId = $(Obj).attr('data-replyId');
			var newComment = $('.newReply', this.el).val();
			if(!newComment || newComment.trim() == '回复:'){
				$('.newReply', this.el).focus();
				return false;
			}
			var comment = new Comment({
				reply_to_id : commentId,
				publishDate : getDateStr(),
				publisherId:this.model.get('userId'),
				publisher : this.model.get('username'),
				comment : newComment
			});
			var me = this;
			$.post('/LR/saveComment', {comment: JSON.stringify(comment.toJSON())}, function(result){
				if(result.success){
					$('.newReply', me.el).val('回复'+$('#publisher', me.this).text()+':');
					comment.set({id: result.data});
					var docReplyItemView = new DocReplyItemView({model: comment});
					$('.publishMyReply', me.el).after(docReplyItemView.render().el);

					var replyLength = $('.replyComment', me.el).find('label').eq(0).text();
					$('.replyComment', me.el).find('label').eq(0).text(Number(replyLength)+1);
					console.log('save reply success!');
				}else{
					console.log('save reply fails!');
				}
			});
			return false;
		},

		replyComment : function(event){
			var userId = this.model.get('userId'), username = this.model.get('username');
			/*if(!username || username.trim() == ''){
				alert('您还未登陆，不能回复！');
				return false;
			}*/
			var replyItem = $('.replyItem', this.el);
			if(replyItem && replyItem.length > 0){
				replyItem.remove();
			}else {
				$(this.el).append(this.replyInputHTML);
				var obj = event.currentTarget;
				var replyTo = $(obj).attr('data-replyId');
				$('.replyCommentBut', this.el).attr('data-replyId', replyTo);
				$('.newReply', this.el).val('回复'+$('#publisher').text()+':');
				$('.newReply', this.el).focus();
				var me = this;
				$.get('/LR/getComments', {query: {reply_to_id: replyTo}}, function (data) {
					if (data && data.length > 0) {
						$(obj).find('label').eq(0).text(data.length);
						_.each(data, function (item) {
							var commentModel = new Comment(item);
							var docReplyItemView = new DocReplyItemView({model: commentModel});

							$('.publishMyReply', me.el).after(docReplyItemView.render().el);
						});
					}
				});
			}
		}
	});

	//回复item
	var DocReplyItemView = Backbone.View.extend({
		tagName : 'div',
		className : 'replyItem',
		attributes : {
			style : "margin-left:5%;",
			background:'#000'
		},
		initialize : function(){
			_.bindAll(this, 'render');
		},

		render : function(){
			//$(this.el).append(TemplateView.DocCommentItemHTML);
			var DocReplyItemHTML =  '<ul class="nav nav-pills">'+
											'<li>'+
												'<div>'+
													'<a href="#" target="_blank">'+
														'<img class="avatar" src="http://himg.bdimg.com/sys/portraitn/item/62ba636169737579613838303131319b72">'+
													'</a>'+
												'</div>'+
											'</li>'+
											'<li style="margin-left: 10px;width:90%;">'+
												'<div>'+
													'<p>'+
														'<a id="publisher" href="#" target="_blank"><%=publisher%></a>'+
														'<span style="float:right;">发表日期：<%=new Date(publishDate).toLocaleString()%></span>'+
													'</p>'+
													'<div>'+
													'<p><%=comment%></p>'+
													'</div>'+
												'</div>'+
											'</li>'+
										'</ul>'+
										'<hr />';
				this.template = _.template(DocReplyItemHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);

			return this;
		}
	});

	//评论集，组织评论item
	var DocCommentsView = Backbone.View.extend({
		id : 'doc-comment-items',

		events : {

		},

		initialize : function(){
			_.bindAll(this, 'render', 'removeSelf');
		},

		render : function(){
			var resultList = this.collection.models;
			$(this.el).append('<h4 style="margin-top:35px;"><strong>用户评论</strong><label >('+Query.get('totalRecords')+')</label></h4><hr />');
			//var docCommentItemView = new DocCommentItemView();
			//$(this.el).append(docCommentItemView.render().el);
			var me = this;
			 _.each(resultList, function(item){
				 var docCommentItemView = new DocCommentItemView({model: item});
				 $(me.el).append(docCommentItemView.render().el);
			 });
			return this;
		},

		removeSelf : function(){
			$(this.el).remove();
		}
	});

	//相关文档
	var RelatedDocumentsView = Backbone.View.extend({
		tagName : 'div',

		events : {

		},

		initialize : function(){
			_.bindAll(this, 'render');
		},

		render : function(){
			$(this.el).append(TemplateView.RelatedDocumentsHTML);
			return this;
		}
	});

	//推荐资料
	var RecommentDocumentsView = Backbone.View.extend({
		tagName : 'div',

		events : {

		},

		initialize : function(){
			_.bindAll(this, 'render');
		},

		render : function(){
			$(this.el).append(TemplateView.RecommentDocumentsHTML);
			return this;
		}
	});

	//主视图，组织各个子视图
	var APPView = Backbone.View.extend({
		initialize : function(){
			_.bindAll(this, 'render', 'writeItem', 'getDevidedList', 'reLoad');
			this.listenTo(CommentCollection, 'addComment', this.writeItem);
			this.listenTo(CommentCollection, 'reset', this.writeItem);
			this.listenTo(Query, 'change', this.writeItem);
			this.model = new Material();
			this.searchInputView = new SearchInputView();
			this.relatedDocumentsView = new RelatedDocumentsView();
			this.recommentDocumentsView = new RecommentDocumentsView();
			this.pageMaterialsList = new CommentsCollection();//分页collection

			this.render();
		},

		render : function(){
			var me = this;
			$('#keyWords-searchInput').append(this.searchInputView.render().el);
			$('#related-documents').append(this.relatedDocumentsView.render().el);
			$('#recommend-documents').append(this.recommentDocumentsView.render().el);

			var url = window.location.search;
			if(url && url.indexOf('?') != -1){
				var param = url.substr(1);
				var paramsArr = param.split('=');
				console.log(paramsArr);
				$.get('/load/searchLearningRes', {materialsId : paramsArr[1]}, function(data){
					if(data && data.success){
						var result = data.data
						console.log(result[0]);
						me.model.set(result[0],{silent:true});
					}

					me.docContentsView = new DocContentsView({model: me.model});
					me.docPublisher = new DocPublisherView({model: me.model});
					me.addCommentView = new AddCommentView({model: me.model});
					me.docPlayerView = new DocPlayerView({model: me.model});
					$('#doc-contents').append(me.docContentsView.render().el);
					$('#doc-publisher').append(me.docPublisher.render().el);
					$('#add-comment').append(me.addCommentView.render().el);
					$('#doc-main', '#doc-contents').append(me.docPlayerView.render().el);

					if(me.docPlayerView.isVideo && me.docPlayerView.isVideo.trim() != '' && me.docPlayerView.isVideo.trim() != 'undefined') {
						me.docPlayerView.playVideo();
					}
					$.get('/LR/getComments', {query:{reply_to_id : $('#doc-top').find('p').eq(0).attr('data-material-id')}}, function(data){
						if(data && data.length > 0) {
							var counts =data.length;
							var size = Math.ceil(counts / Query.get('recordsSize'));
							Query.set({totalRecords: counts, totalPage: size, startPage: 1, endPage: size}, {silent: true});
							CommentCollection.set(data);
						}else {
							Query.set({totalRecords: 0, totalPage: 0, startPage: 1, endPage: Query.get('totalPage')}, {silent: true});
							CommentCollection.set(null);
						}
						me.getDevidedList();
						/*
						 me.docCommentsView = new DocCommentsView({collection: CommentCollection});
						$('#doc-comments').append(this.docCommentsView.render().el);
						*/
					});

				});
			}
			
		},

		writeItem : function(){
			if(this.docCommentsView) {
				this.docCommentsView.removeSelf();
			}
			if(this.bottomPageView){
				this.bottomPageView.removeSelf();
			}
			//$('#doc-comment-items')[0].innerHTML = '';
			this.getDevidedList();
			/*
			this.docCommentsView = new DocCommentsView({collection: CommentCollection});
			$('#doc-comments').append(this.docCommentsView.render().el);
			*/
		},

		getDevidedList : function(){
			//处理分页list
			var totalLength = CommentCollection.length;
			if(totalLength > 0) {
				var start = (Query.get('currentPage') - 1) * Query.get('recordsSize');
				var end = start + Query.get('recordsSize');
				if(end > totalLength)
					end = totalLength;
				this.pageMaterialsList.reset(CommentCollection.slice(start, end));

				if (this.pageMaterialsList.length > 0) {
					this.docCommentsView = new DocCommentsView({collection: this.pageMaterialsList});
					$('#doc-comments').append(this.docCommentsView.render().el);

					this.bottomPageView = new PageView({model: Query});
					$('#doc-comment-items').append(this.bottomPageView.render(PageTemplateView.PageHTML).el);
				}
			}
		},

		reLoad : function(data){
			//处理page
			Query.set({currentPage : 1, startPage: 1, endPage: Query.get('totalPage')}, {silent: true});
			this.writeItem();
		}

	});

	var appView = new APPView();

	function getDateStr(){
		var date = new Date();
		var month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
		var day = date.getDate()<10 ? ('0'+date.getDate()) : date.getDate();
		var hour = date.getHours()<10 ? ('0'+date.getHours()) : date.getHours();
		var minutes = date.getMinutes()<10 ? ('0'+date.getMinutes()) : date.getMinutes();
		var seconds = date.getSeconds()<10 ? ('0'+date.getSeconds()) : date.getSeconds();

		var dateStr = date.getFullYear() + "/" + month + "/" + day + " " +
			hour + ":" + minutes + ":" + seconds;

		return dateStr;
	}
})(jQuery);