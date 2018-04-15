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
        "bpmn:definitions":{
            "$":{
                "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
                "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
                "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
                "xmlns:camunda": "http://camunda.org/schema/1.0/bpmn",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "id": "Definitions_1",
                "targetNamespace": "http://bpmn.io/schema/bpmn"
            },
            "bpmn:collaboration": {
                "$": {"id": "Collaboration_0qwrb2n"} //???id
                //"bpmn:participant": {
                //    "$": {
                //        "id": "Participant_1t50h73",
                //        "name": "???",
                //        "processRef": "Process_1"}
                //}
            },
            "bpmn:process":{
                "$": {"id": "Process_" + xmlId, "name":"main", "isExecutable": "true"},
                "bpmn:startEvent": {
                    "$": {"id": "StartEvent_1"},
                    "bpmn:outgoing": "SequenceFlow_0ektsez"},
                "bpmn:endEvent": {
                    "$": {"id": "EndEvent_0dj5doo"},
                    "bpmn:incoming": "SequenceFlow_1x8hosp"},
                "bpmn:userTask": [],
                "bpmn:sequenceFlow":[]
            },
            "bpmndi:BPMNDiagram":{
                "$": {"id": "BPMNDiagram_1"},
                "bpmndi:BPMNPlane":{
                    "$": {"id": "BPMNPlane_1", "bpmnElement": "Collaboration_0qwrb2n"},
                    "bpmndi:BPMNShape":[],
                    "bpmndi:BPMNEdge":[]
                }
            }
        }
    };
}
function addBpmnShape(id, position){
    BpmnXml["bpmn:definitions"]["bpmndi:BPMNDiagram"]["bpmndi:BPMNPlane"]["bpmndi:BPMNShape"].push({
        "$": {
            "id": id + "_di",
            "bpmnElement": id
        },
        "dc:Bounds": {
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
    BpmnXml["bpmn:definitions"]["bpmn:collaboration"] = {
        "$": {"id": "Collaboration_0qwrb2n"},
        "bpmn:participant": {
            "$": {
                "id": id,
                "name": name,
                "processRef": BpmnXml["bpmn:definitions"]["bpmn:process"].$.id}
        }
    };
    //??shape
    if (position){
        addBpmnShape(id, position);
    }
}
function addStart(id, outgoing, position){
    BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:startEvent"].$.id = id;
    if (outgoing){
        BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:startEvent"]["bpmn:outgoing"] = outgoing;
    }
    //??shape
    if (position){
        addBpmnShape(id, position);
    }
}
function addEnd(id, incoming, position){
    BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:endEvent"].$.id = id;
    if (incoming){
        BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:endEvent"]["bpmn:incoming"] = incoming;
    }
    //??shape
    if (position){
        addBpmnShape(id, position);
    }
}
function addTask(id, name, property, position){
    var propertyXml = [];
    for (var key in property){
        propertyXml.push({
            "$": {
                "name": key,
                "value": property[key]
            }
        })
    }
    BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:userTask"].push({
        "$": {"id": id, "name": name},
        "bpmn:extensionElements": {
            "camunda:properties": {
                "camunda:property": propertyXml
            }
        },
        "bpmn:incoming": "",
        "bpmn:outgoing": ""
    })
    //??shape
    if (position){
        addBpmnShape(id, position);
    }
}
function addEdge(id, source, target, position){
    BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:sequenceFlow"].push({
        "$": {
            "id": id,
            "sourceRef": source,
            "targetRef": target
        }
    });

    //????node?incoming?outgoing
    if (BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:startEvent"].$.id === source){
        addStart(source, id);
    }
    if(BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:endEvent"].$.id === target){
        addEnd(target, id);
    }
    var taskArr =BpmnXml["bpmn:definitions"]["bpmn:process"]["bpmn:userTask"]
    for (var i = 0; i < taskArr.length; i++){
        if (taskArr[i].$.id === source){
            taskArr[i]["bpmn:outgoing"] = id;
        }else if (taskArr[i].$.id === target){
            taskArr[i]["bpmn:incoming"] = id;
        }
    }
    //??plane??bpmnedge !!!??dx dy

    BpmnXml["bpmn:definitions"]["bpmndi:BPMNDiagram"]["bpmndi:BPMNPlane"]["bpmndi:BPMNEdge"].push({
        "$": {
            "id": id + "_di",
            "bpmnElement": id
        },
        "di:waypoint": [
            {"$": {"xsi:type": "dc:Point", "x": position.sourceX, "y": position.sourceY}},
            {"$": {"xsi:type": "dc:Point", "x": position.targetX, "y": position.targetY}}
        ]
    });
}
exports.parseXmlToBpmn = function(obj, xmlId){
    var nodes = obj.mxGraphModel.root.ecCell;
    var edges = obj.mxGraphModel.root.mxCell;

    function findNodeById(id){
        for (var i = 0; i < nodes.length; i++){
            if (nodes[i].$.id === id){
                return nodes[i];
            }
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
            addPool('_'+ xmlId + '_' + nodes[i].$.id, nodes[i].$.label, position);
        } else if (nodes[i].$.type ==='bpmn.gateway.general.start'){
            addStart('_'+ xmlId + '_' + nodes[i].$.id, null, position);
        } else if (nodes[i].$.type ==='bpmn.gateway.general.end'){
            addEnd('_'+ xmlId + '_' + nodes[i].$.id, null, position);
        } else if (nodes[i].$.type ==='bpmn.task.user'){
            var property = {};
            for(var key in nodes[i].$){
                if (key !='type' && key != 'label' && key != 'creator' && key != 'id'){
                    property[key] = nodes[i].$[key];
                }
            }
            addTask('_'+ xmlId + '_' + nodes[i].$.id, nodes[i].$.label, property, position);
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
                    delete BpmnXml["bpmn:definitions"]["bpmn:collaboration"];
                    BpmnXml["bpmn:definitions"]["bpmndi:BPMNDiagram"]["bpmndi:BPMNPlane"].$.bpmnElement = BpmnXml["bpmn:definitions"]["bpmn:process"].$.id;
                }
                var sourceNode = findNodeById(edges[j].$.source).mxCell.mxGeometry.$;
                var targetNode = findNodeById(edges[j].$.target).mxCell.mxGeometry.$;
                var edgePosition = {
                    sourceX: parseInt(sourceNode.x) + parseInt(sourceNode.width) * 0.5 + parseInt(poolPosition.x),
                    sourceY: parseInt(sourceNode.y) + parseInt(sourceNode.height) + parseInt(poolPosition.y),
                    targetX: parseInt(targetNode.x) + parseInt(targetNode.width) * 0.5 + parseInt(poolPosition.x),
                    targetY: parseInt(targetNode.y) + parseInt(poolPosition.y)
                };
                addEdge('SequenceFlow_' + edges[j].$.id, '_'+ xmlId + '_' + edges[j].$.source,'_'+ xmlId + '_' + edges[j].$.target, edgePosition);
            }
        }
    }
    return BpmnXml;
};