/**
 * Created by Administrator on 2015/11/19.
 */
var xml2js = require('xml2js');

exports.extended_text_interaction_toXML = function(examItem, assessmentItemModel){
    var assessmentItem = assessmentItemModel.assessmentItem;

    assessmentItem.itemBody.extendedTextInteraction ={
        $:{responseIdentifier:examItem.itemId, expectedLength:"200"},
        prompt:examItem.itemDescription
    };
    assessmentItem.responseDeclaration = {
        $:{
            identifier:examItem.itemId,
            cardinality:"single",
            baseType:"string"
        }
    };

    assessmentItem.$["identifier"] = examItem.itemType+'_'+examItem.itemId;

    assessmentItemModel.assessmentItem = assessmentItem;
    var builder = new (xml2js.Builder)();
    var xml = builder.buildObject(assessmentItemModel);
    console.log(assessmentItemModel);

    return xml;
};

exports.extended_text_interaction_toJSON = function(choiceSample_XML, callback){
    var aaa = JSON.stringify({data: choiceSample_XML});
    var reqData = JSON.parse(aaa);
    xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result){
        if(err){
            callback(err);
        }else {
            console.log(result);
            var assessmentItem = result.assessmentItem;
            console.log(assessmentItem.itemBody.extendedTextInteraction.prompt);
            callback(result);
        }
    });
};
