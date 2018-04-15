/**
 * Created by fangz_000 on 5/31/2016.
 */
//var BPMNXml = function () {
//    this.BpmnXml= {
//        "bpmn:definitions":{
//            "$":{
//                "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
//                "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
//                "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
//                "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
//                "xmlns:camunda": "http://camunda.org/schema/1.0/bpmn",
//                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
//                "id": "Definitions_1",
//                "targetNamespace": "http://bpmn.io/schema/bpmn"
//            },
//            "bpmn:collaboration": {
//                "$": {"id": "Collaboration_0qwrb2n"} //???id
//                //"bpmn:participant": {
//                //    "$": {
//                //        "id": "Participant_1t50h73",
//                //        "name": "???",
//                //        "processRef": "Process_1"}
//                //}
//            },
//            "bpmn:process":{
//                "$": {"id": "Process_1", "isExecutable": "false"},
//                "bpmn:startEvent": {
//                    "$": {"id": "StartEvent_1"},
//                    "bpmn:outgoing": "SequenceFlow_0ektsez"},
//                "bpmn:endEvent": {
//                    "$": {"id": "EndEvent_0dj5doo"},
//                    "bpmn:incoming": "SequenceFlow_1x8hosp"},
//                "bpmn:userTask": [],
//                "bpmn:sequenceFlow":[]
//            },
//            "bpmndi:BPMNDiagram":{
//                "$": {"id": "BPMNDiagram_1"},
//                "bpmndi:BPMNPlane":{
//                    "$": {"id": "BPMNPlane_1", "bpmnElement": "Collaboration_0qwrb2n"},
//                    "bpmndi:BPMNShape":[],
//                    "bpmndi:BPMNEdge":[]
//                }
//            }
//        }
//    };
//};
var BpmnXml={};
exports.first = function(xmlId){
    BpmnXml= {
        "definitions":{
            "$":{
                "xmlns": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
                "xmlns:omgdi": "http://www.omg.org/spec/DD/20100524/DI",
                "xmlns:omgdc": "http://www.omg.org/spec/DD/20100524/DC",
                //"xmlns:camunda": "http://camunda.org/schema/1.0/bpmn",
                "xmlns:activiti": "http://activiti.org/bpmn",
                "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "id": "Definitions_1",
                //"targetNamespace": "http://bpmn.io/schema/bpmn"
                "targetNamespace": "http://www.activiti.org/test"
            },
            //"collaboration": {
            //    "$": {"id": "Collaboration_0qwrb2n"} //???id
            //    //"bpmn:participant": {
            //    //    "$": {
            //    //        "id": "Participant_1t50h73",
            //    //        "name": "???",
            //    //        "processRef": "Process_1"}
            //    //}
            //},
            "process":{
                "$": {"id": "Process_" + xmlId, "name":"main", "isExecutable": "true"},
                //"laneSet": {
                //    "$": {"id": "laneSet_process_" + xmlId}
                //},
                "startEvent": {
                    "$": {"id": "StartEvent_1", "name": "start"}
                },
                "endEvent": {
                    "$": {"id": "EndEvent_0dj5doo", "name": "end"}
                },
                "userTask": [],
                "subProcess": [],
                "sequenceFlow":[]
            },
            "bpmndi:BPMNDiagram":{
                "$": {"id": "BPMNDiagram_1"},
                "bpmndi:BPMNPlane":{
                    "$": {"id": "BPMNPlane_Process_" + xmlId, "bpmnElement": "Process_" + xmlId},
                    "bpmndi:BPMNShape":[],
                    "bpmndi:BPMNEdge":[]
                }
            }
        }
    };
};

