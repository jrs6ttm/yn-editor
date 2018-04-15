/**
 * @type {string}
 */
var Fill_In_Blank_QPanel =
		'<div class="panel panel-default toAddQPanel">'+
			   '<div class="panel-heading" align="center">'+
				  '<h2 class="panel-title">编辑<%=itemType%><input type="hidden" id="questionId"></h2>'+
			   '</div>'+
			   '<div class="panel-body">'+
					'<ul class="nav nav-tabs nav-justified" style="margin-bottom:25px;">'+
						'<li class="active myTabsLi" data-tab = "tab1"><a href="javascript:void(0);">题目基本设置</a></li>'+
						'<li class="myTabsLi" data-tab = "tab2"><a href="javascript:void(0);">分数设置</a></li>'+
					'</ul>'+
					'<div class="myTabsDiv tab1">'+
						'<label>编辑问题描述:</label>'+
						'<div class="row">'+
							'<div class="col-md-10">'+
								'<div class="fillInBlankItem"></div>'+
								'<div class="toFillInBlankItem" style="display: block;" >'+
									'<textarea  class="form-control questionDes"  rows="5" placeholder="请输入问题描述"><%=itemDescription%></textarea>'+
								'</div>'+
							'</div>'+
							'<div class="col-md-2">'+
								'<button type="button"  class="btn btn-info btn-sm edit-blank-btn" style="margin-bottom:10px;">编辑题目</button>'+
								'<button type="button"  class="btn btn-default btn-sm set-blank-btn" style="margin-bottom:10px;">设置填空</button>'+
							'</div>'+
						'</div>'+

						'<hr />'+
						'<div style="margin-top: 8px;">'+
						   '<p>参考答案：</p>'+
						   '<label>'+
							 '<input type="checkbox" name="eChoiceAllItem">选择'+
						   '</label>'+
						   '<button type="button" id="cancel-btn" style="float:right;" class="btn btn-default btn-sm cancelBlankBtn">取消填空</button>'+
						'</div>'+

					   '<table class="table mySelectionTable">'+
						'<%if(blankCollection && blankCollection.length > 0){%>'+
							'<%_.each(blankCollection, function(blankItem){%>'+
								'<tr id="answer-<%=blankItem.blankId%>">'+
									'<td>'+
										'<div class="row">'+
											'<div class="col-sm-2">'+
												'<input type="checkbox" name="selectionItem" />'+
												'<label class="control-label" style="float:right;"><%=blankItem.blankId%>. </label>'+
											'</div>'+
											'<div class="col-sm-8">'+
												'<input type="text" class="form-control mySelectionContents" placeholder="请输入选项" value="<%=blankItem.blankValue%>"/>'+
											'</div>'+
											'<label  class="col-sm-2 control-label">'+
												'<span class="glyphicon glyphicon-remove cancelBlankSpan" style="cursor: pointer;" title="取消填空">取消</span>'+
											'</label>'+
										'</div>'+
										'<div class="row">'+
											'<label class="col-sm-2"></label>'+
											'<div class="col-sm-8">'+
												'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
												'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"><%=blankItem.feedback%></textarea>'+
											'</div>'+
										'</div>'+
									'</td>'+
								'</tr>'+
							'<%});%>'+
						'<%}%>'+
					   '</table>'+
					'</div>'+
					'<div class="myTabsDiv tab2" style="display:none;margin-bottom:25px;">'+
						'<div class="row" style="margin-bottom:10px;">'+
							'<label  class="col-sm-3" align="center">每项正确得分：</label>'+
							'<div class="col-sm-3" style="margin-left:-5%;">'+
								'<input type="number"  class="form-control" id="tab2_score" placeholder="请输入分数" value="3"/>'+
							'</div>'+
							'<label  class="col-sm-3" align="center">每项错误扣分：</label>'+
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
					'<button type="button" class="btn btn-info btn-sm saveExamItem" disabled="disabled" style="margin-right: 5%;">确 定</button>'+
					'<button type="button" class="btn btn-default btn-sm cancel_addExamItem" style="margin-right: 5%;">取 消</button>'+
			   '</div>'+
			'</div>';

	var FillInBlankPanelView = Backbone.View.extend({

		events: {
			'click .myTabsLi': 'switchTab',
			'click .edit-blank-btn': 'editFillInBlank',
			'click .set-blank-btn': 'setFillInBlank',
			'click #make-blank': 'makeBlank',
			'click #cancel-blank': 'cancelBlank',
			'click .cancelBlankSpan': 'cancelBlank',
			'click .cancelBlankBtn': 'cancelBlank',
			'click .feedbackSpan': 'feedbackOpt',

			'click input[name="eChoiceAllItem"]': 'isCheckAll',
			'click .saveExamItem' : 'saveExamItem',
			'click .cancel_addExamItem' : 'cancel_addExamItem'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'addToolTip', 'isCheckAll',  'saveExamItem', 'cancel_addExamItem','getExamItem');
			this.template = _.template(Fill_In_Blank_QPanel);
		},

		render : function(){
			$(this.el).append(this.template(this.model.toJSON()));
			this.addToolTip();

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

		addToolTip: function(){
			var me = this;
			$(".fillInBlankItem", this.el).mouseup(function (e) {

				var x = e.pageX + 10 - $('.workspace').offset().left;
				var y = e.pageY + 20 - $('.workspace').offset().top;

				var selection = null;
				if (document.selection) {
					// selection = document.selection.createRange().text;
					selection = document.selection;
				}else if (window.getSelection()) {
					selection = window.getSelection();
				}
				if (selection && selection != '') {
					me.startOffset = selection.anchorOffset;
					me.endOffset = selection.extentOffset;
					me.selection = selection;

					var selectText = ''+selection, tooltip='';
					if(selectText.match(/_(\d+)_/)){
						tooltip =
							'<div id="tooltip" style="top:'+y+'px;left:'+x+'px;position:absolute;z-index:10;">'+
								'<a href="javascript:void(0);" id="cancel-blank">取消填空</a>'+
							'</div>';
					}else {
						tooltip =
							'<div id="tooltip" style="top:'+y+'px;left:'+x+'px;position:absolute;z-index:10;">' +
								'<a href="javascript:void(0);" id="make-blank">设为填空</a>' +
							'</div>';
					}
					$(me.el).append(tooltip);
					/*
					$("#tooltip", me.el).css({
						"top":  y + "px",
						"left": x + "px",
						"position": "absolute"
					}).show("fast");*/
				}
			}).mousedown(function () {
				$("#tooltip", me.el).remove();
			});
		},

		feedbackOpt: function(event){
			var obj = event.currentTarget;
			var currFeedbackArea = $(obj).parent().find('textarea').eq(0), arrowSpan = $(obj).parent().find('span').eq(0);
			var status = $(currFeedbackArea).css('display');
			if(status == 'block'){
				status = 'none';
				$(arrowSpan).removeClass('glyphicon-chevron-down');
				$(arrowSpan).addClass('glyphicon-chevron-up');
			}else{
				status = 'block';
				$(arrowSpan).removeClass('glyphicon-chevron-up');
				$(arrowSpan).addClass('glyphicon-chevron-down');
			}
			$(currFeedbackArea).css('display', status);
		},

		isCheckAll : function(event){
			var obj = event.currentTarget;
			var status = $(obj)[0].checked;
			var selectedItem = $('input[name="selectionItem"]', this.el);

			if(status){
				$.each(selectedItem, function(index, element){
					$(element)[0].checked = true;
				});
			}else{
				$.each(selectedItem, function(index, element){
					$(element)[0].checked = false;
				});
			}
		},

		editFillInBlank: function (){
			var text = $('.fillInBlankItem', this.el).text();
			if(text && text.trim() != ''){
				$('.questionDes', this.el).val(text);
			}

			$('.questionDes', this.el).focus();

			$(".edit-blank-btn", this.el).removeClass('btn-default');
			$(".edit-blank-btn", this.el).addClass('btn-info');

			$(".set-blank-btn", this.el).removeClass('btn-info');
			$(".set-blank-btn", this.el).addClass('btn-default');

			$(".saveExamItem" , this.el).attr('disabled', true);//编辑状态下禁用确定按钮

			$('.fillInBlankItem', this.el).css('display', 'none');
			$('.toFillInBlankItem', this.el).css('display', 'block');
		},

		setFillInBlank: function (){
			var value = $('.questionDes', this.el).val();
			if(!value || value.trim() == ''){
				$('.questionDes', this.el).focus();
				return false;
			}

			$('.fillInBlankItem', this.el).text(value);

			$(".set-blank-btn", this.el).removeClass('btn-default');
			$(".set-blank-btn", this.el).addClass('btn-info');

			$(".edit-blank-btn", this.el).removeClass('btn-info');
			$(".edit-blank-btn", this.el).addClass('btn-default');

			$(".saveExamItem" , this.el).attr('disabled', false);//编辑状态下禁用确定按钮

			$('.fillInBlankItem', this.el).css('display', 'block');
			$('.toFillInBlankItem', this.el).css('display', 'none');
		},

		makeBlank : function() {
			var selection = ''+this.selection;
			if (selection.trim() != '') {
				var startOffset = this.startOffset;
				var endOffset = this.endOffset;
				var text = $('.fillInBlankItem', this.el).text();
				//selectText = text.substring(startOffset, endOffset);

				if(startOffset<0||startOffset>=text.length||text.length==0){
					alert(mxResources.get('invalidParameters'));
				}
				if(endOffset<0||endOffset>text.length||text.length==0){
					alert(mxResources.get('invalidParameters'));
				}
				var iBeginPos= 0, iEndPos=text.length, readyToUpdateNum = 1, startAfterChange = 0;
				var sFrontPart=text.substring(iBeginPos,startOffset);
				var sTailPart=text.substring(endOffset,iEndPos);

				var sFrontPartNum = sFrontPart.match(/__(\d+)__/g);
				if(sFrontPartNum && sFrontPartNum.length > 0){
					var aaa = sFrontPartNum[sFrontPartNum.length-1];
					readyToUpdateNum = Number(aaa.charAt(2))+1;
				}

				var newChar = '__'+readyToUpdateNum+'__';

				var answer =
					'<tr id="answer-'+readyToUpdateNum+'">'+
						'<td>'+
							'<div class="row">'+
								'<div class="col-sm-2">'+
									'<input type="checkbox" name="selectionItem" />'+
									'<label class="control-label" style="float:right;">'+readyToUpdateNum+'. </label>'+
								'</div>'+
								'<div class="col-sm-8">'+
									'<input type="text" class="form-control mySelectionContents" placeholder="请输入选项" value="'+selection+'"/>'+
								'</div>'+
								'<label  class="col-sm-2 control-label">'+
									'<span class="glyphicon glyphicon-remove cancelBlankSpan" style="cursor: pointer;" title="取消填空">取消</span>'+
								'</label>'+
							'</div>'+
							'<div class="row">'+
								'<label class="col-sm-2"></label>'+
								'<div class="col-sm-8">'+
									'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
									'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"></textarea>'+
								'</div>'+
							'</div>'+
						'</td>'+
					'</tr>';

					var bbb = sTailPart.match(/__(\d+)__/g);
					if(bbb && bbb.length > 0){
						//要逆序操作
						for(var i=bbb.length-1; i>-1; i--){
							var num = bbb[i].charAt(2), tr_id='#answer-'+Number(num);
							startAfterChange = Number(num)+1;
							$(tr_id, this.el).find('label').eq(0).text(startAfterChange+'.');
							$(tr_id, this.el).attr('id', 'answer-'+startAfterChange);
							sTailPart = sTailPart.replace('__'+num+'__', '__'+startAfterChange+'__');
						}
					}

				var sRet=sFrontPart+newChar+sTailPart;
				$('.fillInBlankItem', this.el).text(sRet);

				var answerSum = $('.mySelectionTable', this.el).find('tr').length;
				if(answerSum == 0){//第一个填空
					$('.mySelectionTable', this.el).append(answer);
				}else if(answerSum > 0){
					if(readyToUpdateNum == 1){//已有填空，新填空插在第一位置
						$('#answer-2', this.el).before(answer);
					}else{//已有填空，新填空插在其他位置
						$('#answer-'+(readyToUpdateNum-1), this.el).after(answer);
					}
				}

				$("#tooltip", this.el).remove();

				this.selection = '';
				//return sRet;
			}else{
				alert("请选中需要设为填空的文本");
			}
		},

		cancelBlank : function(event){
			var obj = event.currentTarget;
			var objClass = $(obj).attr('class');
			console.log(objClass);
			if(!objClass){//右键取消填空
				var selection = ''+this.selection;
				if (selection.trim() != '') {
					var aaa = selection.match(/__(\d+)__/g);
					this.cancelBlankOpt(aaa);
					this.selection = '';
				}
			}else{//点击取消填空
				var objId = $(obj).attr('id');
				var readyToCancel = [];
				if(objId && objId == 'cancel-btn'){//选择删除
					var selectedItem = $('input[name="selectionItem"]:checked', this.el);
					if(!selectedItem.length){
						alert("请选择要删除的选项!");
						return false;
					}

					_.each(selectedItem, function(item){
						var obj_tr = $(item).parent().parent().parent().parent();
						var tr_id = $(obj_tr).attr('id');
						var tempArr = tr_id.split('-');
						var blank_number = tempArr[1];
						readyToCancel.push('__' + blank_number + '__');
					});
				}else {//单一删除
					var obj_tr = $(obj).parent().parent().parent().parent();
					var tr_id = $(obj_tr).attr('id');
					var tempArr = tr_id.split('-');
					var blank_number = tempArr[1];
					readyToCancel.push('__' + blank_number + '__');

				}

				this.cancelBlankOpt(readyToCancel);

				var selectedItem = $('input[name="selectionItem"]:checked', this.el);
				if(!selectedItem.length){
					$('input[name="eChoiceAllItem"]', this.el)[0].checked = false;
				}
			}
		},

		cancelBlankOpt : function(blank){
			var text = '';
			if($('.fillInBlankItem', this.el).css('display') == 'block') {//设置填空状态下做删除
				text = $('.fillInBlankItem', this.el).text();
			}else {//编辑问题状态下做删除
				text = $('.questionDes', this.el).text();
			}

			if(blank && blank.length > 0) {
				_.each(blank, function(item){//取消指定填空，影响后面的填空序号
					var num = item.charAt(2), tr_id='#answer-'+Number(num);
					var value = $(tr_id, this.el).find('input').eq(1).val();
					text = text.replace('__'+num+'__', value.trim());
					$(tr_id, this.el).remove();
				});

				//对取消填空的后面部分的填空的序号进行更改
				var readyToUpdateNum = Number(blank[0].charAt(2)) +blank.length, firstText='', lastText='';
				var num = text.indexOf('__'+readyToUpdateNum+'__');
				if(num != -1){
					firstText = text.substring(0, num);
					lastText = text.substring(num, text.length);

					var bbb = lastText.match(/__(\d+)__/g);
					if(bbb && bbb.length > 0){
						var startAfterChange = blank[0].charAt(2);
						_.each(bbb, function(item){
							var num = item.charAt(2), tr_id='#answer-'+Number(num);
							$(tr_id, this.el).find('label').eq(0).text(startAfterChange+'.');
							$(tr_id, this.el).attr('id', 'answer-'+startAfterChange);
							lastText = lastText.replace('__'+num+'__', '__'+startAfterChange+'__');
							startAfterChange++;
						});

						text = firstText + lastText;
					}
				}

				if($('.fillInBlankItem', this.el).css('display') == 'block') {
					$('.fillInBlankItem', this.el).text(text);
				}else {
					$('.questionDes', this.el).val(text);
				}

				$("#tooltip", this.el).remove();
			}
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
									//var examItemView = new FillInBlankItemView({model: examItemModel});
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
									//var examItemView = new FillInBlankItemView({model: examItemModel});
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
				itemType: "FILL_IN_BLANK",
				itemDescription: "",
				itemPosition: 1,
				weight:0,
				difficultyDegree:0,
				rightAnswer:[],
				blankCollection:[]
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

			var tArea = $(".fillInBlankItem", this.el).text();
			if(!tArea || tArea.trim() == ""){
				var tArea_Edit = $(".questionDes", this.el).val();
				if(!tArea_Edit || tArea_Edit.trim() == ""){
					//alert("请输入问题描述!");
					this.switchTabOpt('tab1');
					$(".questionDes", this.el).focus();
					return false;
				}
			}

			item.itemDescription = tArea;

			item.blankCollection = [];
			var itemType = this.model.get('itemType'), currElementValue='', me = this;
			$(".mySelectionContents", this.el).each(function(index, element){
				currElementValue = $(element, me.el).val();
				if(!currElementValue || currElementValue.trim() == ""){
					//alert("您有未输入的选项描述!");
					item.blankCollection = [];
					me.switchTabOpt('tab1');
					$(element, me.el).focus();
					return false;  //return false;跳出所有循环；相当于 javascript 中的 break 效果。return true;跳出当前循环，进入下一个循环；相当于 javascript 中的 continue 效果
				}

				var blank = {blankId:index + 1, blankValue: [currElementValue], feedback:'', score: Number(score), deduct: Number(deduct)};
				var currFeedback = $('.feedback', me.el)[index];
				var feedback = $(currFeedback).val();
				blank.feedback = feedback;

				item.blankCollection.push(blank);
			});

			if(!item.blankCollection.length){
				return false;
			}

			console.log(item);
			return item;
		}
	});








