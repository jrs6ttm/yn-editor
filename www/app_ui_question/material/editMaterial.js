(function($){
	var templateHTML = {
		EditHTML :  '<div class="panel panel-default">'+
						'<div class="panel-heading">'+
							'<span style="margin-left: 45%;"><strong><font size="5">编辑资料</font></strong><span>'+
							'<!--<a href="/searchMaterials" class="btn btn-info animate" role="button" style="float:right;">搜索资料</a>-->'+
						'</div>'+
						'<div class="panel-body">'+
							'<ul class="nav nav-tabs nav-justified" style="margin-bottom:30px;">'+
								'<li class="active myTabsLi" data-tab = "tab1"><a href="javascript:void(0);">基本信息</a></li>'+
								'<li class="myTabsLi" data-tab = "tab2"><a href="javascript:void(0);">其他信息</a></li>'+
							'</ul>'+
							'<div class="myTabsDiv tab1">'+
								'<form class="form-horizontal" role="form" style="margin-left:-3%;margin-right:10px;">'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label">编辑方式: </label>'+
										'<div class="radio col-sm-10">'+
											'<label style="margin-right: 50px;" ><input type="radio" name="editType" class="editType" value="0" checked="checked" />已有资料, 上传</label>'+
											'<label><input type="radio" name="editType" class="editType" value="1" />还没资料, 在线编辑</label>'+
										'</div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label" for="name">资料名:</label>'+
										'<div class="col-sm-8">'+
											'<input type="text" class="form-control" id="LRTitle" placeholder="请输入资料名" />'+
										'</div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label">关键词:</label>'+
										'<div class="col-sm-10 keywords"></div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label"></label>'+
										'<div class="col-sm-8">'+
											'<input type="text" class="form-control setKeyword"  placeholder="请输入关键词" />'+
										'</div>'+
										'<div class="col-sm-2">'+
											'<button type="button" class="btn btn-info btn-sm keywordBtn">确定</button>'+
										'</div>'+
									'</div>'+
									'<div class="form-group" style="display:block" id="uploadTypeId">'+
										'<label class="col-sm-2 control-label" for="myFile">选择资料:</label>'+
										'<div class="col-sm-10">'+
											'<input type="file" id="myFile">'+
										'</div>'+
									'</div>'+
									'<div class="form-group" style="display:none" id="editTypeId">'+
										'<label class="col-sm-2 control-label">编辑资料:</label>'+
										'<div class="col-sm-10">'+
											'<div id="editTool"></div>'+
										'</div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label" for="description">描述:</label>'+
										'<div class="col-sm-8">'+
											'<textarea id="description" class="form-control" cols="50%" rows="3" placeholder="请输入描述信息"></textarea>'+
										'</div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label">适用用户: </label>'+
										'<div class="radio col-sm-10">'+
											'<label><input type="radio" name="toUser" value="1" checked="checked"/> 新手&nbsp;&nbsp;</label>'+
											'<label><input type="radio" name="toUser" value="2" /> 生手&nbsp;&nbsp;</label>'+
											'<label><input type="radio" name="toUser" value="3" /> 熟手&nbsp;&nbsp;</label>'+
											'<label><input type="radio" name="toUser" value="4" /> 高手&nbsp;&nbsp;</label>'+
											'<label><input type="radio" name="toUser" value="5" /> 能手&nbsp;&nbsp;</label>'+
										'</div>'+
									'</div>'+
								'</form>'+
							'</div>'+
							'<div class="myTabsDiv tab2" style="display:none;margin-bottom:25px;">'+
								'<form class="form-horizontal" role="form" style="margin-left:-3%;margin-right:10px;">'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label">难度：</label>'+
										'<div class="col-sm-3">'+
											'<select class="form-control" name="difficulty">'+
												'<option value="">-- 不限 --</option>'+
												'<option value="very-easy">非常容易</option>'+
												'<option value="easy">容易</option>'+
												'<option value="medium">适中</option>'+
												'<option value="difficult">困难</option>'+
												'<option value="very-difficult">非常困难</option>'+
											'</select>'+
										'</div>'+
										'<label class="col-sm-2 control-label">适用年龄：</label>'+
										'<div class="col-sm-3">'+
											'<select class="form-control" name="typicalAgeRange">'+
												'<option value="">-- 不限 --</option>'+
												'<option value="baby">婴幼儿</option>'+
												'<option value="child">儿童</option>'+
												'<option value="teenager">青少年</option>'+
												'<option value="middle-age">中年</option>'+
												'<option value="old-age">老年</option>'+
											'</select>'+
										'</div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label">资源语言：</label>'+
										'<div class="col-sm-3">'+
											'<select class="form-control" name="language">'+
												'<option value="zh">中文</option>'+
												'<option value="en">英文</option>'+
											'</select>'+
										'</div>'+
										'<label class="col-sm-2 control-label">资源状态：</label>'+
										'<div class="col-sm-3">'+
											'<select class="form-control" name="status">'+
												'<option value="draft">草稿</option>'+
												'<option value="final">完成</option>'+
												'<option value="revised">修改</option>'+
												'<option value="unavailable">不可用</option>'+
											'</select>'+
										'</div>'+
									'</div>'+
									'<div class="form-group">'+
										'<label class="col-sm-2 control-label">资源类型：</label>'+
										'<div class="col-sm-3">'+
											'<select class="form-control" name="learningResourceType">'+
												'<option value="exercise">练习</option>'+
												'<option value="simulation">模拟</option>'+
												'<option value="questionnaire">问卷</option>'+
												'<option value="diagram">示意图</option>'+
												'<option value="graph">图表</option>'+
												'<option value="index">索引</option>'+
												'<option value="slide">幻灯片</option>'+
												'<option value="table">表格</option>'+
												'<option value="narrative-text" selected="selected">文本/档</option>'+
												'<option value="exam">考试</option>'+
												'<option value="experiment">实验</option>'+
												'<option value="problemStatement">问题陈述</option>'+
												'<option value="selfAssessment">自我评估</option>'+
											'</select>'+
										'</div>'+
										'<label class="col-sm-2 control-label">资源结构：</label>'+
										'<div class="col-sm-3">'+
											'<select class="form-control" name="structure">'+
												'<option value="atomic">原子</option>'+
												'<option value="collection">集合</option>'+
												'<option value="mixed">混合</option>'+
												'<option value="linear">线性</option>'+
												'<option value="hierarchical">层级</option>'+
												'<option value="networked">网状</option>'+
												'<option value="branched">分支</option>'+
												'<option value="parceled">打包</option>'+
											'</select>'+
										'</div>'+
									'</div>'+

								'</form>'+
							'</div>'+
						'</div>'+
						'<div class="panel-footer" align="right">'+
							'<button type="button" class="btn btn-info animate" id="okBut" disabled="disabled">确定</button>&nbsp;&nbsp;'+
							'<img src="images/wait.jpg" width="45px;" style="display:none"/>'+
						'</div>'+
					'</div>'
	};
	var learningResourceView = Backbone.View.extend({
		className : 'container',
		attributes : {
			style : "padding: 50px 50px 10px"
		},

		events:{
			'click .editType' : 'editType',
			'click .myTabsLi': 'switchTab',
			'click .keywordBtn':'setKeyword',
			'click .cancelKeyword': 'cancelKeyword',
			'click #okBut' : 'submitForm',
			'change #myFile' : 'setFilename'
		},

		initialize: function(){
			_.bindAll(this, 'render');

			this.render();
		},

		render : function(){
			$('body').append(this.el);

			$(this.el).append(templateHTML.EditHTML);
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

		setKeyword : function(){
			var keyword = $('.setKeyword', this.el).val(), isRepeat = false;
			if(!keyword || keyword.trim() == ''){
				$('.setKeyword', this.el).focus();
				return false;
			}
			var keywordsHTML = $('.keywords', this.el).find('button');
			if(keywordsHTML.length >= 5){
				alert('最多只能添加5个关键词！');
				return false;
			}
			keywordsHTML.each(function(){
				var currValue = $(this).attr('data-value');
				if(currValue == keyword.trim()){
					alert('此关键词已存在！');
					isRepeat = true;
					return false;
				}
			});
			if(isRepeat){
				return false;
			}

			var kHTML = '<button type="button" class="btn btn-default btn-sm" data-value="'+keyword.trim()+'" style="text-decoration:none;cursor:default;margin-left:4px;">'+
							keyword.trim()+'&nbsp;&nbsp;<span class="cancelKeyword" style="text-decoration:none;cursor:pointer;;">x</span>'+
						'</button>';
			$('.keywords', this.el).append(kHTML);
			$('.setKeyword', this.el).val('');
		},

		cancelKeyword : function(event){
			var currObj = event.currentTarget;
			$(currObj, this.el).parent().remove();
		},

		setFilename : function(event){
			var obj = event.currentTarget;
			var fileInput =$(obj);
			var fileText = fileInput.val();
			if(!fileText || fileText.trim() == ''){
				$('#LRTitle').val('');
				$('#okBut').attr('disabled', true);
			}else{
				var files = fileInput[0].files;
				var fileName = files[0].name;
				var is = fileName.lastIndexOf('.');
				if(is == -1){
					alert('资料格式不正确!');
					return false;
				}else{
					//过滤文件类型
					var testFileType = fileName.substring(is+1);
					if(AllowFileType.hasOwnProperty(testFileType.toLowerCase())) {
						$('#LRTitle').val(fileName);
						$('#okBut').attr('disabled', false);
					}else{
						alert('抱歉，系统暂不支持'+testFileType+'格式的资料，您可以转换为其他格式再上传~');
						return false;
					}
				}
			}

		},

		editType : function(event){
			var Obj = event.currentTarget;
			var type = $(Obj).attr('value');

			if(type == '0'){//上传
				$('#uploadTypeId').css('display', 'block');
				$('#editTypeId').css('display', 'none');
				$('#okBut').attr('disabled', true);
			}else{//在线编辑

				tinymce.init({
								selector: "#editTool"
							});
				$('#editTypeId').css('display', 'block');
				$('#uploadTypeId').css('display', 'none');
				$('#okBut').attr('disabled', false);
			}
		},

		submitForm : function(){
			var me = this;
			var material = new Material();
			var editType = $('input[name="editType"]:checked').val();

			var formData = new FormData();
			if(editType == '0'){
				material.set({isCreated : 'NO'});
				var fileInput =$('#myFile');
				var fileText = fileInput.val();
				if(!fileText || fileText.trim() == ''){
					alert('请先上传资料!');
					return false;
				}

				var files = fileInput[0].files;
				var file = files[0];
				formData.append("file",file);
			}else{
				material.set({isCreated : 'YES'});
				var richText = tinymce.get('editTool').getContent();
				if(!richText || richText.trim() == ''){
					alert('请编辑内容!');
					return false;
				}

				formData.append("fileStr",richText);
			}

			var LRTitle = $('#LRTitle').val();
			if(!LRTitle || LRTitle.trim() == ''){
				$('#LRTitle').focus();
				return false;
			}
			$("#okBut").attr("disabled", "disabled");
			$('img').css('display', 'inline');

			var toUser = $('input[name="toUser"]:checked').val();
			var description = $('#description').val();
			var keyword = [];
			$('.keywords', me.el).find('button').each(function(){
				keyword.push($(this).attr('data-value'));
			});
			var difficulty = $('select[name = "difficulty"]', this.el).val();
			var typicalAgeRange = $('select[name = "typicalAgeRange"]', this.el).val();
			var language = $('select[name = "language"]', this.el).val();
			var status = $('select[name = "status"]', this.el).val();
			var learningResourceType = $('select[name = "learningResourceType"]', this.el).val();
			var structure = $('select[name = "structure"]', this.el).val();
			material.set({toUser : toUser, description: description,
				keyword:keyword,
				difficulty:difficulty,typicalAgeRange:typicalAgeRange,
				language:language,status:status,
				learningResourceType:learningResourceType,
				structure:structure,
				readTimes : 0,
				downloadTimes : 0,
				praiseTimes : 0
			});

			var xhr = new XMLHttpRequest(), path = resourceServerHost+'OfficeHandler';
			xhr.open('post', path, true);
			xhr.onload = function(e){
				$("#okBut").attr("disabled", false);
				$('img').css('display', 'none');
				if(this.status == 200){
					var result = this.response;
					if(result == 'error'){
						alert('资料编辑失败!');
						return false;
					}
					if(result == 'type_error'){
						alert('资料格式不支持!');
						return false;
					}
					result = JSON.parse(result);
					material.set({sourceF : result.sourceF, fileName: LRTitle, transformF : result.transformF,
						fileType: result.fileType, materialsId: result.materialsId, size : result.fileSize, isStatic: result.isStatic});

					if(result.videoImagePath)
						material.set({videoImagePath:result.videoImagePath});
					$.post('/save/saveLearningRes', material.toJSON(), function(data){
						if(data && data.success){
							me.el.innerHTML = '';
							$(me.el).append(templateHTML.EditHTML);
						}

					});
				}
			}
			xhr.send(formData);
		}

	});

	var lrv = new learningResourceView();

})(jQuery);
