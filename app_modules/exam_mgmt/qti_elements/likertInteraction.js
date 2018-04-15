/**
 * Created by Administrator on 2015/11/27.
 */

var xml2js = require('xml2js');

exports.likert_interaction_toXML = function(examItem, assessmentItemModel){

    var assessmentItem = assessmentItemModel.assessmentItem,
        responseProcessing={$:{template:"http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"}};

    var responseDeclarationArr = [], choiceInteraction=[];
    var examItemChoices = examItem.choiceCollection, prompt = examItem.itemDescription, simpleChoice=[], identifier='';
    assessmentItem.itemBody.rubrickBlock = {
        $:{view: 'candidate'},
        p: prompt
    };

    for(var i=0;i<5;i++){
        simpleChoice.push({
            $:{
                identifier:i+1+''
            },
            _:i+1
        });
    }
    for (var j = 0; j < examItemChoices.length; j++) {
        identifier = examItem.itemId + '_' + examItemChoices[j].choiceId;
        var temp = {
                        $:{
                            identifier:identifier,
                            cardinality:'single',
                            baseType:"identifier"
                        }
                    };

        responseDeclarationArr.push(temp);

        choiceInteraction.push({
            $:{
                responseIdentifier:identifier,
                shuffle:'false',
                maxChoices:1
            },
            prompt:{
                _: examItemChoices[j].choiceDescription
            },
            simpleChoice:simpleChoice
        });
    }

    assessmentItem.itemBody.choiceInteraction = choiceInteraction;
    assessmentItem.responseDeclaration = responseDeclarationArr;

    assessmentItem.$["identifier"] = examItem.itemType+'_'+examItem.itemId;
    assessmentItem.responseProcessing = responseProcessing;

    assessmentItemModel.assessmentItem = assessmentItem;
    var builder = new (xml2js.Builder)();
    var xml = builder.buildObject(assessmentItemModel);

    return xml;
};

exports.likert_interaction_toJSON = function(choiceSample_XML, callback){
    var aaa = JSON.stringify({data: choiceSample_XML});
    var reqData = JSON.parse(aaa);
    xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result){
        if(err){
            callback(err);
        }else {
/*
            var assessmentItem = result.assessmentItem;

            var startIndex = choiceSample_XML.indexOf('<itemBody>'), endIndex =choiceSample_XML.indexOf('</itemBody>'), itemBody='';
            if(startIndex != -1 && endIndex != -1) {
                itemBody = choiceSample_XML.substring(startIndex+10, endIndex);

                var responseDeclaration = assessmentItem.responseDeclaration;
                if(responseDeclaration instanceof Array){
                    for(var i=0; i<responseDeclaration.length;i++){
                        var identifier = responseDeclaration[i].$.identifier;
                        itemBody = getItemBodyStr(itemBody, identifier);
                    }
                }else{
                    var identifier = responseDeclaration.$.identifier;
                    itemBody = getItemBodyStr(itemBody, identifier);
                }

                result.assessmentItem.itemBody = itemBody;
                console.log(result);

                callback(result);
            }*/
            //console.log(result);
            callback(result);
        }
    });
};

function getItemBodyStr(itemBody, identifier){
    var cutIndex = itemBody.indexOf(identifier);
    if(cutIndex != -1){
        var start = itemBody.lastIndexOf('<textEntryInteraction', cutIndex );
        var end1 = itemBody.indexOf('/>', cutIndex ), end2 = itemBody.indexOf('</textEntryInteraction>', cutIndex ), end = 0;
        if(end1 != -1){
            if(end2 != -1){
                end = (end1 < end2)? (end1+2): (end2+23);
            }else{
                end = end1+2;
            }
            var firstStr = itemBody.substring(0, start ), lastStr = itemBody.substring(end, itemBody.length);
            itemBody = firstStr +　'__'+identifier+'__'+ lastStr ;
        }
    }

    return itemBody;
}
