/**
 * Created by fangz_000 on 5/11/2017.
 */
var jm_save_mmp = function (jm){
    var mind_data = jm.get_data('node_array');
    var mind_name = mind_data.meta.name;
    var mind_str = JSON.stringify(mind_data);/*jsMind.util.json.json2string(mind_data)*/;
    /*jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.jm');*/
    //save(mind_str, mind_name+'.jm');
    console.log(mind_name);
    return mind_str;
};
var jm_open_mmp = function (divId, data) {
    //add tool
    var toolBox = document.createElement('div');
    toolBox.setAttribute('style', 'position: fixed;z-index:1001');
    toolBox.innerHTML = '<style>ul.ec-jm-tool li{display: inline;  box-sizing: border-box;}ul.ec-jm-tool li a:hover{background-color:#1ABC9C;color:white}ul.ec-jm-tool li a{position: relative;float: left;padding: 6px 12px;margin-left: -1px;color: #337ab7;text-decoration: none;background-color: #fff;border: 1px solid #ddd;cursor: pointer;}</style>' +
        '<ul class="ec-jm-tool" style="display: inline-block;border-radius: 4px;  margin: 15px 15px;padding: 0;"> ' +
        '<li><span style="cursor:default;position: relative;float: left;padding: 6px 12px;color: #959595;text-decoration: none;background-color: #F7F7F7;border: 1px solid #ddd;">工</span></li> ' +
        '<li title="插入下级主题[快捷键：Insert]"><a onclick="jm_add_child_node()">下</a></li> ' +
        '<li title="插入同级主题[快捷键：Enter]"><a onclick="jm_add_bro_node()">同</a></li> ' +
        '<li title="编辑内容[快捷键：F2或双击]"><a onclick="jm_edit_node()">编</a></li> ' +
        '<li title="删除节点[快捷键：Delete]"><a onclick="jm_remove_node()">删</a></li> ' +
        '<li title="放大画布"><a onclick="jm_zoom_in()">大</a></li> ' +
        '<li title="缩小画布"><a onclick="jm_zoom_out()">小</a></li> ' +
        '<li title="全部展开"><a onclick="jm_expand_all()">展</a></li> ' +
        '<li title="全部收起"><a onclick="jm_collapse_all()">收</a></li> ' +
        '</ul>';
    var container = document.getElementById(divId);
    container.appendChild(toolBox);
    //create and open
    var mind = (data)?(data):null;
    var options = {
        container: divId,
        editable: true,
        theme:'greensea'
    };
    var jm = new jsMind(options);
    jm.show(mind);
    return jm;
};


var get_selected_nodeid  = function (){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node();
    if(!!selected_node){
        return selected_node.id;
    }else{
        return null;
    }
};
//插入下级节点
var jm_add_child_node = function (){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node(); // as parent of new node
    if(!selected_node){console.log('please select a node first.');return;}

    var nodeid = jsMind.util.uuid.newid();
    var topic = '分支主题';
    var node = _jm.add_node(selected_node, nodeid, topic);
};
//插入同级节点
var jm_add_bro_node = function(){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node();
    if(!!selected_node && !selected_node.isroot){
        var nodeid = jm.util.uuid.newid();
        var node = _jm.insert_node_after(selected_node, nodeid, '分支主题');
        if(!!node){
            _jm.select_node(nodeid);
            _jm.begin_edit(nodeid);
        }
    }
};
//编辑一个节点
var jm_edit_node = function (){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node();
    if(!!selected_node){
        _jm.begin_edit(selected_node);
    }
};

//删除一个节点
var jm_remove_node = function (){
    var _jm = jsMind.current;
    var selected_id = get_selected_nodeid();
    if(!selected_id){console.log('please select a node first.');return;}

    _jm.remove_node(selected_id);
};
//放大
var jm_zoom_in = function (){
    var _jm = jsMind.current;
    _jm.view.zoomIn();
};
//缩小
var jm_zoom_out = function (){
    var _jm = jsMind.current;
    if (_jm.view.zoomOut()) {
        zoomInButton.disabled = false;
    } else {
        zoomOutButton.disabled = true;
    }
};
//全部展开
var jm_expand_all = function (){
    var _jm = jsMind.current;
    _jm.expand_all();
};
//全部收起
var jm_collapse_all = function (){
    var _jm = jsMind.current;
    _jm.collapse_all();
};