function addSubProcess(id, name, property, position){
    BpmnXml["definitions"]["process"]["subProcess"].push({
        "$": {"id": id, "name": name},
        "documentation": JSON.stringify(property),
        "startEvent": {
            "$": {"id": "StartEvent_2", "name": "start"}
        },
        "endEvent": {
            "$": {"id": "EndEvent_2", "name": "end"}
        },
        "userTask": [],
        "sequenceFlow":[]
    });
    //??shape
    if (position){
        addNodeToLane(id);
        addBpmnShape(id, position);
    }
}
function addBpmnShape(id, position){
    BpmnXml["definitions"]["bpmndi:BPMNDiagram"]["bpmndi:BPMNPlane"]["bpmndi:BPMNShape"].push({
        "$": {
            "id": id + "_di",
            "bpmnElement": id
        },
        "omgdc:Bounds": {
            "$": {
                "x": position.x,
                "y": position.y,
                "width": position.w,
                "height": position.h
            }
        }
    })
}
function addPool(id, name, position){
    BpmnXml["definitions"]["collaboration"] = {
        "$": {"id": "Collaboration_0qwrb2n"},
        "participant": {
            "$": {
                "id": id,
                "name": name,
                "processRef": BpmnXml["definitions"]["process"].$.id}
        }
    };
    //??shape
    if (position){
        addBpmnShape(id, position);
    }
}
function addLane(id, name, position){
    BpmnXml["definitions"]["process"]["laneSet"]["lane"] = {
        "$": {"id": id},
        "flowNodeRef":[]
    };
    //??shape
    if (position){
        addBpmnShape(id, position);
    }
}
function addNodeToLane(id){
    //if (BpmnXml["definitions"]["process"]["laneSet"]["lane"]){
    //    BpmnXml["definitions"]["process"]["laneSet"]["lane"]["flowNodeRef"].push(id)
    //}
}
function addStart(id, outgoing, parentId, rootId, position){
    if (parentId && parentId!=='EC' + rootId){
        var temp = BpmnXml["definitions"]["process"]["subProcess"];
        for (var i = 0; i < temp.length; i++){
            if (temp[i].$.id == parentId) {
                BpmnXml["definitions"]["process"]["subProcess"][i]["startEvent"].$.id = id;
                break;
            }
        }
    } else {
        BpmnXml["definitions"]["process"]["startEvent"].$.id = id;
        if (outgoing){
            BpmnXml["definitions"]["process"]["startEvent"]["outgoing"] = outgoing;
        }
    }
    //??shape
    if (position){
        addNodeToLane(id);
        addBpmnShape(id, position);
    }
}
function addEnd(id, incoming, parentId, rootId, position){
    if (parentId && parentId!=='EC' + rootId){
        var temp = BpmnXml["definitions"]["process"]["subProcess"];
        for (var i = 0; i < temp.length; i++){
            if (temp[i].$.id == parentId) {
                BpmnXml["definitions"]["process"]["subProcess"][i]["endEvent"].$.id = id;
                break;
            }
        }
    } else {
        BpmnXml["definitions"]["process"]["endEvent"].$.id = id;
        if (incoming){
            BpmnXml["definitions"]["process"]["endEvent"]["incoming"] = incoming;
        }
    }
    //??shape
    if (position){
        addNodeToLane(id);
        addBpmnShape(id, position);
    }
}
function addTask(id, name, property, parentId, isCooperation, rootId, position){
    var propertyXml = [];
    for (var key in property){
        propertyXml.push({
            "$": {
                "name": key,
                "value": property[key]
            }
        })
    }
    var taskXml = {
        "$": {"id": id, "name": name},
        "extensionElements": {
            "activiti:executionListener": {
                "$": {"event": "start", "delegateExpression": "${myBusinessListener}"}
            },
            "activiti:taskListener": {
                "$": {"event": "create", "delegateExpression": "${myBusinessListener}"}
            },
            "activiti:properties": {
                "activiti:property": propertyXml
            }
        }
        //"incoming": "",
        //"outgoing": ""
    };
    if (isCooperation){
        taskXml.$["activiti:assignee"] = "${assignee}";
        taskXml["multiInstanceLoopCharacteristics"] = {
            "$":{"isSequential": "false", "activiti:collection": id, "activiti:elementVariable": "assignee"},
            "completionCondition": '${nrOfCompletedInstances/nrOfInstances >= 1}'
        };
    } else {
        delete taskXml.extensionElements["activiti:executionListener"];
        delete taskXml.extensionElements["activiti:taskListener"];
    }
    var temp = BpmnXml["definitions"]["process"]["subProcess"];
    if (parentId && parentId!=='EC' + rootId){
        for (var i = 0; i < temp.length; i++){
            if (temp[i].$.id == parentId) {
                BpmnXml["definitions"]["process"]["subProcess"][i]["userTask"].push(taskXml);
                break;
            }
        }
    } else {
        BpmnXml["definitions"]["process"]["userTask"].push(taskXml);
    }
    //??shape
    if (position){
        addNodeToLane(id);
        addBpmnShape(id, position);
    }
}
function addEdge(id, source, target, position){
    BpmnXml["definitions"]["process"]["sequenceFlow"].push({
        "$": {
            "id": id,
            "sourceRef": source,
            "targetRef": target
        }
    });

    //????node?incoming?outgoing
    //if (BpmnXml["definitions"]["process"]["startEvent"].$.id === source){
    //    addStart(source, id);
    //}
    //if(BpmnXml["definitions"]["process"]["endEvent"].$.id === target){
    //    addEnd(target, id);
    //}

    //去掉incoming和outgoing 170104
    //var taskArr =BpmnXml["definitions"]["process"]["userTask"]
    //for (var i = 0; i < taskArr.length; i++){
    //    if (taskArr[i].$.id === source){
    //        taskArr[i]["outgoing"] = id;
    //    }else if (taskArr[i].$.id === target){
    //        taskArr[i]["incoming"] = id;
    //    }
    //}
    //??plane??bpmnedge !!!??dx dy

    BpmnXml["definitions"]["bpmndi:BPMNDiagram"]["bpmndi:BPMNPlane"]["bpmndi:BPMNEdge"].push({
        "$": {
            "id": id + "_di",
            "bpmnElement": id
        },
        "omgdi:waypoint": [
            {"$": {"x": position.sourceX, "y": position.sourceY}},
            {"$": {"x": position.targetX, "y": position.targetY}}
        ]
    });
}
exports.parseBPMNToMxXml = function(obj){
    var body = '';
    var process = obj.definitions.process;
    var makeStart = function (id, parentId) {
        var pId = (parentId)?parentId:1;
        var xml= '<ecCell type="bpmn.gateway.general.start" label="" creator="{&quot;userName&quot;:&quot;ynlisa&quot;,&quot;userId&quot;:&quot;457bff90-135d-11e7-8c55-1f33be1fa07e&quot;}" id="' +
            id +
            '"> <mxCell style="shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;verticalAlign=top;perimeter=ellipsePerimeter;outline=standard;symbol=general;gradientColor=#CC99FF" parent="' +
            pId +
            '" vertex="1"> <mxGeometry x="410" y="50" width="50" height="50" as="geometry"/> </mxCell> </ecCell>';
        return xml;

    }
    var makeEnd = function (id, parentId) {
        var pId = (parentId)?parentId:1;
        var xml= '<ecCell type="bpmn.gateway.general.end" label="" creator="{&quot;userName&quot;:&quot;ynlisa&quot;,&quot;userId&quot;:&quot;457bff90-135d-11e7-8c55-1f33be1fa07e&quot;}" id="' +
            id +
            '"> <mxCell style="shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;verticalAlign=top;perimeter=ellipsePerimeter;outline=end;symbol=general;gradientColor=#CC99FF" parent="' +
            pId +
            '" vertex="1"> <mxGeometry x="410" y="880" width="50" height="50" as="geometry"/> </mxCell> </ecCell>'
        return xml;

    }
    var makeTask = function (id, pId, dt) {
        function html2Escape(sHtml) {
            return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
        }
        var a = '<ecCell type="bpmn.task.user" label="' +
            dt.taskName +
            '" creator="{&quot;userName&quot;:&quot;ynlisa&quot;,&quot;userId&quot;:&quot;457bff90-135d-11e7-8c55-1f33be1fa07e&quot;}" ' +
            'workbench="{&quot;taskId&quot;:&quot;' +
            dt.taskId +
            '&quot;,&quot;taskName&quot;:&quot;' +
            dt.taskName +
            '&quot;,&quot;taskDescription&quot;:&quot;' +
            html2Escape(dt.taskDescription.replace(/"/g,'\\"')) +
            '&quot;,&quot;materialSource&quot;:' +
            '{&quot;actionId&quot;:&quot;&quot;,&quot;materialMaker&quot;:&quot;self&quot;}' +
            ',&quot;toolType&quot;:&quot;' +
            dt.toolType +
            '&quot;,&quot;role&quot;:[],&quot;' +
            'input&quot;:' +
            html2Escape(dt.input) +
            ',&quot;output&quot;:' +
            html2Escape(dt.output) +
            '}" controlType="{&quot;controlType&quot;:&quot;userControl&quot;,&quot;controlData&quot;:null}" ' +
            'scoreRules="[]" id="' +
            id +
            '"> <mxCell style="shape=bpmn;html=1;whiteSpace=wrap;rounded=1;gradientColor=#CC99FF" parent="' +
            pId +
            '" vertex="1"> <mxGeometry x="375" y="390" width="120" height="80" as="geometry"/> </mxCell> </ecCell>'
        return a;
    };
    var makeSub = function (id,name,rId) {
        var a = '<ecCell type="bpmn.subprocess.ectask" label="' +
            name +
            '" creator="{&quot;userName&quot;:&quot;ynlisa&quot;,&quot;userId&quot;:&quot;457bff90-135d-11e7-8c55-1f33be1fa07e&quot;}" id="' +
            id +
            '"> <mxCell style="shape=swimlane;html=1;horizontal=1;swimlaneFillColor=white;swimlaneLine=0;startSize=20;rounded=1;arcSize=14;strokeWidth=2;gradientColor=#CC99FF" vertex="1" parent="1"> <mxGeometry x="41" y="181" width="530" height="130" as="geometry"> <mxRectangle width="120" height="50" as="alternateBounds"/> </mxGeometry> </mxCell> </ecCell> <mxCell id="' +
            rId +
            '" value="" style="html=1;shape=plus;" vertex="1" parent="' +
            id +
            '"> <mxGeometry x="0.5" y="1" width="14" height="14" relative="1" as="geometry"> <mxPoint x="-7" y="-15" as="offset"/> </mxGeometry> </mxCell>';
        return a;
    }
    if (process.startEvent){
        var id = process.startEvent.$.id.substr(2);
        body += makeStart(id);
    }
    if (process.endEvent){
        var id = process.endEvent.$.id.substr(2);
        body += makeEnd(id);
    }
    if (process.subProcess){
        var rId = 100;
        for (var i=0;i<process.subProcess.length;i++){
            var s = process.subProcess[i];
            var sId = s.$.id.substr(2);
            var sName = s.$.name;
            rId++;
            body += makeSub(sId, sName, rId);
            body += makeStart(s.startEvent.$.id.substr(2), sId);
            body += makeEnd(s.endEvent.$.id.substr(2), sId);

            for (var j=0;j< s.userTask.length;j++){
                var t = s.userTask[j];
                var tId = t.$.id.substr(2);
                var data = {};
                var pros = t.extensionElements['activiti:properties']['activiti:property'];
                for (var k=0;k<pros.length;k++){
                    data[pros[k].$.name] = pros[k].$.value;
                }
                body += makeTask(tId,sId, data);
            }
        }
    }
    var makeFlow = function (id,pId, sId, tId) {
        var a = '<mxCell id="' +
            id +
            '" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=#B3B3B3;strokeWidth=3" parent="' +
            pId +
            '" source="' +
            sId +
            '" target="' +
            tId +
            '" edge="1"> <mxGeometry relative="1" as="geometry"/> </mxCell>'
        return a;
    }
    if (process.sequenceFlow){
        for (var i=0;i<process.sequenceFlow.length;i++){
            var id = process.sequenceFlow[i].$.id.substr(13);
            body += makeFlow(id,'1',process.sequenceFlow[i].$.sourceRef.substr(2),process.sequenceFlow[i].$.targetRef.substr(2));
        }
    }

    var B = '<mxGraphModel dx="885" dy="804" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" fold="1" page="1" pageScale="1" pageWidth="826" pageHeight="1169" background="#E6FFCC"> <root> <mxCell id="0"/> <mxCell id="1" parent="0"/> ' +
        body +
        '</root> </mxGraphModel>';
    return B;
};
exports.parseXmlToBpmn = function(obj, isCooperation, xmlId){
    var nodes = obj.mxGraphModel.root.ecCell;
    var edges = obj.mxGraphModel.root.mxCell;
    var property;
    var rootId = 1;
    function findNodeById(id){
        for (var i = 0; i < nodes.length; i++){
            if (nodes[i].$.id === id){
                return nodes[i];
            }
        }
    }
    var rolePoolStr = '';
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].$.type === 'bpmn.participant.pool' || nodes[i].$.type === 'bpmn.participant.lane') {
                if (nodes[i].$.label) {
                    var rolePoolArr = nodes[i].$.label.split('+');
                    if (rolePoolArr.length === 0) {
                        rolePoolStr = '学生';
                    } else {
                        for (var k = 0; k < rolePoolArr.length; k++) {
                            rolePoolStr += ('@' + rolePoolArr[k]);
                        }
                    }
                }
                rootId = nodes[i].$.id;
                break;
            }
        }
    for (var i = 0; i < nodes.length; i++){
        var position = {
            x: nodes[i].mxCell.mxGeometry.$.x,
            y: nodes[i].mxCell.mxGeometry.$.y,
            w: nodes[i].mxCell.mxGeometry.$.width,
            h: nodes[i].mxCell.mxGeometry.$.height
        };
        if (poolPosition){
            position = {
                x: parseInt(position.x) + parseInt(poolPosition.x),
                y: parseInt(position.y) + parseInt(poolPosition.y),
                w: position.w,
                h: position.h
            }
        }
        if (nodes[i].$.type ==='bpmn.participant.pool' || nodes[i].$.type ==='bpmn.participant.lane'){
            var poolPosition = position;
             /*//addPool('EC' + nodes[i].$.id, nodes[i].$.label, position);
            if (isCooperation){
                if (nodes[i].$.label){
                    var rolePoolArr = nodes[i].$.label.split('+');
                    var rolePoolStr = '';
                    if (rolePoolArr.length === 0){
                        rolePoolStr = '学生';
                    } else {
                        for(var k = 0; k < rolePoolArr.length; k++){
                            rolePoolStr +=('@' + rolePoolArr[k]);
                        }
                    }
                    //BpmnXml["definitions"]["process"].$.name += rolePoolStr;
                }
            }
            rootId = nodes[i].$.id;
            //addLane('lane_' + nodes[i].$.id, nodes[i].$.label, position);*/
        } else if (nodes[i].$.type ==='bpmn.gateway.general.start'){
            addStart('EC' + nodes[i].$.id, null, 'EC' + nodes[i].mxCell.$.parent, rootId, position);
        } else if (nodes[i].$.type ==='bpmn.gateway.general.end'){
            addEnd('EC' + nodes[i].$.id, null, 'EC' + nodes[i].mxCell.$.parent, rootId, position);
        } else if (nodes[i].$.type ==='bpmn.task.user'){
            property = {};
            if (nodes[i].$.workbench){
                var workbench = JSON.parse(nodes[i].$.workbench);
                if (workbench['input'].inputWay && (workbench['input'].inputWay=='DB' || workbench['input'].inputWay=='upload' || workbench['input'].inputWay=='editOnline')){
                    workbench['input'].inputWay = 'template';
                }
                for(var key in workbench){
                    if (typeof(workbench[key]) == 'object'){
                        property[key] = JSON.stringify(workbench[key]);
                    } else {
                        property[key] = workbench[key];
                    }
                }
                if (property['toolType'] == 'comment'){
                    property['isHuPing'] = 1;
                } else {
                    property['isHuPing'] = 0;
                }
            }
            if (nodes[i].$.scoreRules){
                property['scoreRules'] = nodes[i].$.scoreRules;
            }
            /*for(var key in nodes[i].$){
                if (key !='type' && key != 'label' && key != 'creator' && key != 'id'){
                    property[key] = nodes[i].$[key];
                }
            }*/
            var roleStr = '';
            if (isCooperation){
                var roleArr = (nodes[i].$.workbench)?(JSON.parse(nodes[i].$.workbench).role):[];
                if (roleArr.length === 0){
                    roleStr = rolePoolStr;
                }else {
                    for(var k = 0; k < roleArr.length; k++){
                        roleStr +=('@' + roleArr[k].id);
                    }
                }
            }
            addTask('EC' + nodes[i].$.id, nodes[i].$.label + roleStr, property, 'EC' + nodes[i].mxCell.$.parent,isCooperation, rootId, position);
        } else if (nodes[i].$.type === 'bpmn.subprocess.ectask'){
            property = {};
            for(var key in nodes[i].$){
                if (key !='type' && key != 'label' && key != 'creator' && key != 'id'){
                    property[key] = nodes[i].$[key];
                }
            }
            addSubProcess('EC' + nodes[i].$.id, nodes[i].$.label, property, position);
        }
    }
    for (var j = 0; j < edges.length; j++){
        if (edges[j].$.edge){
            if (edges[j].$.source && edges[j].$.target){
                if (!poolPosition){
                    poolPosition = {
                        x:0,
                        y:0
                    };
                    delete BpmnXml["definitions"]["collaboration"];
                    //BpmnXml["definitions"]["bpmndi:BPMNDiagram"]["bpmndi:BPMNPlane"].$.bpmnElement = BpmnXml["definitions"]["process"].$.id;
                }
                var sourceNode = findNodeById(edges[j].$.source).mxCell.mxGeometry.$;
                var targetNode = findNodeById(edges[j].$.target).mxCell.mxGeometry.$;
                var edgePosition = {
                    sourceX: parseInt(sourceNode.x) + parseInt(sourceNode.width) * 0.5 + parseInt(poolPosition.x),
                    sourceY: parseInt(sourceNode.y) + parseInt(sourceNode.height) + parseInt(poolPosition.y),
                    targetX: parseInt(targetNode.x) + parseInt(targetNode.width) * 0.5 + parseInt(poolPosition.x),
                    targetY: parseInt(targetNode.y) + parseInt(poolPosition.y)
                };
                addEdge('SequenceFlow_' + edges[j].$.id, 'EC' + edges[j].$.source, 'EC' + edges[j].$.target, edgePosition);
            }
        }
    }
    return BpmnXml;
};