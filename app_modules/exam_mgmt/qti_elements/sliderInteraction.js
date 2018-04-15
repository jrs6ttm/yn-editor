/**
 * Created by Administrator on 2015/11/19.
 */
var xml2js = require('xml2js');

exports.slider_interaction_toXML = function(examItem, assessmentItemModel){
    var assessmentItem = assessmentItemModel.assessmentItem,
        responseProcessing={$:{template:"http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"}};


    assessmentItem.itemBody.sliderInteraction  ={
        $:{responseIdentifier:examItem.itemId, lowerBound:"0", upperBound:"100", step:"1", stepLabel:"false"},
        prompt:examItem.itemDescription
    };
    assessmentItem.responseDeclaration = {
        $:{
            identifier:examItem.itemId,
            cardinality:"single",
            baseType:"integer"
        },
        correctResponse:{
            value: 16
        }
    };

    assessmentItem.$["identifier"] = examItem.itemType+'_'+examItem.itemId;
    assessmentItem.responseProcessing = responseProcessing;

    assessmentItemModel.assessmentItem = assessmentItem;
    var builder = new (xml2js.Builder)();
    var xml = builder.buildObject(assessmentItemModel);
    console.log(assessmentItemModel);

    return xml;
};

exports.slider_interaction_toJSON = function(choiceSample_XML, callback){
    var aaa = JSON.stringify({data: choiceSample_XML});
    var reqData = JSON.parse(aaa);
    xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result1){
        if(err){
            callback(err);
        }else {
            var assessmentItem = result1.assessmentItem;
            var startIndex = choiceSample_XML.indexOf('<itemBody>'), endIndex =choiceSample_XML.indexOf('</itemBody>'), itemBody='';
            if(startIndex != -1 && endIndex != -1) {
                itemBody = choiceSample_XML.substring(startIndex+10, endIndex);

                var responseDeclaration = assessmentItem.responseDeclaration;

                var identifier = responseDeclaration.$.identifier;
                var cutIndex = itemBody.indexOf(identifier);
                if(cutIndex != -1){
                    var start = itemBody.lastIndexOf('<sliderInteraction', cutIndex );
                    var end = itemBody.indexOf('</sliderInteraction>', cutIndex );
                    if(end != -1){
                        itemBody = itemBody.substring(start, end+20);
                        var aaa = JSON.stringify({data: itemBody});
                        var reqData = JSON.parse(aaa);
                        xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result2){
                            //console.log(result2);
                            //console.log(result2.sliderInteraction.prompt);
                            result1.assessmentItem.itemBody = result2.sliderInteraction.prompt;
                            console.log(result1);
                        });

                    }
                }
                callback(result1);
            }
        }
    });
};

/*
function getItemBodyStr(itemBody, identifier){
    var cutIndex = itemBody.indexOf(identifier);
    if(cutIndex != -1){
        var start = itemBody.lastIndexOf('<sliderInteraction', cutIndex );
        var end = itemBody.indexOf('</sliderInteraction>', cutIndex );
        if(end != -1){
            //var firstStr = itemBody.substring(0, start ), lastStr = itemBody.substring(end+20, itemBody.length);
            //itemBody = firstStr +　'__'+identifier+'__'+ lastStr ;
            itemBody = itemBody.substring(start, end+20);
            var aaa = JSON.stringify({data: itemBody});
            var reqData = JSON.parse(aaa);
            xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result){
                console.log(result);
                console.log(result.sliderInteraction.prompt);
            });

        }
    }

    //return itemBody;
}
    */